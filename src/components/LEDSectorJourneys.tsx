import React, { useState } from 'react';
import {
  Church, Building2, Radio, Music, ShoppingBag, ShieldCheck,
  CheckCircle2, ArrowRight, Sliders, Zap, Clock, MapPin, Sparkles, AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface SectorJourney {
  id: string;
  name: string;
  shortTitle: string;
  targetRole: string;
  icon: React.ElementType;
  accentColor: string;
  headline: string;
  coreChallenge: string;
  solutionBlueprint: string;
  keySpecs: {
    recommendedPitch: string;
    packagingType: string;
    refreshRate: string;
    controllerStack: string;
    weatherRating: string;
    leadTime: string;
  };
  ethiopianFactors: string[];
  turnkeyQuotation: {
    pricingStatus: string;
    sampleDimensions: string;
    warrantyNote: string;
  };
}

export const SECTOR_JOURNEYS: SectorJourney[] = [
  {
    id: 'worship',
    name: 'House of Worship',
    shortTitle: 'Churches & Sanctuaries',
    targetRole: 'Pastors, Media Directors & Church Councils',
    icon: Church,
    accentColor: 'from-amber-500 to-orange-500',
    headline: 'Zero-Dead-Pixel Stage Backdrops with Armored GOB Surface Protection',
    coreChallenge: 'Choir movement, handheld microphones, altar flowers, and cleaning wipes cause permanent diode failure on standard SMD screens. Stage spotlights wash out inferior displays, ruining Sunday live streaming.',
    solutionBlueprint: 'DemaQ Glue-On-Board (GOB) epoxy armor with 100% impact resistance, 160° ultra-wide horizontal viewing angles for side aisles, and 7,680Hz broadcast shutter synchronization for TV cameras.',
    keySpecs: {
      recommendedPitch: 'P2.0 – P2.5 Shield-GOB Armored',
      packagingType: 'Glue-On-Board (Epoxy Resin Armor)',
      refreshRate: '7,680Hz (Zero Camera Moire)',
      controllerStack: 'NovaStar VX1000 + Fiber Optical Redundancy',
      weatherRating: 'IK08 Impact-Proof & Dust-Sealed',
      leadTime: 'In-Stock Addis Warehouse: 24–48 Hours'
    },
    ethiopianFactors: [
      'MeanWell 5V 60A surge suppression protects against Sunday morning grid surges',
      'Dual optical loop ensures live sermon never drops even if one cable is severed',
      '3% free module stock and dedicated DemaQ technician on-site for inaugural service'
    ],
    turnkeyQuotation: {
      pricingStatus: 'Official Quotation upon Request / Direct WhatsApp DM or Call',
      sampleDimensions: '8m × 3.5m (28 m²)',
      warrantyNote: 'Includes NovaStar VX1000, steel frame, Addis delivery, 15% VAT & 5-year warranty'
    }
  },
  {
    id: 'banking',
    name: 'Banking & Corporate',
    shortTitle: 'Boardrooms & SOC',
    targetRole: 'CIOs, IT Directors, Bank Executives & SOC Managers',
    icon: Building2,
    accentColor: 'from-cyan-500 to-blue-500',
    headline: 'Seamless 8K Flip-Chip COB Cold-Screens for 24/7 Mission-Critical Centers',
    coreChallenge: 'Executives sit under 1.5m from boardroom walls; visible pixel grids and acoustic fan drone cause meeting fatigue. Command centers cannot tolerate even 1 second of downtime.',
    solutionBlueprint: 'Sub-millimeter Flip-Chip COB (Chip-on-Board) with zero wire bonding, 10,000:1 deep black contrast, runs 12°C cooler, and operates in total 0 dB fanless silence.',
    keySpecs: {
      recommendedPitch: 'P0.93 – P1.56 Nova-Pitch COB',
      packagingType: 'Flip-Chip Chip-On-Board (COB)',
      refreshRate: '3,840Hz – 7,680Hz Micro Precision',
      controllerStack: 'NovaPro UHD Jr + Redundant Power PSUs',
      weatherRating: 'Fanless 0 dB Acoustic Sealed',
      leadTime: '14–21 Days Custom Air Import'
    },
    ethiopianFactors: [
      'Engineered for Addis Ababa altitude (2,355m) heat dissipation dynamics',
      'Bank-grade encrypted video processing compatible with multi-source video matrixing',
      '5-Year Gold SLA with 4-hour local emergency on-site technician dispatch'
    ],
    turnkeyQuotation: {
      pricingStatus: 'Official Quotation upon Request / Direct WhatsApp DM or Call',
      sampleDimensions: '6m × 3.375m Native 16:9 4K (20.25 m²)',
      warrantyNote: 'Includes NovaPro UHD processor, gold-plated connectors, fanless power supplies & 5-year SLA'
    }
  },
  {
    id: 'dooh',
    name: 'Outdoor Commercial DOOH',
    shortTitle: 'Digital Billboards & Facades',
    targetRole: 'Media Agency Owners, Real Estate Developers & Malls',
    icon: Radio,
    accentColor: 'from-emerald-500 to-teal-500',
    headline: '9,500 Nits Direct Sunlight Visibility with EMA-Compliant Automatic Dimming',
    coreChallenge: 'Equatorial direct sunlight renders standard screens unreadable. Heavy rainy seasons corrode cheap modules, while Ethiopian Media Authority mandates nighttime photodiode dimming.',
    solutionBlueprint: 'High-brightness common-cathode outdoor modules saving 35% power, IP65 waterproof front & rear cabinets, integrated photodiode light sensor, and Huidu 4G multi-screen cloud clustering.',
    keySpecs: {
      recommendedPitch: 'P3.91 – P6.67 Horizon Outdoor DOOH',
      packagingType: 'Die-Cast Aluminum IP65 SMD Gold Wire',
      refreshRate: '3,840Hz (Crystal-Clear Motion Ads)',
      controllerStack: 'Huidu 4G Cloud Cluster + Photodiode Dimming',
      weatherRating: 'IP65 Full Weather & Dust Sealed',
      leadTime: 'In-Stock P4.81 (48h) or 21-Day Air Import'
    },
    ethiopianFactors: [
      'Certified structural steel engineering signed off for 120 km/h wind loads',
      'Automatic brightness ramp from 9,500 nits down to 1,200 nits to comply with EMA laws',
      'Cloud scheduling allows selling ad slots to 20+ national brands simultaneously'
    ],
    turnkeyQuotation: {
      pricingStatus: 'Official Quotation upon Request / Direct WhatsApp DM or Call',
      sampleDimensions: '14m × 6m Landmark (84 m²)',
      warrantyNote: 'Includes heavy structural pylon calculations, 4G cluster gateway, IP65 cabinets & EMA calibration'
    }
  },
  {
    id: 'staging',
    name: 'Concert & Event Staging',
    shortTitle: 'Rentals & Concerts',
    targetRole: 'Event Production Companies, Millennium Hall Stagers & Touring Crews',
    icon: Music,
    accentColor: 'from-purple-500 to-pink-500',
    headline: 'Ultra-Lightweight Die-Cast Magnesium Fast-Lock Touring Cabinets',
    coreChallenge: 'Rigging and teardown time is restricted to 4 hours. Broadcast cameras require zero scan lines, and stage transport over rough roads damages cheap cabinets.',
    solutionBlueprint: 'Apex-Rental touring series with ergonomic fast-locks, -10° to +10° convex/concave curve locks, shock-absorbing flight cases, and dual NovaStar VX-Series controllers.',
    keySpecs: {
      recommendedPitch: 'P2.6 – P3.91 Apex-Rental Touring',
      packagingType: 'Die-Cast Magnesium Curved Fast-Lock',
      refreshRate: '7,680Hz Broadcast Shutter Safe',
      controllerStack: 'Dual NovaStar VX1000 + Flight Case Loop',
      weatherRating: 'Touring Drop-Proof & Rain-Shielded',
      leadTime: 'In-Stock Addis Warehouse: 24–48 Hours'
    },
    ethiopianFactors: [
      'Includes custom steel hanging beams, ground-support stacking base, and flight cases',
      '7.5 kg ultra-light panels allow 2-person quick crew rigging without heavy cranes',
      'Immediate access to spare cabinets in Addis Ababa for emergency event backups'
    ],
    turnkeyQuotation: {
      pricingStatus: 'Official Quotation upon Request / Direct WhatsApp DM or Call',
      sampleDimensions: '12m × 4.5m Main Staging Wall (54 m²)',
      warrantyNote: 'Includes fast-rig hanging bars, mobile flight cases, dual backup controller racks & rigging training'
    }
  },
  {
    id: 'retail',
    name: 'Luxury Retail & Hospitality',
    shortTitle: 'Hotels & Showrooms',
    targetRole: 'Hotel General Managers, Boutique Owners & Mall Architects',
    icon: ShoppingBag,
    accentColor: 'from-sky-500 to-indigo-500',
    headline: 'Slim Magnetic Front-Service Architectural Curved & Pillar Displays',
    coreChallenge: 'Luxury interiors cannot accommodate rear service corridors or visible power cables. Screens must blend architecturally into columns, curved atriums, and window storefronts.',
    solutionBlueprint: 'Flexible silicone and magnetic front-service modules under 45mm profile depth, high color rendering (CRI > 95), and low-power common-cathode drivers saving 35% electricity.',
    keySpecs: {
      recommendedPitch: 'P1.86 – P2.5 Flexible & Ultra-Slim',
      packagingType: 'Magnetic Front-Extractable Armor',
      refreshRate: '3,840Hz Vivid High Color CRI 95',
      controllerStack: 'Colorlight Z6 PRO / NovaStar Mini',
      weatherRating: 'Anti-Glare Indoor Architectural',
      leadTime: 'In-Stock Addis Warehouse (P2.5) or 18-Day Import'
    },
    ethiopianFactors: [
      'Vacuum tool front-service allows swapping any module in under 15 seconds',
      'Common-cathode power rail lowers operating costs by 35% on Ethiopian tariffs',
      'Full aesthetic customization around curved pillars in Addis Ababa luxury properties'
    ],
    turnkeyQuotation: {
      pricingStatus: 'Official Quotation upon Request / Direct WhatsApp DM or Call',
      sampleDimensions: '5m × 2.8m Luxury Storefront (14 m²)',
      warrantyNote: 'Includes front-service magnetic suction tool, architectural bracketry, 15% VAT & 5-year warranty'
    }
  }
];

interface Props {
  onSelectSectorForRFQ?: (sectorName: string, specs: string) => void;
  onSelectSectorForCalc?: (pitch: string, areaM2: number) => void;
}

export const LEDSectorJourneys: React.FC<Props> = ({
  onSelectSectorForRFQ,
  onSelectSectorForCalc
}) => {
  const { theme } = useApp();
  const isLight = theme === 'light';

  const [activeSectorId, setActiveSectorId] = useState<string>('worship');

  const sector = SECTOR_JOURNEYS.find(s => s.id === activeSectorId) || SECTOR_JOURNEYS[0];

  return (
    <section id="sector-journeys" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="max-w-3xl">
          <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>02. Tailored Client Sector Blueprints</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              ROLE-BASED ONBOARDING
            </span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Engineered Specifically For Your Industry’s Demands
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            Every deployment has different mission priorities. Select your sector to review tailored hardware blueprints, local Ethiopian field factors, and turnkey engineering solutions with immediate pricing via direct DM or phone call.
          </p>
        </div>

        {/* Direct Contact Bar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
          <a
            href="https://wa.me/251942992799?text=Hello%20DemaQ%20team,%20I%20would%20like%20to%20request%20an%20official%20quotation%20and%20pricing%20for%20an%20LED%20video%20wall."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>💬 WhatsApp Direct DM</span>
          </a>
          <a
            href="tel:+251942992799"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <span>📞 Call (+251 942 992 799)</span>
          </a>
        </div>
      </div>

      {/* Persona Selection Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {SECTOR_JOURNEYS.map((sec) => {
          const isSelected = sec.id === activeSectorId;
          const Icon = sec.icon;

          return (
            <button
              key={sec.id}
              onClick={() => setActiveSectorId(sec.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/15 scale-[1.02]'
                  : isLight
                  ? 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950'
                    : isLight
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </div>

              <div>
                <div className={`text-xs font-bold leading-tight ${
                  isSelected ? 'text-white' : isLight ? 'text-slate-900' : 'text-slate-200'
                }`}>
                  {sec.name}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                  {sec.shortTitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Sector Blueprint Presentation Card */}
      <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
      }`}>
        {/* Card Header Banner */}
        <div className={`p-6 sm:p-8 border-b ${
          isLight ? 'bg-gradient-to-r from-slate-50 to-cyan-50/50 border-slate-200' : 'bg-gradient-to-r from-slate-900 to-cyan-950/30 border-slate-800'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <span className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-wider flex items-center gap-2">
              <span>Client Focus: {sector.targetRole}</span>
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
              {sector.keySpecs.leadTime}
            </span>
          </div>

          <h3 className={`text-2xl sm:text-3xl font-extrabold font-display leading-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {sector.headline}
          </h3>
        </div>

        {/* Content Body Grid */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Problem & Solution Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-5 rounded-2xl border ${
              isLight ? 'bg-rose-50/60 border-rose-200 text-slate-700' : 'bg-rose-950/20 border-rose-900/40 text-slate-300'
            }`}>
              <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400 font-mono text-xs uppercase mb-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>The Industry Pain Point:</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">{sector.coreChallenge}</p>
            </div>

            <div className={`p-5 rounded-2xl border ${
              isLight ? 'bg-emerald-50/60 border-emerald-200 text-slate-700' : 'bg-emerald-950/20 border-emerald-900/40 text-slate-300'
            }`}>
              <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase mb-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>The DemaQ Turnkey Blueprint:</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">{sector.solutionBlueprint}</p>
            </div>
          </div>

          {/* Technical Hardware Stack Grid */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-500" />
              <span>Recommended Hardware Specification</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Optimal Pitch</span>
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono block mt-1">
                  {sector.keySpecs.recommendedPitch}
                </span>
              </div>

              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Packaging Armor</span>
                <span className="text-xs font-bold font-mono block mt-1">
                  {sector.keySpecs.packagingType}
                </span>
              </div>

              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Refresh Rate</span>
                <span className="text-xs font-bold text-emerald-500 font-mono block mt-1">
                  {sector.keySpecs.refreshRate}
                </span>
              </div>

              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Controller Stack</span>
                <span className="text-xs font-bold font-mono block mt-1 truncate">
                  {sector.keySpecs.controllerStack}
                </span>
              </div>

              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Environmental</span>
                <span className="text-xs font-bold font-mono block mt-1">
                  {sector.keySpecs.weatherRating}
                </span>
              </div>

              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Turnkey Availability</span>
                <span className="text-xs font-bold text-amber-500 font-mono block mt-1 truncate">
                  {sector.keySpecs.leadTime.includes('In-Stock') ? '48h In-Stock' : '14-21d Import'}
                </span>
              </div>
            </div>
          </div>

          {/* Ethiopian Field Factors Handled */}
          <div className={`p-5 rounded-2xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
          }`}>
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-500" />
              <span>Ethiopian Local Operating Realities Addressed by DemaQ:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sector.ethiopianFactors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span className={`${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Turnkey Quotation & Quick Actions */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase block">
                Turnkey Project Quotation ({sector.turnkeyQuotation.sampleDimensions}):
              </span>
              <div className="text-base sm:text-lg font-bold text-cyan-600 dark:text-cyan-400 mt-1">
                Quoted after Official Request / Direct WhatsApp DM or Call
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {sector.turnkeyQuotation.warrantyNote}. Itemized proforma with 15% VAT delivered within 2 hours.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <a
                href={`https://wa.me/251942992799?text=${encodeURIComponent(
                  `Hello DemaQ, I would like to request an official turnkey quote for a ${sector.name} video wall (${sector.turnkeyQuotation.sampleDimensions}, ${sector.keySpecs.recommendedPitch}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>💬 WhatsApp Direct DM</span>
              </a>

              {onSelectSectorForCalc && (
                <button
                  onClick={() => onSelectSectorForCalc(sector.keySpecs.recommendedPitch, 24)}
                  className={`flex-1 md:flex-none px-4 py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Customize in Calculator</span>
                </button>
              )}

              {onSelectSectorForRFQ && (
                <button
                  onClick={() => onSelectSectorForRFQ(sector.name, `${sector.keySpecs.recommendedPitch} - ${sector.turnkeyQuotation.sampleDimensions}`)}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <span>Request {sector.shortTitle} Quote</span>
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
