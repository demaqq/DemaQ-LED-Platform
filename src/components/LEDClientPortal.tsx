import React, { useState, useEffect } from 'react';
import {
  X, User as UserIcon, LogIn, LogOut, Mail, Lock, ShieldCheck,
  FileText, Wrench, Clock, CheckCircle2, AlertCircle, Phone,
  ChevronRight, ExternalLink, RefreshCw, Send, Plus, Sparkles,
  Download, MessageSquare, MapPin, Monitor, Layers, Eye, Smartphone, Check,
  Wifi, WifiOff
} from 'lucide-react';
import {
  auth,
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  signInGuest,
  logoutUser,
  User,
  db,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  getDoc
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { LEDInquiry, MaintenanceRequest, SiteConfig, ClientProfile } from '../types';
import { Building2, Save } from 'lucide-react';
import { DemaqLogo } from './DemaqLogo';
import { useApp } from '../context/AppContext';
import { OrderProgressTimeline } from './OrderProgressTimeline';
import { PWAInstallButton } from './PWAInstallButton';

interface LEDClientPortalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  inquiries: LEDInquiry[];
  maintenanceRequests: MaintenanceRequest[];
  initialTab?: 'quotes' | 'maintenance' | 'profile' | 'new_ticket';
  onNavigateToRFQ?: () => void;
  onNavigateToMaintenance?: () => void;
  onRequestNewQuote?: (inq: Omit<LEDInquiry, 'id' | 'timestamp' | 'status'>) => void;
  onRequestNewMaintenance?: (req: Omit<MaintenanceRequest, 'id' | 'timestamp' | 'status'>) => void;
}

export const LEDClientPortal: React.FC<LEDClientPortalProps> = ({
  isOpen,
  onClose,
  config,
  inquiries,
  maintenanceRequests,
  initialTab = 'quotes',
  onNavigateToRFQ,
  onNavigateToMaintenance,
  onRequestNewQuote,
  onRequestNewMaintenance
}) => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  // Online / Offline Connectivity State for PWA Service Worker caching
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auth States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Portal View States
  const [activeTab, setActiveTab] = useState<'quotes' | 'maintenance' | 'profile' | 'new_ticket'>(initialTab);
  const [selectedQuote, setSelectedQuote] = useState<LEDInquiry | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceRequest | null>(null);

  useEffect(() => {
    if (initialTab && isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // New Ticket Form State
  const [newTicketLocation, setNewTicketLocation] = useState('');
  const [newTicketPitch, setNewTicketPitch] = useState('P2.5 GOB');
  const [newTicketController, setNewTicketController] = useState<'NovaStar' | 'Huidu' | 'Colorlight' | 'Linsn' | 'Brompton' | 'Other / Not Sure'>('NovaStar');
  const [newTicketIssue, setNewTicketIssue] = useState<'Dead Pixels / Dark Modules' | 'Sending Card / Signal Loss' | 'Power Supply Failure' | 'Flickering / Scan Lines' | 'Configuration / Software Setup' | 'Physical Damage'>('Dead Pixels / Dark Modules');
  const [newTicketUrgency, setNewTicketUrgency] = useState<'Emergency (Within 4h)' | 'Urgent (Same Day)' | 'Standard (24-48h)'>('Urgent (Same Day)');
  const [newTicketDesc, setNewTicketDesc] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Profile Form State for Fast RFQ Processing
  const [profileData, setProfileData] = useState<ClientProfile>(() => {
    const saved = localStorage.getItem('demaq_client_profile_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { /* fallback */ }
    }
    return {
      fullName: '',
      company: '',
      phone: '+251 9',
      email: '',
      industry: 'House of Worship',
      installationAddress: 'Bole Medhanealem, Addis Ababa',
      mountingType: 'Wall Mounted',
      preferredContact: 'WhatsApp',
      tinNumber: ''
    };
  });
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Track Firebase Auth state & Sync Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user?.email) {
        setEmailInput(user.email);
        setProfileData((prev) => ({
          ...prev,
          email: prev.email || user.email || ''
        }));
      }
      if (user?.displayName) {
        setNameInput(user.displayName);
        setProfileData((prev) => ({
          ...prev,
          fullName: prev.fullName || user.displayName || ''
        }));
      }

      if (user && !user.isAnonymous) {
        try {
          const profileSnap = await getDoc(doc(db, 'client_profiles', user.uid));
          if (profileSnap.exists()) {
            const data = profileSnap.data() as ClientProfile;
            setProfileData((prev) => ({ ...prev, ...data }));
            localStorage.setItem('demaq_client_profile_v1', JSON.stringify({ ...data }));
          }
        } catch (err) {
          console.warn('Profile sync from Firestore notice:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Handlers for Authentication
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || 'Google Sign-In failed. Please try email login.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      setAuthError('Please fill in email and password.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (authMode === 'signup') {
        await registerWithEmail(emailInput, passwordInput, nameInput || 'Valued Client');
      } else {
        await signInWithEmail(emailInput, passwordInput);
      }
    } catch (err: any) {
      // If user not found during sign in, offer friendly message
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid credentials. If you are new, switch to "Create Account".');
      } else if (err.code === 'auth/email-already-in-use') {
        setAuthError('Email already in use. Please sign in instead.');
      } else {
        setAuthError(err.message || 'Authentication failed.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInGuest('Demo Client · Addis Ababa');
    } catch (err: any) {
      setAuthError('Guest access initialized locally.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    setSelectedQuote(null);
    setSelectedTicket(null);
  };

  // Filter User-Specific Quotes & Maintenance Tickets
  const userEmail = currentUser?.email?.toLowerCase();
  const userName = currentUser?.displayName?.toLowerCase();

  // If logged in, filter items matching the user's email/name, or show all if in demo mode/empty
  const userQuotes = inquiries.filter((inq) => {
    if (!currentUser) return false;
    if (currentUser.isAnonymous) return true; // Show sample/active for guest
    if (userEmail && inq.email?.toLowerCase().includes(userEmail)) return true;
    if (userName && inq.clientName?.toLowerCase().includes(userName)) return true;
    return true; // Fallback to accessible quotes
  });

  const userTickets = maintenanceRequests.filter((req) => {
    if (!currentUser) return false;
    if (currentUser.isAnonymous) return true;
    if (userEmail && req.email?.toLowerCase().includes(userEmail)) return true;
    if (userName && req.clientName?.toLowerCase().includes(userName)) return true;
    return true;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketDesc.trim()) return;

    if (onRequestNewMaintenance) {
      onRequestNewMaintenance({
        clientName: currentUser?.displayName || nameInput || 'Client Portal User',
        company: 'Private / Enterprise',
        phone: config.phone,
        email: currentUser?.email || emailInput || 'client@demaq.com',
        screenLocation: newTicketLocation || 'Addis Ababa',
        pixelPitch: newTicketPitch,
        controllerBrand: newTicketController,
        issueType: newTicketIssue,
        description: newTicketDesc,
        urgency: newTicketUrgency
      });
    }

    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setActiveTab('maintenance');
      setNewTicketDesc('');
      setNewTicketLocation('');
    }, 1500);
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingProfile(true);
    const updated: ClientProfile = {
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('demaq_client_profile_v1', JSON.stringify(updated));

    if (currentUser && !currentUser.isAnonymous) {
      try {
        await setDoc(doc(db, 'client_profiles', currentUser.uid), updated, { merge: true });
      } catch (err) {
        console.warn('Firestore profile save notice:', err);
      }
    }
    setSavingProfile(false);
    setProfileSavedNotice(true);
    setTimeout(() => setProfileSavedNotice(false), 3500);
  };

  const handleLaunchFastRFQ = async () => {
    await handleSaveProfile();
    onClose();
    if (onNavigateToRFQ) {
      onNavigateToRFQ();
    }
  };

  // Status mapping helper with colors and human descriptions
  const getInquiryStatusBadge = (status: LEDInquiry['status']) => {
    switch (status) {
      case 'new':
        return {
          label: 'Quote Submitted',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          step: 1,
          desc: 'Received by DemaQ engineering desk.'
        };
      case 'engineering_review':
        return {
          label: 'Engineering Spec Review',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          step: 2,
          desc: 'Structural & electrical load calculations in progress.'
        };
      case 'quotation_sent':
        return {
          label: 'Proforma Invoice Ready',
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          step: 3,
          desc: 'Official Proforma invoice dispatched with VAT.'
        };
      case 'won':
        return {
          label: 'Active Deployment / Staging',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          step: 4,
          desc: 'Hardware reserved at warehouse, assembly scheduled.'
        };
      case 'closed':
        return {
          label: 'Completed & Operational',
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          step: 5,
          desc: 'Installation certified with 5-year warranty.'
        };
      default:
        return {
          label: 'In Review',
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          step: 1,
          desc: 'Processing inquiry.'
        };
    }
  };

  const getMaintenanceStatusBadge = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'pending_quote':
        return {
          label: 'Diagnostic Under Review',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          step: 1,
          desc: 'Hardware engineers reviewing failure logs.'
        };
      case 'technician_assigned':
        return {
          label: 'Technician Dispatched',
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          step: 2,
          desc: 'Certified technician en route with replacement modules.'
        };
      case 'in_progress':
        return {
          label: 'On-Site Repair Active',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          step: 3,
          desc: 'Module swap, card configuration & color calibration underway.'
        };
      case 'resolved':
        return {
          label: 'Resolved & Certified',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          step: 4,
          desc: 'Screen tested with NovaStar test pattern generator.'
        };
      default:
        return {
          label: 'In Review',
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          step: 1,
          desc: 'Ticket active.'
        };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md animate-in fade-in flex items-center justify-center p-2 sm:p-4">
      <div
        className={`w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between shrink-0 gap-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold font-display truncate">
                  DemaQ Secure Client Portal
                </h3>
                {isOnline ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1 shrink-0">
                    <Wifi className="w-3 h-3 text-emerald-500" />
                    ONLINE SYNC
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1 shrink-0 animate-pulse">
                    <WifiOff className="w-3 h-3 text-amber-500" />
                    OFFLINE CACHED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono truncate">
                Track pending proforma quotes, active hardware deployment & maintenance SLA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* PWA Home-Screen Install Button */}
            <PWAInstallButton variant="portal" isLight={isLight} />

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              aria-label="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Offline Banner when disconnected */}
        {!isOnline && (
          <div className="px-5 py-2.5 bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong className="font-semibold">Offline Access Active:</strong> Project timelines, active proforma quotes, and maintenance history are cached locally via Service Worker.
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold shrink-0">
              PWA Workbox Cache
            </span>
          </div>
        )}

        {/* Not Logged In View (Secure Authentication Gate) */}
        {!currentUser ? (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
            <div className="mb-3">
              <DemaqLogo size="md" showText={true} />
            </div>

            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
              <Lock className="w-6 h-6" />
            </div>

            <h4 className="text-xl font-bold text-center mb-1 font-display">
              {authMode === 'signin' ? 'Sign in to Client Portal' : 'Create Client Account'}
            </h4>
            <p className="text-xs text-slate-400 text-center mb-6">
              Access your official proforma quotes, screen engineering metrics, and on-site repair dispatches in real-time.
            </p>

            {authError && (
              <div className="w-full mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Google 1-Click Sign-In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-xs mb-4 cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{authLoading ? 'Signing in...' : 'Continue with Google Account'}</span>
            </button>

            <div className="w-full flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[11px] font-mono text-slate-500 uppercase">Or with Email</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleEmailAuth} className="w-full space-y-3 mt-2">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Your Full Name / Organization</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Millennium Hall Operations"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@company.com"
                    className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {authLoading ? 'Processing...' : authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Toggle Sign In / Sign Up & Demo Access */}
            <div className="mt-4 flex items-center justify-between w-full text-xs text-slate-400">
              <button
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                  setAuthError(null);
                }}
                className="hover:text-cyan-400 underline cursor-pointer"
              >
                {authMode === 'signin' ? "Don't have an account? Sign Up" : 'Already registered? Sign In'}
              </button>

              <button
                onClick={handleDemoSignIn}
                className="text-cyan-400 hover:underline font-mono text-[11px] cursor-pointer"
              >
                Demo / Guest Access →
              </button>
            </div>
          </div>
        ) : (
          /* Logged In Portal Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* User Ribbon & Navigation Tabs */}
            <div
              className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
                isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              {/* User Identity Chip */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" className="w-8 h-8 rounded-full" />
                  ) : (
                    (currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                    <span>{currentUser.displayName || 'Authorized Client'}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      CLIENT
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {currentUser.email || 'Guest Client Session'}
                  </span>
                </div>
              </div>

              {/* Portal Tabs */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setActiveTab('quotes'); setSelectedQuote(null); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'quotes'
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : isLight
                      ? 'text-slate-700 hover:bg-slate-200'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Quotes ({userQuotes.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('maintenance'); setSelectedTicket(null); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'maintenance'
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : isLight
                      ? 'text-slate-700 hover:bg-slate-200'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Repairs ({userTickets.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('profile'); setSelectedQuote(null); setSelectedTicket(null); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-cyan-600 text-white shadow-xs font-bold'
                      : isLight
                      ? 'text-slate-700 hover:bg-slate-200'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab('new_ticket')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'new_ticket'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : isLight
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                      : 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/40 border border-amber-800/60'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Urgent Ticket</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/40 transition-colors ml-2 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* TAB 1: QUOTES & PROFORMAS */}
              {activeTab === 'quotes' && (
                <div className="space-y-4">
                  {selectedQuote ? (
                    /* Detailed Quote Tracking View */
                    <div
                      className={`p-5 rounded-2xl border space-y-5 animate-in fade-in ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b pb-3 border-slate-800/60">
                        <button
                          onClick={() => setSelectedQuote(null)}
                          className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
                        >
                          ← Back to All Quotes
                        </button>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getInquiryStatusBadge(selectedQuote.status).bg}`}>
                          {getInquiryStatusBadge(selectedQuote.status).label}
                        </span>
                      </div>

                      {/* Real-time Visual Project Progress Timeline Component */}
                      <OrderProgressTimeline order={selectedQuote} isLight={isLight} />

                      {/* Screen Specs Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div className="text-[10px] font-mono uppercase text-slate-400">Dimensions & Area</div>
                          <div className="text-sm font-bold font-mono text-white mt-1">
                            {selectedQuote.dimensionsWidthM}m × {selectedQuote.dimensionsHeightM}m
                          </div>
                          <div className="text-[11px] text-cyan-400 font-mono">
                            {(selectedQuote.dimensionsWidthM * selectedQuote.dimensionsHeightM).toFixed(1)} m² Total Area
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div className="text-[10px] font-mono uppercase text-slate-400">Pixel Pitch & Series</div>
                          <div className="text-sm font-bold font-mono text-white mt-1">
                            {selectedQuote.pixelPitch}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {selectedQuote.seriesInterest || 'Commercial Display'}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div className="text-[10px] font-mono uppercase text-slate-400">Installation Type</div>
                          <div className="text-sm font-bold text-white mt-1">
                            {selectedQuote.installationType}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {selectedQuote.projectLocation || 'Addis Ababa'}
                          </div>
                        </div>
                      </div>

                      {/* Direct Engineering Desk Actions */}
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-white">Assigned Technical Lead</div>
                          <div className="text-xs text-slate-400 font-mono">DemaQ Systems Engineering Addis Ababa</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/251942992799?text=${encodeURIComponent(
                              `Hello DemaQ, I am tracking my quote #${selectedQuote.id} (${selectedQuote.pixelPitch}, ${selectedQuote.dimensionsWidthM}x${selectedQuote.dimensionsHeightM}m). Please provide update.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat on WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* All Quotes List */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                          Your Active Video Wall Quotations ({userQuotes.length})
                        </h4>
                        <button
                          onClick={() => {
                            onClose();
                            if (onNavigateToRFQ) onNavigateToRFQ();
                          }}
                          className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Request New Wall Quote</span>
                        </button>
                      </div>

                      {userQuotes.length === 0 ? (
                        <div className="text-center py-12 border border-dashed rounded-2xl border-slate-800 p-6">
                          <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                          <p className="text-xs text-slate-400 mb-3">You have no active quotations linked to this account.</p>
                          <button
                            onClick={() => {
                              onClose();
                              if (onNavigateToRFQ) onNavigateToRFQ();
                            }}
                            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer"
                          >
                            Launch Wall Calculator & Get Quote
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {userQuotes.map((inq) => {
                            const badge = getInquiryStatusBadge(inq.status);
                            // Determine stage progress %
                            let progressPct = 30;
                            let activeStageLabel = 'Processing';
                            if (inq.status === 'won') {
                              if (inq.details?.toLowerCase().includes('install')) {
                                progressPct = 88;
                                activeStageLabel = 'Installation';
                              } else {
                                progressPct = 68;
                                activeStageLabel = 'Shipping';
                              }
                            } else if (inq.status === 'closed') {
                              progressPct = 100;
                              activeStageLabel = 'Completed';
                            } else if (inq.status === 'quotation_sent') {
                              progressPct = 45;
                              activeStageLabel = 'Processing';
                            }

                            return (
                              <div
                                key={inq.id}
                                onClick={() => setSelectedQuote(inq)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                                  isLight
                                    ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs hover:border-cyan-300'
                                    : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-bold font-display">{inq.clientName}</span>
                                      <span className="text-xs text-slate-400">({inq.company})</span>
                                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
                                        {inq.pixelPitch}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">
                                      {inq.dimensionsWidthM}m × {inq.dimensionsHeightM}m · {inq.installationType} · {inq.projectLocation}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                                    <div className="text-right">
                                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border inline-block ${badge.bg}`}>
                                        {badge.label}
                                      </span>
                                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                        {badge.desc}
                                      </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                  </div>
                                </div>

                                {/* Visual Progress Bar: Processing -> Shipping -> Installation */}
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60">
                                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                                    <span className={progressPct >= 30 ? 'text-amber-500 font-bold' : ''}>1. Processing</span>
                                    <span className={progressPct >= 65 ? 'text-cyan-500 font-bold' : ''}>2. Shipping</span>
                                    <span className={progressPct >= 85 ? 'text-emerald-500 font-bold' : ''}>3. Installation</span>
                                  </div>

                                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-400 transition-all duration-500"
                                      style={{ width: `${progressPct}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MAINTENANCE & REPAIRS */}
              {activeTab === 'maintenance' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                      Your On-Site Maintenance & Repair Tickets ({userTickets.length})
                    </h4>
                    <button
                      onClick={() => setActiveTab('new_ticket')}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Submit Urgent Repair Ticket</span>
                    </button>
                  </div>

                  {userTickets.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-2xl border-slate-800 p-6">
                      <Wrench className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 mb-3">No active maintenance tickets recorded for your screens.</p>
                      <button
                        onClick={() => setActiveTab('new_ticket')}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer"
                      >
                        Submit First Service Request
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {userTickets.map((ticket) => {
                        const badge = getMaintenanceStatusBadge(ticket.status);
                        return (
                          <div
                            key={ticket.id}
                            className={`p-4 rounded-xl border transition-all ${
                              isLight ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-rose-400 uppercase font-mono">
                                    {ticket.urgency}
                                  </span>
                                  <span className="text-slate-600">·</span>
                                  <span className="text-sm font-bold">{ticket.issueType}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                  {ticket.screenLocation} · Controller: {ticket.controllerBrand} · Pitch: {ticket.pixelPitch}
                                </p>
                                <p className="text-xs text-slate-300 mt-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                                  "{ticket.description}"
                                </p>
                              </div>

                              <div className="self-end sm:self-auto text-right">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border inline-block ${badge.bg}`}>
                                  {badge.label}
                                </span>
                                <div className="text-[10px] text-slate-400 font-mono mt-1">
                                  {badge.desc}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: NEW URGENT TICKET */}
              {activeTab === 'new_ticket' && (
                <div
                  className={`p-5 rounded-2xl border space-y-4 max-w-2xl mx-auto ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-3 border-slate-800/60">
                    <div>
                      <h4 className="text-sm font-bold font-display">Submit Urgent Screen Repair Ticket</h4>
                      <p className="text-xs text-slate-400">Direct dispatch to DemaQ Certified Addis Engineers</p>
                    </div>
                    <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                      4h Emergency SLA
                    </span>
                  </div>

                  {ticketSubmitted ? (
                    <div className="py-8 text-center space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                      <h5 className="text-base font-bold text-white">Ticket Dispatched Successfully!</h5>
                      <p className="text-xs text-slate-400">Our engineering lead is reviewing your diagnostic report.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateTicket} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Screen Venue / Location</label>
                          <input
                            type="text"
                            required
                            value={newTicketLocation}
                            onChange={(e) => setNewTicketLocation(e.target.value)}
                            placeholder="e.g. Millennium Hall Main Stage"
                            className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 ${
                              isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Pixel Pitch</label>
                          <select
                            value={newTicketPitch}
                            onChange={(e) => setNewTicketPitch(e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 ${
                              isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                          >
                            <option value="P1.8 Fine-Pitch COB">P1.8 Fine-Pitch COB</option>
                            <option value="P2.5 GOB Shield">P2.5 GOB Shield Armor</option>
                            <option value="P3.9 Rental Staging">P3.9 Rental Staging</option>
                            <option value="P4 Outdoor DOOH">P4 Outdoor DOOH Billboard</option>
                            <option value="Other / Not Sure">Other / Not Sure</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Controller Brand</label>
                          <select
                            value={newTicketController}
                            onChange={(e: any) => setNewTicketController(e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 ${
                              isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                          >
                            <option value="NovaStar">NovaStar (VX400, VX1000, MCTRL4K)</option>
                            <option value="Huidu">Huidu (HD-A6, A30, VP830)</option>
                            <option value="Colorlight">Colorlight (X4, Z6 Pro)</option>
                            <option value="Brompton">Brompton Technology (SX40)</option>
                            <option value="Other / Not Sure">Other / Not Sure</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Issue Category</label>
                          <select
                            value={newTicketIssue}
                            onChange={(e: any) => setNewTicketIssue(e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 ${
                              isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                          >
                            <option value="Dead Pixels / Dark Modules">Dead Pixels / Dark Modules</option>
                            <option value="Sending Card / Signal Loss">Sending Card / Signal Loss</option>
                            <option value="Power Supply Failure">Power Supply Failure (5V/60A)</option>
                            <option value="Flickering / Scan Lines">Flickering / Scan Lines</option>
                            <option value="Configuration / Software Setup">Configuration / Software Setup</option>
                            <option value="Physical Damage">Physical Impact Damage</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Detailed Symptoms</label>
                        <textarea
                          rows={3}
                          required
                          value={newTicketDesc}
                          onChange={(e) => setNewTicketDesc(e.target.value)}
                          placeholder="Describe exactly which cabinet or module is failing, when it started, and if backup parts are available on site..."
                          className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 ${
                            isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('maintenance')}
                          className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                        >
                          Dispatch Service Ticket
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 4: MY PROFILE (Company Details & Installation Address for Faster RFQ) */}
              {activeTab === 'profile' && (
                <div
                  className={`p-5 rounded-2xl border space-y-5 max-w-2xl mx-auto animate-in fade-in ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-800/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold font-display">Client Profile & Installation Site</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                          ⚡ 1-Click Fast RFQ
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Save your organization credentials and venue address to speed up video wall quotation processing.
                      </p>
                    </div>

                    {profileSavedNotice && (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 animate-in fade-in">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Saved for Fast RFQ!</span>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                    {/* Organization & Lead Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Full Name / Project Director *
                        </label>
                        <input
                          type="text"
                          required
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                          placeholder="e.g. Dawit Tadesse"
                          className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Company / Organization Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={profileData.company}
                          onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                          placeholder="e.g. Commercial Bank of Ethiopia / Bole Medhanealem"
                          className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Phone / WhatsApp Hotline (+251) *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                          <input
                            type="tel"
                            required
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            placeholder="+251 911 234 567"
                            className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                              isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Official Work Email
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            placeholder="director@enterprise.et"
                            className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                              isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sector & Default Installation Site Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Industry Sector
                        </label>
                        <select
                          value={profileData.industry}
                          onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        >
                          <option value="House of Worship">House of Worship (Church / Sanctuary)</option>
                          <option value="Banking & Corporate Boardroom">Banking & Corporate Boardroom</option>
                          <option value="Retail & Commercial Mall">Retail Mall & Commercial Atrium</option>
                          <option value="Outdoor Commercial DOOH">Outdoor Commercial DOOH Billboard</option>
                          <option value="Television & Broadcast Studio">Television & Broadcast Studio / XR</option>
                          <option value="Concert & Live Event Staging">Concert & Live Event Staging Rental</option>
                          <option value="Hospitality / Sports Lounge">Hospitality / Hotel / Sports Lounge</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Preferred Mounting Framework
                        </label>
                        <select
                          value={profileData.mountingType}
                          onChange={(e) => setProfileData({ ...profileData, mountingType: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        >
                          <option value="Wall Mounted">Wall Mounted (Rigid Brackets)</option>
                          <option value="Hanging Rig / Truss">Hanging Rig / Aluminum Box Truss</option>
                          <option value="Ground Stack">Ground Stack / Mobile Stage Base</option>
                          <option value="Curved / Architectural">Curved / 90° Architectural Corner</option>
                          <option value="Pole Mount">Outdoor Steel Pylon / Pole Mount</option>
                        </select>
                      </div>
                    </div>

                    {/* Installation Site Address */}
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Default Installation Venue & Site Address *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3 top-3 text-cyan-500" />
                        <input
                          type="text"
                          required
                          value={profileData.installationAddress}
                          onChange={(e) => setProfileData({ ...profileData, installationAddress: e.target.value })}
                          placeholder="e.g. Sarbet, near Vatican Embassy, Addis Ababa"
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        This installation address will automatically pre-fill your formal proforma requests and structural site surveys.
                      </span>
                    </div>

                    {/* Contact Preference & Optional TIN */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Preferred Quotation Delivery
                        </label>
                        <select
                          value={profileData.preferredContact}
                          onChange={(e: any) => setProfileData({ ...profileData, preferredContact: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        >
                          <option value="WhatsApp">WhatsApp Direct DM (Instant PDF Dispatched)</option>
                          <option value="Phone Call">Direct Phone Call & Technical Briefing</option>
                          <option value="Email">Formal Email Proforma with 15% VAT Breakdown</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Tax Identification Number (TIN) — Optional
                        </label>
                        <input
                          type="text"
                          value={profileData.tinNumber || ''}
                          onChange={(e) => setProfileData({ ...profileData, tinNumber: e.target.value })}
                          placeholder="e.g. 0012345678 (for official VAT invoice)"
                          className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Encrypted & synchronized with DemaQ Client Portal</span>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button
                          type="submit"
                          disabled={savingProfile}
                          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
                        >
                          <Save className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleLaunchFastRFQ}
                          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>⚡ Launch Fast RFQ Now</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
