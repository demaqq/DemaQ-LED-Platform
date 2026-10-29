/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  SiteConfig, LEDInquiry, MaintenanceRequest, PortfolioItem,
  BlogPost, LEDCaseStudy, AdminAlertSettings, AlertNotification
} from './types';
import {
  initialSiteConfig, ledProducts, ledSolutions, ledCaseStudies,
  sampleLEDInquiries, sampleMaintenanceRequests, blogPosts as initialBlogPosts,
  initialAlertSettings, sampleAlertNotifications
} from './data/mockData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { useApp } from './context/AppContext';
import { AILEDStudioArchitect } from './components/AILEDStudioArchitect';
import { LEDDisplayComparisonTool } from './components/LEDDisplayComparisonTool';
import { LEDWallCalculator } from './components/LEDWallCalculator';
import { TechComparisonSection } from './components/TechComparisonSection';
import { LEDProductCatalog } from './components/LEDProductCatalog';
import { ControllersEcosystem } from './components/ControllersEcosystem';
import { LEDSolutionsSection } from './components/LEDSolutionsSection';
import { LEDSectorJourneys } from './components/LEDSectorJourneys';
import { PixelPitchVisualizer } from './components/PixelPitchVisualizer';
import { LEDWallARVisualizer } from './components/LEDWallARVisualizer';
import { LEDVenueBeforeAfterVisualizer } from './components/LEDVenueBeforeAfterVisualizer';
import { LEDMaintenancePortal } from './components/LEDMaintenancePortal';
import { LEDCaseStudies } from './components/LEDCaseStudies';
import { DemaqBlogSection } from './components/DemaqBlogSection';
import { LEDProformaCurrencyMatrix } from './components/LEDProformaCurrencyMatrix';
import { LEDRFQSection } from './components/LEDRFQSection';
import { LEDFooter } from './components/LEDFooter';
import { PixelEyesBackground } from './components/PixelEyesBackground';
import { FloatingChatbot } from './components/FloatingChatbot';
import { LEDAdminStudioDrawer } from './components/LEDAdminStudioDrawer';
import { LEDClientPortal } from './components/LEDClientPortal';
import { SearchModal } from './components/SearchModal';
import { BellRing, X, ArrowRight, MessageSquare, Smartphone, Mail, Sparkles } from 'lucide-react';
import { db, collection, onSnapshot, setDoc, doc } from './lib/firebase';
import { syncMarketTrendsToFirestore } from './services/realtimeSyncService';

export default function App() {
  // 1. Config State
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('demaq_led_config_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialSiteConfig;
  });

  // 2. Inquiries & RFQs State
  const [inquiries, setInquiries] = useState<LEDInquiry[]>(() => {
    const saved = localStorage.getItem('demaq_led_inquiries_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return sampleLEDInquiries;
  });

  // 3. Maintenance Requests State
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(() => {
    const saved = localStorage.getItem('demaq_led_maintenance_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return sampleMaintenanceRequests;
  });

  // Helper to ensure realistic non-person images for legacy cached items
  const migrateImagePath = (imgPath?: string): string => {
    if (!imgPath) return '/src/assets/images/led_hero_stage_real_1790853027067.jpg';
    if (imgPath.includes('church') || imgPath.includes('sanctuary')) return '/src/assets/images/led_worship_sanctuary_real_1790853041095.jpg';
    if (imgPath.includes('boardroom') || imgPath.includes('cob')) return '/src/assets/images/led_boardroom_real_1790853068703.jpg';
    if (imgPath.includes('control_room') || imgPath.includes('noc') || imgPath.includes('soc')) return '/src/assets/images/led_control_room_real_1790853095603.jpg';
    if (imgPath.includes('concert') || imgPath.includes('staging') || imgPath.includes('arena')) return '/src/assets/images/led_concert_stage_real_1790853083477.jpg';
    if (imgPath.includes('dooh') || imgPath.includes('outdoor') || imgPath.includes('billboard') || imgPath.includes('3d')) return '/src/assets/images/led_outdoor_dooh_real_1790853056151.jpg';
    if (imgPath.includes('virtual') || imgPath.includes('xr') || imgPath.includes('cinema')) return '/src/assets/images/led_virtual_xr_real_1790853110437.jpg';
    if (imgPath.includes('flex') || imgPath.includes('retail') || imgPath.includes('curved')) return '/src/assets/images/led_retail_flexible_real_1790853123520.jpg';
    return imgPath;
  };

  // 4. Blog Posts CMS State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('demaq_blog_posts_v4') || localStorage.getItem('demaq_blog_posts_v3');
    if (saved) {
      try {
        const parsed: BlogPost[] = JSON.parse(saved);
        return parsed.map(p => ({ ...p, image: migrateImagePath(p.image) }));
      } catch (e) { /* fallback */ }
    }
    return initialBlogPosts;
  });

  // 5. Case Studies CMS State
  const [caseStudies, setCaseStudies] = useState<LEDCaseStudy[]>(() => {
    const saved = localStorage.getItem('demaq_case_studies_v4') || localStorage.getItem('demaq_case_studies_v3');
    if (saved) {
      try {
        const parsed: LEDCaseStudy[] = JSON.parse(saved);
        return parsed.map(cs => ({ ...cs, image: migrateImagePath(cs.image) }));
      } catch (e) { /* fallback */ }
    }
    return ledCaseStudies;
  });

  // 6. Admin Alert Settings State
  const [alertSettings, setAlertSettings] = useState<AdminAlertSettings>(() => {
    const saved = localStorage.getItem('demaq_alert_settings_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialAlertSettings;
  });

  // 7. Alert Logs State
  const [alertLogs, setAlertLogs] = useState<AlertNotification[]>(() => {
    const saved = localStorage.getItem('demaq_alert_logs_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return sampleAlertNotifications;
  });

  // UI Modals & Active Toast
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('demaq_studio_admin_authenticated') === 'true';
  });

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = sessionStorage.getItem('demaq_studio_admin_authenticated') === 'true';
      setIsAdminAuthenticated(isAuth);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    const interval = setInterval(checkAuth, 1000);
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, [isAdminOpen]);

  const [prefilledSeries, setPrefilledSeries] = useState<string>('');
  const [activeToastAlert, setActiveToastAlert] = useState<{
    title: string;
    clientName: string;
    summary: string;
    channel: string;
  } | null>(null);

  // Global hotkey Cmd+K or Ctrl+K to open Search Modal & URL Hash for #admin / #portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#dashboard' || window.location.search.includes('admin=true')) {
        setIsAdminOpen(true);
      }
      if (window.location.hash === '#portal' || window.location.hash === '#quotes' || window.location.hash === '#tickets' || window.location.search.includes('portal=true')) {
        setIsPortalOpen(true);
      }
    };

    checkHash();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkHash);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('demaq_led_config_v3', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('demaq_led_inquiries_v3', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('demaq_led_maintenance_v3', JSON.stringify(maintenanceRequests));
  }, [maintenanceRequests]);

  useEffect(() => {
    localStorage.setItem('demaq_blog_posts_v3', JSON.stringify(blogPosts));
  }, [blogPosts]);

  // Auto-generate fresh technical blog post once a day with distinct images
  useEffect(() => {
    const LAST_BLOG_AUTOGEN_KEY = 'demaq_last_blog_autogen_date';
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem(LAST_BLOG_AUTOGEN_KEY);

    if (lastDate !== todayStr) {
      const dailyArticles = [
        {
          title: "Direct 320×160mm Modular Wall Assembly Without Heavy Cabinets",
          category: "Technical" as const,
          readTime: "4 min read",
          excerpt: "How DemaQ uses precision magnetic sub-frames to install ultra-slim 45mm video walls directly on interior masonry walls.",
          content: `Cabinet-less magnetic installations eliminate the bulk and weight of traditional die-cast housings:\n- Ultra-Slim Depth: Only 45mm total profile including magnetic standoffs, fully ADA hallway egress compliant.\n- Weight Reduction: Cuts wall load by 45%, allowing mounting on lightweight gypsum and partition studs.\n- Front Service: 100% magnetic front vacuum tool servicing in under 5 seconds per module.`,
          tags: ["Modular Frame", "Magnetic Front Service", "Slim Profile", "Addis Ababa"],
          image: "/src/assets/images/led_retail_flexible_real_1790853123520.jpg"
        },
        {
          title: "High-Altitude Thermodynamics: Thermal Dissipation at 2,355m in Addis Ababa",
          category: "Technical" as const,
          readTime: "5 min read",
          excerpt: "How common-cathode 2.8V/3.8V rail splits keep junction temperatures 12.4°C cooler in thin mountain atmosphere.",
          content: `At 2,355 meters elevation, Addis Ababa's reduced air density lowers convective airflow efficiency:\n- Common-Cathode Split: Providing separate 2.8V power for red diodes and 3.8V for green/blue diodes stops passive heat generation.\n- Fanless Quiet Cabinets: Die-cast aluminum acts as a massive thermal heatsink with 0 dB acoustic noise for church sanctuaries.\n- MTBF: Operating temperatures below 55°C extend diode half-life past 100,000 continuous hours.`,
          tags: ["Altitude 2355m", "Thermodynamics", "Common-Cathode", "Energy Saving"],
          image: "/src/assets/images/led_control_room_cob_realistic_1790852833333.jpg"
        },
        {
          title: "Ethiopian Media Authority Nocturnal Dimming Standards for Commercial Billboards",
          category: "Industry News" as const,
          readTime: "3 min read",
          excerpt: "Mandatory photodiode automation reducing daylight luminance from 8,500 nits to 1,200 nits after 19:00.",
          content: `Municipal advertising regulations along Bole Road, Meskel Square, and Mexico Square enforce strict environmental guidelines:\n- Photodiode Sensors: Continuous ambient illumination sensing adjusts screen output across 256 brightness steps.\n- Wind Load Compliance: Reinforced steel trusses engineered for 120 km/h wind shear forces.\n- 4G Cloud Telemetry: Remote emergency override broadcasting capability.`,
          tags: ["DOOH", "City Regulations", "Addis Ababa", "Photodiode"],
          image: "/src/assets/images/led_commercial_dooh_realistic_1790852780180.jpg"
        },
        {
          title: "NovaStar VX1000 vs VX400: Selecting the Correct Processor for Your Video Canvas",
          category: "Technical" as const,
          readTime: "4 min read",
          excerpt: "Port bandwidth limits, optical fiber backup loops, and low-latency scaling for sanctuary broadcasts.",
          content: `Calculating Gigabit Ethernet port budgets ensures zero dropped frames during live events:\n- NovaStar VX400: 4 Gigabit output ports driving up to 2.6 million pixels. Ideal for screens up to 20 m² at P2.5.\n- NovaStar VX1000: 10 Gigabit output ports driving up to 6.5 million pixels with dual optical transceiver redundancy.\n- Genlock Shutter: Low-latency ingest eliminates audio-visual lag in live worship streaming.`,
          tags: ["NovaStar", "VX1000", "Video Processing", "Fiber Loop"],
          image: "/src/assets/images/led_concert_staging_realistic_1790852811038.jpg"
        }
      ];

      const dayIndex = Math.floor(Date.now() / 86400000) % dailyArticles.length;
      const chosen = dailyArticles[dayIndex];

      const dailyPost: BlogPost = {
        id: `blog-daily-${todayStr}`,
        title: chosen.title,
        category: chosen.category,
        readTime: chosen.readTime,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        excerpt: chosen.excerpt,
        content: chosen.content,
        tags: chosen.tags,
        image: chosen.image,
        automated: true,
        published: true,
        author: 'DemaQ Daily Engineering Intelligence'
      };

      setBlogPosts(prev => {
        if (prev.some(p => p.id === dailyPost.id || p.title === dailyPost.title)) return prev;
        return [dailyPost, ...prev];
      });

      localStorage.setItem(LAST_BLOG_AUTOGEN_KEY, todayStr);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('demaq_case_studies_v3', JSON.stringify(caseStudies));
  }, [caseStudies]);

  useEffect(() => {
    localStorage.setItem('demaq_alert_settings_v3', JSON.stringify(alertSettings));
  }, [alertSettings]);

  useEffect(() => {
    localStorage.setItem('demaq_alert_logs_v3', JSON.stringify(alertLogs));
  }, [alertLogs]);

  // Real-time Firestore Sync Listeners
  useEffect(() => {
    try {
      const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snap) => {
        if (!snap.empty) {
          const cloudBlogs: BlogPost[] = [];
          snap.forEach((d) => cloudBlogs.push({ id: d.id, ...d.data() } as BlogPost));
          setBlogPosts((prev) => {
            const merged = [...cloudBlogs];
            prev.forEach((p) => {
              if (!merged.some((m) => m.id === p.id)) {
                merged.push(p);
              }
            });
            return merged;
          });
        }
      }, (err) => console.warn('Firestore blogs listener notice:', err));

      const unsubCases = onSnapshot(collection(db, 'caseStudies'), (snap) => {
        if (!snap.empty) {
          const cloudCases: LEDCaseStudy[] = [];
          snap.forEach((d) => cloudCases.push({ id: d.id, ...d.data() } as LEDCaseStudy));
          setCaseStudies((prev) => {
            const merged = [...cloudCases];
            prev.forEach((c) => {
              if (!merged.some((m) => m.id === c.id)) {
                merged.push(c);
              }
            });
            return merged;
          });
        }
      }, (err) => console.warn('Firestore case studies listener notice:', err));

      return () => {
        unsubBlogs();
        unsubCases();
      };
    } catch (e) {
      console.warn('Firestore listener initialization fallback:', e);
    }
  }, []);

  // Once-a-Day Automated Blog & Market Trends Generation (24-hour interval check)
  const { language } = useApp();
  useEffect(() => {
    const checkAndAutoGenerateDaily = async () => {
      try {
        const lastSyncKey = 'demaq_last_daily_auto_sync_v1';
        const lastSyncTime = localStorage.getItem(lastSyncKey);
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;

        if (!lastSyncTime || now - parseInt(lastSyncTime, 10) > oneDayMs) {
          // Trigger backend sync & auto-generation of fresh blog posts & case studies
          const res = await syncMarketTrendsToFirestore(language);
          if (res.success) {
            localStorage.setItem(lastSyncKey, now.toString());
            console.log('[Auto-Generation] Daily blog & market trends successfully auto-generated:', res.message);
          }
        }
      } catch (err) {
        console.warn('[Auto-Generation] Daily check notice:', err);
      }
    };

    checkAndAutoGenerateDaily();
  }, [language]);

  // Audio Chime Synthesizer
  const playAlertChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Ignore if autoplay restricted
    }
  };

  // Trigger Real-Time Proforma Alert Dispatcher
  const dispatchAlert = (inquiry: LEDInquiry) => {
    const newLogs: AlertNotification[] = [];
    const timestamp = 'Just now';

    if (alertSettings.enableWhatsapp) {
      newLogs.push({
        id: `alert-wa-${Date.now()}`,
        timestamp,
        title: 'New RFQ & Proforma Request',
        channel: 'WhatsApp',
        recipient: alertSettings.adminWhatsapp,
        status: 'delivered',
        inquiryType: 'RFQ / Proforma',
        clientName: `${inquiry.clientName} (${inquiry.company})`,
        clientPhone: inquiry.phone,
        summary: `${inquiry.dimensionsWidthM}m × ${inquiry.dimensionsHeightM}m ${inquiry.pixelPitch} · ${inquiry.projectLocation}`,
        payloadText: `🚨 [DEMAQ PROFORMA ALERT]\nClient: ${inquiry.clientName} (${inquiry.company})\nPhone: ${inquiry.phone}\nSpec: ${inquiry.dimensionsWidthM}m × ${inquiry.dimensionsHeightM}m ${inquiry.pixelPitch}\nLocation: ${inquiry.projectLocation}\nRequirement: ${inquiry.availabilityRequirement}\nBudget: ${inquiry.budgetRange}`
      });
    }

    if (alertSettings.enableSms) {
      newLogs.push({
        id: `alert-sms-${Date.now()}`,
        timestamp,
        title: 'New Proforma SMS Alert',
        channel: 'SMS',
        recipient: alertSettings.adminPhone,
        status: 'delivered',
        inquiryType: 'RFQ / Proforma',
        clientName: inquiry.clientName,
        clientPhone: inquiry.phone,
        summary: `${inquiry.pixelPitch} inquiry from ${inquiry.clientName}`,
        payloadText: `[DEMAQ-SMS] New Proforma Request from ${inquiry.clientName} (${inquiry.phone}). Spec: ${inquiry.dimensionsWidthM}x${inquiry.dimensionsHeightM}m ${inquiry.pixelPitch}. Location: ${inquiry.projectLocation}.`
      });
    }

    if (alertSettings.enableEmail) {
      newLogs.push({
        id: `alert-mail-${Date.now()}`,
        timestamp,
        title: 'Proforma Request Notification Email',
        channel: 'Email',
        recipient: alertSettings.adminEmail,
        status: 'delivered',
        inquiryType: 'RFQ / Proforma',
        clientName: inquiry.clientName,
        clientPhone: inquiry.phone,
        summary: `Proforma quote requested for ${inquiry.dimensionsWidthM}m × ${inquiry.dimensionsHeightM}m ${inquiry.seriesInterest}`,
        payloadText: `Subject: New LED Display Proforma Request - ${inquiry.clientName}\nClient: ${inquiry.clientName}\nCompany: ${inquiry.company}\nPhone: ${inquiry.phone}\nDimensions: ${inquiry.dimensionsWidthM}m x ${inquiry.dimensionsHeightM}m\nPitch: ${inquiry.pixelPitch}`
      });
    }

    if (newLogs.length > 0) {
      setAlertLogs((prev) => [...newLogs, ...prev]);
    }

    if (alertSettings.soundAlert) {
      playAlertChime();
    }

    setActiveToastAlert({
      title: '🚨 New Proforma Request Alert!',
      clientName: `${inquiry.clientName} (${inquiry.phone})`,
      summary: `${inquiry.dimensionsWidthM}m × ${inquiry.dimensionsHeightM}m ${inquiry.pixelPitch} · Dispatched to WhatsApp & SMS`,
      channel: 'WhatsApp + SMS + Email'
    });

    // Auto-dismiss toast after 7s
    setTimeout(() => {
      setActiveToastAlert((curr) => (curr?.clientName.includes(inquiry.clientName) ? null : curr));
    }, 7000);
  };

  // Test Alert Trigger Handler for Admin Studio
  const handleTriggerTestAlert = (channel: 'All' | 'SMS' | 'WhatsApp' | 'Email') => {
    const mockInquiry: LEDInquiry = {
      id: `test-rfq-${Date.now()}`,
      clientName: 'Dr. Fitsum Abate',
      company: 'Addis Care Medical Pavilion',
      phone: '+251 911 778 899',
      email: 'fitsum@addiscare.et',
      application: 'Medical Conference & Auditorium',
      seriesInterest: 'DEMAQ Nova-Pitch COB Series',
      pixelPitch: 'P1.25 COB',
      availabilityRequirement: 'Custom Import by Order (<P2.5 / COB)',
      dimensionsWidthM: 7.2,
      dimensionsHeightM: 4.05,
      installationType: 'Wall Mounted',
      projectLocation: 'Sarbet, Addis Ababa',
      budgetRange: '$40,000 - $60,000',
      details: 'Test simulated proforma inquiry from live alert gateway.',
      timestamp: 'Just now',
      status: 'new'
    };

    dispatchAlert(mockInquiry);
  };

  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCaptureInquiry = (data: Omit<LEDInquiry, 'id' | 'timestamp' | 'status'>) => {
    const newInquiry: LEDInquiry = {
      ...data,
      id: `rfq-${Date.now()}`,
      timestamp: 'Just now',
      status: 'new'
    };

    setInquiries((prev) => [newInquiry, ...prev]);
    dispatchAlert(newInquiry);
  };

  const handleUpdateInquiryStatus = (id: string, status: LEDInquiry['status']) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCaptureMaintenanceRequest = (data: Omit<MaintenanceRequest, 'id' | 'timestamp' | 'status'>) => {
    const newRequest: MaintenanceRequest = {
      ...data,
      id: `MAINT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      status: 'pending_quote'
    };

    setMaintenanceRequests((prev) => [newRequest, ...prev]);

    // Dispatch emergency maintenance alert
    if (alertSettings.enableWhatsapp || alertSettings.enableSms) {
      const maintAlert: AlertNotification = {
        id: `alert-maint-${Date.now()}`,
        timestamp: 'Just now',
        title: `🚨 Emergency Repair Ticket: ${newRequest.issueType}`,
        channel: 'WhatsApp',
        recipient: alertSettings.adminWhatsapp,
        status: 'delivered',
        inquiryType: 'Maintenance Urgent Ticket',
        clientName: newRequest.clientName,
        clientPhone: newRequest.phone,
        summary: `${newRequest.urgency} · ${newRequest.screenLocation} (${newRequest.pixelPitch})`,
        payloadText: `🚨 [DEMAQ MAINTENANCE ALERT]\nTicket: ${newRequest.id}\nClient: ${newRequest.clientName} (${newRequest.phone})\nLocation: ${newRequest.screenLocation}\nIssue: ${newRequest.issueType}\nUrgency: ${newRequest.urgency}\nController: ${newRequest.controllerBrand}`
      };
      setAlertLogs((prev) => [maintAlert, ...prev]);
    }

    if (alertSettings.soundAlert) {
      playAlertChime();
    }

    setActiveToastAlert({
      title: '🚨 Emergency Maintenance Alert!',
      clientName: `${newRequest.clientName} (${newRequest.phone})`,
      summary: `${newRequest.issueType} · ${newRequest.screenLocation} (${newRequest.urgency})`,
      channel: 'SMS + WhatsApp'
    });
  };

  const handleUpdateMaintenanceStatus = (id: string, status: MaintenanceRequest['status']) => {
    setMaintenanceRequests((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const handleDeleteMaintenanceRequest = (id: string) => {
    setMaintenanceRequests((prev) => prev.filter((m) => m.id !== id));
  };

  // Blog Handlers
  const handleAddBlogPost = (post: BlogPost) => {
    setBlogPosts((prev) => [post, ...prev]);
  };

  const handleUpdateBlogPost = (updated: BlogPost) => {
    setBlogPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Case Studies Handlers
  const handleAddCaseStudy = (study: LEDCaseStudy) => {
    setCaseStudies((prev) => [study, ...prev]);
  };

  const handleUpdateCaseStudy = (updated: LEDCaseStudy) => {
    setCaseStudies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCaseStudy = (id: string) => {
    setCaseStudies((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSelectForCalculator = (seriesId: string) => {
    handleNavigate('calculator');
  };

  const handleSelectForRFQ = (seriesName: string) => {
    setPrefilledSeries(seriesName);
    handleNavigate('rfq');
  };

  const handleSelectPortfolioForCalc = (portfolio: PortfolioItem) => {
    handleNavigate('calculator');
  };

  const handleSelectPortfolioForRFQ = (portfolio: PortfolioItem) => {
    setPrefilledSeries(`${portfolio.title} (${portfolio.pitch})`);
    handleNavigate('rfq');
  };

  const { theme } = useApp();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen transition-colors duration-400 ease-out flex flex-col font-sans selection:bg-cyan-500/25 selection:text-cyan-200 relative overflow-x-hidden ${
      isLight ? 'bg-[#fcf8f2] text-stone-900' : 'bg-[#091226] text-slate-100'
    }`}>
      {/* Unique Zero-Overhead Cyber LED Pixel Eyes Background Layer */}
      <PixelEyesBackground isLight={isLight} />

      {/* Ambient High-Tech Light Mode Warm Orange/Amber Logo Gradient Orbs & Subtle LED Grid Overlay */}
      {isLight ? (
        <>
          <div className="fixed inset-0 pointer-events-none z-0 led-grid-pattern opacity-80" aria-hidden="true" />
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
            <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-amber-400/18 blur-[120px]" />
            <div className="absolute top-1/4 -right-32 w-[38rem] h-[38rem] rounded-full bg-orange-400/15 blur-[130px]" />
            <div className="absolute top-1/2 -left-40 w-[36rem] h-[36rem] rounded-full bg-yellow-400/15 blur-[130px]" />
            <div className="absolute top-3/4 -right-40 w-[34rem] h-[34rem] rounded-full bg-amber-500/12 blur-[120px]" />
            <div className="absolute -bottom-20 left-1/3 w-[32rem] h-[32rem] rounded-full bg-orange-300/15 blur-[110px]" />
          </div>
        </>
      ) : (
        /* Dark Theme: Sophisticated Deep Navy Blue Cyber Orbs & High-Altitude Starry Atmosphere */
        <>
          <div className="fixed inset-0 pointer-events-none z-0 demaq-grid-bg opacity-70" aria-hidden="true" />
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
            <div className="absolute -top-40 -left-40 w-[42rem] h-[42rem] rounded-full bg-blue-900/18 blur-[140px]" />
            <div className="absolute top-1/4 -right-40 w-[40rem] h-[40rem] rounded-full bg-cyan-950/25 blur-[150px]" />
            <div className="absolute top-1/2 -left-32 w-[38rem] h-[38rem] rounded-full bg-indigo-950/20 blur-[130px]" />
            <div className="absolute top-3/4 -right-32 w-[36rem] h-[36rem] rounded-full bg-blue-950/25 blur-[130px]" />
            <div className="absolute -bottom-20 left-1/3 w-[34rem] h-[34rem] rounded-full bg-cyan-900/15 blur-[120px]" />
          </div>
        </>
      )}

      {/* Top Bar with DEMAQ Branding, In-Stock Alert & Navigation */}
      <Header
        config={config}
        onOpenPortal={() => setIsPortalOpen(true)}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 pt-[112px] sm:pt-[122px] relative z-1">
        {/* Dominant Mobile-First Hero with Embedded Portfolios & Live Specs */}
        <Hero
          config={config}
          onExploreCalculator={() => handleNavigate('calculator')}
          onExploreProducts={() => handleNavigate('products')}
          onSelectPortfolioForCalc={handleSelectPortfolioForCalc}
          onSelectPortfolioForRFQ={handleSelectPortfolioForRFQ}
        />

        {/* 01. DemaQ Display Venue Architect & Screen Planner */}
        <AILEDStudioArchitect
          onLoadIntoCalculator={(w, h, pitch) => {
            handleNavigate('calculator');
          }}
          onNavigateToRFQ={(details) => {
            setPrefilledSeries(details);
            handleNavigate('rfq');
          }}
        />

        {/* 02. Interactive Side-by-Side Model Spec Comparison Matrix */}
        <LEDDisplayComparisonTool
          onSelectForCalculator={(series) => {
            handleNavigate('calculator');
          }}
          onNavigateToRFQ={(series) => {
            setPrefilledSeries(series);
            handleNavigate('rfq');
          }}
        />

        {/* 03. Interactive LED Video Wall Configurator & Pixel Calculator */}
        <LEDWallCalculator
          onCaptureInquiry={handleCaptureInquiry}
          onNavigateToRFQ={() => handleNavigate('rfq')}
        />

        {/* 04. GOB vs COB vs SMD Hardware Architecture Guide */}
        <TechComparisonSection />

        {/* 05. Hardware Catalog & Stock Matrix (In-Stock vs Import by Order) */}
        <LEDProductCatalog
          products={ledProducts}
          onSelectForCalculator={handleSelectForCalculator}
          onNavigateToRFQ={handleSelectForRFQ}
        />

        {/* 06. Supported Controllers Ecosystem (NovaStar, Huidu, Colorlight, Linsn, Brompton) */}
        <ControllersEcosystem />

        {/* 07. Turnkey Industry Solutions */}
        <LEDSolutionsSection
          solutions={ledSolutions}
          onSelectSolution={(title) => handleSelectForRFQ(title)}
        />

        {/* 07B. Tailored Client Sector Journeys (Churches, Banks, DOOH, Stage Rentals, Studios) */}
        <LEDSectorJourneys
          onSelectSectorForRFQ={(sectorName, specs) => {
            setPrefilledSeries(`${sectorName} — ${specs}`);
            handleNavigate('rfq');
          }}
          onSelectSectorForCalc={() => {
            handleNavigate('calculator');
          }}
        />

        {/* 08. Pixel Pitch vs. Viewing Distance Visualizer Simulator */}
        <PixelPitchVisualizer />

        {/* 09. Augmented Reality (AR) Room & Camera Visualizer Tool */}
        <LEDWallARVisualizer />

        {/* 09B. Interactive Before vs. After Venue Visualizer */}
        <LEDVenueBeforeAfterVisualizer
          onConfigureInCalculator={() => {
            handleNavigate('calculator');
          }}
          onNavigateToRFQ={(details) => {
            setPrefilledSeries(details);
            handleNavigate('rfq');
          }}
        />

        {/* 10. LED Screen Maintenance & Repair Portal (Upload Issue & Get Quotation) */}
        <LEDMaintenancePortal
          onCaptureMaintenanceRequest={handleCaptureMaintenanceRequest}
        />

        {/* 11. Global Benchmark Deployments & Real Case Studies */}
        <LEDCaseStudies
          caseStudies={caseStudies}
        />

        {/* 12. Engineering Blog & Technical Knowledge Base */}
        <DemaqBlogSection
          posts={blogPosts}
        />

        {/* 12B. Real-Time Proforma & Multi-Currency Engine (ETB / USD) */}
        <LEDProformaCurrencyMatrix
          onTransferToRFQ={(proformaDetails) => {
            setPrefilledSeries(proformaDetails);
            handleNavigate('rfq');
          }}
        />

        {/* 13. Official LED Video Wall Request for Quotation (RFQ) */}
        <LEDRFQSection
          config={config}
          onCaptureInquiry={handleCaptureInquiry}
          prefilledSeries={prefilledSeries}
        />
      </main>

      {/* Footer with Comprehensive Links, Social Channels, and Navigation */}
      <LEDFooter
        config={config}
        onNavigate={handleNavigate}
        onOpenPortal={() => setIsPortalOpen(true)}
      />

      {/* Floating Demaq bot with Hover Effect and DEMAQ Logo */}
      <FloatingChatbot config={config} />

      {/* Global LED Hardware & Engineering Search Hub Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Secure Client Portal Modal (Firebase Auth & Real-Time Tracking) */}
      <LEDClientPortal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        config={config}
        inquiries={inquiries}
        maintenanceRequests={maintenanceRequests}
        onNavigateToRFQ={() => handleNavigate('rfq')}
        onNavigateToMaintenance={() => handleNavigate('maintenance')}
        onRequestNewQuote={handleCaptureInquiry}
        onRequestNewMaintenance={handleCaptureMaintenanceRequest}
      />

      {/* Live Toast Alert Notification Component (Admin Only) */}
      {activeToastAlert && isAdminAuthenticated && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-2xl bg-slate-900/95 border-2 border-amber-500/50 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 text-white flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <BellRing className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-amber-300 font-display">{activeToastAlert.title}</h5>
                <span className="text-[10px] font-mono text-slate-400 block">{activeToastAlert.channel}</span>
              </div>
            </div>
            <button
              onClick={() => setActiveToastAlert(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs font-semibold text-slate-200">{activeToastAlert.clientName}</div>
          <p className="text-[11px] text-slate-400">{activeToastAlert.summary}</p>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Pushed to WhatsApp & SMS
            </span>
            <button
              onClick={() => { setActiveToastAlert(null); setIsAdminOpen(true); }}
              className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <span>View in Demaq Studio</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* LED Enterprise Admin Studio Drawer (RFQs + Proformas + Blogs CMS + Case Studies + Instant Alerts) */}
      <LEDAdminStudioDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onUpdateConfig={setConfig}
        inquiries={inquiries}
        onUpdateInquiryStatus={handleUpdateInquiryStatus}
        onDeleteInquiry={handleDeleteInquiry}
        maintenanceRequests={maintenanceRequests}
        onUpdateMaintenanceStatus={handleUpdateMaintenanceStatus}
        onDeleteMaintenanceRequest={handleDeleteMaintenanceRequest}
        blogPosts={blogPosts}
        onAddBlogPost={handleAddBlogPost}
        onUpdateBlogPost={handleUpdateBlogPost}
        onDeleteBlogPost={handleDeleteBlogPost}
        caseStudies={caseStudies}
        onAddCaseStudy={handleAddCaseStudy}
        onUpdateCaseStudy={handleUpdateCaseStudy}
        onDeleteCaseStudy={handleDeleteCaseStudy}
        alertSettings={alertSettings}
        onUpdateAlertSettings={setAlertSettings}
        alertLogs={alertLogs}
        onTriggerTestAlert={handleTriggerTestAlert}
        onClearAlertLogs={() => setAlertLogs([])}
      />
    </div>
  );
}
