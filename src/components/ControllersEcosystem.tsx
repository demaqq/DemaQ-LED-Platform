import React from 'react';
import { supportedControllers } from '../data/mockData';
import { Cpu, CheckCircle2, Wrench, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ControllersEcosystem: React.FC = () => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  return (
    <section
      id="controllers"
      className={`py-20 border-t transition-colors duration-200 ${
        isLight ? 'bg-slate-100/60 border-slate-200 text-slate-800' : 'bg-slate-900/40 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider">
            {t.nav.controllers || 'Supported Processing & Control Hardware'}
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.controllers.title}
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {t.controllers.subtitle}
          </p>
        </div>

        {/* Controllers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {supportedControllers.map((ctrl, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl flex flex-col justify-between transition-all border shadow-sm group ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md text-slate-800'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-700'
                  } ${ctrl.accent}`}>
                    {ctrl.logoText}
                  </span>
                  <Cpu className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                </div>

                <h3 className={`text-base font-bold font-display mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {ctrl.name}
                </h3>
                <div className="text-xs text-amber-500 font-mono mb-2">{ctrl.tagline}</div>
                <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  {ctrl.description}
                </p>
              </div>

              <div className={`mt-4 pt-3 border-t text-[11px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5 ${
                isLight ? 'border-slate-100' : 'border-slate-800/80'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.controllers?.certifiedBadge || 'Certified Programming'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Local Services Banner */}
        <div className={`mt-8 p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-100'
        }`}>
          <div className="space-y-1">
            <div className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Wrench className="w-4 h-4 text-cyan-500" />
              <span>{t.controllers?.supportBannerTitle || 'Need Controller Setup, Mapping File Recovery, or On-Site Calibration in Ethiopia?'}</span>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {t.controllers?.supportBannerDesc || 'Our engineers calibrate color uniformity, re-program disconnected receiving cards, and replace burned sender chips on-site anywhere in Addis Ababa.'}
            </p>
          </div>

          <a
            href="https://wa.me/251942992799"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shrink-0 text-center transition-colors shadow-xs"
          >
            {t.controllers?.supportBtn || 'WhatsApp Controller Desk'}
          </a>
        </div>
      </div>
    </section>
  );
};
