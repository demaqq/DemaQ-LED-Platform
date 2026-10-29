import React from 'react';
import { SiteConfig } from '../types';
import { DemaqLogo } from './DemaqLogo';
import { useApp } from '../context/AppContext';

interface LEDFooterProps {
  config: SiteConfig;
  onNavigate: (sectionId: string) => void;
  onOpenPortal?: () => void;
}

export const LEDFooter: React.FC<LEDFooterProps> = ({ config, onNavigate, onOpenPortal }) => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  return (
    <footer className={`border-t py-16 transition-colors duration-200 ${
      isLight ? 'bg-white border-slate-200 text-slate-600' : 'border-slate-800/80 bg-slate-950 text-slate-400'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Col (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <DemaqLogo size="md" showText={true} theme={theme} />
            </div>
            <p className={`text-xs max-w-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t.footer?.tagline || 'Premier provider of commercial LED video wall displays, armored GOB screens, touring rental panels, and custom-imported Flip-Chip COB Micro-LED systems in Ethiopia.'}
            </p>
            <div className="text-xs font-mono">
              {config.location}
            </div>
            <div className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">
              {config.certifications} · {config.warrantyPeriod}
            </div>
          </div>

          {/* In-Stock & Custom Products (3 cols) */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              {t.footer?.seriesTitle || 'Hardware Series'}
            </div>
            <div>
              <button onClick={() => onNavigate('products')} className="text-emerald-600 dark:text-emerald-400 hover:underline transition-colors cursor-pointer flex items-center gap-1">
                <span>Shield-GOB P2.5/P3.0</span>
                <span className="text-[10px] bg-emerald-500/20 px-1 rounded font-mono">{t.search?.categories?.inStock || 'In-Stock'}</span>
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('products')} className="text-emerald-600 dark:text-emerald-400 hover:underline transition-colors cursor-pointer flex items-center gap-1">
                <span>Apex-Rental P2.6/P3.9</span>
                <span className="text-[10px] bg-emerald-500/20 px-1 rounded font-mono">{t.search?.categories?.inStock || 'In-Stock'}</span>
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('products')} className="text-emerald-600 dark:text-emerald-400 hover:underline transition-colors cursor-pointer flex items-center gap-1">
                <span>Horizon-DOOH P3.9-P10</span>
                <span className="text-[10px] bg-emerald-500/20 px-1 rounded font-mono">{t.search?.categories?.inStock || 'In-Stock'}</span>
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('products')} className="text-cyan-600 dark:text-cyan-300 hover:underline transition-colors cursor-pointer flex items-center gap-1">
                <span>Nova-Pitch COB (P0.78-P1.87)</span>
                <span className="text-[10px] bg-cyan-500/20 px-1 rounded font-mono">Import</span>
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('products')} className="text-cyan-600 dark:text-cyan-300 hover:underline transition-colors cursor-pointer flex items-center gap-1">
                <span>Cinema-XR Studio Volumes</span>
                <span className="text-[10px] bg-cyan-500/20 px-1 rounded font-mono">Import</span>
              </button>
            </div>
          </div>

          {/* Tools & Resources (3 cols) */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              {t.footer?.toolsTitle || 'Engineering Tools'}
            </div>
            <div>
              <button onClick={() => onNavigate('ai-architect')} className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer">
                ✨ {t.nav?.aiArchitect || 'AI Venue Engineering Architect'}
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('comparison-matrix')} className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer">
                ⚖️ {t.nav?.comparison || 'Side-by-Side Model Comparison'}
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('calculator')} className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer">
                📐 {t.nav?.calculator || 'LED Video Wall Calculator'}
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('ar-visualizer')} className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer">
                📷 {t.nav?.arVisualizer || 'Augmented Reality (AR) Camera Tool'}
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('pixel-pitch-visualizer')} className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer">
                👁️ {t.nav?.distanceVisualizer || 'Viewing Distance Acuity Simulator'}
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('sector-journeys')} className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer">
                🏢 Industry Sector Journeys
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('venue-visualizer')} className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer">
                🎚️ Before & After Venue Visualizer
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('proforma-matrix')} className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer">
                📄 Commercial Proforma Generator
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('maintenance')} className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer">
                🔧 {t.nav?.maintenance || 'Emergency Screen Repair Portal'}
              </button>
            </div>
            {onOpenPortal && (
              <div>
                <button onClick={onOpenPortal} className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline transition-colors cursor-pointer flex items-center gap-1 font-mono">
                  🛡️ Secure Client Portal (Quotes & My Profile)
                </button>
              </div>
            )}

          </div>

          {/* Social Channels & Contact (2 cols) */}
          <div className="md:col-span-2 space-y-2 text-xs">
            <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              {t.footer?.connectTitle || 'Connect'}
            </div>
            <div>
              <a href={config.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors block">
                WhatsApp: +251 942 992 799
              </a>
            </div>
            <div>
              <a href={config.telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors block">
                Telegram: @demaqdigital
              </a>
            </div>
            <div>
              <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors block">
                Instagram: @demaq_digital
              </a>
            </div>
            <div>
              <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors block">
                Facebook: DemaQ Digital
              </a>
            </div>
            <div>
              <a href={config.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors block">
                TikTok: @demaqdigital
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-500'
        }`}>
          <div>
            {t.common.copyright}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('hero')}
              className="hover:underline cursor-pointer"
            >
              {t.footer?.backToTop || 'Back to Top ↑'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
