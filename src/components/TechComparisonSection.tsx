import React from 'react';
import { Shield, Sparkles, Cpu, Check, Clock, Truck, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TechComparisonSection: React.FC = () => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  return (
    <section
      id="technology-guide"
      className={`py-20 sm:py-24 border-t transition-colors duration-200 ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider">
            {t.nav.techGuide || 'Technology Architecture Guide'}
          </div>
          <h2 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.tech.title}
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {t.tech.subtitle}
          </p>
        </div>

        {/* 3 Columns Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {/* Card 1: GOB (In-Stock) */}
          <div className={`p-6 sm:p-7 rounded-2xl relative flex flex-col justify-between border-2 transition-all ${
            isLight
              ? 'bg-white border-cyan-500 shadow-xl shadow-cyan-900/10 ring-1 ring-cyan-500/20'
              : 'bg-slate-950 border-cyan-500/80 shadow-xl shadow-cyan-950/40'
          }`}>
            {/* Badge */}
            <div className="absolute -top-3 left-6 bg-cyan-500 text-slate-950 text-[10px] font-extrabold font-mono px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {t.tech.gobBadge}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-600 dark:text-cyan-300">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {t.tech.gobTitle}
                  </h3>
                  <div className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">P2.5 & Above In-Stock</div>
                </div>
              </div>

              <p className={`text-xs leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {t.tech.gobDesc}
              </p>

              {/* Status Banner */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-6 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 font-mono">
                <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t.calc?.fastDispatch || 'In-Stock: Fast 24-48h Dispatch'}</span>
              </div>

              <div className={`space-y-2.5 text-xs border-t pt-5 mb-6 ${
                isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>{t.tech?.gobAntiCollision || '100% Anti-Collision: Resists knocks, accidental bumps, and public contact.'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>{t.tech?.gobMoisture || 'Moisture & Dust Sealed: Front surface can be wiped clean with microfiber.'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>{t.tech?.gobCostEffective || 'Cost-Effective: Delivers robust durability at a fraction of COB manufacturing costs.'}</span>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-[11px] font-mono ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}>
              {t.tech?.gobBest || 'Best For: Ethiopian Churches, Retail Malls, Supermarkets, Banquet Halls'}
            </div>
          </div>

          {/* Card 2: COB (Flip-Chip Micro-LED) */}
          <div className={`p-6 sm:p-7 rounded-2xl relative flex flex-col justify-between border-2 transition-all ${
            isLight
              ? 'bg-white border-amber-500 shadow-xl shadow-amber-900/10 ring-1 ring-amber-500/20'
              : 'bg-slate-950 border-amber-500/60 shadow-xl shadow-black/50'
          }`}>
            <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-extrabold font-mono px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {t.tech.cobBadge}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {t.tech.cobTitle}
                  </h3>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-mono">&lt;P2.5 Custom Import</div>
                </div>
              </div>

              <p className={`text-xs leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {t.tech.cobDesc}
              </p>

              {/* Status Banner */}
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl mb-6 flex items-center gap-2.5 text-xs text-cyan-700 dark:text-cyan-300 font-mono">
                <Clock className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>{t.tech?.cobAirTime || t.calc?.customImportTime || 'Custom Order: 14 - 21 Days Air Cargo'}</span>
              </div>

              <div className={`space-y-2.5 text-xs border-t pt-5 mb-6 ${
                isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{t.tech?.cobContrast || '10,000:1 True Black: Deepest cinematic contrast with zero gold bonding wires.'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{t.tech?.cobCold || 'Cold Screen Technology: Operates 12°C cooler for 24/7 continuous operation.'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{t.tech?.cobPitch || 'Ultra-Fine Pitches: Flawless pixel pitch from P0.78mm to P1.87mm.'}</span>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-[11px] font-mono ${
              isLight ? 'bg-slate-100/70 border-slate-300 shadow-xs text-slate-800' : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}>
              {t.tech?.cobBest || 'Best For: Banking Command Centers, Executive Boardrooms, Television Studios'}
            </div>
          </div>

          {/* Card 3: Standard SMD */}
          <div className={`p-6 sm:p-7 rounded-2xl relative flex flex-col justify-between border transition-all ${
            isLight
              ? 'bg-white border-slate-300/80 shadow-xl shadow-slate-900/8 text-slate-800 ring-1 ring-slate-900/5'
              : 'bg-slate-950 border-slate-800 text-slate-100 shadow-xl shadow-black/50'
          }`}>
            <div className={`absolute -top-3 left-6 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
              isLight ? 'bg-slate-100 text-slate-800 border-slate-300 shadow-2xs' : 'bg-slate-900 text-slate-300 border-slate-700'
            }`}>
              {t.tech.smdBadge}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="p-2.5 bg-slate-500/10 rounded-xl border border-slate-500/20 text-slate-700 dark:text-slate-300">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {t.tech.smdTitle}
                  </h3>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-mono font-semibold">Touring & Billboards</div>
                </div>
              </div>

              <p className={`text-xs leading-relaxed mb-6 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {t.tech.smdDesc}
              </p>

              {/* Status Banner */}
              <div className={`p-3 rounded-xl border mb-6 flex items-center gap-2.5 text-xs font-mono ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-800 font-medium' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t.tech?.smdStaging || 'Standard Staging & Outdoor Fast Assembly'}</span>
              </div>

              <div className={`space-y-2.5 text-xs border-t pt-5 mb-6 ${
                isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>{t.tech?.smdBright || 'High Brightness: Up to 10,000 Nits for outdoor full daylight viewability.'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>{t.tech?.smdMaint || 'Fast Maintenance: Individual SMD diodes can be serviced via hot-air solder.'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>{t.tech?.smdCost || 'Cost Leader: Optimal cost for large square footage exterior displays.'}</span>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-[11px] font-mono ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}>
              {t.tech?.smdBest || 'Best For: Outdoor Highway Billboards, Stadium Scoreboards, Concert Staging'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
