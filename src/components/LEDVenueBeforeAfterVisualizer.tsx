import React, { useState } from 'react';
import {
  Sliders, ArrowRight, ShieldCheck, Zap, Sparkles, Eye,
  Maximize2, CheckCircle2, ChevronRight, Sun, Moon, MapPin, Building2, Church, Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface VenueScenario {
  id: string;
  title: string;
  category: string;
  location: string;
  dimensions: string;
  pitch: string;
  technology: string;
  beforeLabel: string;
  afterLabel: string;
  beforeDesc: string;
  afterDesc: string;
  beforeImage: string;
  afterImage: string;
  specs: {
    contrastBefore: string;
    contrastAfter: string;
    brightnessBefore: string;
    brightnessAfter: string;
    durabilityBefore: string;
    durabilityAfter: string;
    powerBefore: string;
    powerAfter: string;
  };
}

export const VENUE_SCENARIOS: VenueScenario[] = [
  {
    id: 'church_sanctuary',
    title: 'Church Worship Sanctuary Main Altar',
    category: 'House of Worship',
    location: 'Sarbet & Bole Medhanealem, Addis Ababa',
    dimensions: '9.6m (W) × 3.84m (H) — 36.86 m²',
    pitch: 'P2.5 Shield-GOB Armored',
    technology: 'Optical Polyurethane GOB + NovaStar VX1000',
    beforeLabel: 'Washed-Out Overhead Projector & Wrinkled Screen',
    afterLabel: 'DemaQ 4K Shield-GOB Armored Video Wall',
    beforeDesc: 'Dim 350-lumen projector washed out by cathedral stained glass and stage spotlights. Worship lyrics were barely readable from mid-pews. Choir movements and microphone stands frequently bumped the fragile fabric screen, and bulbs burned out every 1,200 hours.',
    afterDesc: 'Luminous 1,400-nit stage-calibrated DemaQ Shield-GOB video wall with 10,000:1 deep black HDR contrast. 100% collision-proof epoxy resin armor immune to microphone hits, and 7,680Hz broadcast shutter synchronization for Sunday TV broadcasts.',
    beforeImage: '/src/assets/images/church_projector_before_1792269532327.jpg',
    afterImage: '/src/assets/images/led_church_sanctuary_realistic_1790852763740.jpg',
    specs: {
      contrastBefore: '350:1 (Faded Gray Blacks)',
      contrastAfter: '10,000:1 (Deep HDR Black)',
      brightnessBefore: '350 Nits (Dim in Daylight)',
      brightnessAfter: '1,400 Nits (Stage Calibrated)',
      durabilityBefore: 'Zero Impact Protection',
      durabilityAfter: 'IK08 Epoxy GOB Armor',
      powerBefore: '4.8 kW (Hot Bulb Exhaust)',
      powerAfter: '3.1 kW (Common-Cathode Rail)'
    }
  },
  {
    id: 'banking_boardroom',
    title: 'Financial Enterprise Executive Boardroom',
    category: 'Banking & Corporate',
    location: 'Kazanchis Financial District, Addis Ababa',
    dimensions: '6.4m (W) × 3.6m (H) — 23.04 m²',
    pitch: 'P0.93 Nova-Pitch Flip-Chip COB',
    technology: 'Chip-On-Board Micro-LED + NovaPro UHD Jr',
    beforeLabel: 'Dim Ceiling Projector in Darkened Room',
    afterLabel: 'DemaQ Seamless 8K Flip-Chip COB Master Canvas',
    beforeDesc: 'Executives forced to dim window blinds and turn off room lights during morning board meetings. Audible 48 dB projector fan drone and muddy, low-contrast financial charts on a pull-down screen.',
    afterDesc: 'Flawless sub-millimeter pixel pitch, 170° ultra-wide viewing angles for every boardroom seat, 15,000:1 deep black levels in full daylight with open blinds, and 0 dB fanless cold-screen technology operating 12°C cooler.',
    beforeImage: '/src/assets/images/boardroom_projector_before_1792269532910.jpg',
    afterImage: '/src/assets/images/led_boardroom_cob_realistic_1790852796887.jpg',
    specs: {
      contrastBefore: '600:1 (Requires Dark Room)',
      contrastAfter: '15,000:1 (Deep Micro Black)',
      brightnessBefore: '400 Nits (Low Dynamic Range)',
      brightnessAfter: '1,200 Nits (Daylight Balanced)',
      durabilityBefore: 'Fragile Pull-Down Fabric',
      durabilityAfter: 'Epoxy Resin Sealed Surface',
      powerBefore: '3.6 kW (High Ambient Heat)',
      powerAfter: '2.2 kW (-12°C Cooler Operation)'
    }
  },
  {
    id: 'bole_billboard',
    title: 'Bole Road 3D Anamorphic Curved DOOH Landmark',
    category: 'Outdoor Commercial DOOH',
    location: 'Bole Road & Meskel Square, Addis Ababa',
    dimensions: '18m (W) × 8m (H) — 144 m²',
    pitch: 'P4.81 Horizon Outdoor DOOH',
    technology: 'Die-Cast Aluminum IP65 + Huidu 4G Cloud Cluster',
    beforeLabel: 'Static Weather-Worn Vinyl Billboard',
    afterLabel: 'DemaQ 9,500 Nits 3D Anamorphic Digital Billboard',
    beforeDesc: 'Static printed paper canvas sun-bleached and faded by intense Addis equatorial UV rays. Tears during rainy season thunderstorms required costly physical reprinting and scaffolding installation for every single campaign change.',
    afterDesc: 'High-margin multi-advertiser digital cluster rotating 12 programmatic campaigns. 9,500 nits high-bright daylight punch under direct equatorial sun, automated nocturnal dimming, and IP65 waterproof front/rear die-cast housing certified for 120 km/h wind shear.',
    beforeImage: '/src/assets/images/billboard_vinyl_before_1792269532918.jpg',
    afterImage: '/src/assets/images/led_outdoor_dooh_real_1790853056151.jpg',
    specs: {
      contrastBefore: 'Static Print (0 FPS Motion)',
      contrastAfter: '7,680Hz Smooth Motion',
      brightnessBefore: 'Ambient Sunlight Only',
      brightnessAfter: '9,500 Nits Direct Sunlight',
      durabilityBefore: 'Vinyl Ripped by Rain & UV',
      durabilityAfter: 'IP65 Stormproof Front & Rear',
      powerBefore: '0 kW (0 Revenue Flexibility)',
      powerAfter: '18 kW (Avg) · High DOOH ROI'
    }
  },
  {
    id: 'control_room_soc',
    title: 'Security Operations & Dispatch Command Center',
    category: 'Government & Infrastructure',
    location: 'Bole Sub-City, Addis Ababa',
    dimensions: '10.5m (W) × 3.0m (H) — 31.5 m²',
    pitch: 'P1.25 Ultra-Fine Pixel Pitch',
    technology: 'Common-Cathode ICs + Optical Fiber Redundancy',
    beforeLabel: 'Thick-Bezel Desktop LCD Monitor Grid',
    afterLabel: 'DemaQ Seamless Mission-Critical SOC Video Wall',
    beforeDesc: 'Surveillance camera streams and city GIS maps chopped up by 20mm thick plastic bezels between separate computer monitors. Tangled external power cords, uneven color temperatures across panels, and high heat exhaustion for operators.',
    afterDesc: 'Zero-bezel seamless monolithic 8K canvas, dual optical loop redundancy, hot-swappable MeanWell power modules, and NovaStar precision color calibration for 24/7/365 uninterrupted mission-critical command dispatch.',
    beforeImage: '/src/assets/images/soc_bezel_monitors_before_1792269533733.jpg',
    afterImage: '/src/assets/images/led_control_room_cob_realistic_1790852833333.jpg',
    specs: {
      contrastBefore: '1,000:1 (LCD Backlight Bleed)',
      contrastAfter: '12,000:1 (Individual Diode Black)',
      brightnessBefore: '450 Nits (Glares Under Fluorescent)',
      brightnessAfter: '800 Nits (Anti-Glare Eye-Safe)',
      durabilityBefore: 'Fragile Exposed Desktop Glass',
      durabilityAfter: 'Reinforced Metal Substrate',
      powerBefore: '5.2 kW (Heavy AC Cooling Load)',
      powerAfter: '3.3 kW (Energy-Efficient Common-Cathode)'
    }
  }
];

interface Props {
  onConfigureInCalculator?: (scenario: VenueScenario) => void;
  onNavigateToRFQ?: (details: string) => void;
}

export const LEDVenueBeforeAfterVisualizer: React.FC<Props> = ({
  onConfigureInCalculator,
  onNavigateToRFQ
}) => {
  const { theme } = useApp();
  const isLight = theme === 'light';

  const [activeScenarioId, setActiveScenarioId] = useState<string>('church_sanctuary');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [ambientLighting, setAmbientLighting] = useState<'daylight' | 'evening'>('daylight');
  const containerRef = React.useRef<HTMLDivElement>(null);

  const currentScenario = VENUE_SCENARIOS.find(s => s.id === activeScenarioId) || VENUE_SCENARIOS[0];

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        // ignore
      }
    }
  };

  return (
    <section id="venue-visualizer" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="max-w-3xl">
          <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>01. Interactive Venue Transformation Visualizer</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              REALISTIC COMPARISON SLIDER
            </span>
          </div>
          <h2 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            See The Real Transformation In Ethiopian Venues
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            Slide horizontally to experience the real-world upgrade: replacing washed-out overhead projectors, sun-bleached static vinyl, and chunky LCD monitor bezels with DemaQ high-bright GOB armored and Flip-Chip COB video walls.
          </p>
        </div>

        {/* Ambient Lighting & Split Presets Toggle */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto">
          {/* Preset Buttons */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 text-[11px] font-mono ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <button
              onClick={() => setSliderPosition(0)}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                sliderPosition === 0 ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Show 100% Previous Installation"
            >
              Before
            </button>
            <button
              onClick={() => setSliderPosition(50)}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                sliderPosition === 50 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="50/50 Split View"
            >
              50/50
            </button>
            <button
              onClick={() => setSliderPosition(100)}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                sliderPosition === 100 ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Show 100% DemaQ LED Upgrade"
            >
              After
            </button>
          </div>

          {/* Ambient Lighting Toggle */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <button
              onClick={() => setAmbientLighting('daylight')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                ambientLighting === 'daylight'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3" />
              <span>Daylight</span>
            </button>
            <button
              onClick={() => setAmbientLighting('evening')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                ambientLighting === 'evening'
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>Evening</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-6">
        {VENUE_SCENARIOS.map((sc) => {
          const isSelected = sc.id === activeScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setActiveScenarioId(sc.id);
                setSliderPosition(50);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                  : isLight
                  ? 'bg-white border-slate-300 text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-400'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {sc.id === 'church_sanctuary' && <Church className="w-3.5 h-3.5" />}
              {sc.id === 'banking_boardroom' && <Building2 className="w-3.5 h-3.5" />}
              {sc.id === 'bole_billboard' && <Radio className="w-3.5 h-3.5" />}
              {sc.id === 'control_room_soc' && <Zap className="w-3.5 h-3.5" />}
              <span>{sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Split Viewer Card */}
      <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-colors ${
        isLight ? 'bg-white border-slate-300 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5' : 'bg-slate-950 border-slate-800 shadow-black/80'
      }`}>
        {/* Scenario Info Bar */}
        <div className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
          isLight ? 'bg-slate-100/70 border-slate-300 text-slate-800' : 'bg-slate-900/80 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-3">
            <span className="font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{currentScenario.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-500" />
              <span>{currentScenario.location}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 font-bold">
              {currentScenario.pitch}
            </span>
            <span className="text-slate-400">{currentScenario.dimensions}</span>
          </div>
        </div>

        {/* Interactive Comparison Canvas with Rock-Solid Clip-Path */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative aspect-[16/9] sm:aspect-[21/9] w-full select-none cursor-ew-resize overflow-hidden bg-slate-950 touch-none group"
        >
          {/* AFTER (Right / Bottom Full Layer) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={currentScenario.afterImage}
              alt={currentScenario.afterLabel}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-300 ${
                ambientLighting === 'evening' ? 'brightness-110 saturate-120' : 'brightness-100'
              }`}
            />
            {/* After Tag */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 font-mono text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AFTER: {currentScenario.afterLabel}</span>
              </span>
            </div>
          </div>

          {/* BEFORE (Left Layer - Pixel-Perfect Clip-Path matching parent geometry) */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-none"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
            }}
          >
            <img
              src={currentScenario.beforeImage}
              alt={currentScenario.beforeLabel}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-300 ${
                ambientLighting === 'daylight' ? 'filter contrast-90 brightness-95' : 'filter contrast-85 brightness-80'
              }`}
            />

            {/* Simulated daylight washout effect on the old projector/vinyl */}
            {ambientLighting === 'daylight' && (
              <div className="absolute inset-0 bg-amber-100/10 pointer-events-none" />
            )}

            {/* Before Tag */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <span className="px-3 py-1.5 rounded-xl bg-rose-950/90 border border-rose-500/60 text-rose-300 font-mono text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>BEFORE: {currentScenario.beforeLabel}</span>
              </span>
            </div>
          </div>

          {/* Draggable Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 z-30 w-1 bg-white shadow-2xl cursor-ew-resize flex items-center justify-center -translate-x-1/2 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className={`w-10 h-10 rounded-full border-2 border-white text-white flex items-center justify-center shadow-2xl transition-transform ${
              isDragging ? 'scale-115 bg-cyan-600' : 'bg-slate-900 group-hover:scale-105'
            }`}>
              <Sliders className="w-4 h-4 text-cyan-300" />
            </div>
          </div>

          {/* Interactive instruction banner */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <span className="px-3.5 py-1 rounded-full bg-slate-950/85 border border-slate-700/80 text-slate-200 text-[11px] font-mono shadow-lg backdrop-blur-md flex items-center gap-2">
              <span className="text-cyan-400 font-bold">◀ Drag Slider ▶</span>
              <span className="text-slate-400">({sliderPosition}% reveal)</span>
            </span>
          </div>
        </div>

        {/* Narrative & Side-by-Side Metric Matrix */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              isLight ? 'bg-rose-50/80 border-rose-300 shadow-xs text-slate-800' : 'bg-rose-950/20 border-rose-900/40 text-slate-300'
            }`}>
              <div className="font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider font-mono text-[11px] mb-1">
                The Previous Dilemma:
              </div>
              <p>{currentScenario.beforeDesc}</p>
            </div>

            <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              isLight ? 'bg-emerald-50/80 border-emerald-300 shadow-xs text-slate-800' : 'bg-emerald-950/20 border-emerald-900/40 text-slate-300'
            }`}>
              <div className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-mono text-[11px] mb-1">
                The DemaQ Engineering Solution:
              </div>
              <p>{currentScenario.afterDesc}</p>
            </div>
          </div>

          {/* Quantitative Metrics Comparison */}
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
              <span>Quantitative Engineering Benchmarks</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 uppercase block font-semibold">Contrast Ratio</span>
                <div className="text-xs text-rose-500 line-through font-mono mt-0.5">{currentScenario.specs.contrastBefore}</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{currentScenario.specs.contrastAfter}</div>
              </div>

              <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 uppercase block font-semibold">Calibrated Brightness</span>
                <div className="text-xs text-rose-500 line-through font-mono mt-0.5">{currentScenario.specs.brightnessBefore}</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{currentScenario.specs.brightnessAfter}</div>
              </div>

              <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 uppercase block font-semibold">Mechanical Durability</span>
                <div className="text-xs text-rose-500 line-through font-mono mt-0.5">{currentScenario.specs.durabilityBefore}</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{currentScenario.specs.durabilityAfter}</div>
              </div>

              <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 uppercase block font-semibold">Power Consumption</span>
                <div className="text-xs text-rose-500 line-through font-mono mt-0.5">{currentScenario.specs.powerBefore}</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{currentScenario.specs.powerAfter}</div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Includes 5-Year Local Warranty & Certified NovaStar Calibration</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {onConfigureInCalculator && (
                <button
                  onClick={() => onConfigureInCalculator(currentScenario)}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Configure in Calculator</span>
                </button>
              )}

              {onNavigateToRFQ && (
                <button
                  onClick={() => onNavigateToRFQ(`${currentScenario.title} (${currentScenario.pitch}) - ${currentScenario.dimensions}`)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <span>Request Turnkey Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
