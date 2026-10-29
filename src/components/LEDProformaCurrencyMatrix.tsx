import React, { useState, useEffect } from 'react';
import {
  FileText, Calculator, Printer, Copy,
  Check, ArrowRight, Sparkles, Building2, MapPin,
  Sliders, Send, CheckCircle2, MessageSquare, Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DemaqLogo } from './DemaqLogo';

export interface PitchConfig {
  pitch: string;
  category: string;
  packaging: string;
  inStock: boolean;
  leadTime: string;
}

export const PITCH_CATALOG: PitchConfig[] = [
  { pitch: 'P0.93 Nova-Pitch', category: 'Micro-LED COB', packaging: 'Flip-Chip COB', inStock: false, leadTime: '14–21 Days Air Import' },
  { pitch: 'P1.25 Precision', category: 'Fine-Pitch COB', packaging: 'Flip-Chip COB', inStock: false, leadTime: '14–21 Days Air Import' },
  { pitch: 'P1.56 Boardroom', category: 'Fine-Pitch', packaging: 'Flip-Chip COB', inStock: false, leadTime: '14–21 Days Air Import' },
  { pitch: 'P1.86 Shield-GOB', category: 'Indoor Armored', packaging: 'Glue-On-Board Epoxy', inStock: true, leadTime: '24–48h In-Stock Addis' },
  { pitch: 'P2.0 Shield-GOB', category: 'Indoor Armored', packaging: 'Glue-On-Board Epoxy', inStock: true, leadTime: '24–48h In-Stock Addis' },
  { pitch: 'P2.5 Commercial GOB', category: 'Indoor Armored', packaging: 'Glue-On-Board Epoxy', inStock: true, leadTime: '24–48h In-Stock Addis' },
  { pitch: 'P3.0 Standard Indoor', category: 'Indoor SMD', packaging: 'Surface Mount SMD', inStock: true, leadTime: '24–48h In-Stock Addis' },
  { pitch: 'P2.6 Apex-Rental', category: 'Event Rental', packaging: 'Die-Cast Magnesium', inStock: true, leadTime: '24–48h In-Stock Addis' },
  { pitch: 'P3.91 Apex-Rental', category: 'Event Rental', packaging: 'Die-Cast Magnesium', inStock: true, leadTime: '24–48h In-Stock Addis' },
  { pitch: 'P4.81 Horizon DOOH', category: 'Outdoor Billboard', packaging: 'IP65 Die-Cast Aluminum', inStock: true, leadTime: '24–48h In-Stock Addis' },
  { pitch: 'P6.0 Horizon DOOH', category: 'Outdoor Billboard', packaging: 'IP65 Iron / Aluminum', inStock: false, leadTime: '18–24 Days Sea/Air' },
];

interface Props {
  onTransferToRFQ?: (proformaDetails: string) => void;
}

export const LEDProformaCurrencyMatrix: React.FC<Props> = ({ onTransferToRFQ }) => {
  const { theme } = useApp();
  const isLight = theme === 'light';

  // Proforma Specs State
  const [widthM, setWidthM] = useState<number>(6.4);
  const [heightM, setHeightM] = useState<number>(3.6);
  const [selectedPitchIndex, setSelectedPitchIndex] = useState<number>(5); // P2.5 default
  const [clientName, setClientName] = useState<string>('Enterprise Client');
  const [companyName, setCompanyName] = useState<string>('Addis Commercial Corp');
  const [locationName, setLocationName] = useState<string>('Bole, Addis Ababa');
  const [includeInstallation, setIncludeInstallation] = useState<boolean>(true);
  const [includeStructure, setIncludeStructure] = useState<boolean>(true);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);
  const [vatIncluded, setVatIncluded] = useState<boolean>(true);

  // Sync with saved profile if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('demaq_client_profile_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setClientName(parsed.fullName);
        if (parsed.company) setCompanyName(parsed.company);
        if (parsed.installationAddress) setLocationName(parsed.installationAddress);
      }
    } catch (e) {
      // fallback
    }
  }, []);

  const activePitch = PITCH_CATALOG[selectedPitchIndex] || PITCH_CATALOG[5];
  const areaM2 = Math.max(0.5, widthM * heightM);
  const pitchMM = parseFloat(activePitch.pitch.replace(/[^0-9.]/g, '')) || 2.5;

  // Pixel resolution
  const resolutionW = Math.round((widthM * 1000) / pitchMM);
  const resolutionH = Math.round((heightM * 1000) / pitchMM);

  const proformaNumber = `DEMAQ-PF-2026-${Math.round(areaM2 * 100 + pitchMM * 10)}`;

  // Quick Aspect Ratio Pre-sets
  const handleApplyPreset = (presetW: number, presetH: number) => {
    setWidthM(presetW);
    setHeightM(presetH);
  };

  // WhatsApp formatted string generator
  const getWhatsAppText = () => {
    return `*DEMAQ DIGITAL SOLUTION — OFFICIAL PROFORMA REQUEST*
📄 Specification Code: ${proformaNumber}
👤 Client: ${clientName} (${companyName})
📍 Installation Site: ${locationName}

📐 *Screen Specifications:*
• Pitch & Packaging: ${activePitch.pitch} (${activePitch.packaging})
• Dimensions: ${widthM}m (W) × ${heightM}m (H) [${areaM2.toFixed(2)} m²]
• Native Resolution: ${resolutionW} × ${resolutionH} px
• Availability: ${activePitch.leadTime}
• Structural Framework: ${includeStructure ? 'Engineered Steel Sub-frame Included' : 'By Client'}
• Installation: ${includeInstallation ? 'Turnkey Rigging & Calibration Included' : 'Self-Install'}
• Tax Compliance: ${vatIncluded ? '15% Official Ethiopian VAT' : 'Duty Free / Pre-Tax'}

💰 *Requesting Official Price Quote:*
Please send official itemized proforma invoice and delivery schedule to this WhatsApp chat or call me directly.

🛡️ Standard 5-Year Local Commercial Warranty & 3% Spare Modules
📞 Direct Hotline: +251 942 992 799 | contact@demaqdigital.com`;
  };

  const handleCopyProforma = () => {
    const text = getWhatsAppText();
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  const handleWhatsAppSend = () => {
    const text = getWhatsAppText();
    const waUrl = `https://wa.me/251942992799?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="proforma-matrix" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="max-w-3xl">
          <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>03. Interactive Proforma Specification Generator</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              PRICING UPON REQUEST / DIRECT DM
            </span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Official Commercial Proforma & Specification Builder
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            Configure your custom video wall geometry, pixel pitch, controller redundancy, and structural sub-frame. Generate an official specification and dispatch it directly to our engineering desk for an immediate proforma quote with 15% VAT breakdown via WhatsApp DM or Phone Call.
          </p>
        </div>

        {/* Direct Contact Notice */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto">
          <a
            href="https://wa.me/251942992799?text=Hello%20DemaQ%20team,%20I%20would%20like%20to%20request%20an%20official%20proforma%20quote%20for%20an%20LED%20display."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Direct DM</span>
          </a>

          <a
            href="tel:+251942992799"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>+251 942 992 799</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Interactive Controls & Live Printable Proforma */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Screen Parameter Controls (5 cols) */}
        <div className={`lg:col-span-5 p-6 rounded-3xl border space-y-6 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-950 border-slate-800 shadow-xl'
        }`}>
          <div>
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-500" />
              <span>Step 1: Screen Geometry & Dimensions</span>
            </h4>
            <p className="text-xs text-slate-400">Specify active visual canvas area in meters.</p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleApplyPreset(4.8, 2.7)}
              className="px-2.5 py-1 rounded-lg border text-xs font-mono hover:border-cyan-500 transition-colors"
            >
              16:9 Small (4.8 × 2.7m)
            </button>
            <button
              onClick={() => handleApplyPreset(6.4, 3.6)}
              className="px-2.5 py-1 rounded-lg border text-xs font-mono hover:border-cyan-500 transition-colors bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
            >
              16:9 Standard (6.4 × 3.6m)
            </button>
            <button
              onClick={() => handleApplyPreset(9.6, 3.84)}
              className="px-2.5 py-1 rounded-lg border text-xs font-mono hover:border-cyan-500 transition-colors"
            >
              Sanctuary (9.6 × 3.84m)
            </button>
            <button
              onClick={() => handleApplyPreset(14.0, 6.0)}
              className="px-2.5 py-1 rounded-lg border text-xs font-mono hover:border-cyan-500 transition-colors"
            >
              DOOH (14 × 6m)
            </button>
          </div>

          {/* Sliders for Width & Height */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Screen Width (Meters):</span>
                <span className="font-bold text-cyan-400">{widthM.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="24.0"
                step="0.1"
                value={widthM}
                onChange={(e) => setWidthM(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Screen Height (Meters):</span>
                <span className="font-bold text-cyan-400">{heightM.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.1"
                value={heightM}
                onChange={(e) => setHeightM(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          {/* Pitch & Packaging Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-400 block uppercase">
              Step 2: Pixel Pitch & Packaging Architecture
            </label>
            <div className="relative">
              <select
                value={selectedPitchIndex}
                onChange={(e) => setSelectedPitchIndex(parseInt(e.target.value))}
                className={`w-full p-3 rounded-xl border text-xs font-mono transition-colors outline-hidden cursor-pointer ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                }`}
              >
                {PITCH_CATALOG.map((p, idx) => (
                  <option key={idx} value={idx}>
                    {p.pitch} — {p.packaging} ({p.inStock ? 'In-Stock Addis Warehouse' : 'Custom Import'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-300">
              <span>Delivery Timeframe:</span>
              <strong className="text-emerald-400">{activePitch.leadTime}</strong>
            </div>
          </div>

          {/* Line Item Inclusions */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-mono text-slate-400 block uppercase">Step 3: Turnkey Inclusions</span>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeStructure}
                  onChange={(e) => setIncludeStructure(e.target.checked)}
                  className="rounded text-cyan-500 accent-cyan-500"
                />
                <span>Engineered Structural Steel Sub-frame & Laser Bracketry</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInstallation}
                  onChange={(e) => setIncludeInstallation(e.target.checked)}
                  className="rounded text-cyan-500 accent-cyan-500"
                />
                <span>Turnkey On-Site Rigging, Cabling & NovaStar Color Calibration</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={vatIncluded}
                  onChange={(e) => setVatIncluded(e.target.checked)}
                  className="rounded text-cyan-500 accent-cyan-500"
                />
                <span>Include 15% Official Ethiopian VAT in Proforma Invoice</span>
              </label>
            </div>
          </div>

          {/* Client Details for Proforma */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 block uppercase">Recipient Information</span>
              <span className="text-[10px] font-mono text-cyan-400">⚡ Saved Profile Auto-Synced</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Client Contact Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={`p-2 rounded-lg border text-xs ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700 text-white'}`}
              />
              <input
                type="text"
                placeholder="Company / Church Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={`p-2 rounded-lg border text-xs ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700 text-white'}`}
              />
            </div>
            <input
              type="text"
              placeholder="Installation Address (e.g. Bole Medhanealem)"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className={`w-full p-2 rounded-lg border text-xs ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700 text-white'}`}
            />
          </div>
        </div>

        {/* Right Column: Formal Printable Proforma Invoice Preview (7 cols) */}
        <div className={`lg:col-span-7 rounded-3xl border overflow-hidden shadow-2xl transition-colors ${
          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/90 border-slate-700 text-slate-100'
        }`}>
          {/* Proforma Action Bar */}
          <div className={`px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center gap-2 text-cyan-500 font-bold">
              <FileText className="w-4 h-4" />
              <span>OFFICIAL COMMERCIAL PROFORMA SPECIFICATION</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyProforma}
                className="px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer hover:bg-slate-800"
              >
                {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copiedQuote ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer hover:bg-slate-800"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Official Proforma Document Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <DemaqLogo />
                <p className="text-[11px] font-mono text-slate-400 mt-1">
                  DemaQ Digital Solution · Addis Ababa, Ethiopia<br />
                  Bole Road Landmark Corridor · Tel: +251 942 992 799
                </p>
              </div>

              <div className="text-left sm:text-right font-mono text-xs">
                <div className="font-bold text-sm text-cyan-500">{proformaNumber}</div>
                <div className="text-slate-400 mt-0.5">Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                <div className="text-slate-400">Validity: 30 Calendar Days</div>
              </div>
            </div>

            {/* Bill To & Project Info */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Prepared For:</span>
                <div className="font-bold text-sm mt-0.5">{clientName}</div>
                <div className="text-slate-400">{companyName}</div>
                <div className="text-slate-400">{locationName}</div>
              </div>

              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Project Canvas:</span>
                <div className="font-bold text-sm mt-0.5">{widthM}m × {heightM}m ({areaM2.toFixed(2)} m²)</div>
                <div className="text-cyan-500 font-bold">{activePitch.pitch} ({activePitch.packaging})</div>
                <div className="text-slate-400">{resolutionW} × {resolutionH} px Native</div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                    <th className="py-2.5">Item Description</th>
                    <th className="py-2.5 text-center">Qty</th>
                    <th className="py-2.5 text-right">Pricing Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr>
                    <td className="py-3">
                      <div className="font-bold text-slate-800 dark:text-white">{activePitch.pitch} Commercial Display Panels</div>
                      <div className="text-[11px] text-slate-400">{activePitch.packaging} · MeanWell redundant 5V supplies · 3% free spare modules</div>
                    </td>
                    <td className="py-3 text-center">{areaM2.toFixed(2)} m²</td>
                    <td className="py-3 text-right font-bold text-cyan-400">Quoted upon Request / Direct DM</td>
                  </tr>

                  <tr>
                    <td className="py-3">
                      <div className="font-bold text-slate-800 dark:text-white">NovaStar / Video Controller Processing Rack</div>
                      <div className="text-[11px] text-slate-400">Gigabit Ethernet sending card, optical fiber isolation & calibrated SmartLCT configuration</div>
                    </td>
                    <td className="py-3 text-center">1 Set</td>
                    <td className="py-3 text-right font-bold text-slate-300">Included in Custom Proforma</td>
                  </tr>

                  {includeStructure && (
                    <tr>
                      <td className="py-3">
                        <div className="font-bold text-slate-800 dark:text-white">Engineered Structural Steel Sub-frame</div>
                        <div className="text-[11px] text-slate-400">Laser-leveled precision mounting framework, seismic anchors & wind-tolerance hardware</div>
                      </td>
                      <td className="py-3 text-center">Turnkey</td>
                      <td className="py-3 text-right font-bold text-slate-300">Site-Engineered Quote</td>
                    </tr>
                  )}

                  {includeInstallation && (
                    <tr>
                      <td className="py-3">
                        <div className="font-bold text-slate-800 dark:text-white">Logistics & Certified Engineering Installation</div>
                        <div className="text-[11px] text-slate-400">Local transport in Addis, crane hoisting, certified electrician tie-in & pixel calibration</div>
                      </td>
                      <td className="py-3 text-center">1 Job</td>
                      <td className="py-3 text-right font-bold text-slate-300">Quoted upon Site Assessment</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Box */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span>Proforma Pricing Policy:</span>
                  <span className="text-emerald-400 font-mono">Direct DM / Call / Quote</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  To ensure 100% accurate quotes without hidden fees, exact pricing is generated immediately upon request or direct discussion with our technical engineering desk. We provide formal Ethiopian Birr (ETB) and USD proformas with 15% VAT and bank letters.
                </p>
              </div>
            </div>

            {/* Terms & Warranty */}
            <div className="text-[10px] font-mono text-slate-400 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div>🛡️ <strong>Warranty:</strong> 5-Year Comprehensive Warranty with 3% free replacement modules provided on delivery.</div>
              <div>⚡ <strong>Power Stability:</strong> MeanWell power architecture engineered for Ethiopian 180V–260V fluctuations.</div>
              <div>🚚 <strong>Lead Time:</strong> {activePitch.leadTime}. Immediate inspection available at Addis Ababa warehouse.</div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleWhatsAppSend}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Get Proforma via WhatsApp DM</span>
              </button>

              <a
                href="tel:+251942992799"
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Call Desk (+251 942 992 799)</span>
              </a>

              {onTransferToRFQ && (
                <button
                  onClick={() => onTransferToRFQ(`${companyName} Proforma Request: ${activePitch.pitch} (${widthM}m × ${heightM}m, Installation: ${locationName})`)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <span>Submit to Fast RFQ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
