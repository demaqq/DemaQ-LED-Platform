import { db, doc, setDoc } from '../lib/firebase';
import { BlogPost, LEDCaseStudy } from '../types';

export interface SyncResult {
  success: boolean;
  timestamp: string;
  source: string;
  blogsCount: number;
  casesCount: number;
  message: string;
  error?: string;
}

/**
 * Actively queries external market trend APIs via backend search grounding
 * and synchronizes live articles and benchmark case studies into Firestore.
 */
export async function syncMarketTrendsToFirestore(language = 'en'): Promise<SyncResult> {
  try {
    const response = await fetch('/api/sync-realtime-feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language })
    });

    if (!response.ok) {
      throw new Error(`Sync API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Sync returned unsuccessful status');
    }

    const blogs: BlogPost[] = data.blogs || [];
    const caseStudies: LEDCaseStudy[] = data.caseStudies || [];

    // 1. Commit each fresh blog post into Firestore
    for (const blog of blogs) {
      try {
        await setDoc(doc(db, 'blogs', blog.id), {
          ...blog,
          lastSyncedAt: new Date().toISOString(),
          syncedFrom: data.source || 'external_api'
        }, { merge: true });
      } catch (err) {
        console.warn(`[Firestore Sync] Failed to commit blog ${blog.id}:`, err);
      }
    }

    // 2. Commit each fresh case study into Firestore
    for (const cs of caseStudies) {
      try {
        await setDoc(doc(db, 'caseStudies', cs.id), {
          ...cs,
          lastSyncedAt: new Date().toISOString(),
          syncedFrom: data.source || 'external_api'
        }, { merge: true });
      } catch (err) {
        console.warn(`[Firestore Sync] Failed to commit case study ${cs.id}:`, err);
      }
    }

    // 3. Update active sync status record in Firestore
    try {
      await setDoc(doc(db, 'system_sync', 'market_trends'), {
        lastSyncTime: data.timestamp || new Date().toISOString(),
        status: 'active',
        source: data.source || 'external_api_google_grounded',
        blogsCount: blogs.length,
        caseStudiesCount: caseStudies.length,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore Sync] Status doc update note:', err);
    }

    // Persist last sync time locally for fast UI render
    localStorage.setItem('demaq_last_market_sync', new Date().toISOString());

    return {
      success: true,
      timestamp: data.timestamp || new Date().toISOString(),
      source: data.source || 'external_api_google_grounded',
      blogsCount: blogs.length,
      casesCount: caseStudies.length,
      message: `Successfully synchronized ${blogs.length} market trend articles & ${caseStudies.length} benchmark case studies into Firestore.`
    };
  } catch (err: any) {
    console.error('[Firestore Sync Service Error]:', err);
    return {
      success: false,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      blogsCount: 0,
      casesCount: 0,
      message: 'Failed to synchronize with external API',
      error: err?.message || String(err)
    };
  }
}
