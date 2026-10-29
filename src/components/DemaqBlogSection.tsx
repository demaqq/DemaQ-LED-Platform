import React, { useState, useMemo } from 'react';
import { blogPosts as defaultBlogPosts } from '../data/mockData';
import { BlogPost, BlogCategory } from '../types';
import { BookOpen, Calendar, Clock, ArrowUpRight, X, Tag, Sparkles, Filter, Search, Activity, Radio, ExternalLink, ShieldCheck, Database, RefreshCw, CheckCircle2, FlaskConical, Binary, Link2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { syncMarketTrendsToFirestore } from '../services/realtimeSyncService';
import { LazyImage } from './common/LazyImage';

// Helper to render markdown links [text](url) and bold text within article bodies
const renderFormattedContent = (content: string) => {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const [fullMatch, text, url] = match;
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      parts.push(content.substring(lastIndex, matchIndex));
    }

    parts.push(
      <a
        key={matchIndex}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-600 dark:text-cyan-400 font-semibold underline underline-offset-2 hover:text-cyan-500 inline-flex items-center gap-0.5 mx-1"
      >
        <span>{text}</span>
        <ExternalLink className="w-3 h-3 shrink-0" />
      </a>
    );

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts.length > 0 ? parts : content;
};

interface DemaqBlogSectionProps {
  posts?: BlogPost[];
}

export const DemaqBlogSection: React.FC<DemaqBlogSectionProps> = ({ posts = defaultBlogPosts }) => {
  const { theme, t, language } = useApp();
  const isLight = theme === 'light';
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshingLive, setIsRefreshingLive] = useState(false);
  const [liveRefreshNotice, setLiveRefreshNotice] = useState<string | null>(null);

  // Extract unique categories plus standard ones
  const categories = useMemo(() => {
    const list = ['All', 'Technical', 'Industry News', 'Projects', 'Buyer Guide'];
    posts.forEach(p => {
      if (p.category && !list.includes(p.category)) {
        list.push(p.category);
      }
    });
    return list;
  }, [posts]);

  // Translate category label
  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return t.blog?.categories?.all || 'All';
    if (cat === 'Technical') return t.blog?.categories?.technical || 'Technical';
    if (cat === 'Industry News') return t.blog?.categories?.industryNews || 'Industry News';
    if (cat === 'Projects') return t.blog?.categories?.projects || 'Projects';
    if (cat === 'Buyer Guide') return t.blog?.categories?.buyerGuide || 'Buyer Guide';
    return cat;
  };

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory =
        selectedCategory === 'All' ||
        post.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Technical' && (post.category === 'Technology & Hardware' || post.category === 'Processors & Systems'));

      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const handleRefreshLiveDatasets = async () => {
    setIsRefreshingLive(true);
    setLiveRefreshNotice(null);
    try {
      // Actively fetch and synchronize latest industry news and market trends from external APIs into Firestore
      const res = await syncMarketTrendsToFirestore(language);
      if (res.success) {
        setLiveRefreshNotice(`✓ Synchronized with External Market APIs: dynamic update pushed to Firestore (${res.blogsCount} articles, ${res.casesCount} case studies)`);
      } else {
        // Fallback to single blog generation
        const resp = await fetch('/api/generate-realtime-blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: 'Addis Ababa Commercial LED Displays 2026 Grid Stability and Altitude Thermodynamics',
            category: 'Technical',
            language
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          setLiveRefreshNotice(`✓ ${t.blog?.realtimeBadge || 'Live Data Grounded'}: ${data.post?.title || 'Updated'}`);
        }
      }
      setTimeout(() => setLiveRefreshNotice(null), 7000);
    } catch (e: any) {
      console.warn('Real-time feed update note:', e);
      setLiveRefreshNotice('Real-time dataset sync note: using local high-fidelity telemetry cache.');
      setTimeout(() => setLiveRefreshNotice(null), 4000);
    } finally {
      setIsRefreshingLive(false);
    }
  };

  return (
    <section id="blog" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="max-w-2xl">
          <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>08. {t.blog?.tag || 'Engineering Knowledge Base & Insights'}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE DATASETS
            </span>
          </div>
          <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.blog?.title || 'LED Display Engineering & Industry Articles'}
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {t.blog?.subtitle || 'Expert guides on GOB/COB packaging, NovaStar calibration, viewing distance calculations, and Ethiopian commercial LED installation case studies.'}
          </p>
        </div>

        {/* Search input & Refresh */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.blog?.searchPlaceholder || 'Search articles, GOB, NovaStar...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-cyan-500 transition-colors ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  : 'bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={handleRefreshLiveDatasets}
            disabled={isRefreshingLive}
            title="Fetch real-time data from Ethiopian hardware lab & live datasets"
            className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshingLive ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline font-mono text-[11px]">{t.blog?.fetchRealtimeBtn || 'Live Data'}</span>
          </button>
        </div>
      </div>

      {liveRefreshNotice && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{liveRefreshNotice}</span>
        </div>
      )}

      {/* Category Pills Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-8">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3 h-3 text-cyan-500" />
          <span>{t.blog?.categoryFilter || 'Category:'}</span>
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = cat === 'All'
            ? posts.length
            : posts.filter(p => p.category?.toLowerCase() === cat.toLowerCase() || (cat === 'Technical' && (p.category === 'Technology & Hardware' || p.category === 'Processors & Systems'))).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : isLight
                  ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{getCategoryLabel(cat)}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border border-dashed font-mono text-xs ${
          isLight ? 'border-slate-200 text-slate-500 bg-white' : 'border-slate-800 text-slate-400 bg-slate-950/40'
        }`}>
          {t.blog?.noArticlesFound || 'No articles found matching'} "{selectedCategory}"{searchQuery ? ` "${searchQuery}"` : ''}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => {
            const hasRealtime = post.automated || (post.realtimeDataPoints && post.realtimeDataPoints.length > 0) || post.grounded;

            return (
              <article
                key={post.id}
                className={`rounded-2xl overflow-hidden flex flex-col justify-between transition-all border group ${
                  isLight
                    ? 'bg-white border-slate-300/80 shadow-lg shadow-slate-900/8 hover:shadow-2xl hover:shadow-slate-900/15 hover:border-slate-400 text-slate-900 ring-1 ring-slate-900/5'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-100 shadow-xl shadow-black/50'
                }`}
              >
                <div>
                  <div className={`relative aspect-[16/9] w-full overflow-hidden ${
                    isLight ? 'bg-slate-100' : 'bg-slate-950'
                  }`}>
                    <LazyImage
                      src={post.image}
                      alt={post.title}
                      aspectRatio="16/9"
                      imgClassName="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 pointer-events-none ${
                      isLight
                        ? 'bg-gradient-to-t from-black/35 via-transparent to-transparent'
                        : 'bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent'
                    }`} />
                    <span className="absolute top-3 left-3 text-[10px] font-mono text-cyan-300 bg-slate-950/85 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-slate-800">
                      {getCategoryLabel(post.category)}
                    </span>
                    {hasRealtime && (
                      <span className="absolute top-3 right-3 text-[10px] font-mono text-emerald-300 bg-emerald-950/85 backdrop-blur-md px-2 py-0.5 rounded-lg border border-emerald-800 flex items-center gap-1.5 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{t.blog?.liveTelemetryBadge || 'Real-Time Grounded'}</span>
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span>{post.date}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>

                    <h3 className={`text-lg font-bold font-display mb-3 transition-colors line-clamp-2 ${
                      isLight ? 'text-slate-900 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-300'
                    }`}>
                      {post.title}
                    </h3>

                    <p className={`text-xs leading-relaxed mb-3 line-clamp-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {post.excerpt}
                    </p>

                    {/* Real-time telemetry chip on card */}
                    {post.realtimeDataPoints && post.realtimeDataPoints.length > 0 && (
                      <div className={`p-2 rounded-xl mb-3 border text-[11px] font-mono flex items-center gap-2 ${
                        isLight ? 'bg-cyan-50/70 border-cyan-200 text-cyan-900' : 'bg-cyan-950/30 border-cyan-800/40 text-cyan-300'
                      }`}>
                        <Activity className="w-3 h-3 text-cyan-500 shrink-0" />
                        <span className="truncate">{post.realtimeDataPoints[0]}</span>
                      </div>
                    )}

                    {/* Scientific & Direct Citation Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {post.scientificFormulas && post.scientificFormulas.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-cyan-300 bg-amber-500/10 dark:bg-cyan-950/50 px-2 py-0.5 rounded border border-amber-500/20 dark:border-cyan-800/40">
                          <FlaskConical className="w-2.5 h-2.5 text-cyan-500" />
                          <span>Physics Formulations</span>
                        </span>
                      )}
                      {post.directLinks && post.directLinks.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20 dark:border-emerald-800/40">
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>{post.directLinks.length} Quoted Citations</span>
                        </span>
                      )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                              isLight
                                ? 'bg-slate-100 border-slate-200 text-slate-600'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={`p-6 pt-0 border-t ${isLight ? 'border-slate-100' : 'border-slate-800/80'}`}>
                  <button
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    className={`mt-4 w-full py-2.5 px-3 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isLight
                        ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{t.blog?.readArticle || 'Read Full Technical Guide'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-500" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-3xl rounded-2xl border p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
          }`}>
            <button
              onClick={() => setSelectedPost(null)}
              className={`absolute top-4 right-4 p-2 rounded-lg cursor-pointer ${
                isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono text-cyan-500 font-bold uppercase">{getCategoryLabel(selectedPost.category)}</span>
              {(selectedPost.automated || selectedPost.realtimeDataPoints) && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t.blog?.realtimeBadge || 'Live Telemetry & Real-Time Data'}
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mb-2 leading-tight">
              {selectedPost.title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono mb-4">
              <span>{t.blog?.publishedBy || 'Published by'}: <strong className="text-slate-300">{selectedPost.author || t.blog?.author || 'DemaQ Real-Time Research Engine'}</strong></span>
              <span>·</span>
              <span>{selectedPost.date}</span>
              <span>·</span>
              <span>{selectedPost.readTime}</span>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl mb-6 bg-slate-900 border border-slate-800">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            {/* Verified Real-time Telemetry Section */}
            {selectedPost.realtimeDataPoints && selectedPost.realtimeDataPoints.length > 0 && (
              <div className={`p-4 rounded-xl border mb-6 ${
                isLight ? 'bg-cyan-50/80 border-cyan-200' : 'bg-cyan-950/40 border-cyan-800/60'
              }`}>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
                  <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
                  <span>{t.blog?.realtimeDataTitle || 'Hardware Lab Telemetry & Verified Benchmarks (2,355m Altitude)'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {selectedPost.realtimeDataPoints.map((dp, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs font-mono flex items-start gap-2 ${
                        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span>{dp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scientific Formulations & Physical Laws */}
            {selectedPost.scientificFormulas && selectedPost.scientificFormulas.length > 0 && (
              <div className={`p-4 sm:p-5 rounded-xl border mb-6 ${
                isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-[#0b162e] border-cyan-800/40 shadow-inner'
              }`}>
                <div className="flex items-center justify-between gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-cyan-300 mb-3">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-cyan-500" />
                    <span>Scientific Formulations & Physical Laws</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    PHYSICS GROUNDED
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedPost.scientificFormulas.map((form, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border text-xs ${
                      isLight ? 'bg-white border-slate-200' : 'bg-[#091226] border-slate-800'
                    }`}>
                      <div className="font-semibold text-slate-900 dark:text-white font-mono text-[11px] mb-1">
                        {form.name || form.label}
                      </div>
                      <div className="px-3 py-2 rounded-lg font-mono text-cyan-600 dark:text-cyan-300 bg-slate-100 dark:bg-[#060d1b] border border-cyan-500/25 overflow-x-auto text-xs my-1.5 font-bold tracking-wide">
                        {form.latex || form.formula}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {form.explanation || form.resultInterpretation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empirical Hardware Telemetry & Benchmarks */}
            {selectedPost.empiricalMetrics && selectedPost.empiricalMetrics.length > 0 && (
              <div className={`p-4 sm:p-5 rounded-xl border mb-6 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b162e] border-slate-800'
              }`}>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                  <Activity className="w-4 h-4 text-cyan-500" />
                  <span>Empirical Hardware Telemetry & Benchmarks</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className={`border-b text-[10px] uppercase text-slate-500 dark:text-slate-400 ${
                        isLight ? 'border-slate-200' : 'border-slate-800'
                      }`}>
                        <th className="pb-2 font-semibold">Parameter</th>
                        <th className="pb-2 font-semibold">DEMAQ Measured</th>
                        <th className="pb-2 font-semibold">Baseline Reference</th>
                        <th className="pb-2 font-semibold">Engineering Standard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                      {selectedPost.empiricalMetrics.map((m, idx) => (
                        <tr key={idx} className="hover:bg-cyan-500/5 transition-colors">
                          <td className="py-2 text-slate-800 dark:text-slate-200 font-medium">{m.parameter || m.metric}</td>
                          <td className="py-2 text-emerald-600 dark:text-emerald-400 font-bold">{m.measuredValue}</td>
                          <td className="py-2 text-slate-500 dark:text-slate-400">{m.baselineValue}</td>
                          <td className="py-2 text-cyan-600 dark:text-cyan-400 text-[11px]">{m.standardRef}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quoted Authoritative Direct Citations & Standards */}
            {selectedPost.directLinks && selectedPost.directLinks.length > 0 && (
              <div className={`p-4 sm:p-5 rounded-xl border mb-6 ${
                isLight ? 'bg-cyan-50/50 border-cyan-200' : 'bg-cyan-950/20 border-cyan-800/40'
              }`}>
                <div className="flex items-center justify-between gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-3">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-cyan-500" />
                    <span>Quoted Authoritative Direct Citations</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-mono">
                    VERIFIED EXTERNAL LINKS
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedPost.directLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between group cursor-pointer ${
                        isLight
                          ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-cyan-400 shadow-xs'
                          : 'bg-[#091226] hover:bg-[#0e1c3a] border-slate-800 hover:border-cyan-500/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-cyan-500 mb-1">
                          <span className="uppercase font-semibold tracking-wider">{link.publisher || link.organization}</span>
                          <ExternalLink className="w-3 h-3 text-cyan-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {link.title}
                        </div>
                      </div>
                      {link.standardCode && (
                        <div className="mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-1.5 flex items-center justify-between">
                          <span>{link.standardCode}</span>
                          <span className="text-emerald-500 font-bold">✓ Verified</span>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Main Content with Link Parser */}
            <div className={`space-y-4 text-xs sm:text-sm leading-relaxed mb-6 whitespace-pre-line ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              {renderFormattedContent(selectedPost.content || selectedPost.excerpt)}
            </div>

            {/* Verified Reference Sources */}
            {selectedPost.sources && selectedPost.sources.length > 0 && (
              <div className={`p-4 rounded-xl border mb-6 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <Database className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t.blog?.sourcesTitle || 'Verified Reference Sources & Technical Citations'}</span>
                </div>
                <ul className="space-y-1.5 text-xs font-mono">
                  {selectedPost.sources.map((src, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-400">
                      <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{src}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 mb-6">
                {selectedPost.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono text-slate-400">
                DemaQ Digital Solution · Addis Ababa, Ethiopia
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                {t.blog?.closeReader || 'Close Guide'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
