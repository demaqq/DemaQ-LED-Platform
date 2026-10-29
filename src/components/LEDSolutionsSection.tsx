import React from 'react';
import { LEDSolution } from '../types';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LazyImage } from './common/LazyImage';

interface LEDSolutionsSectionProps {
  solutions: LEDSolution[];
  onSelectSolution: (solutionTitle: string) => void;
}

export const LEDSolutionsSection: React.FC<LEDSolutionsSectionProps> = ({
  solutions,
  onSelectSolution
}) => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  return (
    <section
      id="solutions"
      className={`py-20 sm:py-24 border-t transition-colors duration-200 ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/40 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider">
            04. {t.solutions.tag}
          </div>
          <h2 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.solutions.title}
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {t.solutions.subtitle}
          </p>
        </div>

        {/* Bento Solutions Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              className={`rounded-2xl overflow-hidden flex flex-col justify-between transition-all border group ${
                isLight
                  ? 'bg-white border-slate-300/80 shadow-lg shadow-slate-900/8 hover:shadow-2xl hover:shadow-slate-900/15 hover:border-slate-400 text-slate-900 ring-1 ring-slate-900/5'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-100 shadow-xl shadow-black/50'
              }`}
            >
              <div>
                {/* Visual Header */}
                <div className={`relative aspect-[16/9] w-full overflow-hidden ${
                  isLight ? 'bg-slate-100' : 'bg-slate-950'
                }`}>
                  <LazyImage
                    src={sol.image}
                    alt={sol.title}
                    aspectRatio="16/9"
                    imgClassName="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 pointer-events-none ${
                    isLight
                      ? 'bg-gradient-to-t from-black/35 via-transparent to-transparent'
                      : 'bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent'
                  }`} />

                  <div className="absolute bottom-3 left-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-cyan-300 px-2.5 py-0.5 bg-slate-950/85 backdrop-blur-md rounded-lg border border-slate-800">
                      Pitch: {sol.recommendedPitch}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-300 px-2 py-0.5 bg-emerald-950/80 backdrop-blur-md rounded-lg border border-emerald-800">
                      {sol.availabilityNote}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <h3 className={`text-xl font-bold font-display mb-1 transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-300'
                  }`}>
                    {sol.title}
                  </h3>
                  <div className="text-xs text-cyan-600 dark:text-cyan-400 font-mono mb-3 font-semibold">{sol.subtitle}</div>
                  <p className={`text-sm leading-relaxed mb-6 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {sol.description}
                  </p>

                  <div className={`p-4 rounded-xl border mb-6 text-xs font-mono space-y-1.5 ${
                    isLight ? 'bg-slate-100/70 border-slate-300 shadow-xs text-slate-800' : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                  }`}>
                    <div className="text-cyan-600 dark:text-cyan-400 font-bold uppercase text-[10px] tracking-wider mb-2">
                      {t.solutions?.deliverablesTitle || 'Key Technical Deliverables:'}
                    </div>
                    {sol.features.map((spec: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`p-6 sm:p-7 pt-0 border-t ${isLight ? 'border-slate-100' : 'border-slate-800/80'}`}>
                <button
                  onClick={() => onSelectSolution(sol.title)}
                  className={`mt-4 w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  <span>{t.solutions?.configureBtn || t.solutions.learnMore}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
