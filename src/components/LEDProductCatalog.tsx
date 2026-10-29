import React, { useState } from 'react';
import { LEDProduct } from '../types';
import { ArrowRight, CheckCircle2, ChevronRight, Truck, Clock, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LazyImage } from './common/LazyImage';

interface LEDProductCatalogProps {
  products: LEDProduct[];
  onSelectForCalculator: (seriesId: string) => void;
  onNavigateToRFQ: (seriesName: string) => void;
}

export const LEDProductCatalog: React.FC<LEDProductCatalogProps> = ({
  products,
  onSelectForCalculator,
  onNavigateToRFQ
}) => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<LEDProduct | null>(null);

  const filteredProducts = activeFilter === 'all'
    ? products
    : activeFilter === 'in_stock'
    ? products.filter(p => p.availability === 'in_stock')
    : activeFilter === 'import_by_order'
    ? products.filter(p => p.availability === 'import_by_order')
    : products.filter(p => p.category === activeFilter);

  const filterTabs = [
    { id: 'all', label: t.catalog.allTab },
    { id: 'in_stock', label: `✓ ${t.catalog.inStockTab}` },
    { id: 'import_by_order', label: `✈ ${t.catalog.importTab}` },
    { id: 'fine_pitch_cob', label: 'COB Micro-LED' },
    { id: 'outdoor_dooh', label: 'Outdoor DOOH' },
    { id: 'rental_staging', label: 'Staging & Rental' },
    { id: 'xr_cinema', label: 'XR Virtual Studio' },
  ];

  return (
    <section id="products" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider">
            02. {t.catalog.tag}
          </div>
          <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.catalog.title}
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {t.catalog.subtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className={`flex flex-wrap gap-1.5 p-1.5 rounded-2xl border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/80 border-slate-800'
        }`}>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? isLight
                    ? 'bg-white text-cyan-700 font-bold shadow-xs'
                    : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className={`group rounded-2xl overflow-hidden flex flex-col justify-between transition-all border ${
              isLight
                ? 'bg-white border-slate-300/80 shadow-lg shadow-slate-900/8 hover:shadow-2xl hover:shadow-slate-900/15 hover:border-slate-400 text-slate-900 ring-1 ring-slate-900/5'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-100 shadow-xl shadow-black/50'
            }`}
          >
            <div>
              {/* Product Visual Container with 4:3 Aspect Ratio */}
              <div className={`relative aspect-[4/3] w-full overflow-hidden ${
                isLight ? 'bg-slate-100' : 'bg-slate-950'
              }`}>
                <LazyImage
                  src={prod.image}
                  alt={prod.seriesName}
                  aspectRatio="4/3"
                  imgClassName="group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 pointer-events-none ${
                  isLight
                    ? 'bg-gradient-to-t from-black/30 via-transparent to-transparent'
                    : 'bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent'
                }`} />

                {/* Stock Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {prod.availability === 'in_stock' ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/90 px-2.5 py-1 rounded-lg border border-emerald-700/80 shadow-md flex items-center gap-1">
                      <Truck className="w-3 h-3 text-emerald-400" />
                      <span>{t.catalog.inStockBadge}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/90 px-2.5 py-1 rounded-lg border border-cyan-700/80 shadow-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{t.catalog.importBadge}</span>
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-300 px-2.5 py-0.5 bg-slate-950/85 backdrop-blur-md rounded-lg border border-slate-800">
                  {prod.packagingTech}
                </div>
              </div>

              {/* Information Body */}
              <div className="p-5 sm:p-6">
                <h3 className={`text-xl font-bold font-display mb-1.5 transition-colors ${
                  isLight ? 'text-slate-900 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-300'
                }`}>
                  {prod.seriesName}
                </h3>
                <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono mb-2 line-clamp-1">{prod.tagline}</p>
                <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  {prod.description}
                </p>

                {/* Available Pitches */}
                <div className="mb-4">
                  <div className={`text-[11px] font-mono mb-1.5 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                    {t.catalog?.availablePitches || 'Available Pitch Options:'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {prod.pixelPitches.map((pitch, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 text-[11px] font-mono rounded-md border ${
                          isLight
                            ? 'bg-slate-100 border-slate-300 text-slate-800 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-200'
                        }`}
                      >
                        {pitch}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hardware Spec Matrix */}
                <div className={`grid grid-cols-2 gap-2 p-3 rounded-xl border text-[11px] font-mono mb-4 ${
                  isLight ? 'bg-slate-100/70 border-slate-300 shadow-xs text-slate-800' : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                }`}>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block text-[10px]">{t.catalog?.peakBrightness || 'Peak Brightness:'}</span>
                    <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white'}>
                      {prod.brightnessNits.toLocaleString()} Nits
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block text-[10px]">{t.catalog?.refreshRate || 'Refresh Rate:'}</span>
                    <strong className="text-cyan-600 dark:text-cyan-300 font-bold">{prod.refreshRateHz} Hz</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block text-[10px]">{t.catalog?.panelDimensions || 'Panel Dimensions:'}</span>
                    <span className={`truncate block font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{prod.cabinetSize}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block text-[10px]">{t.catalog?.contrastRatio || 'Contrast Ratio:'}</span>
                    <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{prod.contrastRatio}</span>
                  </div>
                </div>

                {/* Key Advantages */}
                <ul className="space-y-1.5 mb-5 text-xs">
                  {prod.highlights?.slice(0, 3).map((feat: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card Action Footer */}
            <div className={`p-5 sm:p-6 pt-0 border-t ${isLight ? 'border-slate-100' : 'border-slate-800/80'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(prod)}
                  className={`text-xs font-semibold transition-colors cursor-pointer ${
                    isLight ? 'text-slate-600 hover:text-cyan-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.catalog.specsBtn}
                </button>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('comparison-matrix');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                      isLight
                        ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                        : 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-700/60 text-amber-300'
                    }`}
                    title="Compare this model side-by-side"
                  >
                    <span>⚖️</span>
                    <span>{t.nav?.comparison || 'Compare'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectForCalculator(prod.id)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                    }`}
                  >
                    {t.catalog.calcBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToRFQ(prod.seriesName)}
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    {t.catalog.rfqBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Spec Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
          }`}>
            <button
              onClick={() => setSelectedProduct(null)}
              className={`absolute top-4 right-4 p-2 rounded-lg cursor-pointer ${
                isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                selectedProduct.availability === 'in_stock'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300'
              }`}>
                {selectedProduct.availability === 'in_stock' ? t.catalog.inStockBadge : t.catalog.importBadge}
              </span>
              <span className="text-xs font-mono text-cyan-500">
                {selectedProduct.packagingTech}
              </span>
            </div>

            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">
              {selectedProduct.seriesName}
            </h3>
            <p className="text-sm text-cyan-600 dark:text-cyan-400 font-mono mb-4">{selectedProduct.tagline}</p>
            <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              {selectedProduct.description}
            </p>

            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border text-xs font-mono mb-6 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <span className="text-slate-400 block text-[10px]">Brightness</span>
                <span className="font-bold">{selectedProduct.brightnessNits} Nits</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Refresh</span>
                <span className="font-bold">{selectedProduct.refreshRateHz} Hz</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Weight</span>
                <span className="font-bold">{selectedProduct.weightPerCabinetKg} kg/panel</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Protection</span>
                <span className="font-bold">{selectedProduct.ipRating}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  onSelectForCalculator(selectedProduct.id);
                  setSelectedProduct(null);
                }}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                }`}
              >
                {t.catalog.calcBtn}
              </button>
              <button
                onClick={() => {
                  onNavigateToRFQ(selectedProduct.seriesName);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
              >
                {t.catalog.rfqBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
