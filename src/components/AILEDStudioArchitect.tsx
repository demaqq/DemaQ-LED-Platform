import React, { useState } from 'react';
import {
  Sparkles, Cpu, Zap, Shield, ArrowRight, CheckCircle2,
  AlertTriangle, RefreshCw, Calculator, Send, Building2, Church,
  Briefcase, ShoppingBag, Video, Sliders, Check, Music, Wine,
  UtensilsCrossed, Trophy, Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type VenueType =
  | 'church'
  | 'boardroom'
  | 'retail'
  | 'dooh'
  | 'xrStudio'
  | 'eventHall'
  | 'club'
  | 'lounge'
  | 'restaurant'
  | 'sportsbar';

interface AIProposal {
  pitch: string;
  pitchMm: number;
  packaging: string;
  widthM: number;
  heightM: number;
  resW: number;
  resH: number;
  totalPixels: number;
  cabinets: number;
  avgKw: number;
  peakKw: number;
  breakerAmps: string;
  controller: string;
  controllerEcosystems?: {
    novastar: string;
    huidu: string;
    colorlight: string;
    linsn: string;
  };
  leadTime: string;
  reasoning: string;
}

interface AILEDStudioArchitectProps {
  onLoadIntoCalculator?: (width: number, height: number, pitchSeries: string) => void;
  onNavigateToRFQ?: (details: string) => void;
}

export const AILEDStudioArchitect: React.FC<AILEDStudioArchitectProps> = ({
  onLoadIntoCalculator,
  onNavigateToRFQ
}) => {
  const { theme, t, language } = useApp();
  const isLight = theme === 'light';

  // Venue planner form inputs
  const [venueType, setVenueType] = useState<VenueType>('church');
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [roomHeight, setRoomHeight] = useState<number>(6);
  const [closestAudienceDist, setClosestAudienceDist] = useState<number>(3.5);
  const [ambientLight, setAmbientLight] = useState<'ambientLow' | 'ambientMed' | 'ambientHigh' | 'ambientOutdoor'>('ambientMed');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<'novastar' | 'huidu' | 'colorlight' | 'linsn'>('novastar');

  // Active Proposal
  const [proposal, setProposal] = useState<AIProposal | null>(() => {
    // Initial benchmark: 4.8m x 2.88m P2.5 GOB = 2,211,840 pixels (NovaStar VX400 2.6M capacity)
    return {
      pitch: 'DEMAQ Shield-GOB P2.5 (In-Stock Ethiopia)',
      pitchMm: 2.5,
      packaging: 'Glue-On-Board (GOB Optical Polyurethane Epoxy Armor)',
      widthM: 4.8,
      heightM: 2.88,
      resW: 1920,
      resH: 1152,
      totalPixels: 2211840,
      cabinets: 48,
      avgKw: 1.66,
      peakKw: 4.42,
      breakerAmps: '32A Single-Phase (or 16A 3-Phase 380V/220V)',
      controller: 'NovaStar VX400 All-in-One Controller (2.6M px capacity, 4x Gigabit RJ45)',
      controllerEcosystems: {
        novastar: 'NovaStar VX400 (2.6M px, 4x Gigabit RJ45 Ports, Dual Layers)',
        huidu: 'Huidu HD-VP620 (2.6M px, 4x Gigabit RJ45 Ports, Audio Input)',
        colorlight: 'Colorlight X4e (2.6M px, 4x Gigabit RJ45 Ports, DVI/HDMI Loop)',
        linsn: 'Linsn X200 (2.3M px, 4x Gigabit RJ45 Ports, Hardware Scaling)'
      },
      leadTime: 'In-Stock Ethiopia Warehouse (24–48h Dispatch)',
      reasoning: 'At 3.5m closest viewing distance, P2.5 reaches human retinal acuity limits while GOB epoxy provides 100% collision proofing against accidental pulpit or event bumps.'
    };
  });

  // Helper to compute dynamic multi-brand controllers based on pixel capacity
  const getControllerEcosystems = (pixels: number) => {
    if (pixels <= 650000) {
      return {
        primary: 'NovaStar TB1 / Taurus TB30 (650K px, Cloud Wi-Fi/4G)',
        novastar: 'NovaStar TB1 / Taurus TB30 (650K px, 1x Gigabit RJ45)',
        huidu: 'Huidu HD-A3L Cloud Box (650K px, 1x Gigabit RJ45)',
        colorlight: 'Colorlight C3 Cloud Player (650K px, 1x Gigabit RJ45)',
        linsn: 'Linsn TS802D Sender Card (1.3M px, 2x RJ45 Ports)'
      };
    } else if (pixels <= 1300000) {
      return {
        primary: 'NovaStar VX400 / TB2 (1.3M px, 2x Gigabit RJ45 Ports)',
        novastar: 'NovaStar TB2 / VX400 (1.3M px, 2x Gigabit RJ45 Ports)',
        huidu: 'Huidu HD-VP410 (1.3M px, 2x Gigabit RJ45 Ports)',
        colorlight: 'Colorlight X2 / C4 (1.3M px, 2x Gigabit RJ45 Ports)',
        linsn: 'Linsn X100 (1.3M px, 2x Gigabit RJ45 Ports)'
      };
    } else if (pixels <= 2600000) {
      return {
        primary: 'NovaStar VX400 (2.6M px, 4x Gigabit RJ45 Ports)',
        novastar: 'NovaStar VX400 (2.6M px, 4x Gigabit RJ45 Ports, Dual Layers)',
        huidu: 'Huidu HD-VP620 (2.6M px, 4x Gigabit RJ45 Ports, Audio Input)',
        colorlight: 'Colorlight X4e (2.6M px, 4x Gigabit RJ45 Ports, HDMI/DVI Loop)',
        linsn: 'Linsn X200 (2.3M px, 4x Gigabit RJ45 Ports, Hardware Scaling)'
      };
    } else if (pixels <= 3900000) {
      return {
        primary: 'NovaStar VX600 (3.9M px, 6x Gigabit RJ45 Ports, 3x Layers)',
        novastar: 'NovaStar VX600 (3.9M px, 6x Gigabit RJ45 Ports, 3x Layers)',
        huidu: 'Huidu HD-VP820 (3.9M px, 6x Gigabit RJ45 Ports, 4K Input)',
        colorlight: 'Colorlight X6 (3.9M px, 6x Gigabit RJ45 Ports, 3x Windows)',
        linsn: 'Linsn X800 (3.9M px, 6x Gigabit RJ45 Ports, USB/LAN)'
      };
    } else if (pixels <= 6500000) {
      return {
        primary: 'NovaStar VX1000 (6.5M px, 10x Gigabit RJ45 Ports, 4K Input)',
        novastar: 'NovaStar VX1000 (6.5M px, 10x Gigabit RJ45 Ports, 4K Input, 3G-SDI)',
        huidu: 'Huidu HD-VP1220 (7.8M px, 12x Gigabit RJ45 Ports, Dual 4K Input)',
        colorlight: 'Colorlight X12 (7.8M px, 12x Gigabit RJ45 Ports, Multi-Layer)',
        linsn: 'Linsn X2000 (8.2M px, 12x Gigabit RJ45 Ports, Genlock Ready)'
      };
    } else if (pixels <= 10400000) {
      return {
        primary: 'NovaStar VX16s / NovaPro UHD Jr (10.4M px, 16x RJ45 Ports, 4K@60Hz)',
        novastar: 'NovaStar VX16s / NovaPro UHD (10.4M px, 16x Gigabit RJ45, 4K@60Hz)',
        huidu: 'Huidu HD-VP1640 (10.4M px, 16x Gigabit RJ45 Ports, 4K HDMI 2.0)',
        colorlight: 'Colorlight X16e / Z6 PRO 4K (10.4M px, 16x Gigabit RJ45)',
        linsn: 'Linsn X8216 (10.4M px, 16x Gigabit RJ45 Ports, 4K Matrix)'
      };
    } else {
      return {
        primary: 'NovaStar MX40 Pro / CX40 8K COEX Modular Processor Platform',
        novastar: 'NovaStar MX40 Pro / CX40 8K COEX Modular Platform (Multi-Fiber)',
        huidu: 'Huidu VP1640 Multi-Unit Master-Slave Cascaded Grid',
        colorlight: 'Colorlight Z8t / CS20 8K Ultra Processing Grid',
        linsn: 'Linsn 8K Server Grid Array'
      };
    }
  };

  // Diagnostics state
  const [glitchDesc, setGlitchDesc] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);

  const handleGenerateProposal = async () => {
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai-architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueType,
          roomWidth,
          roomHeight,
          closestAudienceDist,
          ambientLight,
          language
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.proposal) {
          const p = data.proposal;
          if (!p.controllerEcosystems && p.totalPixels) {
            const eco = getControllerEcosystems(p.totalPixels);
            p.controllerEcosystems = {
              novastar: eco.novastar,
              huidu: eco.huidu,
              colorlight: eco.colorlight,
              linsn: eco.linsn
            };
            p.controller = eco.primary;
          }
          setProposal(p);
          setIsGenerating(false);
          return;
        }
      }
    } catch (e) {
      console.warn('AI Architect API call fallback:', e);
    }

    // Local Mathematical & Engineering Rules Algorithm Fallback
    setTimeout(() => {
      let recPitch = 2.5;
      let platform = 'DEMAQ Shield-GOB (In-Stock Ethiopia)';
      let packaging = 'Glue-On-Board (GOB Optical Polyurethane Epoxy Armor)';
      let leadTime = 'In-Stock Ethiopia Warehouse (24–48h Dispatch)';

      if (venueType === 'club') {
        recPitch = closestAudienceDist <= 2.2 ? 2.0 : 2.5;
        platform = 'DEMAQ Shield-GOB Nightlife Pro (In-Stock Ethiopia)';
        packaging = 'GOB Optical Epoxy Polymer (Resists Bass Vibration, Strobe Sync & Liquid Drops)';
        leadTime = 'In-Stock Ethiopia (24–48h Setup)';
      } else if (venueType === 'lounge') {
        recPitch = closestAudienceDist <= 1.8 ? 1.25 : (closestAudienceDist <= 2.5 ? 1.87 : 2.0);
        platform = 'DEMAQ Nova-Pitch COB / GOB VIP Lounge Matrix';
        packaging = 'High-Contrast True Black Polycarbonate (Warm Ambient Dimming & Anti-Glare)';
        leadTime = recPitch <= 1.87 ? 'Import by Order (14–21 Days Air Cargo)' : 'In-Stock Ethiopia';
      } else if (venueType === 'restaurant') {
        recPitch = closestAudienceDist <= 2.0 ? 1.87 : 2.5;
        platform = 'DEMAQ Slim-Profile Commercial GOB (Dining Series)';
        packaging = 'Wipe-Clean Anti-Reflective Optical Epoxy Armor';
        leadTime = 'In-Stock Ethiopia (24–48h Setup)';
      } else if (venueType === 'sportsbar') {
        recPitch = closestAudienceDist <= 2.5 ? 2.5 : 3.0;
        platform = 'DEMAQ Shield-GOB 3840Hz Sports Arena Display';
        packaging = 'High-Refresh 3,840Hz SMD/GOB (Motion-Blur Free Fast Sports & 160° Viewing)';
        leadTime = 'In-Stock Ethiopia (24–48h Setup)';
      } else if (closestAudienceDist <= 1.8) {
        recPitch = 1.25;
        platform = 'DEMAQ Nova-Pitch COB (Custom Import)';
        packaging = 'COB (Flip-Chip Chip-On-Board Micro-LED)';
        leadTime = 'Import by Order (14–21 Days Air Cargo)';
      } else if (closestAudienceDist <= 2.8) {
        recPitch = 1.87;
        platform = 'DEMAQ Nova-Pitch COB (Custom Import)';
        packaging = 'COB (Flip-Chip Chip-On-Board Micro-LED)';
        leadTime = 'Import by Order (14–21 Days Air Cargo)';
      } else if (venueType === 'dooh' || ambientLight === 'ambientOutdoor') {
        recPitch = 4.81;
        platform = 'DEMAQ Horizon-DOOH (Outdoor 10,000 Nits)';
        packaging = 'SMD High-Brightness Outdoor IP66';
        leadTime = 'In-Stock Modules (Rapid Assembly in Ethiopia)';
      }

      const targetW = Math.max(2.4, Math.min(10.0, +(roomWidth * 0.4).toFixed(1)));
      const targetH = +(targetW * (9 / 16)).toFixed(2);
      const area = targetW * targetH;

      const resW = Math.round((targetW * 1000) / recPitch);
      const resH = Math.round((targetH * 1000) / recPitch);
      const totalPixels = resW * resH;

      const cabW = recPitch < 2.0 ? 0.60 : (recPitch >= 4.0 ? 0.96 : 0.64);
      const cabH = recPitch < 2.0 ? 0.3375 : (recPitch >= 4.0 ? 0.96 : 0.48);
      const cabinets = Math.ceil(targetW / cabW) * Math.ceil(targetH / cabH);

      const avgKw = +((area * 120) / 1000).toFixed(2);
      const peakKw = +((area * 320) / 1000).toFixed(2);
      const breakerAmps = peakKw > 6 ? '32A 3-Phase 380V/220V Grid' : '32A Single-Phase 220V Grid';

      const eco = getControllerEcosystems(totalPixels);

      setProposal({
        pitch: `${platform} (Pitch: P${recPitch}mm)`,
        pitchMm: recPitch,
        packaging,
        widthM: targetW,
        heightM: targetH,
        resW,
        resH,
        totalPixels,
        cabinets,
        avgKw,
        peakKw,
        breakerAmps,
        controller: eco.primary,
        controllerEcosystems: {
          novastar: eco.novastar,
          huidu: eco.huidu,
          colorlight: eco.colorlight,
          linsn: eco.linsn
        },
        leadTime,
        reasoning: `Based on an audience distance of ${closestAudienceDist}m in a ${roomWidth}m wide ${venueType}, a ${targetW}m × ${targetH}m screen achieves full optical clarity without individual diode grain. Packaging with ${packaging} guarantees structural longevity in Ethiopian venues.`
      });

      setIsGenerating(false);
    }, 600);
  };

  const handleRunDiagnosis = async () => {
    if (!glitchDesc.trim()) return;
    setIsDiagnosing(true);

    try {
      const res = await fetch('/api/ai-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueText: glitchDesc, language })
      });

      if (res.ok) {
        const data = await res.json();
        setDiagnosisResult(data.diagnosis);
        setIsDiagnosing(false);
        return;
      }
    } catch (e) {
      console.warn('AI Diagnose API fallback:', e);
    }

    setTimeout(() => {
      const lower = glitchDesc.toLowerCase();
      let steps = '';
      if (lower.includes('line') || lower.includes('green') || lower.includes('horizontal') || lower.includes('vertical')) {
        steps = `Diagnostic Analysis for Display Lines:\n1. Root Cause: 85% probability of HUB75 ribbon cable shift or oxidization after voltage surge. 15% probability of cold-solder on the driver IC (MBI5153 / ICN2053).\n2. Field Steps: Unclip the 16-pin grey ribbon cable between receiving card and module; wipe with isopropyl alcohol and re-seat. If line persists, replace the module with an in-stock spare.\n3. Voltage Check: Verify that the MeanWell 5V rail measures between 4.85V and 5.05V with a multimeter.`;
      } else if (lower.includes('dark') || lower.includes('black') || lower.includes('off') || lower.includes('dead')) {
        steps = `Diagnostic Analysis for Dark / Dead Modules:\n1. Root Cause: Loss of 5V DC power harness feeding the module or disconnected RJ45 data loop.\n2. Field Steps: Check if adjacent modules on the same cascade chain are lit. If an entire vertical row is dark, inspect the receiving card power indicator (Green RUN LED should blink at 1Hz).\n3. DemaQ Dispatch: If diode solder is required, contact our Bole rapid-dispatch van at +251 942 992 799 for on-site hot-air reflow.`;
      } else {
        steps = `Diagnostic Analysis:\n1. Inspection: Check NovaLCT hardware configuration and verify Gigabit Ethernet link speed on the NovaStar VX1000.\n2. Cable Integrity: Ensure CAT6 STP cables are shielded against induction noise from building elevator motors or ungrounded generator lines.\n3. Support: Upload a photo in our Maintenance Portal or call our technical desk (+251 942 992 799).`;
      }
      setDiagnosisResult(steps);
      setIsDiagnosing(false);
    }, 500);
  };

  return (
    <section
      id="ai-architect"
      className={`py-20 sm:py-24 border-y relative transition-colors duration-200 ${
        isLight ? 'bg-slate-100/70 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold mb-2 uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span>{t.aiArchitect.tag}</span>
            <span>· Optical & Power Calculations</span>
          </div>

          <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.aiArchitect.title}
          </h2>

          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {t.aiArchitect.subtitle}
          </p>
        </div>

        {/* Interactive 2-Column Deck: Parameters on Left, AI Blueprint on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form Column (5 Cols) */}
          <div className={`lg:col-span-5 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isLight ? 'bg-white border-slate-300 shadow-xl shadow-slate-900/8 text-slate-900 ring-1 ring-slate-900/5' : 'bg-slate-900/80 border-slate-800 text-slate-100 shadow-xl'
          }`}>
            <h3 className="text-base font-bold font-display mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-500" />
              <span>Venue Parameters</span>
            </h3>

            {/* 1. Venue Type */}
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t.aiArchitect.venueLabel}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'church', label: t.aiArchitect.church, icon: Church },
                  { key: 'boardroom', label: t.aiArchitect.boardroom, icon: Briefcase },
                  { key: 'retail', label: t.aiArchitect.retail, icon: ShoppingBag },
                  { key: 'club', label: t.aiArchitect.club || 'Nightclub & Music Stage', icon: Music },
                  { key: 'lounge', label: t.aiArchitect.lounge || 'VIP Lounge & Hospitality', icon: Wine },
                  { key: 'restaurant', label: t.aiArchitect.restaurant || 'Restaurant & Fine Dining', icon: UtensilsCrossed },
                  { key: 'sportsbar', label: t.aiArchitect.sportsbar || 'Sports Bar & Arena Screen', icon: Trophy },
                  { key: 'dooh', label: t.aiArchitect.dooh, icon: Building2 },
                  { key: 'xrStudio', label: t.aiArchitect.xrStudio, icon: Video },
                  { key: 'eventHall', label: t.aiArchitect.eventHall, icon: Zap }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = venueType === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setVenueType(item.key as any)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? isLight
                            ? 'bg-cyan-50 border-cyan-500 text-cyan-900 font-bold shadow-xs'
                            : 'bg-cyan-950/60 border-cyan-400 text-cyan-200 font-bold'
                          : isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Room Dimensions Sliders */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400">Room Width</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{roomWidth}m</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="35"
                  step="1"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400">Ceiling Height</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{roomHeight}m</span>
                </div>
                <input
                  type="range"
                  min="2.8"
                  max="14"
                  step="0.5"
                  value={roomHeight}
                  onChange={(e) => setRoomHeight(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Closest Audience Distance */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500 dark:text-slate-400">{t.aiArchitect.distLabel}</span>
                <span className="font-mono font-bold text-amber-500">{closestAudienceDist}m</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="18.0"
                step="0.5"
                value={closestAudienceDist}
                onChange={(e) => setClosestAudienceDist(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Calculates retinal resolution threshold so audience cannot see pixels.
              </div>
            </div>

            {/* 4. Ambient Light Condition */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {t.aiArchitect.ambientLabel}
              </label>
              <select
                value={ambientLight}
                onChange={(e) => setAmbientLight(e.target.value as any)}
                className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none cursor-pointer ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-800'
                    : 'bg-slate-950 border-slate-700 text-slate-200'
                }`}
              >
                <option value="ambientLow">{t.aiArchitect.ambientLow}</option>
                <option value="ambientMed">{t.aiArchitect.ambientMed}</option>
                <option value="ambientHigh">{t.aiArchitect.ambientHigh}</option>
                <option value="ambientOutdoor">{t.aiArchitect.ambientOutdoor}</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGenerateProposal}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 hover:from-cyan-400 hover:to-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.aiArchitect.generating || 'DemaQ is computing optical calculations & power loads...'}</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>{t.aiArchitect.generateBtn || 'Generate Proposal'}</span>
                </>
              )}
            </button>
          </div>

          {/* AI Engineering Blueprint Output Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {proposal ? (
              <div className={`p-6 sm:p-7 rounded-2xl border transition-colors relative overflow-hidden ${
                isLight ? 'bg-white border-slate-300 shadow-2xl shadow-slate-900/10 text-slate-900 ring-1 ring-slate-900/5' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl shadow-black/80'
              }`}>
                {/* Decorative Accent Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4 mb-5 border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                      OPTIMIZED ENGINEERING BLUEPRINT
                    </span>
                    <h3 className="text-xl font-bold font-display mt-1 text-slate-900 dark:text-white">
                      {proposal.pitch}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-medium">INVENTORY & DISPATCH</span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {proposal.leadTime || 'In-Stock: 24–48h Delivery'}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 block">
                      5-Year Commercial Warranty
                    </span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-950/60 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-medium">{t.aiArchitect.screenDim}</span>
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                      {proposal.widthM}m × {proposal.heightM}m
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5 font-medium">
                      {(proposal.widthM * proposal.heightM).toFixed(1)} m² Active Surface
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-950/60 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-medium">{t.aiArchitect.resNative}</span>
                    <span className="text-sm font-bold font-mono text-cyan-600 dark:text-cyan-400">
                      {proposal.resW} × {proposal.resH} px
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5 font-medium">
                      {(proposal.totalPixels / 1000000).toFixed(2)} Megapixels
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-950/60 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-medium">Cabinet Array</span>
                    <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-500">
                      {proposal.cabinets} Panels
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5 font-medium">Die-Cast Aluminum</span>
                  </div>

                  <div className={`p-3 rounded-xl border col-span-2 sm:col-span-1 ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-950/60 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-medium">{t.aiArchitect.elecPower}</span>
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                      {proposal.avgKw} kW (Peak {proposal.peakKw} kW)
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5 font-medium">{proposal.breakerAmps}</span>
                  </div>

                  <div className={`p-3 rounded-xl border col-span-2 ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-950/60 border-slate-800'}`}>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-medium">Surface Encapsulation & Durability</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
                      {proposal.packaging}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium block mt-0.5">
                      ✓ Anti-knock · Dustproof & Wipe-Clean
                    </span>
                  </div>
                </div>

                {/* Multi-Brand Controller Ecosystem Recommendations (Pixel Cap Matched) */}
                <div className={`p-4 rounded-xl border mb-5 ${isLight ? 'bg-slate-100/70 border-slate-300 shadow-xs' : 'bg-slate-950/80 border-slate-800'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-cyan-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
                        Multi-Brand Video Processor & Controller Options
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      Matched to {(proposal.totalPixels / 1000000).toFixed(2)} MP Load
                    </span>
                  </div>

                  {/* Brand Tabs */}
                  <div className="grid grid-cols-4 gap-1.5 mb-3 text-xs font-mono">
                    {[
                      { id: 'novastar', name: 'NovaStar' },
                      { id: 'huidu', name: 'Huidu' },
                      { id: 'colorlight', name: 'Colorlight' },
                      { id: 'linsn', name: 'Linsn' }
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBrand(b.id as any)}
                        className={`py-1.5 px-2 rounded-lg text-center text-xs transition-all cursor-pointer ${
                          selectedBrand === b.id
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                            : isLight
                            ? 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>

                  {/* Selected Brand Details */}
                  <div className={`p-3 rounded-lg border text-xs ${
                    isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}>
                    {selectedBrand === 'novastar' && (
                      <div className="space-y-1">
                        <div className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center justify-between">
                          <span>{proposal.controllerEcosystems?.novastar || proposal.controller}</span>
                          <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">NovaLCT Ready</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Industry standard controller with ultra-low latency, SmartLCT mapping, 18-bit+ grayscale processing, and seamless cabinet cascading.
                        </p>
                      </div>
                    )}
                    {selectedBrand === 'huidu' && (
                      <div className="space-y-1">
                        <div className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center justify-between">
                          <span>{proposal.controllerEcosystems?.huidu || 'Huidu HD-VP Series Processor'}</span>
                          <span className="text-[10px] font-mono text-purple-500 bg-purple-500/10 px-1.5 py-0.5 rounded">HDPlayer / 4G Cloud</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Cost-effective video processor with built-in audio extraction, USB direct plug-and-play playback, and mobile phone app screen control.
                        </p>
                      </div>
                    )}
                    {selectedBrand === 'colorlight' && (
                      <div className="space-y-1">
                        <div className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center justify-between">
                          <span>{proposal.controllerEcosystems?.colorlight || 'Colorlight X Series Processor'}</span>
                          <span className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">LEDVISION Cloud</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          High-end video processing with HDR10 enhancement, multi-window PiP layering, and Colorlight Cloud cluster synchronization.
                        </p>
                      </div>
                    )}
                    {selectedBrand === 'linsn' && (
                      <div className="space-y-1">
                        <div className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center justify-between">
                          <span>{proposal.controllerEcosystems?.linsn || 'Linsn X Series Controller'}</span>
                          <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">LEDStudio Ready</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Industrial-grade robust sending solution with RV908 receiver cards, long-distance gigabit transmission, and reliable hardware scaling.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className={`p-3.5 rounded-xl border mb-5 text-xs leading-relaxed ${
                  isLight ? 'bg-cyan-50/60 border-cyan-200 text-slate-700' : 'bg-cyan-950/30 border-cyan-800/50 text-slate-300'
                }`}>
                  <strong className="text-cyan-700 dark:text-cyan-300 font-semibold block mb-1">
                    Engineering Justification:
                  </strong>
                  {proposal.reasoning}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {onLoadIntoCalculator && (
                    <button
                      onClick={() => onLoadIntoCalculator(proposal.widthM, proposal.heightM, proposal.pitch)}
                      className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>{t.aiArchitect.applyCalc}</span>
                    </button>
                  )}

                  {onNavigateToRFQ && (
                    <button
                      onClick={() => onNavigateToRFQ(`AI Blueprint: ${proposal.widthM}x${proposal.heightM}m (${proposal.pitch}), ${proposal.resW}x${proposal.resH}px, Controller: ${proposal.controller}`)}
                      className={`px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                      }`}
                    >
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                      <span>{t.aiArchitect.requestQuote}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            {/* AI Screen Fault Diagnostics Assistant Tool */}
            <div className={`p-5 sm:p-6 rounded-2xl border transition-colors shadow-sm ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900/80 border-slate-800 text-slate-100'
            }`}>
              <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-amber-500 uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>{t.aiArchitect.diagnosticsTag}</span>
              </div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                {t.aiArchitect.diagnosticsTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
                {t.aiArchitect.diagnosticsDesc}
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={glitchDesc}
                  onChange={(e) => setGlitchDesc(e.target.value)}
                  placeholder={t.aiArchitect.diagnosticsInputPlaceholder}
                  className={`flex-1 p-2.5 rounded-xl text-xs border focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-800'
                      : 'bg-slate-950 border-slate-700 text-slate-200'
                  }`}
                />
                <button
                  onClick={handleRunDiagnosis}
                  disabled={!glitchDesc.trim() || isDiagnosing}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                >
                  {isDiagnosing ? '...' : t.aiArchitect.diagnoseBtn}
                </button>
              </div>

              {diagnosisResult && (
                <div className={`mt-3 p-3.5 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap ${
                  isLight ? 'bg-amber-50/70 border-amber-200 text-slate-800' : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                }`}>
                  {diagnosisResult}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
