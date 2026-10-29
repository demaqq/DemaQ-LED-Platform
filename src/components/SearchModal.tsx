import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, X, Sparkles, Layers, Calculator, Camera, Eye,
  Wrench, FileText, ArrowRight, Truck, Clock, Check,
  Cpu, Building2, Briefcase, BookOpen, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ledProducts, ledSolutions, ledCaseStudies, blogPosts, supportedControllers } from '../data/mockData';

export interface SearchResultItem {
  id: string;
  type: 'product' | 'solution' | 'tool' | 'case_study' | 'blog' | 'controller';
  title: string;
  subtitle: string;
  category: string;
  tag?: string;
  sectionId: string;
  inStock?: boolean;
  meta?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Global index of searchable elements
  const allItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. Engineering Tools
    items.push(
      {
        id: 'tool-ai-architect',
        type: 'tool',
        title: t.nav?.aiArchitect || 'AI Venue Architect & Screen Planner',
        subtitle: t.aiArchitect?.subtitle || 'DemaQ display proposal, pixel pitch selection & electrical load calculation',
        category: t.search?.categories?.tools || 'Engineering Tool',
        tag: 'DemaQ AI',
        sectionId: 'ai-architect',
        meta: 'church boardroom retail dooh club lounge restaurant sportsbar pitch resolution cabinets power'
      },
      {
        id: 'tool-comparison',
        type: 'tool',
        title: t.nav?.comparison || 'Side-by-Side Display Model Comparison Matrix',
        subtitle: t.comparison?.subtitle || 'Compare LED screen series across physical pitch, impact resistance, refresh rate & controllers',
        category: t.search?.categories?.tools || 'Engineering Tool',
        tag: 'Matrix',
        sectionId: 'comparison-matrix',
        meta: 'compare specs contrast nits brightness weight fixed rental novastar huidu colorlight linsn'
      },
      {
        id: 'tool-calculator',
        type: 'tool',
        title: t.nav?.calculator || 'Interactive LED Video Wall Calculator',
        subtitle: t.calc?.subtitle || 'Real-time cabinet & 32x16cm modular sizing, pixel resolution, power load & BOM',
        category: t.search?.categories?.tools || 'Engineering Tool',
        tag: 'Calculator',
        sectionId: 'calculator',
        meta: 'width height aspect ratio 16:9 modular 32x16cm power watts amps weight'
      },
      {
        id: 'tool-ar-visualizer',
        type: 'tool',
        title: t.nav?.arVisualizer || 'AR Camera Tool & 3D Spatial Room Visualizer',
        subtitle: t.ar?.subtitle || 'Preview your screen on real walls using phone camera or 3D room presets',
        category: t.search?.categories?.tools || 'Engineering Tool',
        tag: 'AR / 3D',
        sectionId: 'ar-visualizer',
        meta: 'augmented reality camera mobile preview mockup'
      },
      {
        id: 'tool-distance',
        type: 'tool',
        title: t.nav?.distanceVisualizer || 'Pixel Pitch vs. Retinal Distance Visualizer',
        subtitle: t.distance?.subtitle || 'Acuity simulator calculating optimal audience viewing distance for 20/20 vision',
        category: t.search?.categories?.tools || 'Engineering Tool',
        tag: 'Simulator',
        sectionId: 'pixel-pitch-visualizer',
        meta: 'meters feet human eye optical acuity'
      },
      {
        id: 'tool-maintenance',
        type: 'tool',
        title: t.nav?.maintenance || 'LED Screen Maintenance & Repair Portal',
        subtitle: t.maintenance?.subtitle || 'Emergency diagnosis, module repair, NovaStar/Huidu card replacement & nationwide service',
        category: t.search?.categories?.tools || 'Engineering Tool',
        tag: 'Rapid Support',
        sectionId: 'maintenance',
        meta: 'dead pixels power supply burning failure fix quote ethiopia'
      },
      {
        id: 'tool-rfq',
        type: 'tool',
        title: t.nav?.rfq || 'Official LED Video Wall Request for Quotation (RFQ)',
        subtitle: t.rfq?.subtitle || 'Itemized pro-forma invoice with sending controllers, steel frame & nationwide delivery',
        category: t.search?.categories?.tools || 'Engineering Tool',
        tag: 'Pro-Forma',
        sectionId: 'rfq',
        meta: 'quote invoice price etb usd bank formal contract'
      },
      {
        id: 'tool-sector-journeys',
        type: 'tool',
        title: 'Industry Sector Journeys & Tailored Blueprints',
        subtitle: 'Churches, Banks, Control Rooms, DOOH Billboards, Stage Rentals & Malls with Addis Ababa power & structure specs',
        category: t.search?.categories?.tools || 'Engineering Tool',
        tag: 'Sector Blueprints',
        sectionId: 'sector-journeys',
        meta: 'church sanctuary bank boardroom control room dooh outdoor stage rental concert mall retail'
      },
      {
        id: 'tool-venue-visualizer',
        type: 'tool',
        title: 'Before vs. After Interactive Venue Visualizer',
        subtitle: 'Interactive comparison slider: Dim washed-out projectors vs. DemaQ 4K Armored GOB / COB displays',
        category: t.search?.categories?.tools || 'Engineering Tool',
        tag: 'Interactive Slider',
        sectionId: 'venue-visualizer',
        meta: 'before after slider projector vs led sanctuary altar boardroom mall tv studio contrast nits'
      },
      {
        id: 'tool-proforma-matrix',
        type: 'tool',
        title: 'Commercial Proforma Specification & Direct Quotation Generator',
        subtitle: 'Configure turnkey screen specifications, structure, and request official proforma invoice with 15% VAT via WhatsApp DM or Call',
        category: t.search?.categories?.tools || 'Engineering Tool',
        tag: 'Official Proforma',
        sectionId: 'proforma-matrix',
        meta: 'proforma invoice quotation quote vat tax structure brackets installation direct dm call'
      },
      {
        id: 'tool-tech-guide',
        type: 'tool',
        title: t.nav?.techGuide || 'Hardware Architecture: GOB vs COB vs SMD Guide',
        subtitle: t.tech?.subtitle || 'Detailed guide on optical epoxy durability, flip-chip micro-LED and traditional SMD',
        category: t.search?.categories?.tools || 'Engineering Tool',
        tag: 'Hardware Guide',
        sectionId: 'technology-guide',
        meta: 'gob cob smd glue on board impact resistant dust proof'
      }
    );

    // 2. Hardware Products
    ledProducts.forEach((p) => {
      items.push({
        id: `prod-${p.id}`,
        type: 'product',
        title: p.seriesName,
        subtitle: `${p.tagline} · ${p.pixelPitches.join(', ')} · ${p.brightnessNits} Nits · ${p.packagingTech}`,
        category: t.search?.categories?.products || 'Hardware Product',
        tag: p.availability === 'in_stock' ? (t.catalog?.inStockBadge || 'IN-STOCK ADDIS') : (t.catalog?.importBadge || 'IMPORT BY ORDER'),
        sectionId: 'products',
        inStock: p.availability === 'in_stock',
        meta: `${p.seriesName} ${p.packagingTech} ${p.description} ${p.pixelPitches.join(' ')} ${p.cabinetSize} ${p.highlights.join(' ')}`
      });
    });

    // 3. Turnkey Solutions
    ledSolutions.forEach((s) => {
      items.push({
        id: `sol-${s.id}`,
        type: 'solution',
        title: s.title,
        subtitle: `${s.subtitle} · Recommended Pitch: ${s.recommendedPitch} · ${s.availabilityNote}`,
        category: t.search?.categories?.solutions || 'Turnkey Solution',
        tag: s.recommendedPitch,
        sectionId: 'solutions',
        meta: `${s.title} ${s.subtitle} ${s.description} ${s.features.join(' ')}`
      });
    });

    // 4. Case Studies
    ledCaseStudies.forEach((cs) => {
      items.push({
        id: `cs-${cs.id}`,
        type: 'case_study',
        title: `${cs.projectName} (${cs.client})`,
        subtitle: `${cs.location} · Pitch: ${cs.pitch} · Area: ${cs.totalArea} · ${cs.resolution}`,
        category: t.search?.categories?.caseStudies || 'Case Study',
        tag: cs.category,
        sectionId: 'case-studies',
        meta: `${cs.projectName} ${cs.client} ${cs.location} ${cs.pitch} ${cs.challenge} ${cs.solution}`
      });
    });

    // 5. Technical Knowledge Base
    blogPosts.forEach((bp) => {
      items.push({
        id: `blog-${bp.id}`,
        type: 'blog',
        title: bp.title,
        subtitle: `${bp.date} · ${bp.readTime} · ${bp.excerpt}`,
        category: t.search?.categories?.blog || 'Knowledge Base',
        tag: bp.category,
        sectionId: 'blog',
        meta: `${bp.title} ${bp.excerpt} ${bp.tags.join(' ')} ${bp.content}`
      });
    });

    // 6. Controllers
    supportedControllers.forEach((ctrl) => {
      items.push({
        id: `ctrl-${ctrl.name}`,
        type: 'controller',
        title: `${ctrl.name} Video Processors & Sending Cards`,
        subtitle: `${ctrl.tagline} · ${ctrl.description}`,
        category: t.nav?.controllers || 'Controller Ecosystem',
        tag: ctrl.logoText,
        sectionId: 'controllers',
        meta: `${ctrl.name} ${ctrl.tagline} ${ctrl.description} novastar huidu colorlight linsn brompton`
      });
    });

    return items;
  }, [t]);

  // Quick Chips
  const quickChips = [
    { label: 'P2.5 GOB (In-Stock Addis)', query: 'P2.5 GOB' },
    { label: 'COB Micro-LED (<P2.5)', query: 'COB' },
    { label: 'Outdoor DOOH Billboard', query: 'DOOH' },
    { label: 'Stage Rental P2.6 / P3.9', query: 'Rental' },
    { label: 'NovaStar Controllers', query: 'NovaStar' },
    { label: 'Wall Calculator', query: 'Calculator' },
    { label: 'AI Venue Architect', query: 'AI' },
    { label: 'AR Camera Tool', query: 'AR' },
    { label: 'Emergency Repair (4h)', query: 'Repair' },
    { label: 'Church Sanctuary LED', query: 'Church' },
  ];

  // Filtering
  const filteredResults = useMemo(() => {
    let list = allItems;

    // Filter by category
    if (activeCategory === 'in_stock') {
      list = list.filter((item) => item.inStock === true);
    } else if (activeCategory === 'products') {
      list = list.filter((item) => item.type === 'product');
    } else if (activeCategory === 'solutions') {
      list = list.filter((item) => item.type === 'solution');
    } else if (activeCategory === 'tools') {
      list = list.filter((item) => item.type === 'tool');
    } else if (activeCategory === 'case_study') {
      list = list.filter((item) => item.type === 'case_study');
    } else if (activeCategory === 'blog') {
      list = list.filter((item) => item.type === 'blog');
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return list.slice(0, 10);
    }

    const searchWords = trimmed.split(/\s+/).filter(Boolean);

    return list.filter((item) => {
      const haystack = `${item.title} ${item.subtitle} ${item.category} ${item.tag || ''} ${item.meta || ''}`.toLowerCase();
      return searchWords.every((word) => haystack.includes(word));
    });
  }, [allItems, activeCategory, query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length, query, activeCategory]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onNavigate(item.sectionId);
    onClose();
  };

  const getItemIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'tool':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'product':
        return <Layers className="w-4 h-4 text-cyan-500" />;
      case 'solution':
        return <Building2 className="w-4 h-4 text-indigo-500" />;
      case 'case_study':
        return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case 'blog':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'controller':
        return <Cpu className="w-4 h-4 text-blue-500" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
            : 'bg-slate-950 border-slate-800 text-slate-100 shadow-cyan-950/20'
        }`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Bar */}
        <div className={`p-4 sm:p-5 border-b flex items-center gap-3 ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800 bg-slate-900/60'
        }`}>
          <Search className="w-5 h-5 text-cyan-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search?.inputPlaceholder || 'Search screens, pixel pitch (P2.5, COB), calculators, tools...'}
            className={`w-full bg-transparent text-sm sm:text-base font-medium outline-none placeholder:text-slate-400 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className={`hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded text-[10px] font-mono font-semibold border shrink-0 ${
            isLight ? 'bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-900 border-slate-700 text-slate-300'
          }`}>
            ESC
          </kbd>
        </div>

        {/* Category Filters Row */}
        <div className={`px-4 sm:px-5 py-2.5 border-b flex items-center gap-1.5 overflow-x-auto text-xs font-semibold no-scrollbar ${
          isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-900/40 border-slate-800/80'
        }`}>
          {[
            { id: 'all', label: t.search?.categories?.all || 'All' },
            { id: 'in_stock', label: `✓ ${t.search?.categories?.inStock || 'In-Stock Addis'}` },
            { id: 'products', label: t.search?.categories?.products || 'Displays' },
            { id: 'tools', label: t.search?.categories?.tools || 'Engineering Tools' },
            { id: 'solutions', label: t.search?.categories?.solutions || 'Solutions' },
            { id: 'case_study', label: t.search?.categories?.caseStudies || 'Case Studies' },
            { id: 'blog', label: t.search?.categories?.blog || 'Tech Guides' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? isLight
                    ? 'bg-cyan-600 text-white shadow-xs font-bold'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-200/70'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Search Chips (when query is empty) */}
        {!query && (
          <div className={`px-4 sm:px-5 py-3 border-b ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/20 border-slate-800/60'
          }`}>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>{t.search?.quickChipsTitle || 'Suggested Quick Searches:'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(chip.query);
                    inputRef.current?.focus();
                  }}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-cyan-500 hover:text-cyan-700 text-slate-700'
                      : 'bg-slate-900 border-slate-800 hover:border-cyan-500/60 hover:text-cyan-300 text-slate-300'
                  }`}
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Search Results List */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 max-h-[50vh]"
        >
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 mx-auto flex items-center justify-center text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                {t.search?.noResults || 'No results matching your query'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {t.search?.noResultsDesc || 'Try searching for terms like "P2.5", "COB", "Calculator", "NovaStar", "Church", or "Repair".'}
              </p>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                    isSelected
                      ? isLight
                        ? 'bg-cyan-50 border-cyan-200 shadow-xs'
                        : 'bg-cyan-950/40 border-cyan-800/80 shadow-md'
                      : isLight
                      ? 'bg-transparent border-transparent hover:bg-slate-100/60'
                      : 'bg-transparent border-transparent hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                      isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-900 border-slate-800'
                    }`}>
                      {getItemIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold transition-colors ${
                          isSelected
                            ? isLight ? 'text-cyan-800' : 'text-cyan-300'
                            : isLight ? 'text-slate-900' : 'text-white'
                        }`}>
                          {item.title}
                        </span>
                        {item.tag && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                            item.inStock
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                              : isLight
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 line-clamp-1 ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono">
                    <span className="hidden sm:inline text-slate-400 text-[11px]">{item.category}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-cyan-500 translate-x-0.5' : 'text-slate-400'
                    }`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className={`px-4 sm:px-5 py-2.5 border-t text-[11px] font-mono flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-3">
            <span>
              <strong>{filteredResults.length}</strong> {t.search?.resultsFound || 'results found'}
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden sm:inline">
              <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">↑</kbd>{' '}
              <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">↓</kbd> to navigate
            </span>
            <span className="hidden sm:inline">
              <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">↵</kbd> to select
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">DemaQ Search Hub</span>
          </div>
        </div>
      </div>
    </div>
  );
};
