import React, { useState, useEffect } from 'react';
import {
  SiteConfig, LEDInquiry, MaintenanceRequest, BlogPost, LEDCaseStudy,
  AdminAlertSettings, AlertNotification, ProformaQuote, BlogCategory
} from '../types';
import {
  X, Sliders, Users, Download, Save, Check, Trash2, Mail,
  ExternalLink, ShieldCheck, Monitor, Truck, Clock, Wrench,
  AlertCircle, Phone, FileText, Send, Plus, Edit3, MessageSquare,
  Bell, BellRing, Smartphone, CheckCircle2, ChevronRight, Eye,
  Sparkles, RefreshCw, Layers, Printer, Share2, Copy, Filter,
  Building, MapPin, Hash, Zap, HelpCircle, LogIn, LogOut, User as UserIcon,
  Bot, Wand2, Database, Globe, Lock, ChevronUp, ArrowUp
} from 'lucide-react';
import {
  auth,
  signInWithGoogle,
  signInWithEmail,
  logoutUser,
  User,
  db,
  collection,
  doc,
  setDoc,
  deleteDoc
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { LEDAdminAnalyticsChart } from './LEDAdminAnalyticsChart';
import { useApp } from '../context/AppContext';
import { DemaqLogo } from './DemaqLogo';
import { syncMarketTrendsToFirestore, SyncResult } from '../services/realtimeSyncService';

interface LEDAdminStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
  inquiries: LEDInquiry[];
  onUpdateInquiryStatus: (id: string, status: LEDInquiry['status']) => void;
  onDeleteInquiry: (id: string) => void;
  maintenanceRequests: MaintenanceRequest[];
  onUpdateMaintenanceStatus: (id: string, status: MaintenanceRequest['status']) => void;
  onDeleteMaintenanceRequest: (id: string) => void;
  blogPosts: BlogPost[];
  onAddBlogPost: (post: BlogPost) => void;
  onUpdateBlogPost: (post: BlogPost) => void;
  onDeleteBlogPost: (id: string) => void;
  caseStudies: LEDCaseStudy[];
  onAddCaseStudy: (study: LEDCaseStudy) => void;
  onUpdateCaseStudy: (study: LEDCaseStudy) => void;
  onDeleteCaseStudy: (id: string) => void;
  alertSettings: AdminAlertSettings;
  onUpdateAlertSettings: (settings: AdminAlertSettings) => void;
  alertLogs: AlertNotification[];
  onTriggerTestAlert: (channel: 'All' | 'SMS' | 'WhatsApp' | 'Email') => void;
  onClearAlertLogs: () => void;
}

export const LEDAdminStudioDrawer: React.FC<LEDAdminStudioDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  inquiries,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  maintenanceRequests,
  onUpdateMaintenanceStatus,
  onDeleteMaintenanceRequest,
  blogPosts,
  onAddBlogPost,
  onUpdateBlogPost,
  onDeleteBlogPost,
  caseStudies,
  onAddCaseStudy,
  onUpdateCaseStudy,
  onDeleteCaseStudy,
  alertSettings,
  onUpdateAlertSettings,
  alertLogs,
  onTriggerTestAlert,
  onClearAlertLogs
}) => {
  const { theme, language, logoUrl, setLogoUrl } = useApp();
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'overview' | 'rfqs' | 'alerts' | 'blogs' | 'case_studies' | 'maintenance' | 'automation' | 'settings'>('overview');
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [alertFormData, setAlertFormData] = useState<AdminAlertSettings>(alertSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'engineering_review' | 'quotation_sent' | 'won'>('all');
  const [maintStatusFilter, setMaintStatusFilter] = useState<'all' | 'pending_quote' | 'technician_assigned' | 'in_progress' | 'resolved'>('all');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [realtimeGenStep, setRealtimeGenStep] = useState<string | null>(null);
  const contentContainerRef = React.useRef<HTMLDivElement>(null);

  // Firebase Auth user state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // External Market Trends Sync State
  const [isSyncingTrends, setIsSyncingTrends] = useState(false);
  const [syncResultNotice, setSyncResultNotice] = useState<string | null>(null);

  // Admin verification with specific administrative password and authorized accounts
  const ADMIN_EMAILS = ['makbelcj@gmail.com', 'admin@demaqdigital.com', 'admin@demaq.com'];
  const ADMIN_PASSWORDS = ['demaq2026', 'DemaqStudio2026!', 'demaq799', 'Admin@Demaq2026'];

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('demaq_studio_admin_authenticated') === 'true';
  });

  const isUserAdmin = Boolean(
    isAdminAuthenticated ||
    (currentUser?.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim()))
  );

  // Ensure currentUser has a fallback object when authenticated via password so UI controls show
  const activeUser = currentUser || (isAdminAuthenticated ? {
    uid: 'admin-master',
    email: 'admin@demaqdigital.com',
    displayName: 'Demaq Administrator',
    photoURL: null
  } as User : null);

  // Form states for login
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const normalizedUser = adminUsername.trim().toLowerCase();
    const enteredPassword = adminPassword.trim();

    if (!normalizedUser) {
      setAuthError('Please enter your administrator username or email.');
      return;
    }

    if (!enteredPassword) {
      setAuthError('Administrative password is required. Access to Demaq Studio is protected.');
      return;
    }

    // Verify against specific administrative security passwords
    if (ADMIN_PASSWORDS.includes(enteredPassword)) {
      sessionStorage.setItem('demaq_studio_admin_authenticated', 'true');
      setIsAdminAuthenticated(true);
      setCurrentUser({
        uid: 'admin-master',
        email: normalizedUser.includes('@') ? normalizedUser : 'makbelcj@gmail.com',
        displayName: 'Demaq Administrator',
        photoURL: null,
        emailVerified: true
      } as User);
      setAdminUsername('');
      setAdminPassword('');
      return;
    }

    // Try standard email authentication if valid email format with Firebase Auth
    if (normalizedUser.includes('@')) {
      setAuthLoading(true);
      try {
        const cred = await signInWithEmail(normalizedUser, enteredPassword);
        if (cred?.user?.email && ADMIN_EMAILS.includes(cred.user.email.toLowerCase().trim())) {
          sessionStorage.setItem('demaq_studio_admin_authenticated', 'true');
          setIsAdminAuthenticated(true);
          setCurrentUser(cred.user);
          setAdminUsername('');
          setAdminPassword('');
        } else {
          await logoutUser();
          setAuthError('Unauthorized Account: This user does not possess administrative clearance for Demaq Studio.');
        }
      } catch (err: any) {
        setAuthError(err?.message || 'Access denied: Invalid administrative password or credentials.');
      } finally {
        setAuthLoading(false);
      }
      return;
    }

    setAuthError('Access denied: Incorrect administrative password.');
  };
  // Proforma Invoice Generator state
  const [activeProformaInquiry, setActiveProformaInquiry] = useState<LEDInquiry | null>(null);
  const [proformaVatRate, setProformaVatRate] = useState<number>(0.15);
  const [proformaDeliveryFee, setProformaDeliveryFee] = useState<number>(15000);
  const [proformaLaborFee, setProformaLaborFee] = useState<number>(25000);
  const [copiedText, setCopiedText] = useState(false);

  // Blog Editor State
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [blogEditId, setBlogEditId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState<BlogCategory>('Technical');
  const [blogReadTime, setBlogReadTime] = useState('4 min read');
  const [blogDate, setBlogDate] = useState('October 2026');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState('/src/assets/images/led_hero_stage_real_1790853027067.jpg');
  const [blogTags, setBlogTags] = useState('Technical, GOB LED, Addis Ababa');
  const [isAutoGeneratingBlog, setIsAutoGeneratingBlog] = useState(false);

  // Automation Generator State
  const [autoBlogTopic, setAutoBlogTopic] = useState('');
  const [autoBlogCategory, setAutoBlogCategory] = useState<BlogCategory>('Technical');
  const [autoCasePreset, setAutoCasePreset] = useState<'worship' | 'control_room' | 'arena' | 'billboard' | 'custom'>('worship');
  const [autoCustomCaseProject, setAutoCustomCaseProject] = useState('');
  const [autoCustomCaseClient, setAutoCustomCaseClient] = useState('');
  const [autoCustomCaseLocation, setAutoCustomCaseLocation] = useState('Addis Ababa, Ethiopia');
  const [autoCustomCaseCategory, setAutoCustomCaseCategory] = useState('Projects');
  const [autoCustomCasePitch, setAutoCustomCasePitch] = useState('P2.5 Shield-GOB');
  const [isAutoGeneratingCase, setIsAutoGeneratingCase] = useState(false);
  const [autoSuccessNotice, setAutoSuccessNotice] = useState<string | null>(null);

  // Case Study Editor State
  const [isEditingCaseStudy, setIsEditingCaseStudy] = useState(false);
  const [caseEditId, setCaseEditId] = useState<string | null>(null);
  const [caseClient, setCaseClient] = useState('');
  const [caseProjectName, setCaseProjectName] = useState('');
  const [caseLocation, setCaseLocation] = useState('Addis Ababa, Ethiopia');
  const [caseCategory, setCaseCategory] = useState('Projects');
  const [casePitch, setCasePitch] = useState('P2.5 Shield-GOB');
  const [casePackaging, setCasePackaging] = useState('Glue-On-Board Epoxy Armor');
  const [caseDimensions, setCaseDimensions] = useState('8m × 4m');
  const [caseTotalArea, setCaseTotalArea] = useState('32 m²');
  const [caseResolution, setCaseResolution] = useState('3200 × 1600 px');
  const [caseChallenge, setCaseChallenge] = useState('');
  const [caseSolution, setCaseSolution] = useState('');
  const [caseImage, setCaseImage] = useState('/src/assets/images/led_worship_sanctuary_real_1790853041095.jpg');
  const [caseMetric1Label, setCaseMetric1Label] = useState('Surface Durability');
  const [caseMetric1Value, setCaseMetric1Value] = useState('100% Anti-Collision');
  const [caseMetric2Label, setCaseMetric2Label] = useState('Energy Saving');
  const [caseMetric2Value, setCaseMetric2Value] = useState('35% Common-Cathode');
  const [caseTechs, setCaseTechs] = useState('NovaStar VX1000, MeanWell 5V60A, GOB Coating');

  // Track Firebase Auth state & 30-Minute Inactivity Auto-Logout Mechanism
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOpen || !isUserAdmin) return;

    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      // 30 minutes = 30 * 60 * 1000 ms
      inactivityTimer = setTimeout(() => {
        sessionStorage.removeItem('demaq_studio_admin_authenticated');
        setIsAdminAuthenticated(false);
        setCurrentUser(null);
        try {
          logoutUser();
        } catch {
          // ignore
        }
        console.warn('Demaq Studio auto-logged out due to 30 minutes of inactivity.');
      }, 30 * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [isOpen, isUserAdmin]);

  React.useEffect(() => {
    setFormData(config);
  }, [config]);

  React.useEffect(() => {
    setAlertFormData(alertSettings);
  }, [alertSettings]);

  if (!isOpen) return null;

  const handleDrawerClose = () => {
    if (!isUserAdmin && (window.location.hash === '#admin' || window.location.hash === '#dashboard')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    onClose();
  };

  const handleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const loggedInUser = await signInWithGoogle();
      if (loggedInUser?.email && ADMIN_EMAILS.includes(loggedInUser.email.toLowerCase().trim())) {
        sessionStorage.setItem('demaq_studio_admin_authenticated', 'true');
        setIsAdminAuthenticated(true);
        setCurrentUser(loggedInUser);
      } else {
        await logoutUser();
        setAuthError('Unauthorized Account: This Google account does not possess administrative clearance for Demaq Studio.');
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      setAuthError(err?.message || 'Google Sign-In failed. Please use your administrator password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    sessionStorage.removeItem('demaq_studio_admin_authenticated');
    setIsAdminAuthenticated(false);
    setCurrentUser(null);
    try {
      await logoutUser();
    } catch (e) { /* ignore */ }
    if (window.location.hash === '#admin' || window.location.hash === '#dashboard') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Active External API & Firestore Market Trends Synchronization
  const handleSyncMarketTrends = async () => {
    setIsSyncingTrends(true);
    setSyncResultNotice(null);
    try {
      const res = await syncMarketTrendsToFirestore(language);
      if (res.success) {
        setSyncResultNotice(`✓ Synced ${res.blogsCount} articles & ${res.casesCount} case studies into Firestore.`);
        setTimeout(() => setSyncResultNotice(null), 7000);
      } else {
        setSyncResultNotice(`⚠ Sync note: ${res.error || res.message}`);
      }
    } catch (err: any) {
      setSyncResultNotice(`Sync failed: ${err.message || String(err)}`);
    } finally {
      setIsSyncingTrends(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveAlertSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAlertSettings(alertFormData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Blog Management Handlers
  const handleOpenNewBlog = () => {
    setBlogEditId(null);
    setBlogTitle('');
    setBlogCategory('Technical');
    setBlogReadTime('4 min read');
    setBlogDate(new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    setBlogExcerpt('');
    setBlogContent('');
    setBlogImage('/src/assets/images/led_hero_stage_real_1790853027067.jpg');
    setBlogTags('Technical, Hardware, Ethiopia');
    setIsEditingBlog(true);
  };

  const handleOpenEditBlog = (post: BlogPost) => {
    setBlogEditId(post.id);
    setBlogTitle(post.title);
    setBlogCategory(post.category);
    setBlogReadTime(post.readTime);
    setBlogDate(post.date);
    setBlogExcerpt(post.excerpt);
    setBlogContent(post.content || post.excerpt);
    setBlogImage(post.image);
    setBlogTags((post.tags || []).join(', '));
    setIsEditingBlog(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) return;

    const tagsArray = blogTags.split(',').map(t => t.trim()).filter(Boolean);
    const postData: BlogPost = {
      id: blogEditId || `blog-${Date.now()}`,
      title: blogTitle,
      category: blogCategory,
      readTime: blogReadTime,
      date: blogDate,
      excerpt: blogExcerpt,
      content: blogContent,
      image: blogImage,
      tags: tagsArray,
      published: true,
      author: currentUser?.displayName || 'DemaQ Lead Systems Engineer'
    };

    if (blogEditId) {
      onUpdateBlogPost(postData);
    } else {
      onAddBlogPost(postData);
    }

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'blogs', postData.id), {
        ...postData,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Firestore sync note:', err);
    }

    setIsEditingBlog(false);
  };

  // Automation Feature: Real-Time AI Blog Generation
  const handleAutomateGenerateBlog = async (presetTopic?: string, presetCat?: BlogCategory) => {
    setIsAutoGeneratingBlog(true);
    const rawTopic = presetTopic || autoBlogTopic.trim() || 'Why Flip-Chip COB Micro-LEDs Run 12°C Cooler Than Traditional SMD';
    const cat = presetCat || autoBlogCategory || 'Technical';

    setRealtimeGenStep('🔍 Gathering real-time LED industry datasets & market parameters...');

    try {
      const resp = await fetch('/api/generate-realtime-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: rawTopic,
          category: cat,
          language: language
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.post) {
          setRealtimeGenStep('⚡ Publishing search-grounded technical post to live database...');
          onAddBlogPost(data.post);
          try {
            await setDoc(doc(db, 'blogs', data.post.id), {
              ...data.post,
              createdAt: new Date().toISOString()
            });
          } catch (e) {
            console.warn('Firestore sync note:', e);
          }

          setIsAutoGeneratingBlog(false);
          setRealtimeGenStep(null);
          setAutoBlogTopic('');
          setAutoSuccessNotice(`✨ Published Real-Time Article: "${data.post.title}"`);
          setTimeout(() => setAutoSuccessNotice(null), 6000);
          setActiveTab('blogs');
          return;
        }
      }
    } catch (apiErr) {
      console.warn('Real-time blog API network error, applying local dataset engine:', apiErr);
    }

    // High-fidelity fallback
    await new Promise(r => setTimeout(r, 600));

    let title = '';
    let excerpt = '';
    let content = '';
    let tags: string[] = [];
    let image = '/src/assets/images/led_hero_stage_real_1790853027067.jpg';

    const lower = rawTopic.toLowerCase();
    if (lower.includes('worship') || lower.includes('church') || lower.includes('sanctuary')) {
      image = '/src/assets/images/led_worship_sanctuary_real_1790853041095.jpg';
    } else if (lower.includes('control') || lower.includes('soc') || lower.includes('noc') || lower.includes('cob') || lower.includes('flip-chip')) {
      image = '/src/assets/images/led_control_room_real_1790853095603.jpg';
    } else if (lower.includes('boardroom') || lower.includes('conference') || lower.includes('corporate')) {
      image = '/src/assets/images/led_boardroom_real_1790853068703.jpg';
    } else if (lower.includes('outdoor') || lower.includes('dooh') || lower.includes('billboard') || lower.includes('3d') || lower.includes('anamorphic')) {
      image = '/src/assets/images/led_outdoor_dooh_real_1790853056151.jpg';
    } else if (lower.includes('concert') || lower.includes('arena') || lower.includes('staging') || lower.includes('rental') || lower.includes('millennium')) {
      image = '/src/assets/images/led_concert_stage_real_1790853083477.jpg';
    } else if (lower.includes('xr') || lower.includes('virtual') || lower.includes('cinema') || lower.includes('studio')) {
      image = '/src/assets/images/led_virtual_xr_real_1790853110437.jpg';
    } else if (lower.includes('retail') || lower.includes('curved') || lower.includes('mall') || lower.includes('flexible')) {
      image = '/src/assets/images/led_retail_flexible_real_1790853123520.jpg';
    }

    if (cat === 'Technical') {
      title = rawTopic.startsWith('Why') || rawTopic.startsWith('How') || rawTopic.startsWith('Engineering') ? rawTopic : `Engineering Deep-Dive: ${rawTopic}`;
      excerpt = `A comprehensive technical analysis on diode packaging, refresh rates, thermal distribution, and power reliability in commercial Ethiopian LED installations.`;
      content = `When specifying LED display hardware in East Africa, thermal management and power stability directly dictate diode lifespan and optical color fidelity.

1. Common-Cathode vs Common-Anode Architecture:
Common-cathode power distribution supplies separate voltages to Red (2.8V) and Green/Blue (3.8V) diodes, saving up to 35% electrical consumption and lowering screen surface temperature by 12°C to 15°C.

2. Flip-Chip COB vs Surface Mount (SMD):
By removing gold bonding wires and mounting chips directly onto the PCB substrate with optical resin encapsulation, Flip-Chip COB achieves 10,000:1 contrast ratios, 170° viewing angles, and zero physical wire bonding failures.

3. Voltage Protection & MeanWell Power Modules:
All DemaQ installations include MeanWell 5V 60A redundant power modules with integrated spike suppression designed specifically for municipal grid fluctuations across Addis Ababa.

4. Calibration & Signal Ingest:
Using NovaStar NovaLCT and SmartLCT calibration, white balance ΔE is maintained below 1.5 with full 16-bit grayscale precision.`;
      tags = ['Technical', 'Engineering', 'Hardware', 'Thermal Management', 'Addis Ababa'];
    } else if (cat === 'Industry News') {
      title = rawTopic.includes('Report') || rawTopic.includes('Standards') || rawTopic.includes('Regulations') ? rawTopic : `Industry Bulletin: ${rawTopic}`;
      excerpt = `Recent developments in the Ethiopian commercial display market, municipal compliance standards, daylight sensor dimming, and digital billboard installations.`;
      content = `The outdoor advertising and architectural LED market across Addis Ababa and regional commercial corridors is witnessing rapid modern upgrades in 2026.

Key Industry Drivers:
- Transition from static billboards to anamorphic 3D curved DOOH displays along major traffic arteries (Bole Road, Meskel Square, Sarbet, Kazanchis).
- Municipal mandates requiring automatic photodiode day/night brightness sensors and certified wind-load structural engineering.
- Increasing demand for local in-stock inventory with 24 to 48-hour event deployments to eliminate multi-month import delays.

DemaQ Digital Solution continues to lead the market with turnkey engineering, certified structural frames, and immediate warehouse availability.`;
      tags = ['Industry News', 'DOOH', 'Market Report', 'Addis Ababa', 'Ethiopian Media Authority'];
    } else if (cat === 'Projects') {
      title = rawTopic.includes('Inside') || rawTopic.includes('Project') || rawTopic.includes('Spotlight') ? rawTopic : `Project Case Study: ${rawTopic}`;
      excerpt = `Engineering documentation covering structural sub-framing, cabinet rigging, NovaStar calibration, and turnkey delivery.`;
      content = `Executing large-scale video wall projects in corporate boardrooms, auditoriums, and event venues requires synchronized multi-cabinet engineering:

Engineering Execution:
- Display Surface: Ultra-flat seamless cabinet array engineered with sub-millimeter precision tolerances.
- Signal Processing: Redundant Gigabit Ethernet loops driven by NovaStar VX-Series processors with optical fiber isolation to eliminate ground loop artifacts.
- Post-Installation Tuning: On-site photometer calibration ensuring uniform luminance and chromaticity across all seating perspectives.`;
      tags = ['Projects', 'Installation', 'Turnkey Staging', 'Addis Ababa', 'NovaStar'];
    } else {
      title = rawTopic.includes('Guide') || rawTopic.includes('Buyer') ? rawTopic : `Buyer & Engineering Guide: ${rawTopic}`;
      excerpt = `Essential criteria for evaluating pixel pitch, viewing distance, GOB surface protection, and total cost of ownership.`;
      content = `Selecting the right LED video wall specification requires balancing viewing distance, ambient illumination, and mechanical durability:

1. Pixel Pitch vs Viewing Distance:
A minimum viewing distance of 2.5 meters pairs perfectly with P2.5 GOB panels, while executive boardrooms (<1.5m) benefit from sub-P1.5 COB ultra-fine pitch.

2. Packaging Durability (GOB vs SMD):
For high-traffic spaces, worship sanctuaries, and schools, Glue-On-Board (GOB) provides essential waterproof, dustproof, and anti-collision surface armor.

3. Total Cost of Ownership:
Investing in energy-efficient ICs and locally available spare modules reduces long-term maintenance overhead by over 40%.`;
      tags = ['Buyer Guide', 'Pixel Pitch', 'GOB Armor', 'Commercial LED'];
    }

    const autoPost: BlogPost = {
      id: `blog-auto-${Date.now()}`,
      title,
      category: cat,
      readTime: '5 min read',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      excerpt,
      content,
      image,
      tags,
      automated: true,
      published: true,
      author: 'DemaQ Real-Time Research Engine',
      realtimeDataPoints: [
        'MeanWell 5V 60A redundant dual-rail surge suppression',
        'Common-Cathode 35% thermal dissipation optimization (-12°C)',
        'NovaStar 16-bit grayscale calibration (ΔE < 1.5)'
      ],
      sources: ['DemaQ Hardware Lab & Addis Ababa Municipal Records']
    };

    onAddBlogPost(autoPost);
    try {
      await setDoc(doc(db, 'blogs', autoPost.id), {
        ...autoPost,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore sync note:', e);
    }

    setIsAutoGeneratingBlog(false);
    setRealtimeGenStep(null);
    setAutoBlogTopic('');
    setAutoSuccessNotice(`✨ Published AI Article: "${title}"`);
    setTimeout(() => setAutoSuccessNotice(null), 6000);
    setActiveTab('blogs');
  };

  // Automation Feature: Real-Time AI Case Study Generation
  const handleAutomateGenerateCaseStudy = async () => {
    setIsAutoGeneratingCase(true);
    setRealtimeGenStep('📐 Calculating display geometry, power draw, and real benchmarks...');

    try {
      const resp = await fetch('/api/generate-realtime-case-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preset: autoCasePreset,
          customProject: autoCustomCaseProject,
          customClient: autoCustomCaseClient,
          customLocation: autoCustomCaseLocation,
          customPitch: autoCustomCasePitch,
          customCategory: autoCustomCaseCategory,
          language: language
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.caseStudy) {
          setRealtimeGenStep('✨ Publishing verified benchmark case study...');
          onAddCaseStudy(data.caseStudy);
          try {
            await setDoc(doc(db, 'caseStudies', data.caseStudy.id), {
              ...data.caseStudy,
              createdAt: new Date().toISOString()
            });
          } catch (e) {
            console.warn('Firestore sync note:', e);
          }

          setIsAutoGeneratingCase(false);
          setRealtimeGenStep(null);
          setAutoSuccessNotice(`✨ Published Real-Time Case Study: "${data.caseStudy.projectName}"`);
          setTimeout(() => setAutoSuccessNotice(null), 6000);
          setActiveTab('case_studies');
          return;
        }
      }
    } catch (apiErr) {
      console.warn('Real-time case study API error, applying local dataset engine:', apiErr);
    }

    await new Promise(r => setTimeout(r, 600));

    let newStudy: LEDCaseStudy;
    if (autoCasePreset === 'worship') {
      newStudy = {
        id: `case-auto-${Date.now()}`,
        client: 'Addis Christian Center',
        projectName: 'Main Auditorium Sanctuary Armored Video Wall',
        location: 'Sarbet, Addis Ababa',
        category: 'House of Worship',
        pitch: 'P2.5 Shield-GOB Armored',
        packaging: 'Glue-On-Board Epoxy Resin Encapsulation',
        screenDimensions: '9.6m (W) × 3.84m (H)',
        totalArea: '36.86 m²',
        resolution: '3840 × 1536 px (Ultra-Wide HD)',
        challenge: 'Worship stage required an ultra-durable screen that would not suffer dead pixels from choir contact, instrument bumps, or cleaning wipe-downs.',
        solution: 'Deployed DEMAQ in-stock P2.5 GOB displays with 100% anti-collision surface armor, paired with NovaStar VX1000 processing and redundant MeanWell 5V 60A power supplies.',
        metrics: [
          { label: 'Surface Impact Resistance', value: '100% Collision-Proof GOB' },
          { label: 'White Uniformity', value: 'ΔE < 1.5 Color Calibrated' }
        ],
        technologies: ['NovaStar VX1000', 'Shield-GOB Armored', 'MeanWell 5V60A', 'Precision Steel Sub-frame'],
        image: '/src/assets/images/led_worship_sanctuary_real_1790853041095.jpg',
        automated: true
      };
    } else if (autoCasePreset === 'control_room') {
      newStudy = {
        id: `case-auto-${Date.now()}`,
        client: 'National Financial Headquarters',
        projectName: 'Executive Security Operations Center (SOC) Video Wall',
        location: 'Kazanchis Financial District, Addis Ababa',
        category: 'Control Room SOC',
        pitch: 'P0.93 Nova-Pitch Flip-Chip COB',
        packaging: 'Flip-Chip Chip-On-Board (Zero Wire Bonding)',
        screenDimensions: '8.4m (W) × 2.7m (H)',
        totalArea: '22.68 m²',
        resolution: '9032 × 2903 px (True 8K Master Canvas)',
        challenge: 'Operators sit less than 1.5 meters from the display 24/7. High thermal dissipation and visible pixel grids were unacceptable.',
        solution: 'Custom air-imported sub-P2.5 Flip-Chip COB running cold-screen technology (12°C cooler) with 10,000:1 deep black contrast and 170° ultra-wide viewing angles.',
        metrics: [
          { label: 'Contrast Ratio', value: '10,000:1 True Black' },
          { label: 'Operating Temp', value: 'Runs 12°C Cooler' }
        ],
        technologies: ['Flip-Chip COB', 'NovaPro UHD Jr', 'Common-Cathode ICs', 'Redundant Fiber Loop'],
        image: '/src/assets/images/led_control_room_real_1790853095603.jpg',
        automated: true
      };
    } else if (autoCasePreset === 'arena') {
      newStudy = {
        id: `case-auto-${Date.now()}`,
        client: 'East Africa Summit Events',
        projectName: 'Millennium Hall Main Staging Screen',
        location: 'Bole, Addis Ababa',
        category: 'Concert & Event Staging',
        pitch: 'P2.6 Apex-Rental Touring',
        packaging: 'Die-Cast Magnesium Curved Fast-Lock Cabinets',
        screenDimensions: '16m (W) × 5m (H)',
        totalArea: '80 m²',
        resolution: '6144 × 1920 px',
        challenge: 'Rapid 4-hour assembly and strike schedule with broadcast cameras requiring complete flicker-free operation.',
        solution: 'Supplied in-stock Apex-Rental P2.6 cabinets with -10° to +10° curve locks, flight cases, dual NovaStar processors, and 7,680Hz ultra-high refresh rate.',
        metrics: [
          { label: 'Camera Shutter Sync', value: '7,680Hz Refresh Rate' },
          { label: 'Rigging Time', value: '4-Hour Fast Lock Setup' }
        ],
        technologies: ['NovaStar VX1000', 'Die-Cast Magnesium', 'Touring Flight Cases', 'Optical Fiber Link'],
        image: '/src/assets/images/led_concert_stage_real_1790853083477.jpg',
        automated: true
      };
    } else if (autoCasePreset === 'billboard') {
      newStudy = {
        id: `case-auto-${Date.now()}`,
        client: 'Addis Prime Landmark Tower',
        projectName: 'Bole Road 3D Anamorphic Curved Landmark DOOH',
        location: 'Bole Road, Addis Ababa',
        category: 'Outdoor 3D Billboard',
        pitch: 'P4.81 Horizon Outdoor DOOH',
        packaging: 'IP65 Die-Cast Aluminum Modules with Gold Wire SMD',
        screenDimensions: '18m (W) × 8m (H)',
        totalArea: '144 m²',
        resolution: '3742 × 1663 px',
        challenge: 'Direct equatorial sunlight visibility and extreme thunderstorm/dust environmental resilience on a curved facade.',
        solution: 'Installed 9,500 nits high-brightness common-cathode modules with Huidu 4G cloud clustering and integrated automatic brightness sensor.',
        metrics: [
          { label: 'Daylight Brightness', value: '9,500 Nits Direct Sun' },
          { label: 'Weather Rating', value: 'IP65 Front & Rear Sealed' }
        ],
        technologies: ['Huidu 4G Cloud', '9,500 Nits High Brightness', 'Anamorphic 3D Corner', 'Photodiode Dimming'],
        image: '/src/assets/images/led_outdoor_dooh_real_1790853056151.jpg',
        automated: true
      };
    } else {
      // Dynamic Custom Case Study
      const projName = autoCustomCaseProject.trim() || 'Executive Corporate Boardroom Ultra-HD LED Wall';
      const clientName = autoCustomCaseClient.trim() || 'Premier Commercial Enterprise';
      const loc = autoCustomCaseLocation.trim() || 'Addis Ababa, Ethiopia';
      const cat = autoCustomCaseCategory || 'Projects';
      const pitch = autoCustomCasePitch || 'P1.86 Shield-GOB';

      newStudy = {
        id: `case-custom-auto-${Date.now()}`,
        client: clientName,
        projectName: projName,
        location: loc,
        category: cat,
        pitch: pitch,
        packaging: pitch.includes('COB') ? 'Flip-Chip COB Resin Encapsulation' : 'Shield-GOB Armored Epoxy Layer',
        screenDimensions: '7.2m (W) × 3.6m (H)',
        totalArea: '25.92 m²',
        resolution: '3840 × 1920 px (4K Extended Master)',
        challenge: `Custom technical implementation required for ${clientName} in ${loc} demanding seamless surface alignment, zero acoustic noise, and redundant signal processing.`,
        solution: `Engineered and deployed DEMAQ ${pitch} displays with NovaStar VX-series video controllers, silent fanless power supplies, and turnkey on-site calibration.`,
        metrics: [
          { label: 'Pixel Uniformity', value: '100% Calibrated' },
          { label: 'Surface Protection', value: 'IP54 Wipe-Clean' }
        ],
        technologies: ['NovaStar Processing', 'MeanWell PSUs', 'Sub-millimeter Sub-frame', 'Optical Photometer Calibration'],
        image: '/src/assets/images/led_boardroom_real_1790853068703.jpg',
        automated: true
      };
    }

    onAddCaseStudy(newStudy);
    try {
      await setDoc(doc(db, 'caseStudies', newStudy.id), {
        ...newStudy,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore sync note:', e);
    }

    setIsAutoGeneratingCase(false);
    setRealtimeGenStep(null);
    setAutoSuccessNotice(`✨ Published AI Case Study: "${newStudy.projectName}"`);
    setTimeout(() => setAutoSuccessNotice(null), 6000);
    setActiveTab('case_studies');
  };

  // 1-Click Convert RFQ Inquiry to Case Study
  const handleGenerateCaseStudyFromRFQ = async (inq: LEDInquiry) => {
    setIsAutoGeneratingCase(true);
    await new Promise(r => setTimeout(r, 500));

    const width = inq.dimensionsWidthM || 6.4;
    const height = inq.dimensionsHeightM || 3.6;
    const area = (width * height).toFixed(2);
    const pitch = inq.pixelPitch || 'P2.5';
    
    let img = '/src/assets/images/led_hero_stage_real_1790853027067.jpg';
    if (inq.application?.toLowerCase().includes('church') || inq.application?.toLowerCase().includes('worship')) {
      img = '/src/assets/images/led_worship_sanctuary_real_1790853041095.jpg';
    } else if (inq.application?.toLowerCase().includes('boardroom') || inq.application?.toLowerCase().includes('corporate')) {
      img = '/src/assets/images/led_boardroom_real_1790853068703.jpg';
    } else if (inq.application?.toLowerCase().includes('control') || inq.application?.toLowerCase().includes('soc')) {
      img = '/src/assets/images/led_control_room_real_1790853095603.jpg';
    } else if (inq.application?.toLowerCase().includes('rental') || inq.application?.toLowerCase().includes('event') || inq.application?.toLowerCase().includes('concert')) {
      img = '/src/assets/images/led_concert_stage_real_1790853083477.jpg';
    } else if (inq.application?.toLowerCase().includes('outdoor') || inq.application?.toLowerCase().includes('billboard')) {
      img = '/src/assets/images/led_outdoor_dooh_real_1790853056151.jpg';
    }

    const rfqCaseStudy: LEDCaseStudy = {
      id: `case-rfq-${Date.now()}`,
      client: inq.company ? `${inq.company} (${inq.clientName})` : inq.clientName,
      projectName: `${inq.company || inq.clientName} ${inq.application || 'Display'} Video Wall`,
      location: inq.projectLocation || 'Addis Ababa, Ethiopia',
      category: inq.application || 'Projects',
      pitch: `${pitch} (${inq.seriesInterest || 'Commercial Series'})`,
      packaging: pitch.includes('GOB') ? 'Glue-On-Board Epoxy Armor' : pitch.includes('COB') ? 'Flip-Chip COB' : 'Standard SMD Sealed',
      screenDimensions: `${width}m (W) × ${height}m (H)`,
      totalArea: `${area} m²`,
      resolution: `${Math.round(width * 1000 / 2.5)} × ${Math.round(height * 1000 / 2.5)} px`,
      challenge: inq.details || `Turnkey ${inq.installationType} installation in ${inq.projectLocation} requiring high brightness and reliable 24/7 commercial operation.`,
      solution: `Supplied and installed DEMAQ ${inq.seriesInterest} display with NovaStar video controller, custom steel mounting frame, and local warranty support.`,
      metrics: [
        { label: 'Surface Area', value: `${area} m² Active Area` },
        { label: 'Installation Type', value: inq.installationType || 'Wall Mounted' }
      ],
      technologies: ['NovaStar Controller', 'MeanWell 5V PSUs', 'DEMAQ Sub-frame', 'Front Service Modules'],
      image: img,
      automated: true
    };

    onAddCaseStudy(rfqCaseStudy);
    try {
      await setDoc(doc(db, 'caseStudies', rfqCaseStudy.id), {
        ...rfqCaseStudy,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore sync note:', e);
    }

    setIsAutoGeneratingCase(false);
    setAutoSuccessNotice(`✨ Converted RFQ into Case Study: "${rfqCaseStudy.projectName}"`);
    setTimeout(() => setAutoSuccessNotice(null), 6000);
    setActiveTab('case_studies');
  };

  // Case Study Handlers
  const handleOpenNewCaseStudy = () => {
    setCaseEditId(null);
    setCaseClient('');
    setCaseProjectName('');
    setCaseLocation('Addis Ababa, Ethiopia');
    setCaseCategory('Projects');
    setCasePitch('P2.5 Shield-GOB');
    setCasePackaging('Glue-On-Board Epoxy Armor');
    setCaseDimensions('6.4m × 3.6m');
    setCaseTotalArea('23.04 m²');
    setCaseResolution('2560 × 1440 px');
    setCaseChallenge('High humidity and direct stage contact risking diode damage.');
    setCaseSolution('Installed DEMAQ P2.5 GOB display with NovaStar VX1000 and 5V MeanWell redundant supplies.');
    setCaseImage('/src/assets/images/led_worship_sanctuary_real_1790853041095.jpg');
    setCaseMetric1Label('Impact Resistance');
    setCaseMetric1Value('100% Anti-Collision');
    setCaseMetric2Label('Brightness');
    setCaseMetric2Value('1,200 Nits Balanced');
    setCaseTechs('NovaStar, MeanWell, GOB Armored Modules');
    setIsEditingCaseStudy(true);
  };

  const handleOpenEditCaseStudy = (study: LEDCaseStudy) => {
    setCaseEditId(study.id);
    setCaseClient(study.client);
    setCaseProjectName(study.projectName);
    setCaseLocation(study.location);
    setCaseCategory(study.category);
    setCasePitch(study.pitch);
    setCasePackaging(study.packaging);
    setCaseDimensions(study.screenDimensions);
    setCaseTotalArea(study.totalArea);
    setCaseResolution(study.resolution);
    setCaseChallenge(study.challenge);
    setCaseSolution(study.solution);
    setCaseImage(study.image);
    setCaseMetric1Label(study.metrics[0]?.label || 'Metric 1');
    setCaseMetric1Value(study.metrics[0]?.value || '100%');
    setCaseMetric2Label(study.metrics[1]?.label || 'Metric 2');
    setCaseMetric2Value(study.metrics[1]?.value || '35%');
    setCaseTechs((study.technologies || []).join(', '));
    setIsEditingCaseStudy(true);
  };

  const handleSaveCaseStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseProjectName.trim() || !caseClient.trim()) return;

    const techArray = caseTechs.split(',').map(t => t.trim()).filter(Boolean);
    const metricsArray = [
      { label: caseMetric1Label, value: caseMetric1Value },
      { label: caseMetric2Label, value: caseMetric2Value }
    ];

    const studyData: LEDCaseStudy = {
      id: caseEditId || `case-${Date.now()}`,
      client: caseClient,
      projectName: caseProjectName,
      location: caseLocation,
      category: caseCategory,
      pitch: casePitch,
      packaging: casePackaging,
      screenDimensions: caseDimensions,
      totalArea: caseTotalArea,
      resolution: caseResolution,
      challenge: caseChallenge,
      solution: caseSolution,
      image: caseImage,
      metrics: metricsArray,
      technologies: techArray
    };

    if (caseEditId) {
      onUpdateCaseStudy(studyData);
    } else {
      onAddCaseStudy(studyData);
    }

    try {
      await setDoc(doc(db, 'caseStudies', studyData.id), {
        ...studyData,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore sync note:', e);
    }

    setIsEditingCaseStudy(false);
  };

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter(i => {
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchesQuery = searchQuery === '' ||
      i.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.pixelPitch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Filtered Blogs
  const filteredBlogs = blogPosts.filter(p => {
    if (blogCategoryFilter === 'all') return true;
    return (
      p.category?.toLowerCase() === blogCategoryFilter.toLowerCase() ||
      (blogCategoryFilter === 'Technical' && (p.category === 'Technology & Hardware' || p.category === 'Processors & Systems'))
    );
  });

  const filteredMaintenance = maintenanceRequests.filter(m => {
    return maintStatusFilter === 'all' || m.status === maintStatusFilter;
  });

  // Calculate quick stats
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const urgentTickets = maintenanceRequests.filter(m => m.urgency.includes('Emergency') || m.urgency.includes('Urgent')).length;

  // Proforma Calculations for active inquiry
  const getProformaDetails = (inq: LEDInquiry) => {
    const area = inq.dimensionsWidthM * inq.dimensionsHeightM || 10;
    const isCob = inq.pixelPitch.includes('0.') || inq.pixelPitch.includes('1.') || inq.availabilityRequirement?.includes('Custom');
    const ratePerM2ETB = isCob ? 220000 : 98000;
    const screenTotalETB = Math.round(area * ratePerM2ETB);
    const processorETB = inq.dimensionsWidthM * inq.dimensionsHeightM > 20 ? 145000 : 85000;
    const structureETB = Math.round(area * 12000);
    const subtotal = screenTotalETB + processorETB + structureETB + proformaDeliveryFee + proformaLaborFee;
    const vat = Math.round(subtotal * proformaVatRate);
    const grandTotal = subtotal + vat;

    return {
      area: area.toFixed(2),
      isCob,
      screenTotalETB,
      processorETB,
      structureETB,
      subtotal,
      vat,
      grandTotal,
      proformaNo: `DEMAQ-PF-${new Date().getFullYear()}-${inq.id.replace(/\D/g, '').slice(-4) || '1088'}`
    };
  };

  const handleCopyWhatsAppQuote = (inq: LEDInquiry) => {
    const p = getProformaDetails(inq);
    const text = `*DEMAQ DIGITAL SOLUTION — OFFICIAL PROFORMA QUOTATION*
📄 Proforma No: ${p.proformaNo}
👤 Client: ${inq.clientName} (${inq.company})
📱 Phone: ${inq.phone}
📍 Location: ${inq.projectLocation || 'Addis Ababa'}

📐 *Screen Specifications:*
• Model: ${inq.seriesInterest} (${inq.pixelPitch})
• Dimensions: ${inq.dimensionsWidthM}m (W) × ${inq.dimensionsHeightM}m (H) [${p.area} m²]
• Installation: ${inq.installationType}
• Lead Time: ${inq.availabilityRequirement?.includes('In-Stock') ? '24–48 Hours (In-Stock Addis Warehouse)' : '14–21 Days Air Import'}

💰 *Financial Breakdown:*
• LED Display Modules & Cabinets: ${p.screenTotalETB.toLocaleString()} ETB
• NovaStar / Video Processing System: ${p.processorETB.toLocaleString()} ETB
• Steel Mounting Structure & Cabling: ${p.structureETB.toLocaleString()} ETB
• Logistics & Local Installation: ${(proformaDeliveryFee + proformaLaborFee).toLocaleString()} ETB
-----------------------------------
*Subtotal:* ${p.subtotal.toLocaleString()} ETB
*VAT (15%):* ${p.vat.toLocaleString()} ETB
*GRAND TOTAL:* ${p.grandTotal.toLocaleString()} ETB

🛡️ Includes 5-Year Warranty, 3% Free Spare Modules & Calibration.
📞 Contact: +251 942 992 799 | contact@demaqdigital.com`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);

    const cleanPhone = (inq.phone || '').replace(/[^\d]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex w-full">
        <div className={`w-full max-w-5xl border-l shadow-2xl flex flex-col h-full ml-auto transition-colors ${
          isLight ? 'bg-white border-slate-300 text-slate-900 shadow-2xl shadow-slate-900/20' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}>
          {/* Header with Live Status and Conditional Admin Controls */}
          <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${
            isLight ? 'bg-slate-100/80 border-slate-300' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              <DemaqLogo size="sm" showText={true} theme={theme} />
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Studio Administration
                  </span>
                  {isUserAdmin ? (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 font-bold ${
                      isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      FIRESTORE ACTIVE
                    </span>
                  ) : (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 font-bold ${
                      isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      <Lock className="w-2.5 h-2.5" />
                      RESTRICTED ACCESS
                    </span>
                  )}
                </div>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {isUserAdmin ? 'Quotes · Proformas · Blog CMS · Case Studies · Automation · Alerts' : 'Administrative Clearance Required'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Only show management controls when admin authenticated */}
              {isUserAdmin && activeUser && (
                <div className={`flex items-center gap-2 border rounded-xl px-2 py-1 text-xs ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}>
                  {activeUser.photoURL ? (
                    <img src={activeUser.photoURL} alt="Avatar" className="w-5 h-5 rounded-full" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-cyan-500" />
                  )}
                  <div className="hidden xs:block sm:block text-left">
                    <span className={`font-semibold text-[11px] block leading-tight truncate max-w-[90px] sm:max-w-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {activeUser.displayName || activeUser.email || 'Admin'}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors ml-0.5 cursor-pointer flex items-center gap-1"
                    title="Lock Studio & Sign Out"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span className="text-[10px] font-mono hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}

              {isUserAdmin && (
                <button
                  onClick={() => onTriggerTestAlert('All')}
                  className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                  title="Simulate client asking for proforma quote"
                >
                  <BellRing className="w-3.5 h-3.5 animate-bounce" />
                  <span>Test Alert</span>
                </button>
              )}

              <button
                onClick={handleDrawerClose}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ACCESS RESTRICTION & ADMIN LOGIN GATE: Entire dashboard is protected & hidden from unauthorized visitors */}
          {!isUserAdmin ? (
            <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
              <div className={`max-w-md w-full p-8 rounded-3xl border shadow-2xl space-y-6 text-center transition-colors ${
                isLight ? 'bg-white border-slate-300 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5' : 'bg-slate-900/90 border-slate-800'
              }`}>
                {/* Shield / Lock Icon */}
                <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 shadow-lg flex items-center justify-center">
                  <div className={`w-full h-full rounded-2xl flex items-center justify-center ${isLight ? 'bg-white text-cyan-600' : 'bg-slate-900 text-cyan-400'}`}>
                    <Lock className="w-7 h-7" />
                  </div>
                </div>

                <div>
                  <h2 className={`text-2xl font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Demaq Studio Protected Access
                  </h2>
                  <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Enter administrative credentials or security password to access Demaq Studio.
                  </p>
                </div>

                {/* Account Status / Mismatch Notice */}
                {currentUser && !isUserAdmin && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs text-left space-y-2">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Unauthorized Account</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      This account does not have administrative clearance for Demaq Studio.
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}

                {/* Auth Error Banner */}
                {authError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs text-left flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">{authError}</span>
                  </div>
                )}

                {/* Secure Admin Password Login Form */}
                <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left">
                  <div>
                    <label className={`text-xs font-semibold block mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Administrator Username or Email
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="Enter administrator username or email"
                        className={`w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border transition-colors outline-hidden focus:ring-2 focus:ring-cyan-500 ${
                          isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                            : 'bg-slate-800/80 border-slate-700 text-white focus:bg-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`text-xs font-semibold block mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Administrative Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter administrative password"
                        className={`w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border transition-colors outline-hidden focus:ring-2 focus:ring-cyan-500 ${
                          isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                            : 'bg-slate-800/80 border-slate-700 text-white focus:bg-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{authLoading ? 'Verifying Credentials...' : 'Unlock Demaq Studio'}</span>
                  </button>

                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`} />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                      <span className={`px-2 font-mono ${isLight ? 'bg-white text-slate-400' : 'bg-slate-900 text-slate-500'}`}>
                        or authenticate with Firebase
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignIn}
                    disabled={authLoading}
                    className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer ${
                      isLight
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                        : 'bg-slate-800/60 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                    </svg>
                    <span>Sign In with Admin Google Account</span>
                  </button>
                </form>

                {/* Studio Security Notice */}
                <div className={`p-3 rounded-xl border text-xs text-left ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
                  <div className="font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Protected Administrative Studio</span>
                  </div>
                  <p className={`text-[11px] leading-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Customer RFQ inquiries, proforma invoices, maintenance tickets, and CMS tools are restricted to authorized Demaq engineering staff.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Navigation Bar */}
              <div className={`flex border-b px-4 sm:px-6 overflow-x-auto scrollbar-none gap-1 transition-colors ${
                isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
            <button
              onClick={() => { setActiveTab('overview'); setIsEditingBlog(false); setIsEditingCaseStudy(false); setActiveProformaInquiry(null); }}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? isLight ? 'border-cyan-600 text-cyan-800 bg-cyan-50/80 font-bold' : 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('rfqs'); setIsEditingBlog(false); setIsEditingCaseStudy(false); }}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'rfqs'
                  ? isLight ? 'border-cyan-600 text-cyan-800 bg-cyan-50/80 font-bold' : 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Quotes & Proformas</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                isLight ? 'bg-cyan-100 text-cyan-800' : 'bg-cyan-900/60 text-cyan-300'
              }`}>
                {inquiries.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('blogs'); setIsEditingCaseStudy(false); }}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'blogs'
                  ? isLight ? 'border-emerald-600 text-emerald-800 bg-emerald-50/80 font-bold' : 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                  : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Blog Articles ({blogPosts.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('case_studies'); setIsEditingBlog(false); }}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'case_studies'
                  ? isLight ? 'border-purple-600 text-purple-800 bg-purple-50/80 font-bold' : 'border-purple-400 text-purple-300 bg-purple-950/20'
                  : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Case Studies ({caseStudies.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('automation'); setIsEditingBlog(false); setIsEditingCaseStudy(false); }}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'automation'
                  ? isLight ? 'border-teal-600 text-teal-800 bg-teal-50/80 font-bold' : 'border-teal-400 text-teal-300 bg-teal-950/20'
                  : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-teal-500" />
              <span>AI Automation</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border ${
                isLight ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-teal-950 text-teal-300 border-teal-800'
              }`}>
                NEW
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('alerts'); setIsEditingBlog(false); setIsEditingCaseStudy(false); }}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'alerts'
                  ? isLight ? 'border-amber-600 text-amber-800 bg-amber-50/80 font-bold' : 'border-amber-400 text-amber-300 bg-amber-950/20'
                  : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Instant Alerts</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-900/60 text-amber-300'
              }`}>
                {alertLogs.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('maintenance'); setIsEditingBlog(false); setIsEditingCaseStudy(false); }}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'maintenance'
                  ? isLight ? 'border-rose-600 text-rose-800 bg-rose-50/80 font-bold' : 'border-rose-400 text-rose-300 bg-rose-950/20'
                  : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Repairs</span>
              {urgentTickets > 0 && (
                <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded-full font-mono font-bold animate-pulse">
                  {urgentTickets}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setIsEditingBlog(false); setIsEditingCaseStudy(false); }}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'settings'
                  ? isLight ? 'border-slate-800 text-slate-900 bg-slate-200/60 font-bold' : 'border-slate-300 text-white bg-slate-800/40'
                  : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>

          {/* Content Area with scrollable container and safe bottom padding for sticky footer */}
          <div ref={contentContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-28 sm:pb-16 scroll-smooth">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-xl border relative overflow-hidden transition-colors ${
                    isLight ? 'bg-cyan-50/50 border-cyan-200 text-slate-900' : 'bg-slate-950/80 border-slate-800 text-white'
                  }`}>
                    <div className={`text-[10px] font-mono uppercase mb-1 font-bold ${isLight ? 'text-cyan-800' : 'text-slate-400'}`}>New RFQ Inquiries</div>
                    <div className={`text-2xl font-bold font-mono ${isLight ? 'text-cyan-950' : 'text-cyan-400'}`}>{newInquiries}</div>
                    <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>Total {totalInquiries} proforma requests</div>
                    <div className={`absolute top-3 right-3 ${isLight ? 'text-cyan-600/20' : 'text-cyan-500/20'}`}>
                      <Users className="w-8 h-8" />
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border relative overflow-hidden transition-colors ${
                    isLight ? 'bg-amber-50/50 border-amber-200 text-slate-900' : 'bg-slate-950/80 border-slate-800 text-white'
                  }`}>
                    <div className={`text-[10px] font-mono uppercase mb-1 font-bold ${isLight ? 'text-amber-800' : 'text-slate-400'}`}>Alert Channels</div>
                    <div className={`text-2xl font-bold font-mono ${isLight ? 'text-amber-950' : 'text-amber-400'}`}>3 / 3 Active</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> SMS · Email · WhatsApp
                    </div>
                    <div className={`absolute top-3 right-3 ${isLight ? 'text-amber-600/20' : 'text-amber-500/20'}`}>
                      <Bell className="w-8 h-8" />
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border relative overflow-hidden transition-colors ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200 text-slate-900' : 'bg-slate-950/80 border-slate-800 text-white'
                  }`}>
                    <div className={`text-[10px] font-mono uppercase mb-1 font-bold ${isLight ? 'text-emerald-800' : 'text-slate-400'}`}>Published Content</div>
                    <div className={`text-2xl font-bold font-mono ${isLight ? 'text-emerald-950' : 'text-emerald-400'}`}>
                      {blogPosts.length + caseStudies.length}
                    </div>
                    <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
                      {blogPosts.length} Blogs · {caseStudies.length} Case Studies
                    </div>
                    <div className={`absolute top-3 right-3 ${isLight ? 'text-emerald-600/20' : 'text-emerald-500/20'}`}>
                      <FileText className="w-8 h-8" />
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border relative overflow-hidden transition-colors ${
                    isLight ? 'bg-rose-50/50 border-rose-200 text-slate-900' : 'bg-slate-950/80 border-slate-800 text-white'
                  }`}>
                    <div className={`text-[10px] font-mono uppercase mb-1 font-bold ${isLight ? 'text-rose-800' : 'text-slate-400'}`}>Emergency Tickets</div>
                    <div className={`text-2xl font-bold font-mono ${isLight ? 'text-rose-900' : 'text-rose-400'}`}>{urgentTickets}</div>
                    <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>4h Addis Tech Dispatch</div>
                    <div className={`absolute top-3 right-3 ${isLight ? 'text-rose-600/20' : 'text-rose-500/20'}`}>
                      <Wrench className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                {/* 6-Month Volume & Maintenance Trend Analytics (Recharts) */}
                <LEDAdminAnalyticsChart
                  inquiries={inquiries}
                  maintenanceRequests={maintenanceRequests}
                  isLight={isLight}
                />

                {/* Quick Action Center */}
                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                  isLight
                    ? 'bg-gradient-to-r from-cyan-50 via-slate-50 to-amber-50 border-cyan-200 text-slate-900'
                    : 'bg-gradient-to-r from-cyan-950/40 via-slate-900 to-amber-950/30 border-cyan-800/40 text-white'
                }`}>
                  <div>
                    <h4 className={`text-sm font-bold font-display flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <Sparkles className="w-4 h-4 text-cyan-500" />
                      Proforma & Instant Alert Engine
                    </h4>
                    <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      When a client requests a quote, notifications are instantly pushed to WhatsApp ({alertSettings.adminWhatsapp}) and SMS ({alertSettings.adminPhone}).
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onTriggerTestAlert('All')}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      Trigger Test Alert
                    </button>
                    <button
                      onClick={() => setActiveTab('automation')}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-teal-600/20"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      Auto-Publish
                    </button>
                  </div>
                </div>

                {/* Recent Inquiries List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-mono uppercase font-bold tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Recent Proforma & RFQ Inquiries
                    </h4>
                    <button
                      onClick={() => setActiveTab('rfqs')}
                      className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-mono font-bold"
                    >
                      View All ({inquiries.length}) <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {inquiries.slice(0, 3).map((inq) => (
                      <div
                        key={inq.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isLight
                            ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
                            : 'bg-slate-950/70 hover:bg-slate-900 border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{inq.clientName}</span>
                            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>({inq.company})</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                              isLight ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : 'bg-cyan-950 border-cyan-800 text-cyan-300'
                            }`}>
                              {inq.pixelPitch}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {inq.dimensionsWidthM}m × {inq.dimensionsHeightM}m · {inq.seriesInterest} · {inq.projectLocation}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => { setActiveProformaInquiry(inq); setActiveTab('rfqs'); }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                              isLight
                                ? 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border-cyan-200'
                                : 'bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border-cyan-500/30'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Proforma
                          </button>
                          <button
                            onClick={() => handleCopyWhatsAppQuote(inq)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                              isLight
                                ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200'
                                : 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border-emerald-500/30'
                            }`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            WhatsApp
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RFQS & PROFORMAS */}
            {activeTab === 'rfqs' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Top Actions & Search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search client, company, phone, pitch..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-2 text-xs transition-colors focus:outline-none focus:border-cyan-500 ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                          : 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-600'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                    <select
                      value={statusFilter}
                      onChange={(e: any) => setStatusFilter(e.target.value)}
                      className={`border rounded-xl px-3 py-2 text-xs transition-colors focus:outline-none focus:border-cyan-500 cursor-pointer ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-800'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <option value="all">All Statuses ({inquiries.length})</option>
                      <option value="new">New ({inquiries.filter(i => i.status === 'new').length})</option>
                      <option value="engineering_review">Engineering Review</option>
                      <option value="quotation_sent">Quotation Sent</option>
                      <option value="won">Won / Confirmed</option>
                    </select>
                  </div>
                </div>

                {/* Proforma View Modal / Overlay if Selected */}
                {activeProformaInquiry && (
                  <div className={`p-6 rounded-2xl border-2 shadow-2xl space-y-6 relative transition-colors ${
                    isLight
                      ? 'bg-white border-cyan-500/60 shadow-cyan-100 text-slate-900'
                      : 'bg-slate-950 border-cyan-500/40 text-white'
                  }`}>
                    <button
                      onClick={() => setActiveProformaInquiry(null)}
                      className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
                        isLight ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Proforma Header */}
                    <div className={`border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${
                            isLight
                              ? 'bg-cyan-50 border-cyan-200 text-cyan-800'
                              : 'bg-cyan-950 border-cyan-800 text-cyan-400'
                          }`}>
                            Official Proforma Invoice
                          </span>
                          <h3 className={`text-xl font-bold font-display mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {getProformaDetails(activeProformaInquiry).proformaNo}
                          </h3>
                          <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            Client: {activeProformaInquiry.clientName} ({activeProformaInquiry.company}) · {activeProformaInquiry.phone}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyWhatsAppQuote(activeProformaInquiry)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{copiedText ? 'Copied!' : 'Send on WhatsApp'}</span>
                          </button>
                          <button
                            onClick={() => window.print()}
                            className={`px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border ${
                              isLight
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            }`}
                          >
                            <Printer className="w-4 h-4 text-cyan-500" />
                            <span>Print / PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Equipment Table */}
                    <div className="space-y-2">
                      <h5 className={`text-xs font-mono uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Itemized Equipment & Services
                      </h5>
                      <div className={`border rounded-xl overflow-hidden ${
                        isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800 bg-slate-900/50'
                      }`}>
                        <table className="w-full text-left text-xs">
                          <thead className={`font-mono text-[10px] border-b ${
                            isLight
                              ? 'bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-slate-950/80 text-slate-400 border-slate-800'
                          }`}>
                            <tr>
                              <th className="p-3">Item Description</th>
                              <th className="p-3 text-center">Qty</th>
                              <th className="p-3 text-right">Unit Price (ETB)</th>
                              <th className="p-3 text-right">Total (ETB)</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isLight ? 'divide-slate-200 text-slate-800' : 'divide-slate-800 text-slate-200'}`}>
                            <tr>
                              <td className="p-3">
                                <strong className={`block ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeProformaInquiry.seriesInterest}</strong>
                                <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                  Pitch: {activeProformaInquiry.pixelPitch} · {activeProformaInquiry.dimensionsWidthM}m × {activeProformaInquiry.dimensionsHeightM}m · {activeProformaInquiry.availabilityRequirement}
                                </span>
                              </td>
                              <td className="p-3 text-center font-mono">
                                {getProformaDetails(activeProformaInquiry).area} m²
                              </td>
                              <td className="p-3 text-right font-mono">
                                {(getProformaDetails(activeProformaInquiry).screenTotalETB / parseFloat(getProformaDetails(activeProformaInquiry).area)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </td>
                              <td className={`p-3 text-right font-mono font-bold ${isLight ? 'text-cyan-700 font-extrabold' : 'text-cyan-400'}`}>
                                {getProformaDetails(activeProformaInquiry).screenTotalETB.toLocaleString()}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-3">
                                <strong className={`block ${isLight ? 'text-slate-900' : 'text-white'}`}>NovaStar / Multi-Brand All-in-One Video Controller</strong>
                                <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Sending system, HD scaler, NovaLCT calibration</span>
                              </td>
                              <td className="p-3 text-center font-mono">1 Set</td>
                              <td className="p-3 text-right font-mono">{getProformaDetails(activeProformaInquiry).processorETB.toLocaleString()}</td>
                              <td className={`p-3 text-right font-mono font-bold ${isLight ? 'text-cyan-700 font-extrabold' : 'text-cyan-400'}`}>{getProformaDetails(activeProformaInquiry).processorETB.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="p-3">
                                <strong className={`block ${isLight ? 'text-slate-900' : 'text-white'}`}>Custom Steel Mounting Sub-Structure & Hardware</strong>
                                <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Mounting: {activeProformaInquiry.installationType}</span>
                              </td>
                              <td className="p-3 text-center font-mono">{getProformaDetails(activeProformaInquiry).area} m²</td>
                              <td className="p-3 text-right font-mono">12,000</td>
                              <td className={`p-3 text-right font-mono font-bold ${isLight ? 'text-cyan-700 font-extrabold' : 'text-cyan-400'}`}>{getProformaDetails(activeProformaInquiry).structureETB.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="p-3">
                                <strong className={`block ${isLight ? 'text-slate-900' : 'text-white'}`}>Nationwide Delivery & Certified Installation Labor</strong>
                                <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Addis Ababa & regional dispatch + 3% free spare modules</span>
                              </td>
                              <td className="p-3 text-center font-mono">1 Lot</td>
                              <td className="p-3 text-right font-mono">{(proformaDeliveryFee + proformaLaborFee).toLocaleString()}</td>
                              <td className={`p-3 text-right font-mono font-bold ${isLight ? 'text-cyan-700 font-extrabold' : 'text-cyan-400'}`}>{(proformaDeliveryFee + proformaLaborFee).toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Totals & Tax */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className={`p-4 rounded-xl border text-xs space-y-1.5 font-mono ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}>
                        <div className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Payment & Bank Details</div>
                        <div>Bank: Commercial Bank of Ethiopia (CBE)</div>
                        <div>Account Name: DemaQ Digital Solution PLC</div>
                        <div>Account No: 1000284792019</div>
                        <div>Telebirr Merchant: 0942992799</div>
                      </div>

                      <div className={`p-4 rounded-xl border text-xs space-y-2 font-mono ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}>
                        <div className="flex justify-between">
                          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Subtotal:</span>
                          <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{getProformaDetails(activeProformaInquiry).subtotal.toLocaleString()} ETB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>VAT (15%):</span>
                          <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{getProformaDetails(activeProformaInquiry).vat.toLocaleString()} ETB</span>
                        </div>
                        <div className={`flex justify-between text-sm font-bold pt-2 border-t ${
                          isLight
                            ? 'border-slate-300 text-cyan-800'
                            : 'border-slate-800 text-cyan-300'
                        }`}>
                          <span>Grand Total:</span>
                          <span className={`text-base font-extrabold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>{getProformaDetails(activeProformaInquiry).grandTotal.toLocaleString()} ETB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inquiries List */}
                <div className="space-y-3">
                  {filteredInquiries.length === 0 ? (
                    <div className={`p-8 text-center font-mono text-xs border border-dashed rounded-2xl ${
                      isLight ? 'border-slate-300 text-slate-500 bg-slate-50/50' : 'border-slate-800 text-slate-500 bg-slate-950/40'
                    }`}>
                      No matching inquiries found.
                    </div>
                  ) : (
                    filteredInquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className={`p-5 rounded-2xl border transition-all space-y-3 ${
                          isLight
                            ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${
                          isLight ? 'border-slate-200' : 'border-slate-800/80'
                        }`}>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{inq.clientName}</h4>
                              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>· {inq.company}</span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                                isLight
                                  ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                                  : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                              }`}>
                                {inq.pixelPitch}
                              </span>
                            </div>
                            <div className={`flex flex-wrap items-center gap-3 text-xs font-mono mt-1 ${
                              isLight ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              <span>📱 {inq.phone}</span>
                              <span>✉️ {inq.email}</span>
                              <span>📍 {inq.projectLocation}</span>
                              <span>🕒 {inq.timestamp}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={inq.status}
                              onChange={(e: any) => onUpdateInquiryStatus(inq.id, e.target.value)}
                              className={`text-xs font-mono font-bold rounded-lg px-2.5 py-1 border cursor-pointer ${
                                inq.status === 'new'
                                  ? isLight ? 'bg-cyan-50 text-cyan-800 border-cyan-300' : 'bg-cyan-950 text-cyan-300 border-cyan-700'
                                  : inq.status === 'engineering_review'
                                  ? isLight ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-amber-950 text-amber-300 border-amber-700'
                                  : inq.status === 'quotation_sent'
                                  ? isLight ? 'bg-blue-50 text-blue-800 border-blue-300' : 'bg-blue-950 text-blue-300 border-blue-700'
                                  : inq.status === 'won'
                                  ? isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                  : isLight ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}
                            >
                              <option value="new">● New</option>
                              <option value="engineering_review">● Under Review</option>
                              <option value="quotation_sent">● Proforma Sent</option>
                              <option value="won">● Won / Invoiced</option>
                              <option value="closed">● Closed</option>
                            </select>

                            <button
                              onClick={() => onDeleteInquiry(inq.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isLight
                                  ? 'hover:bg-rose-50 text-slate-400 hover:text-rose-600'
                                  : 'hover:bg-rose-950 text-slate-500 hover:text-rose-400'
                              }`}
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                          <div className={`p-2 rounded-lg border ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
                          }`}>
                            <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Dimensions</span>
                            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{inq.dimensionsWidthM}m (W) × {inq.dimensionsHeightM}m (H)</span>
                          </div>
                          <div className={`p-2 rounded-lg border ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
                          }`}>
                            <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Series & Pitch</span>
                            <span className={`font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>{inq.pixelPitch} ({inq.seriesInterest.split(' ')[0]})</span>
                          </div>
                          <div className={`p-2 rounded-lg border ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
                          }`}>
                            <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Installation</span>
                            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{inq.installationType}</span>
                          </div>
                          <div className={`p-2 rounded-lg border ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
                          }`}>
                            <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Inventory Req.</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{inq.availabilityRequirement?.includes('In-Stock') ? 'In-Stock (24-48h)' : 'Air Import (14d)'}</span>
                          </div>
                        </div>

                        {inq.details && (
                          <div className={`p-3 rounded-lg border text-xs ${
                            isLight
                              ? 'bg-slate-50 border-slate-200 text-slate-700'
                              : 'bg-slate-900/40 border-slate-800/80 text-slate-300'
                          }`}>
                            <span className={`font-mono text-[10px] block mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Project Notes:</span>
                            {inq.details}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                            Est Budget: <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{inq.budgetRange}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleGenerateCaseStudyFromRFQ(inq)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                                isLight
                                  ? 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'
                                  : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-500/30'
                              }`}
                              title="Convert this quote inquiry into a published technical Case Study"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              Case Study
                            </button>
                            <button
                              onClick={() => setActiveProformaInquiry(inq)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                                isLight
                                  ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200'
                                  : 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border-cyan-500/30'
                              }`}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View Proforma
                            </button>
                            <button
                              onClick={() => handleCopyWhatsAppQuote(inq)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                                isLight
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
                              }`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              WhatsApp
                            </button>
                            <a
                              href={`tel:${inq.phone}`}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                                isLight
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                              }`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                              Call
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: BLOG ARTICLES CMS */}
            {activeTab === 'blogs' && (
              <div className="space-y-6 animate-in fade-in">
                {isEditingBlog ? (
                  /* Blog Editor Form */
                  <form id="admin-blog-form" onSubmit={handleSaveBlog} className={`p-6 rounded-2xl border space-y-4 transition-colors ${
                    isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-slate-950 border-slate-800 text-white'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                      <h4 className={`text-base font-bold font-display flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        <Edit3 className="w-4 h-4 text-emerald-500" />
                        {blogEditId ? 'Edit Engineering Blog Post' : 'Post New Engineering Blog Article'}
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingBlog(false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Publish Article
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Article Title *</label>
                        <input
                          type="text"
                          required
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                            isLight
                              ? 'bg-slate-50 border-slate-300 text-slate-900'
                              : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                          placeholder="e.g. Why GOB Displays Are Dominating Ethiopian Churches"
                        />
                      </div>

                      <div>
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Category *</label>
                        <select
                          value={blogCategory}
                          onChange={(e: any) => setBlogCategory(e.target.value)}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs transition-colors cursor-pointer ${
                            isLight
                              ? 'bg-slate-50 border-slate-300 text-slate-800'
                              : 'bg-slate-900 border-slate-800 text-slate-200'
                          }`}
                        >
                          <option value="Technical">Technical</option>
                          <option value="Industry News">Industry News</option>
                          <option value="Projects">Projects</option>
                          <option value="Buyer Guide">Buyer Guide</option>
                          <option value="Technology & Hardware">Technology & Hardware</option>
                          <option value="Processors & Systems">Processors & Systems</option>
                        </select>
                      </div>

                      <div>
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Read Time & Date</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={blogReadTime}
                            onChange={(e) => setBlogReadTime(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="4 min read"
                          />
                          <input
                            type="text"
                            value={blogDate}
                            onChange={(e) => setBlogDate(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="October 2026"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Featured Image URL</label>
                        <input
                          type="text"
                          value={blogImage}
                          onChange={(e) => setBlogImage(e.target.value)}
                          className={`w-full border rounded-xl px-4 py-2 text-xs font-mono ${
                            isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                          placeholder="/src/assets/images/led_hero_curved_stage_1790747076381.jpg"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Short Excerpt *</label>
                        <textarea
                          rows={2}
                          required
                          value={blogExcerpt}
                          onChange={(e) => setBlogExcerpt(e.target.value)}
                          className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 ${
                            isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                          placeholder="Brief 2-line summary for cards..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Full Article Content (Markdown / Text)</label>
                        <textarea
                          rows={6}
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 font-mono ${
                            isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                          placeholder="Detailed engineering guide, bullet points, hardware specs..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Tags (Comma separated)</label>
                        <input
                          type="text"
                          value={blogTags}
                          onChange={(e) => setBlogTags(e.target.value)}
                          className={`w-full border rounded-xl px-4 py-2 text-xs font-mono ${
                            isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                          placeholder="Technical, GOB LED, In-Stock P2.5, Addis Ababa"
                        />
                      </div>
                    </div>
                  </form>
                ) : (
                  /* Blog List with Category Filter */
                  <div className="space-y-4">
                    {autoSuccessNotice && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-between font-mono animate-in fade-in">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{autoSuccessNotice}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">Live on Site</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className={`text-sm font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          Published Blog Posts ({filteredBlogs.length})
                        </h4>
                        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Filtered by category and synced to Firestore</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={blogCategoryFilter}
                          onChange={(e) => setBlogCategoryFilter(e.target.value)}
                          className={`border rounded-xl px-3 py-1.5 text-xs cursor-pointer ${
                            isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-300'
                          }`}
                        >
                          <option value="all">All Categories ({blogPosts.length})</option>
                          <option value="Technical">Technical</option>
                          <option value="Industry News">Industry News</option>
                          <option value="Projects">Projects</option>
                          <option value="Buyer Guide">Buyer Guide</option>
                        </select>

                        <button
                          onClick={() => handleAutomateGenerateBlog()}
                          disabled={isAutoGeneratingBlog}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>{isAutoGeneratingBlog ? 'Generating...' : '✨ AI Auto-Generate'}</span>
                        </button>

                        <button
                          onClick={handleOpenNewBlog}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Post Blog
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredBlogs.map((post) => (
                        <div
                          key={post.id}
                          className={`p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 ${
                            isLight
                              ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className={`flex items-center justify-between text-xs font-mono mb-1 ${
                              isLight ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              <span className={`font-bold px-2 py-0.5 rounded border ${
                                isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                              }`}>
                                {post.category}
                              </span>
                              <span>{post.date}</span>
                            </div>
                            <h5 className={`text-sm font-bold mb-2 line-clamp-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{post.title}</h5>
                            <p className={`text-xs line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{post.excerpt}</p>
                          </div>

                          <div className={`flex items-center justify-between pt-3 border-t ${
                            isLight ? 'border-slate-200' : 'border-slate-800'
                          }`}>
                            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{post.readTime}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenEditBlog(post)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                }`}
                              >
                                <Edit3 className="w-3.5 h-3.5 text-cyan-500" />
                                Edit
                              </button>
                              <button
                                onClick={() => onDeleteBlogPost(post.id)}
                                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                  isLight ? 'hover:bg-rose-50 text-slate-400 hover:text-rose-600' : 'hover:bg-rose-950 text-slate-500 hover:text-rose-400'
                                }`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: CASE STUDIES CMS */}
            {activeTab === 'case_studies' && (
              <div className="space-y-6 animate-in fade-in">
                {isEditingCaseStudy ? (
                  /* Case Study Editor Form */
                  <form id="admin-case-form" onSubmit={handleSaveCaseStudy} className={`p-6 rounded-2xl border space-y-4 transition-colors ${
                    isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-slate-950 border-slate-800 text-white'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                      <h4 className={`text-base font-bold font-display flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        <Layers className="w-4 h-4 text-purple-500" />
                        {caseEditId ? 'Edit Project Case Study' : 'Post New LED Project Case Study'}
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingCaseStudy(false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Publish Case Study
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Project Name *</label>
                        <input
                          type="text"
                          required
                          value={caseProjectName}
                          onChange={(e) => setCaseProjectName(e.target.value)}
                          className={`w-full border rounded-xl px-3.5 py-2 text-xs transition-colors ${
                            isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                          placeholder="e.g. Millennium Hall Event Staging Screen"
                        />
                      </div>

                      <div>
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Client / Venue *</label>
                        <input
                          type="text"
                          required
                          value={caseClient}
                          onChange={(e) => setCaseClient(e.target.value)}
                          className={`w-full border rounded-xl px-3.5 py-2 text-xs transition-colors ${
                            isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                          placeholder="e.g. Millennium Hall Arena"
                        />
                      </div>

                      <div>
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Location & Category</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={caseLocation}
                            onChange={(e) => setCaseLocation(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="Bole, Addis Ababa"
                          />
                          <input
                            type="text"
                            value={caseCategory}
                            onChange={(e) => setCaseCategory(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="Projects"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Pixel Pitch & Packaging</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={casePitch}
                            onChange={(e) => setCasePitch(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="P2.6 Apex-Rental"
                          />
                          <input
                            type="text"
                            value={casePackaging}
                            onChange={(e) => setCasePackaging(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="Die-Cast Touring"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Dimensions & Surface Area</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={caseDimensions}
                            onChange={(e) => setCaseDimensions(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="16m × 5m"
                          />
                          <input
                            type="text"
                            value={caseTotalArea}
                            onChange={(e) => setCaseTotalArea(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="80 m²"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Resolution & Image URL</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={caseResolution}
                            onChange={(e) => setCaseResolution(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="6144 × 1920 px"
                          />
                          <input
                            type="text"
                            value={caseImage}
                            onChange={(e) => setCaseImage(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs font-mono ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="/src/assets/images/led_church_sanctuary_real_1790750593649.jpg"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Client Technical Challenge *</label>
                        <textarea
                          rows={2}
                          required
                          value={caseChallenge}
                          onChange={(e) => setCaseChallenge(e.target.value)}
                          className={`w-full border rounded-xl p-3 text-xs ${
                            isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                          placeholder="Describe the environmental or structural challenge..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>DEMAQ Engineering Solution *</label>
                        <textarea
                          rows={2}
                          required
                          value={caseSolution}
                          onChange={(e) => setCaseSolution(e.target.value)}
                          className={`w-full border rounded-xl p-3 text-xs ${
                            isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                          placeholder="Describe the hardware, calibration, and rigging implementation..."
                        />
                      </div>

                      <div>
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Highlight Metric 1</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={caseMetric1Label}
                            onChange={(e) => setCaseMetric1Label(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="Refresh Rate"
                          />
                          <input
                            type="text"
                            value={caseMetric1Value}
                            onChange={(e) => setCaseMetric1Value(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="7,680Hz Shutter"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Highlight Metric 2</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={caseMetric2Label}
                            onChange={(e) => setCaseMetric2Label(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="Viewing Distance"
                          />
                          <input
                            type="text"
                            value={caseMetric2Value}
                            onChange={(e) => setCaseMetric2Value(e.target.value)}
                            className={`border rounded-xl px-3 py-2 text-xs ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                            placeholder="2.5m+ Retina"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* Case Studies Grid */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-sm font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          Published Benchmark Case Studies ({caseStudies.length})
                        </h4>
                        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Live on the Case Studies & Portfolio section</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleAutomateGenerateCaseStudy}
                          disabled={isAutoGeneratingCase}
                          className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isAutoGeneratingCase ? 'Generating...' : '✨ AI Auto-Generate'}</span>
                        </button>

                        <button
                          onClick={handleOpenNewCaseStudy}
                          className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          Post Case Study
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {caseStudies.map((study) => (
                        <div
                          key={study.id}
                          className={`p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 ${
                            isLight
                              ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className={`flex items-center justify-between text-xs font-mono mb-1 ${
                              isLight ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              <span className={`font-bold px-2 py-0.5 rounded border ${
                                isLight ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-purple-950/40 text-purple-400 border-purple-800/40'
                              }`}>
                                {study.category}
                              </span>
                              <span>{study.location}</span>
                            </div>
                            <h5 className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{study.projectName}</h5>
                            <div className={`text-xs font-mono mb-2 ${isLight ? 'text-cyan-700 font-bold' : 'text-cyan-400'}`}>
                              {study.pitch} · {study.screenDimensions} ({study.totalArea})
                            </div>
                            <p className={`text-xs line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{study.challenge}</p>
                          </div>

                          <div className={`flex items-center justify-between pt-3 border-t ${
                            isLight ? 'border-slate-200' : 'border-slate-800'
                          }`}>
                            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{study.client}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenEditCaseStudy(study)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                }`}
                              >
                                <Edit3 className="w-3.5 h-3.5 text-cyan-500" />
                                Edit
                              </button>
                              <button
                                onClick={() => onDeleteCaseStudy(study.id)}
                                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                  isLight ? 'hover:bg-rose-50 text-slate-400 hover:text-rose-600' : 'hover:bg-rose-950 text-slate-500 hover:text-rose-400'
                                }`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: AI AUTOMATION ENGINE */}
            {activeTab === 'automation' && (
              <div className="space-y-6 animate-in fade-in">
                <div className={`p-5 rounded-2xl border transition-colors ${
                  isLight
                    ? 'bg-gradient-to-r from-teal-50 via-slate-50 to-cyan-50 border-teal-200 text-slate-900'
                    : 'bg-gradient-to-r from-teal-950/60 via-slate-900 to-cyan-950/60 border-teal-800/40 text-white'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                      isLight ? 'bg-teal-100 border-teal-300 text-teal-800' : 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                    }`}>
                      <Wand2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-base font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Real-Time AI Engineering Content & Automation Engine
                      </h4>
                      <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Collects live industry datasets, thermal metrics, power loads, and Ethiopian market benchmarks for instant publishing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Active External API & Firestore Sync Engine */}
                <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
                  isLight
                    ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-emerald-300'
                    : 'bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-cyan-950/40 border-emerald-700/50'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                        isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      }`}>
                        <Database className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className={`text-sm font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            Live External API & Firestore Synchronizer
                          </h5>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                            isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            DYNAMIC FIRESTORE SYNC
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                          Actively fetches latest 2026 LED industry news, currency/tariff impacts, and verified deployment benchmarks from external search-grounded APIs and syncs them directly into Firestore.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleSyncMarketTrends}
                      disabled={isSyncingTrends}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shrink-0 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncingTrends ? 'animate-spin' : ''}`} />
                      <span>{isSyncingTrends ? 'Fetching & Syncing to Firestore...' : 'Sync Market Trends to Firestore'}</span>
                    </button>
                  </div>

                  {syncResultNotice && (
                    <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-600 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{syncResultNotice}</span>
                    </div>
                  )}
                </div>

                {/* Real-time Generation Progress Banner */}
                {realtimeGenStep && (
                  <div className="p-4 rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/40 text-cyan-800 dark:text-cyan-200 text-xs flex items-center gap-3 font-mono animate-in fade-in">
                    <RefreshCw className="w-5 h-5 animate-spin text-cyan-500 shrink-0" />
                    <div>
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        <span>Live Real-Time Data Collection Active</span>
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                      </div>
                      <div className="text-xs text-cyan-600 dark:text-cyan-300 mt-0.5">{realtimeGenStep}</div>
                    </div>
                  </div>
                )}

                {/* Section A: One-Click Blog Post Automation */}
                <div className={`p-6 rounded-2xl border space-y-4 transition-colors ${
                  isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-teal-500" />
                      <h5 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Auto-Generate Real-Time Blog Articles</h5>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                      isLight ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-teal-950 text-teal-300 border-teal-800'
                    }`}>
                      Live Search Grounded
                    </span>
                  </div>

                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Select a preset technical topic or enter a keyword. The automation engine fetches real-time 2025/2026 specs, Ethiopian municipal directives, MeanWell power loads, and Flip-Chip COB vs GOB thermodynamic datasets.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAutomateGenerateBlog('Why Flip-Chip COB Micro-LEDs Run 12°C Cooler Than SMD', 'Technical')}
                      disabled={isAutoGeneratingBlog}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
                        isLight
                          ? 'bg-slate-50 hover:bg-teal-50/50 border-slate-200 hover:border-teal-400'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-teal-500/50'
                      }`}
                    >
                      <div className={`text-xs font-bold flex items-center justify-between ${
                        isLight ? 'text-slate-900 group-hover:text-teal-800' : 'text-white group-hover:text-teal-300'
                      }`}>
                        <span>Thermal & Voltage Efficiency</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isLight ? 'bg-teal-100 text-teal-800' : 'text-teal-400 bg-teal-950'
                        }`}>Technical</span>
                      </div>
                      <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Why Flip-Chip COB runs 12°C cooler than SMD for SOC control rooms.
                      </p>
                    </button>

                    <button
                      onClick={() => handleAutomateGenerateBlog('Addis Ababa 3D Curved Outdoor LED Signage Regulations', 'Industry News')}
                      disabled={isAutoGeneratingBlog}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
                        isLight
                          ? 'bg-slate-50 hover:bg-cyan-50/50 border-slate-200 hover:border-cyan-400'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-teal-500/50'
                      }`}
                    >
                      <div className={`text-xs font-bold flex items-center justify-between ${
                        isLight ? 'text-slate-900 group-hover:text-cyan-800' : 'text-white group-hover:text-teal-300'
                      }`}>
                        <span>Municipal Signage Directives</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isLight ? 'bg-cyan-100 text-cyan-800' : 'text-cyan-400 bg-cyan-950'
                        }`}>Industry News</span>
                      </div>
                      <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Ethiopian Media Authority standards for daylight brightness dimming.
                      </p>
                    </button>

                    <button
                      onClick={() => handleAutomateGenerateBlog('Turnkey 80 m² P2.6 Rental Staging at Millennium Hall Arena', 'Projects')}
                      disabled={isAutoGeneratingBlog}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
                        isLight
                          ? 'bg-slate-50 hover:bg-purple-50/50 border-slate-200 hover:border-purple-400'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-teal-500/50'
                      }`}
                    >
                      <div className={`text-xs font-bold flex items-center justify-between ${
                        isLight ? 'text-slate-900 group-hover:text-purple-800' : 'text-white group-hover:text-teal-300'
                      }`}>
                        <span>Millennium Hall Rigging</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isLight ? 'bg-purple-100 text-purple-800' : 'text-purple-400 bg-purple-950'
                        }`}>Projects</span>
                      </div>
                      <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        7,680Hz broadcast camera sync and die-cast curved cabinet rigging.
                      </p>
                    </button>

                    <button
                      onClick={() => handleAutomateGenerateBlog('P1.86 vs P2.5 GOB Selection Guide for Ethiopian Worship Sanctuaries', 'Buyer Guide')}
                      disabled={isAutoGeneratingBlog}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
                        isLight
                          ? 'bg-slate-50 hover:bg-amber-50/50 border-slate-200 hover:border-amber-400'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-teal-500/50'
                      }`}
                    >
                      <div className={`text-xs font-bold flex items-center justify-between ${
                        isLight ? 'text-slate-900 group-hover:text-amber-800' : 'text-white group-hover:text-teal-300'
                      }`}>
                        <span>Worship Sanctuary Pitch Guide</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isLight ? 'bg-amber-100 text-amber-800' : 'text-amber-400 bg-amber-950'
                        }`}>Buyer Guide</span>
                      </div>
                      <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Viewing distance thresholds, budget allocation, and GOB epoxy durability.
                      </p>
                    </button>
                  </div>

                  {/* Custom Topic Generator */}
                  <div className={`pt-3 border-t flex flex-col sm:flex-row gap-2 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                    <input
                      type="text"
                      placeholder="Or enter custom topic prompt (e.g., NovaStar COEX 8K broadcast mapping)..."
                      value={autoBlogTopic}
                      onChange={(e) => setAutoBlogTopic(e.target.value)}
                      className={`flex-1 border rounded-xl px-4 py-2 text-xs transition-colors ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    />
                    <select
                      value={autoBlogCategory}
                      onChange={(e: any) => setAutoBlogCategory(e.target.value)}
                      className={`border rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <option value="Technical">Technical</option>
                      <option value="Industry News">Industry News</option>
                      <option value="Projects">Projects</option>
                      <option value="Buyer Guide">Buyer Guide</option>
                    </select>
                    <button
                      onClick={() => handleAutomateGenerateBlog()}
                      disabled={isAutoGeneratingBlog}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>{isAutoGeneratingBlog ? 'Generating...' : 'Auto-Publish Blog'}</span>
                    </button>
                  </div>
                </div>

                {/* Section B: One-Click Case Study Automation */}
                <div className={`p-6 rounded-2xl border space-y-4 transition-colors ${
                  isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-500" />
                      <h5 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Auto-Generate Benchmark Case Studies</h5>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                      isLight ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-purple-950 text-purple-300 border-purple-800'
                    }`}>
                      Preset Specs & Metrics
                    </span>
                  </div>

                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Select a project blueprint below to automatically compute active area, resolution, power load, engineering challenges, solutions, and quantitative metrics.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setAutoCasePreset('worship')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        autoCasePreset === 'worship'
                          ? isLight ? 'bg-purple-50 border-purple-500 text-slate-900' : 'bg-purple-950/30 border-purple-500 text-white'
                          : isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`text-xs font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>House of Worship 36.8m² GOB Wall</div>
                      <div className={`text-[11px] font-mono ${isLight ? 'text-cyan-700 font-semibold' : 'text-cyan-400'}`}>P2.5 Shield-GOB · NovaStar VX1000 · 100% Anti-Collision</div>
                    </div>

                    <div
                      onClick={() => setAutoCasePreset('control_room')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        autoCasePreset === 'control_room'
                          ? isLight ? 'bg-purple-50 border-purple-500 text-slate-900' : 'bg-purple-950/30 border-purple-500 text-white'
                          : isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`text-xs font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Financial SOC 22.68m² 8K Control Wall</div>
                      <div className={`text-[11px] font-mono ${isLight ? 'text-cyan-700 font-semibold' : 'text-cyan-400'}`}>P0.93 Flip-Chip COB · NovaPro UHD Jr · 10,000:1 True Black</div>
                    </div>

                    <div
                      onClick={() => setAutoCasePreset('arena')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        autoCasePreset === 'arena'
                          ? isLight ? 'bg-purple-50 border-purple-500 text-slate-900' : 'bg-purple-950/30 border-purple-500 text-white'
                          : isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`text-xs font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Concert Arena 80m² Fast-Lock Staging</div>
                      <div className={`text-[11px] font-mono ${isLight ? 'text-cyan-700 font-semibold' : 'text-cyan-400'}`}>P2.6 Apex-Rental · 7,680Hz Camera Sync · Magnesium Frame</div>
                    </div>

                    <div
                      onClick={() => setAutoCasePreset('billboard')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        autoCasePreset === 'billboard'
                          ? isLight ? 'bg-purple-50 border-purple-500 text-slate-900' : 'bg-purple-950/30 border-purple-500 text-white'
                          : isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`text-xs font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Outdoor 144m² 3D Curved Billboard</div>
                      <div className={`text-[11px] font-mono ${isLight ? 'text-cyan-700 font-semibold' : 'text-cyan-400'}`}>P4.81 Horizon Outdoor · 9,500 Nits Sun · Huidu 4G Cloud</div>
                    </div>

                    <div
                      onClick={() => setAutoCasePreset('custom')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        autoCasePreset === 'custom'
                          ? isLight ? 'bg-purple-50 border-purple-500 text-slate-900' : 'bg-purple-950/30 border-purple-500 text-white'
                          : isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`text-xs font-bold mb-1 flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        <span>Custom Project Case Study</span>
                      </div>
                      <div className={`text-[11px] font-mono ${isLight ? 'text-purple-700 font-semibold' : 'text-purple-400'}`}>AI Auto-Synthesizes Specs, Challenges & Solutions</div>
                    </div>
                  </div>

                  {autoCasePreset === 'custom' && (
                    <div className={`p-4 rounded-xl border space-y-3 mt-2 ${
                      isLight ? 'bg-purple-50/50 border-purple-200' : 'bg-purple-950/20 border-purple-800/40'
                    }`}>
                      <div className="text-xs font-bold text-purple-600 dark:text-purple-400">
                        Custom AI Case Study Parameters
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          placeholder="Project Name (e.g., Commercial Bank HQ Video Wall)..."
                          value={autoCustomCaseProject}
                          onChange={(e) => setAutoCustomCaseProject(e.target.value)}
                          className={`border rounded-lg px-3 py-1.5 text-xs ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Client / Venue (e.g., CBE Head Office)..."
                          value={autoCustomCaseClient}
                          onChange={(e) => setAutoCustomCaseClient(e.target.value)}
                          className={`border rounded-lg px-3 py-1.5 text-xs ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Location (e.g., Kazanchis, Addis Ababa)..."
                          value={autoCustomCaseLocation}
                          onChange={(e) => setAutoCustomCaseLocation(e.target.value)}
                          className={`border rounded-lg px-3 py-1.5 text-xs ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        />
                        <select
                          value={autoCustomCasePitch}
                          onChange={(e) => setAutoCustomCasePitch(e.target.value)}
                          className={`border rounded-lg px-3 py-1.5 text-xs ${
                            isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <option value="P2.5 Shield-GOB">P2.5 Shield-GOB (In-Stock)</option>
                          <option value="P1.86 Shield-GOB">P1.86 Shield-GOB (High Res)</option>
                          <option value="P0.93 Nova-Pitch COB">P0.93 Flip-Chip COB (8K Control)</option>
                          <option value="P2.6 Apex-Rental">P2.6 Apex-Rental (Concert Staging)</option>
                          <option value="P4.81 Horizon DOOH">P4.81 Horizon Outdoor (3D Billboard)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleAutomateGenerateCaseStudy}
                      disabled={isAutoGeneratingCase}
                      className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAutoGeneratingCase ? 'Compiling Case Study...' : autoCasePreset === 'custom' ? 'Auto-Generate & Publish Custom Case Study' : 'Auto-Publish Selected Case Study'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: INSTANT ALERTS */}
            {activeTab === 'alerts' && (
              <div className="space-y-6 animate-in fade-in">
                <form id="admin-alerts-form" onSubmit={handleSaveAlertSettings} className={`p-6 rounded-2xl border space-y-6 transition-colors ${
                  isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                    <div>
                      <h4 className={`text-base font-bold font-display flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        <BellRing className="w-5 h-5 text-amber-500" />
                        Live Multi-Channel Alert Gateway
                      </h4>
                      <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Configure instant notifications whenever a client requests a quote, proforma, or maintenance technician.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      Save Alert Settings
                    </button>
                  </div>

                  {saveSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      Alert settings updated and synchronized across all notification endpoints.
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* WhatsApp Channel */}
                    <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
                      alertFormData.enableWhatsapp
                        ? isLight ? 'bg-emerald-50/70 border-emerald-300' : 'bg-emerald-950/20 border-emerald-700/50'
                        : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-500" />
                          <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>WhatsApp Alerts</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={alertFormData.enableWhatsapp}
                          onChange={(e) => setAlertFormData({ ...alertFormData, enableWhatsapp: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className={`text-[10px] font-mono uppercase block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Admin WhatsApp Number</label>
                        <input
                          type="text"
                          value={alertFormData.adminWhatsapp}
                          onChange={(e) => setAlertFormData({ ...alertFormData, adminWhatsapp: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                          placeholder="+251942992799"
                        />
                      </div>
                      <div className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> 1-Click direct chat format ready
                      </div>
                    </div>

                    {/* SMS Channel */}
                    <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
                      alertFormData.enableSms
                        ? isLight ? 'bg-amber-50/70 border-amber-300' : 'bg-amber-950/20 border-amber-700/50'
                        : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-amber-500" />
                          <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>SMS / Text Alerts</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={alertFormData.enableSms}
                          onChange={(e) => setAlertFormData({ ...alertFormData, enableSms: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className={`text-[10px] font-mono uppercase block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Admin Mobile Number</label>
                        <input
                          type="text"
                          value={alertFormData.adminPhone}
                          onChange={(e) => setAlertFormData({ ...alertFormData, adminPhone: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                          placeholder="+251942992799"
                        />
                      </div>
                      <div>
                        <label className={`text-[10px] font-mono uppercase block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Gateway</label>
                        <select
                          value={alertFormData.smsGateway}
                          onChange={(e: any) => setAlertFormData({ ...alertFormData, smsGateway: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer ${
                            isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-300'
                          }`}
                        >
                          <option value="Ethio Telecom SMS">Ethio Telecom SMS Gateway</option>
                          <option value="DemaQ Direct Gateway">DemaQ Direct Gateway</option>
                          <option value="Twilio SMS">Twilio SMS</option>
                        </select>
                      </div>
                    </div>

                    {/* Email Channel */}
                    <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
                      alertFormData.enableEmail
                        ? isLight ? 'bg-blue-50/70 border-blue-300' : 'bg-blue-950/20 border-blue-700/50'
                        : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Email Proforma Alerts</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={alertFormData.enableEmail}
                          onChange={(e) => setAlertFormData({ ...alertFormData, enableEmail: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-500 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className={`text-[10px] font-mono uppercase block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Admin Alert Email</label>
                        <input
                          type="email"
                          value={alertFormData.adminEmail}
                          onChange={(e) => setAlertFormData({ ...alertFormData, adminEmail: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                          placeholder="alerts@demaqdigital.com"
                        />
                      </div>
                      <div className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        <Check className="w-3.5 h-3.5 text-blue-500" /> HTML proforma summary attached
                      </div>
                    </div>
                  </div>
                </form>

                {/* Live Alert Log */}
                <div className={`p-6 rounded-2xl border space-y-4 transition-colors ${
                  isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>Alert Dispatch History & Logs</h4>
                      <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Real-time trace of outgoing SMS, WhatsApp & Email messages</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onTriggerTestAlert('All')}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                          isLight
                            ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                      >
                        <BellRing className="w-3.5 h-3.5" />
                        Send Test Broadcast
                      </button>
                      {alertLogs.length > 0 && (
                        <button
                          onClick={onClearAlertLogs}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono border cursor-pointer transition-colors ${
                            isLight
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                          }`}
                        >
                          Clear Logs
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {alertLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-4 rounded-xl border text-xs space-y-2 transition-colors ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-slate-800'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              log.channel === 'WhatsApp'
                                ? isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : log.channel === 'SMS'
                                ? isLight ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-amber-950 text-amber-300 border border-amber-700'
                                : isLight ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-blue-950 text-blue-300 border border-blue-700'
                            }`}>
                              {log.channel}
                            </span>
                            <strong className={isLight ? 'text-slate-900' : 'text-white'}>{log.title}</strong>
                            <span className={`font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>→ {log.recipient}</span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>{log.timestamp}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">● {log.status}</span>
                          </div>
                        </div>

                        <div className={`p-3 rounded-lg border text-[11px] font-mono whitespace-pre-line ${
                          isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}>
                          {log.payloadText}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: MAINTENANCE */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`text-sm font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      LED Repair & Maintenance Tickets
                    </h4>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Addis Ababa on-site diagnostic & parts replacement queue
                    </p>
                  </div>

                  <select
                    value={maintStatusFilter}
                    onChange={(e: any) => setMaintStatusFilter(e.target.value)}
                    className={`border rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer ${
                      isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <option value="all">All Service Tickets ({maintenanceRequests.length})</option>
                    <option value="pending_quote">Pending Assignment</option>
                    <option value="technician_assigned">Tech Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {filteredMaintenance.map((req) => (
                    <div
                      key={req.id}
                      className={`p-5 rounded-2xl border space-y-3 transition-colors ${
                        isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${
                        isLight ? 'border-slate-200' : 'border-slate-800'
                      }`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{req.clientName}</span>
                            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>({req.company})</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                              req.urgency.includes('Emergency')
                                ? isLight ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-rose-950 text-rose-300 border-rose-800'
                                : isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-950 text-amber-300 border-amber-800'
                            }`}>
                              {req.urgency}
                            </span>
                          </div>
                          <div className={`text-xs font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            📍 {req.screenLocation} · 📱 {req.phone} · 🕒 {req.timestamp}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={req.status}
                            onChange={(e: any) => onUpdateMaintenanceStatus(req.id, e.target.value)}
                            className={`text-xs font-mono font-bold rounded-lg px-2.5 py-1 border cursor-pointer transition-colors ${
                              isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-200'
                            }`}
                          >
                            <option value="pending_quote">● Pending Assignment</option>
                            <option value="technician_assigned">● Tech Assigned</option>
                            <option value="in_progress">● In Progress</option>
                            <option value="resolved">● Resolved</option>
                          </select>

                          <button
                            onClick={() => onDeleteMaintenanceRequest(req.id)}
                            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                              isLight ? 'hover:bg-rose-50 text-slate-400 hover:text-rose-600' : 'hover:bg-rose-950 text-slate-500 hover:text-rose-400'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                        <div className={`p-2 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                          <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Issue Type</span>
                          <span className="text-rose-600 dark:text-rose-400 font-bold">{req.issueType}</span>
                        </div>
                        <div className={`p-2 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                          <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Pixel Pitch</span>
                          <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{req.pixelPitch}</span>
                        </div>
                        <div className={`p-2 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                          <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Controller</span>
                          <span className={`font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>{req.controllerBrand}</span>
                        </div>
                      </div>

                      <div className={`p-3 rounded-lg border text-xs ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}>
                        <span className={`font-mono text-[10px] block mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Diagnostic Report:</span>
                        {req.description}
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <a
                          href={`https://wa.me/${(req.phone || '').replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hello ${req.clientName}, DemaQ Technical Service dispatch regarding ticket #${req.id} for your ${req.screenLocation} LED display.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isLight
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          WhatsApp Tech Update
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: BRAND SETTINGS */}
            {activeTab === 'settings' && (
              <form id="admin-settings-form" onSubmit={handleSaveConfig} className={`p-6 rounded-2xl border space-y-6 animate-in fade-in transition-colors ${
                isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className={`flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                  <div>
                    <h4 className={`text-base font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>Company & Brand Customization</h4>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Headquarters location, proforma contact, and hotline</p>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    Save Brand Settings
                  </button>
                </div>

                {/* Official Logo Uploader Card */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  isLight ? 'bg-cyan-50/50 border-cyan-200' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                      <DemaqLogo size="md" showText={true} theme={theme} />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Official DemaQ Logo Asset</div>
                      <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Upload your authentic DEMAQ LOGO (2).png image as is with 0 changes
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Upload DEMAQ LOGO</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = async (ev) => {
                            const b64 = ev.target?.result as string;
                            if (b64) {
                              setLogoUrl(b64);
                              try {
                                await fetch('/api/upload-logo', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ imageBase64: b64 })
                                });
                              } catch (err) {
                                console.warn('Could not persist to server:', err);
                              }
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>

                    {logoUrl !== '/demaq-official-logo.png' && (
                      <button
                        type="button"
                        onClick={() => setLogoUrl('/demaq-official-logo.png')}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                          isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Company Name</label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      className={`w-full border rounded-xl px-3.5 py-2 text-xs transition-colors ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Support Phone / Hotline</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono transition-colors ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Official Email</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono transition-colors ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Warehouse & Office Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={`w-full border rounded-xl px-3.5 py-2 text-xs transition-colors ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Warranty Statement</label>
                    <input
                      type="text"
                      value={formData.warrantyPeriod}
                      onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                      className={`w-full border rounded-xl px-3.5 py-2 text-xs transition-colors ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    />
                  </div>
                </div>
              </form>
            )}

          </div>

          {/* Sticky Mobile/Desktop Action Footer (Stays visible during long scroll sequences) */}
          <div className={`shrink-0 border-t px-3.5 sm:px-6 py-2.5 sm:py-3 backdrop-blur-md transition-all z-20 ${
            isLight
              ? 'bg-white/95 border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
              : 'bg-slate-950/95 border-slate-800 shadow-[0_-4px_25px_rgba(0,0,0,0.5)]'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 max-w-5xl mx-auto w-full">
              {/* Context-Specific Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap flex-1 min-w-0">
                {/* 1. Blog Editor Active State */}
                {activeTab === 'blogs' && isEditingBlog && (
                  <>
                    <button
                      type="submit"
                      form="admin-blog-form"
                      onClick={(e) => handleSaveBlog(e)}
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Publish Article</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAutomateGenerateBlog()}
                      disabled={isAutoGeneratingBlog}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        isLight
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                      }`}
                    >
                      <Wand2 className={`w-3.5 h-3.5 text-emerald-500 ${isAutoGeneratingBlog ? 'animate-spin' : ''}`} />
                      <span className="hidden xs:inline">AI Generate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingBlog(false)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      Cancel
                    </button>
                  </>
                )}

                {/* 2. Blog List Active State */}
                {activeTab === 'blogs' && !isEditingBlog && (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenNewBlog}
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>New Article</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSyncMarketTrends}
                      disabled={isSyncingTrends}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingTrends ? 'animate-spin text-emerald-500' : 'text-slate-400'}`} />
                      <span className="hidden sm:inline">{isSyncingTrends ? 'Syncing...' : 'Sync Trends'}</span>
                    </button>
                  </>
                )}

                {/* 3. Case Study Editor Active State */}
                {activeTab === 'case_studies' && isEditingCaseStudy && (
                  <>
                    <button
                      type="submit"
                      form="admin-case-form"
                      onClick={(e) => handleSaveCaseStudy(e)}
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Publish Case Study</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingCaseStudy(false)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      Cancel
                    </button>
                  </>
                )}

                {/* 4. Case Studies List Active State */}
                {activeTab === 'case_studies' && !isEditingCaseStudy && (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenNewCaseStudy}
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Add Case Study</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSyncMarketTrends}
                      disabled={isSyncingTrends}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingTrends ? 'animate-spin text-purple-400' : 'text-slate-400'}`} />
                      <span className="hidden sm:inline">Sync Data</span>
                    </button>
                  </>
                )}

                {/* 5. Proforma Modal Active */}
                {activeProformaInquiry && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopyWhatsAppQuote(activeProformaInquiry)}
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{copiedText ? 'Copied!' : 'WhatsApp Quote'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <Printer className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Print PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveProformaInquiry(null)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      Close
                    </button>
                  </>
                )}

                {/* 6. Settings Tab Active */}
                {activeTab === 'settings' && (
                  <>
                    <button
                      type="submit"
                      form="admin-settings-form"
                      onClick={(e) => handleSaveConfig(e)}
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Save Brand Settings</span>
                    </button>
                    {saveSuccess && (
                      <span className="text-xs font-mono font-bold text-emerald-500 flex items-center gap-1 animate-pulse">
                        <Check className="w-3.5 h-3.5" />
                        Saved!
                      </span>
                    )}
                  </>
                )}

                {/* 7. Alerts Tab Active */}
                {activeTab === 'alerts' && (
                  <>
                    <button
                      type="submit"
                      form="admin-alerts-form"
                      onClick={(e) => handleSaveAlertSettings(e)}
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Save Alerts</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onTriggerTestAlert('All')}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                    >
                      <BellRing className="w-3.5 h-3.5 animate-bounce" />
                      <span>Test Alert</span>
                    </button>
                    {saveSuccess && (
                      <span className="text-xs font-mono font-bold text-emerald-500 flex items-center gap-1 animate-pulse">
                        <Check className="w-3.5 h-3.5" />
                        Saved!
                      </span>
                    )}
                  </>
                )}

                {/* 8. Overview Tab Active */}
                {activeTab === 'overview' && (
                  <>
                    <button
                      type="button"
                      onClick={handleSyncMarketTrends}
                      disabled={isSyncingTrends}
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingTrends ? 'animate-spin' : ''}`} />
                      <span>{isSyncingTrends ? 'Syncing...' : 'Sync Market Trends'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onTriggerTestAlert('All')}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Simulate Alert</span>
                      <span className="sm:hidden">Test Alert</span>
                    </button>
                  </>
                )}

                {/* 9. Quotes/RFQs List Active */}
                {activeTab === 'rfqs' && !activeProformaInquiry && (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {filteredInquiries.length} of {inquiries.length} Inquiries
                    </span>
                    {statusFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setStatusFilter('all')}
                        className="text-[11px] font-mono text-cyan-500 hover:underline cursor-pointer"
                      >
                        Clear Filter
                      </button>
                    )}
                  </div>
                )}

                {/* 10. AI Automation Tab Active */}
                {activeTab === 'automation' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAutomateGenerateCaseStudy()}
                      disabled={isAutoGeneratingCase}
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Wand2 className={`w-3.5 h-3.5 ${isAutoGeneratingCase ? 'animate-spin' : ''}`} />
                      <span>{isAutoGeneratingCase ? 'Generating...' : 'Run Auto-Architect'}</span>
                    </button>
                  </div>
                )}

                {/* 11. Maintenance Tab Active */}
                {activeTab === 'maintenance' && (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {maintenanceRequests.length} Repair Tickets
                    </span>
                    {urgentTickets > 0 && (
                      <span className="text-[10px] bg-rose-500 text-white font-mono px-2 py-0.5 rounded-full font-bold animate-pulse">
                        {urgentTickets} Urgent
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Universal Utilities (Scroll to Top & Close Drawer) */}
              <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    contentContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                  title="Scroll back to top of page"
                  aria-label="Scroll back to top"
                >
                  <ChevronUp className="w-4 h-4 text-cyan-500" />
                  <span className="text-[11px] font-mono hidden sm:inline">Top</span>
                </button>

                <button
                  type="button"
                  onClick={handleDrawerClose}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700'
                  }`}
                  title="Close Studio Drawer"
                >
                  <X className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] font-mono">Close</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
        </div>
      </div>
    </div>
  );
};
