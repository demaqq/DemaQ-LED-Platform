import React, { useState } from 'react';
import { SiteConfig, PortfolioItem } from '../types';
import { portfolioItems } from '../data/mockData';
import {
  ArrowRight, Calculator, ShieldCheck,
  CheckCircle2, Eye, Wrench, Sparkles, MapPin, Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LazyImage } from './common/LazyImage';

interface HeroProps {
  config: SiteConfig;
  onExploreCalculator: () => void;
  onExploreProducts: () => void;
  onSelectPortfolioForCalc?: (portfolio: PortfolioItem) => void;
  onSelectPortfolioForRFQ?: (portfolio: PortfolioItem) => void;
}

export const Hero: React.FC<HeroProps> = ({
  config,
  onExploreCalculator,
  onExploreProducts,
  onSelectPortfolioForCalc,
  onSelectPortfolioForRFQ
}) => {
  const { theme, t } = useApp();
  const [selectedPortfolioIndex, setSelectedPortfolioIndex] = useState(0);
  const activePortfolio = portfolioItems[selectedPortfolioIndex] || portfolioItems[0];
  const isLight = theme === 'light';

  return (
    <section id="hero" className="relative pt-6 pb-14 md:pt-12 md:pb-20 overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className={`absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[400px] blur-[130px] rounded-full pointer-events-none transition-opacity ${
          isLight
            ? 'bg-gradient-to-b from-cyan-200/30 via-amber-200/20 to-transparent'
            : 'bg-gradient-to-b from-cyan-500/15 via-amber-500/5 to-transparent'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Status & Inventory Kicker - Mobile First */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-mono mb-4 sm:mb-6">
          <span
            className={`flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full border shadow-sm ${
              isLight
                ? 'bg-emerald-100/90 text-emerald-800 border-emerald-300'
                : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80 shadow-emerald-950'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.nav.inStockBadge}</span>
          </span>

          <span className="hidden sm:inline opacity-40">·</span>

          <span
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs ${
              isLight
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-slate-900/80 text-slate-300 border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.nav.certifiedBadge}</span>
          </span>
        </div>

        {/* Display Headline */}
        <div className="max-w-4xl">
          <h1
            className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight font-display leading-[1.15] mb-3 sm:mb-4 [text-wrap:balance] transition-colors ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}
          >
            {t.hero.headline1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400">
              {t.hero.headline2}
            </span>{' '}
            {t.hero.headlineCity}.
          </h1>

          <p
            className={`text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mb-6 font-normal transition-colors ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}
          >
            {t.hero.subhead}
          </p>

          {/* Action Zone - Mobile First Stacked, Desktop Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <button
              onClick={onExploreCalculator}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:from-cyan-300 hover:to-amber-200 rounded-xl transition-all shadow-lg shadow-cyan-500/25 cursor-pointer hover:scale-[1.01]"
            >
              <Calculator className="w-4 h-4 text-slate-950" />
              <span>{t.hero.calcCta}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <a
              href="#ar-visualizer"
              className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold rounded-xl transition-all cursor-pointer border ${
                isLight
                  ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-300 shadow-sm'
                  : 'bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border-cyan-500/60 shadow-md shadow-cyan-950/40'
              }`}
            >
              <Camera className="w-4 h-4 text-cyan-500" />
              <span>{t.hero.arCta}</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 px-1.5 py-0.2 rounded font-mono font-bold">
                AR
              </span>
            </a>

            <a
              href={config.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-xl transition-all cursor-pointer border ${
                isLight
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
                  : 'bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border-emerald-600/70 shadow-md shadow-emerald-950/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>WhatsApp: {config.phone}</span>
            </a>

            <a
              href="#maintenance"
              className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium rounded-xl transition-all cursor-pointer border ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
              }`}
            >
              <Wrench className="w-4 h-4 text-amber-500" />
              <span>{t.nav.maintenance}</span>
            </a>
          </div>

          {/* Hardware Metrics Bar */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 pt-4 sm:pt-6 border-t ${
              isLight ? 'border-slate-200' : 'border-slate-800/80'
            }`}
          >
            <div className={`p-3 rounded-lg border sm:p-0 sm:border-0 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800/60'}`}>
              <div className={`text-xl sm:text-3xl font-extrabold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t.hero.stat1Val}
              </div>
              <div className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                {t.hero.stat1Lbl}
              </div>
            </div>
            <div className={`p-3 rounded-lg border sm:p-0 sm:border-0 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800/60'}`}>
              <div className={`text-xl sm:text-3xl font-extrabold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t.hero.stat2Val}
              </div>
              <div className="text-[11px] sm:text-xs text-cyan-600 dark:text-cyan-300 font-mono mt-0.5">
                {t.hero.stat2Lbl}
              </div>
            </div>
            <div className={`p-3 rounded-lg border sm:p-0 sm:border-0 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800/60'}`}>
              <div className={`text-xl sm:text-3xl font-extrabold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t.hero.stat3Val}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {t.hero.stat3Lbl}
              </div>
            </div>
            <div className={`p-3 rounded-lg border sm:p-0 sm:border-0 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800/60'}`}>
              <div className={`text-xl sm:text-3xl font-extrabold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t.hero.stat4Val}
              </div>
              <div className="text-[11px] sm:text-xs text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                {t.hero.stat4Lbl}
              </div>
            </div>
          </div>
        </div>

        {/* HERO PORTFOLIO SHOWCASE SECTION */}
        <div id="hero-portfolios" className="mt-12 sm:mt-16 scroll-mt-24">
          <span id="portfolios" className="scroll-mt-24 block" />
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
            <div>
              <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.hero.featuredWork}</span>
              </div>
              <h2 className={`text-base sm:text-lg font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t.hero.viewAllWork || 'Featured LED Screen Deployments by DemaQ'}
              </h2>
            </div>
            <div className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t.hero.clientReview || 'Addis Ababa & Regional Turnkey Projects'}
            </div>
          </div>

          {/* Portfolio Tabs Navigation (Mobile Horizontally Scrollable) */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
            {portfolioItems.map((item, index) => {
              const isActive = index === selectedPortfolioIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedPortfolioIndex(index)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? isLight
                        ? 'bg-cyan-100 text-cyan-900 border border-cyan-400 font-bold shadow-sm'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : isLight
                      ? 'bg-slate-100 text-slate-600 border border-slate-300 hover:text-slate-900'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-500 animate-ping' : 'bg-slate-400 dark:bg-slate-600'}`} />
                  <span className="font-semibold">{item.category}</span>
                  <span className="text-[10px] opacity-75 hidden sm:inline">({item.location.split(',')[0]})</span>
                </button>
              );
            })}
          </div>

          {/* Active Portfolio Hero Display Card */}
          <div
            className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
              isLight
                ? 'border-slate-300/80 bg-white/80 backdrop-blur-xl text-slate-900 shadow-2xl shadow-slate-900/12 ring-1 ring-slate-900/5'
                : 'border-slate-800 bg-slate-950 text-slate-100 shadow-2xl shadow-black/80'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Media Carrier (8 Cols on Desktop) */}
              <div className={`lg:col-span-8 relative aspect-[16/9] lg:aspect-auto lg:h-[460px] w-full overflow-hidden ${
                isLight ? 'bg-slate-100' : 'bg-slate-900'
              }`}>
                <LazyImage
                  src={activePortfolio.image}
                  alt={activePortfolio.title}
                  aspectRatio="16/9"
                  priority={true}
                  className="w-full h-full lg:h-[460px]"
                  imgClassName="transition-all duration-700"
                />
                <div
                  className={`absolute inset-0 pointer-events-none ${
                    isLight
                      ? 'bg-gradient-to-t from-black/30 via-transparent to-transparent'
                      : 'bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/80'
                  }`}
                />

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-950/90 backdrop-blur-md text-cyan-300 text-xs font-mono font-bold rounded-lg border border-cyan-800/80 shadow-md">
                    {activePortfolio.category}
                  </span>
                  <span className="px-3 py-1 bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-xs font-mono font-semibold rounded-lg border border-emerald-800/80 shadow-md">
                    {activePortfolio.metric}
                  </span>
                </div>
              </div>

              {/* Technical Telemetry & Specifications Panel */}
              <div
                className={`lg:col-span-4 p-5 sm:p-6 lg:p-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l ${
                  isLight
                    ? 'bg-white/70 backdrop-blur-md border-slate-200'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 font-mono mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{activePortfolio.venue} · {activePortfolio.location}</span>
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {activePortfolio.title}
                    </h3>
                  </div>

                  {/* Hardware Spec HUD */}
                  <div
                    className={`space-y-2.5 pt-3 border-t text-xs font-mono ${
                      isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className={`flex justify-between items-center py-1.5 border-b ${isLight ? 'border-slate-100' : 'border-slate-900'}`}>
                      <span className="text-slate-600 dark:text-slate-400">Screen Size</span>
                      <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {activePortfolio.screenSize}
                      </span>
                    </div>
                    <div className={`flex justify-between items-center py-1.5 border-b ${isLight ? 'border-slate-100' : 'border-slate-900'}`}>
                      <span className="text-slate-600 dark:text-slate-400">Pixel Pitch</span>
                      <span className="text-cyan-600 dark:text-cyan-300 font-bold">{activePortfolio.pitch}</span>
                    </div>
                    <div className={`flex justify-between items-center py-1.5 border-b ${isLight ? 'border-slate-100' : 'border-slate-900'}`}>
                      <span className="text-slate-600 dark:text-slate-400">Supported System</span>
                      <span className={isLight ? 'text-slate-900 font-semibold' : 'text-slate-200'}>NovaStar & Huidu Certified</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-600 dark:text-slate-400">Key Advantage</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">{activePortfolio.metric}</span>
                    </div>
                  </div>
                </div>

                {/* Portfolio CTAs */}
                <div className="pt-6 space-y-2">
                  <button
                    onClick={() => {
                      if (onSelectPortfolioForCalc) {
                        onSelectPortfolioForCalc(activePortfolio);
                      } else {
                        onExploreCalculator();
                      }
                    }}
                    className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{t.hero.calcCta || 'Launch Wall Calculator'}</span>
                  </button>

                  <a
                    href={`https://wa.me/251942992799?text=${encodeURIComponent(
                      `Hello DEMAQ! I am inquiring about the ${activePortfolio.title} (${activePortfolio.screenSize}, ${activePortfolio.pitch}). Could you provide quotation details for my project?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer border ${
                      isLight
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border-emerald-700/60'
                    }`}
                  >
                    <span>{t.nav.directCall || 'Inquire via WhatsApp'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Thumbnail switcher bar at the bottom */}
            <div
              className={`p-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-2 ${
                isLight ? 'bg-slate-100/60 backdrop-blur-md border-slate-300/70' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {portfolioItems.map((item, idx) => {
                const isSelected = idx === selectedPortfolioIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPortfolioIndex(idx)}
                    className={`p-2 rounded-lg text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? isLight
                          ? 'bg-white/95 border-2 border-cyan-500 shadow-md ring-1 ring-cyan-500/20'
                          : 'bg-slate-800 border border-cyan-500/60'
                        : isLight
                        ? 'bg-white/70 backdrop-blur-xs border border-slate-300/80 hover:border-slate-400 hover:bg-white/90 shadow-xs'
                        : 'bg-slate-950/50 border border-transparent hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-md shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className={`text-[11px] font-bold truncate font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {item.title}
                      </div>
                      <div className="text-[9px] text-cyan-600 dark:text-cyan-400 font-mono truncate">
                        {item.pitch.split(' ')[0]} · {item.category}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
