import React, { useState, useRef, useEffect } from 'react';
import { SiteConfig } from '../types';
import {
  Sliders, Calculator, Phone, Wrench, FileText,
  Sparkles, BookOpen, ChevronDown, Layers, Eye, Cpu, Briefcase, Camera,
  Sun, Moon, Check, ArrowRight, Search, Monitor, ShieldCheck, User as UserIcon
} from 'lucide-react';
import { DemaqLogo } from './DemaqLogo';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { auth, User } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  config: SiteConfig;
  onOpenPortal?: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onOpenPortal,
  onNavigate,
  onOpenSearch
}) => {
  const { language, setLanguage, theme, toggleTheme, t } = useApp();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeNavId, setActiveNavId] = useState<string>('ai-architect');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  // Listen to Firebase Auth state for displaying user profile badge
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (langDropdownRef.current && !langDropdownRef.current.contains(target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleNavClick = (id: string) => {
    if (id === 'client-portal') {
      if (onOpenPortal) onOpenPortal();
      setLangDropdownOpen(false);
      return;
    }
    setActiveNavId(id);
    onNavigate(id);
    setLangDropdownOpen(false);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const NAV_ITEMS = [
    { id: 'ai-architect', label: t.nav?.aiArchitect || 'AI Architect', icon: Sparkles, color: 'text-amber-500' },
    { id: 'sector-journeys', label: 'Sector Journeys', icon: Briefcase, color: 'text-amber-400' },
    { id: 'comparison-matrix', label: t.nav?.comparison || 'Spec Comparison', icon: Layers, color: 'text-cyan-500' },
    { id: 'calculator', label: t.nav?.calculator || 'Wall Calculator', icon: Calculator, color: 'text-teal-500' },
    { id: 'venue-visualizer', label: 'Before & After', icon: Eye, color: 'text-cyan-400' },
    { id: 'ar-visualizer', label: t.nav?.arVisualizer || 'AR Studio', icon: Camera, color: 'text-sky-500' },
    { id: 'products', label: t.nav?.products || 'Products & Stock', icon: Monitor, color: 'text-blue-500' },
    { id: 'controllers', label: t.nav?.controllers || 'Controllers Ecosystem', icon: Cpu, color: 'text-purple-500' },
    { id: 'solutions', label: t.solutions?.title || 'Solutions', icon: Briefcase, color: 'text-indigo-500' },
    { id: 'pixel-pitch-visualizer', label: t.nav?.distanceVisualizer || 'Acuity Simulator', icon: Eye, color: 'text-emerald-500' },
    { id: 'proforma-matrix', label: 'Proforma Generator', icon: FileText, color: 'text-emerald-400' },
    { id: 'maintenance', label: t.nav?.maintenance || 'Maintenance', icon: Wrench, color: 'text-orange-500' },
    { id: 'case-studies', label: t.nav?.caseStudies || 'Case Studies', icon: ShieldCheck, color: 'text-cyan-400' },
    { id: 'blog', label: t.nav?.blog || 'Technical Guide', icon: BookOpen, color: 'text-slate-400' },
    { id: 'rfq', label: t.nav?.rfq || 'Get Quote', icon: ArrowRight, color: 'text-emerald-400' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-xl transition-all duration-200 border-b ${
        isLight
          ? 'bg-white/75 border-slate-300/70 text-slate-900 shadow-[0_4px_24px_rgba(15,23,42,0.06)]'
          : 'bg-slate-950/95 border-slate-800 text-slate-100 shadow-lg shadow-black/30'
      }`}
    >
      {/* Micro Status Bar (Ethiopia Nationwide Coverage & Direct Hotline) */}
      <div
        className={`px-3 sm:px-6 lg:px-8 py-1 text-[11px] font-mono flex items-center justify-between border-b transition-colors ${
          isLight
            ? 'bg-slate-100/60 backdrop-blur-md border-slate-200/60 text-slate-700'
            : 'bg-slate-900/90 border-slate-800/80 text-slate-400'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs">Nationwide Ethiopia Deployment</span>
          </span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden md:inline text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] truncate">
            In-Stock P2.5+ GOB & Custom Import Sub-P2.5 COB
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={config.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity flex items-center gap-1 font-semibold text-[10px] sm:text-[11px]"
          >
            <Phone className="w-3 h-3" />
            <span className="hidden sm:inline">WhatsApp / Call:</span>
            <span>{config.phone}</span>
          </a>
        </div>
      </div>

      {/* Main Navbar Header Row */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4 relative">
        {/* Left: Brand with Minimized DemaQ Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('hero');
            }}
            className="hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1 sm:gap-1.5"
            aria-label="DemaQ Digital Solution"
          >
            <DemaqLogo size="sm" showText={true} theme={theme} />
            <span className="hidden md:inline-block text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Ethiopia
            </span>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => handleNavClick('ai-architect')}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavId === 'ai-architect'
                ? isLight
                  ? 'bg-amber-500/15 text-amber-900 font-bold border border-amber-500/40'
                  : 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.nav?.aiArchitect || 'AI Architect'}</span>
          </button>

          <button
            onClick={() => handleNavClick('comparison-matrix')}
            className={`px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeNavId === 'comparison-matrix'
                ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/30'
                : isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-500" />
            <span>{t.nav?.comparison || 'Spec Comparison'}</span>
          </button>

          <button
            onClick={() => handleNavClick('calculator')}
            className={`px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeNavId === 'calculator'
                ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/30'
                : isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-teal-500" />
            <span>{t.nav?.calculator || 'Wall Calculator'}</span>
          </button>

          <button
            onClick={() => handleNavClick('ar-visualizer')}
            className={`px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeNavId === 'ar-visualizer'
                ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold border border-sky-500/30'
                : isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-sky-500" />
            <span>{t.nav?.arVisualizer || 'AR Visualizer'}</span>
          </button>

          <button
            onClick={() => handleNavClick('products')}
            className={`px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
              activeNavId === 'products'
                ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold border border-blue-500/30'
                : isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            {t.nav?.products || 'Products'}
          </button>
        </nav>

        {/* Right Action Controls: Admin, Search, Language, Theme, Get Quote */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 flex-nowrap">
          {/* Client Portal Button */}
          <button
            onClick={onOpenPortal}
            className={`h-8 sm:h-9 px-2 sm:px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 relative ${
              isLight
                ? 'bg-cyan-50 hover:bg-cyan-100 border-cyan-300 text-cyan-900 shadow-xs font-bold'
                : 'bg-cyan-950/60 hover:bg-cyan-900/80 border-cyan-500/50 text-cyan-300 font-bold'
            }`}
            title="Open Client Portal & Order Tracker"
            aria-label="Client Portal"
          >
            <UserIcon className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span className="hidden sm:inline font-bold">Client Portal</span>
            {currentUser && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>



          {/* Quick Search Button (Hidden on very small screens to give room to Get Quote) */}
          <button
            onClick={onOpenSearch}
            className={`hidden xs:flex h-8 sm:h-9 px-1.5 sm:px-2 rounded-xl border text-xs font-semibold items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 ${
              isLight
                ? 'bg-white/70 hover:bg-white/95 backdrop-blur-md border-slate-300/80 text-slate-800 shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
            title="Search Products, Tools & Specs (Cmd+K)"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <kbd className="hidden lg:inline-flex items-center px-1 py-0.2 rounded text-[9px] font-mono border bg-slate-200/60 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative shrink-0" ref={langDropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLangDropdownOpen(!langDropdownOpen);
              }}
              className={`h-8 sm:h-9 px-1.5 sm:px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white/70 hover:bg-white/95 backdrop-blur-md border-slate-300/80 text-slate-800 shadow-xs'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
              title="Change Language"
              aria-label="Change Language"
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="font-mono uppercase text-[10px] hidden sm:inline">{currentLangObj.code}</span>
              <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 opacity-60 ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl p-2 z-[100] border animate-in fade-in slide-in-from-top-2 ${
                  isLight
                    ? 'bg-white/85 backdrop-blur-2xl border-white/70 text-slate-900 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5'
                    : 'bg-slate-950/95 backdrop-blur-xl border-slate-800 text-slate-100 shadow-black/80'
                }`}
              >
                <div className="px-2.5 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                  Select Language / ቋንቋ ይምረጡ
                </div>
                <div className="space-y-1 mt-1">
                  {SUPPORTED_LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLanguage(item.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        language === item.code
                          ? isLight
                            ? 'bg-cyan-50 text-cyan-800 font-bold border border-cyan-200'
                            : 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                          : isLight
                          ? 'hover:bg-slate-100 text-slate-700'
                          : 'hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{item.flag}</span>
                        <div className="text-left leading-tight">
                          <div className="font-bold">{item.nativeName}</div>
                          <div className="text-[10px] opacity-60 font-mono">{item.name} ({item.region})</div>
                        </div>
                      </div>
                      {language === item.code && <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 active:scale-90 ${
              isLight
                ? 'bg-white/70 hover:bg-white/95 backdrop-blur-md border-slate-300/80 text-amber-600 shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-400'
            }`}
            title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
            aria-label="Toggle Theme"
          >
            <span className="transition-transform duration-300 inline-flex items-center justify-center">
              {isLight ? (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-in fade-in duration-200" />
              ) : (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-in fade-in duration-200" />
              )}
            </span>
          </button>

          {/* Perfectly Aligned Direct RFQ CTA Button */}
          <button
            onClick={() => handleNavClick('rfq')}
            className="h-8 sm:h-9 px-2.5 sm:px-4 rounded-xl bg-gradient-to-r from-amber-500 via-cyan-500 to-blue-600 text-slate-950 font-extrabold text-[11px] sm:text-xs shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer shrink-0 inline-flex items-center justify-center gap-1 leading-none select-none"
          >
            <span className="whitespace-nowrap">{t.nav?.rfq || 'Get Quote'}</span>
            <ArrowRight className="w-3 h-3 hidden sm:inline" />
          </button>
        </div>
      </div>

      {/* Horizontal Navigation Strip (Touch-Optimized with smooth touch scroll and crisp active indicator) */}
      <div
        className={`px-3 sm:px-6 lg:px-8 py-1.5 border-t overflow-x-auto flex items-center gap-1.5 scrollbar-none text-xs transition-colors ${
          isLight ? 'bg-white/60 backdrop-blur-md border-slate-200/80' : 'bg-slate-900/60 border-slate-800/80'
        }`}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNavId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium text-[11px] transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                isActive
                  ? isLight
                    ? 'bg-cyan-600 border-cyan-600 text-white font-bold shadow-xs'
                    : 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold'
                  : isLight
                  ? 'bg-white/70 hover:bg-white backdrop-blur-xs border-slate-300/70 text-slate-800 hover:text-cyan-700 shadow-2xs'
                  : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <Icon className={`w-3 h-3 ${isActive ? 'text-white' : item.color}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
