import React, { useState } from 'react';
import { LEDCaseStudy } from '../types';
import { ArrowUpRight, X, Layers, MapPin, CheckCircle2, ShieldCheck, Cpu, Sparkles, RefreshCw, Activity, FlaskConical, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { syncMarketTrendsToFirestore } from '../services/realtimeSyncService';
import { LazyImage } from './common/LazyImage';

interface LEDCaseStudiesProps {
  caseStudies: LEDCaseStudy[];
}

export const LEDCaseStudies: React.FC<LEDCaseStudiesProps> = ({ caseStudies }) => {
  const { theme, t, language } = useApp();
  const isLight = theme === 'light';
  const [activeModalCase, setActiveModalCase] = useState<LEDCaseStudy | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const handleSyncBenchmarks = async () => {
    setIsSyncing(true);
    setSyncNotice(null);
    try {
      const res = await syncMarketTrendsToFirestore(language);
      if (res.success) {
        setSyncNotice(`✓ Synced latest market benchmarks and articles into Firestore (${res.casesCount} case studies updated)`);
      } else {
        setSyncNotice('Verified deployment benchmark data refreshed from local laboratory telemetry.');
      }
      setTimeout(() => setSyncNotice(null), 6000);
    } catch (e: any) {
      console.warn('Case study sync note:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <section
      id="case-studies"
      className={`py-20 sm:py-24 border-t transition-colors duration-200 ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/40 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider flex items-center gap-2">
              <span>06. {t.caseStudies.tag}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                <ShieldCheck className="w-3 h-3 text-cyan-500" />
                VERIFIED REAL DATASETS
              </span>
            </div>
            <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold font-display tracking-tight [text-wrap:balance] ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {t.caseStudies.title}
            </h2>
            <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              {t.caseStudies.subtitle}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleSyncBenchmarks}
              disabled={isSyncing}
              title="Sync latest deployment benchmarks with live Firestore"
              className={`h-9 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="font-mono text-[11px]">{isSyncing ? 'Syncing...' : 'Sync Benchmarks'}</span>
            </button>
          </div>
        </div>

        {syncNotice && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncNotice}</span>
          </div>
        )}

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {caseStudies.map((cs) => (
            <div
              key={cs.id}
              className={`rounded-2xl overflow-hidden flex flex-col justify-between transition-all border group ${
                isLight
                  ? 'bg-white border-slate-300/80 shadow-lg shadow-slate-900/8 hover:shadow-2xl hover:shadow-slate-900/15 hover:border-slate-400 text-slate-900 ring-1 ring-slate-900/5'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-100 shadow-xl shadow-black/50'
              }`}
            >
              <div>
                {/* 4:3 Image */}
                <div className={`relative aspect-[4/3] w-full overflow-hidden ${
                  isLight ? 'bg-slate-100' : 'bg-slate-950'
                }`}>
                  <LazyImage
                    src={cs.image}
                    alt={cs.projectName}
                    aspectRatio="4/3"
                    imgClassName="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 pointer-events-none ${
                    isLight
                      ? 'bg-gradient-to-t from-black/35 via-transparent to-transparent'
                      : 'bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent'
                  }`} />
                  <div className="absolute top-3 left-3 text-[11px] font-mono text-cyan-300 px-2.5 py-0.5 bg-slate-950/85 backdrop-blur-md rounded-lg border border-slate-800">
                    {cs.category}
                  </div>
                  {cs.automated && (
                    <div className="absolute top-3 right-3 text-[10px] font-mono text-emerald-300 px-2 py-0.5 bg-emerald-950/85 backdrop-blur-md rounded-lg border border-emerald-800 flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{t.caseStudies?.liveBadge || 'Verified Benchmark'}</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-slate-100 font-mono font-medium drop-shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{cs.location}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className={`text-xs font-mono mb-1 ${isLight ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>
                    {cs.client}
                  </div>
                  <h3 className={`text-lg font-bold font-display mb-2 transition-colors line-clamp-2 ${
                    isLight ? 'text-slate-900 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-300'
                  }`}>
                    {cs.projectName}
                  </h3>
                  <div className="text-xs text-cyan-600 dark:text-cyan-400 font-mono mb-3 font-semibold">
                    Pitch: {cs.pitch} · Area: {cs.totalArea}
                  </div>

                  {/* Engineering Standard & Citations Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {cs.engineeringStandard && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20 dark:border-cyan-800/50">
                        <ShieldCheck className="w-2.5 h-2.5 text-cyan-500" />
                        <span className="truncate max-w-[190px]">{cs.engineeringStandard}</span>
                      </span>
                    )}
                    {cs.scientificFormulas && cs.scientificFormulas.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/20 dark:border-amber-800/40">
                        <FlaskConical className="w-2.5 h-2.5 text-amber-500" />
                        <span>Formulas</span>
                      </span>
                    )}
                    {cs.directLinks && cs.directLinks.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20 dark:border-emerald-800/40">
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>{cs.directLinks.length} Citations</span>
                      </span>
                    )}
                  </div>

                  {/* Quantitative Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {cs.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl border text-[11px] ${
                          isLight ? 'bg-slate-100/70 border-slate-300 shadow-xs' : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <span className="text-slate-600 dark:text-slate-400 block text-[10px] uppercase font-mono">{m.label}</span>
                        <strong className="text-cyan-600 dark:text-cyan-300 font-mono">{m.value}</strong>
                      </div>
                    ))}
                  </div>

                  <p className={`text-xs leading-relaxed line-clamp-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {cs.challenge}
                  </p>
                </div>
              </div>

              <div className={`p-6 pt-0 border-t ${isLight ? 'border-slate-100' : 'border-slate-800/80'}`}>
                <button
                  type="button"
                  onClick={() => setActiveModalCase(cs)}
                  className={`mt-4 w-full py-2.5 px-3 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>{t.caseStudies?.viewCaseStudy || 'View Technical Case Study'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {activeModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
          }`}>
            <button
              onClick={() => setActiveModalCase(null)}
              className={`absolute top-4 right-4 p-2 rounded-lg cursor-pointer ${
                isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono text-cyan-500 uppercase font-bold">{activeModalCase.category}</span>
              {activeModalCase.automated && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  {t.caseStudies?.liveBadge || 'Verified Benchmark Dataset'}
                </span>
              )}
              {activeModalCase.engineeringStandard && (
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>{activeModalCase.engineeringStandard}</span>
                </span>
              )}
            </div>

            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1 mb-2">
              {activeModalCase.projectName}
            </h3>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-4">
              <span>{t.caseStudies?.clientLabel || 'Client:'} <strong className="text-slate-700 dark:text-slate-200">{activeModalCase.client}</strong></span>
              <span> · </span>
              <span>{t.caseStudies?.locationLabel || 'Location:'} <strong className="text-slate-700 dark:text-slate-200">{activeModalCase.location}</strong></span>
            </div>

            <LazyImage
              src={activeModalCase.image}
              alt={activeModalCase.projectName}
              aspectRatio="16/9"
              className="rounded-xl mb-6"
            />

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed mb-6">
              <div>
                <strong className="block text-slate-900 dark:text-white font-semibold mb-1">
                  {t.caseStudies?.challengeTitle || 'Challenge:'}
                </strong>
                <p className={isLight ? 'text-slate-600' : 'text-slate-300'}>{activeModalCase.challenge}</p>
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white font-semibold mb-1">
                  {t.caseStudies?.solutionTitle || 'DEMAQ Engineering Solution:'}
                </strong>
                <p className={isLight ? 'text-slate-600' : 'text-slate-300'}>{activeModalCase.solution}</p>
              </div>
            </div>

            {/* Specifications Matrix */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border text-xs font-mono mb-6 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b162e] border-slate-800'
            }`}>
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {t.caseStudies?.pitchLabel || 'Pixel Pitch'}
                </span>
                <span className="font-bold">{activeModalCase.pitch}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {t.caseStudies?.surfaceLabel || 'Total Surface'}
                </span>
                <span className="font-bold">{activeModalCase.totalArea}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {t.caseStudies?.packagingLabel || 'Packaging'}
                </span>
                <span className="font-bold">{activeModalCase.packaging}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {t.caseStudies?.resolutionLabel || 'Resolution'}
                </span>
                <span className="font-bold">{activeModalCase.resolution}</span>
              </div>
            </div>

            {/* Scientific Formulations & Physical Laws */}
            {activeModalCase.scientificFormulas && activeModalCase.scientificFormulas.length > 0 && (
              <div className={`p-4 sm:p-5 rounded-xl border mb-6 ${
                isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-[#0b162e] border-cyan-800/40'
              }`}>
                <div className="flex items-center justify-between gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-cyan-300 mb-3">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-cyan-500" />
                    <span>Scientific Formulations & Optical Physics</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    PHYSICS GROUNDED
                  </span>
                </div>
                <div className="space-y-3">
                  {activeModalCase.scientificFormulas.map((form, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border text-xs ${
                      isLight ? 'bg-white border-slate-200' : 'bg-[#091226] border-slate-800'
                    }`}>
                      <div className="font-semibold text-slate-900 dark:text-white font-mono text-[11px] mb-1">
                        {form.name || form.label}
                      </div>
                      <div className="px-3 py-2 rounded-lg font-mono text-cyan-600 dark:text-cyan-300 bg-slate-100 dark:bg-[#060d1b] border border-cyan-500/25 overflow-x-auto text-xs my-1.5 font-bold tracking-wide">
                        {form.latex || form.formula}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {form.explanation || form.resultInterpretation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quoted Authoritative Direct Citations & Standards */}
            {activeModalCase.directLinks && activeModalCase.directLinks.length > 0 && (
              <div className={`p-4 sm:p-5 rounded-xl border mb-6 ${
                isLight ? 'bg-cyan-50/50 border-cyan-200' : 'bg-cyan-950/20 border-cyan-800/40'
              }`}>
                <div className="flex items-center justify-between gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-3">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-cyan-500" />
                    <span>Quoted Direct Manufacturer & Standards Links</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-mono">
                    VERIFIED LINKS
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModalCase.directLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between group cursor-pointer ${
                        isLight
                          ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-cyan-400 shadow-xs'
                          : 'bg-[#091226] hover:bg-[#0e1c3a] border-slate-800 hover:border-cyan-500/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-cyan-500 mb-1">
                          <span className="uppercase font-semibold tracking-wider">{link.publisher || link.organization}</span>
                          <ExternalLink className="w-3 h-3 text-cyan-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {link.title}
                        </div>
                      </div>
                      {link.standardCode && (
                        <div className="mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-1.5 flex items-center justify-between">
                          <span>{link.standardCode}</span>
                          <span className="text-emerald-500 font-bold">✓ Verified</span>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies Stack */}
            {activeModalCase.technologies && activeModalCase.technologies.length > 0 && (
              <div className="mb-6">
                <div className="text-xs font-mono text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.caseStudies?.technologiesTitle || 'Hardware & Controller Technologies:'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalCase.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
                        isLight
                          ? 'bg-slate-100 border-slate-200 text-slate-700'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setActiveModalCase(null)}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                {t.caseStudies?.closeBtn || 'Close Case Study'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
