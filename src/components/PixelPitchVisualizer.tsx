import React, { useState } from 'react';
import { Eye, Info, CheckCircle2, AlertTriangle, Monitor, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PixelPitchVisualizer: React.FC = () => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';
  const [distanceM, setDistanceM] = useState<number>(3.5);

  const PITCH_LIST = [
    { pitch: 'P0.93', mm: 0.93, minM: 0.9, optM: 2.3, name: 'Micro-LED COB' },
    { pitch: 'P1.25', mm: 1.25, minM: 1.2, optM: 3.1, name: 'LMini Boardroom' },
    { pitch: 'P1.95', mm: 1.95, minM: 2.0, optM: 4.8, name: 'Matrix XR Studio' },
    { pitch: 'P2.60', mm: 2.60, minM: 2.6, optM: 6.5, name: 'Venom Stage Rental' },
    { pitch: 'P4.81', mm: 4.81, minM: 4.8, optM: 12.0, name: 'Titan Outdoor DOOH' },
    { pitch: 'P10.0', mm: 10.0, minM: 10.0, optM: 25.0, name: 'Highway Billboard' },
  ];

  return (
    <section id="pixel-pitch-visualizer" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mb-12">
        <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider">
          05. {t.distance.tag}
        </div>
        <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight [text-wrap:balance] ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          {t.distance.title}
        </h2>
        <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
          isLight ? 'text-slate-600' : 'text-slate-300'
        }`}>
          {t.distance.subtitle}
        </p>
      </div>

      <div className={`border rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100 shadow-2xl'
      }`}>
        {/* Interactive Distance Slider */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-500" />
              <span className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t.distance?.sliderTitle || 'Viewer-to-Screen Distance Simulator'}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono tabular-nums">
              {distanceM.toFixed(1)} Meters ({Math.round(distanceM * 3.28084)} Feet)
            </div>
          </div>

          <input
            type="range"
            min={0.8}
            max={25.0}
            step={0.2}
            value={distanceM}
            onChange={(e) => setDistanceM(parseFloat(e.target.value))}
            className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />

          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>0.8m (Desk / Boardroom)</span>
            <span>5m (Control Room / Retail)</span>
            <span>12m (Auditorium / Stage)</span>
            <span>25m (Outdoor Plaza / Highway)</span>
          </div>
        </div>

        {/* Matrix of Pitches under current distance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PITCH_LIST.map((p) => {
            const isOptimum = distanceM >= p.minM && distanceM <= p.optM * 1.5;
            const isTooClose = distanceM < p.minM;
            const isFarther = distanceM > p.optM * 1.5;

            return (
              <div
                key={p.pitch}
                className={`p-4 rounded-xl border transition-all ${
                  isOptimum
                    ? isLight
                      ? 'bg-cyan-50 border-cyan-400 shadow-xs'
                      : 'bg-cyan-950/40 border-cyan-500/80 shadow-md'
                    : isTooClose
                    ? isLight
                      ? 'bg-rose-50/70 border-rose-300'
                      : 'bg-rose-950/20 border-rose-900/50'
                    : isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-900/40 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-bold font-mono text-cyan-600 dark:text-cyan-400">
                    {p.pitch}
                  </div>
                  {isOptimum ? (
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{t.distance?.retinalClarity || 'Retinal Clarity'}</span>
                    </span>
                  ) : isTooClose ? (
                    <span className="text-[10px] font-mono bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                      <span>{t.distance?.pixelated || 'Pixelated'}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                      {t.distance?.excessDensity || 'Excess Density'}
                    </span>
                  )}
                </div>

                <div className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'} mb-1`}>
                  {p.name}
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono space-y-0.5">
                  <div>{t.distance?.minDistLabel || 'Min Distance:'} {p.minM}m</div>
                  <div>{t.distance?.optimalAcuityLabel || 'Optimal Acuity:'} {p.optM}m</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
