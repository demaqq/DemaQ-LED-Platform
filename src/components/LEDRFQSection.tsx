import React, { useState } from 'react';
import { LEDInquiry, SiteConfig } from '../types';
import { Mail, Phone, MapPin, Send, Check, ShieldCheck, FileCheck2, Truck, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LEDRFQSectionProps {
  config: SiteConfig;
  onCaptureInquiry: (inquiry: Omit<LEDInquiry, 'id' | 'timestamp' | 'status'>) => void;
  prefilledSeries?: string;
  onOpenProfile?: () => void;
}

export const LEDRFQSection: React.FC<LEDRFQSectionProps> = ({ config, onCaptureInquiry, prefilledSeries, onOpenProfile }) => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [application, setApplication] = useState('Commercial Retail / Houses of Worship');
  const [seriesInterest, setSeriesInterest] = useState(prefilledSeries || 'DEMAQ Shield-GOB Commercial Series');
  const [pixelPitch, setPixelPitch] = useState('P2.5');
  const [availabilityRequirement, setAvailabilityRequirement] = useState<LEDInquiry['availabilityRequirement']>('In-Stock Immediate (P2.5+)');
  const [widthM, setWidthM] = useState<number>(4.8);
  const [heightM, setHeightM] = useState<number>(2.7);
  const [installationType, setInstallationType] = useState<LEDInquiry['installationType']>('Wall Mounted');
  const [projectLocation, setProjectLocation] = useState('');
  const [budgetRange, setBudgetRange] = useState('Official Quotation upon Request');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hasProfileLoaded, setHasProfileLoaded] = useState(false);

  // Automatically load saved company details and installation address from My Profile
  React.useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('demaq_client_profile_v1');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.fullName && !clientName) setClientName(parsed.fullName);
        if (parsed.company && !company) setCompany(parsed.company);
        if (parsed.phone && (!phone || phone === '+251 9')) setPhone(parsed.phone);
        if (parsed.email && !email) setEmail(parsed.email);
        if (parsed.installationAddress && !projectLocation) setProjectLocation(parsed.installationAddress);
        if (parsed.mountingType) setInstallationType(parsed.mountingType);
        if (parsed.industry) setApplication(parsed.industry);
        setHasProfileLoaded(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    if (prefilledSeries) {
      setSeriesInterest(prefilledSeries);
      if (prefilledSeries.includes('COB') || prefilledSeries.includes('XR') || prefilledSeries.includes('Nova')) {
        setAvailabilityRequirement('Custom Import by Order (<P2.5 / COB)');
        setPixelPitch('P1.25');
      } else {
        setAvailabilityRequirement('In-Stock Immediate (P2.5+)');
        setPixelPitch('P2.5');
      }
    }
  }, [prefilledSeries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone) return;

    onCaptureInquiry({
      clientName,
      company: company || 'Commercial Client',
      email: email || 'contact@client.com',
      phone,
      application,
      seriesInterest,
      pixelPitch,
      availabilityRequirement,
      dimensionsWidthM: widthM,
      dimensionsHeightM: heightM,
      installationType,
      projectLocation: projectLocation || 'Addis Ababa',
      budgetRange,
      details: details || `Quotation for ${widthM}m x ${heightM}m ${seriesInterest} (${pixelPitch}). Installation Site: ${projectLocation || 'Addis Ababa'}. Mount: ${installationType}. Requirement: ${availabilityRequirement}.`
    });

    setSubmitted(true);
  };

  return (
    <section
      id="rfq"
      className={`py-20 sm:py-24 border-t transition-colors duration-200 ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider">
            09. {t.rfq.tag}
          </div>
          <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.rfq.title}
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {t.rfq.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & SLA (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-100'
            }`}>
              <div className={`text-sm font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Addis Ababa Engineering Headquarters
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>{config.location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-cyan-500 shrink-0" />
                  <a href={`tel:${config.phone}`} className="hover:underline text-cyan-600 dark:text-cyan-400 font-mono">
                    {config.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>{config.contactEmail}</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 text-xs shadow-sm ${
              isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              <div className={`font-bold text-sm font-sans mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                What’s Included in Every DEMAQ Quote:
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Pre-installed NovaStar / Huidu receiving cards</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>3% Free Spare Modules & Power harnesses</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Local Structural Engineering & Steel Rigging Advice</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>3 to 5-Year Full Commercial Warranty</span>
              </div>
            </div>
          </div>

          {/* Form (8 cols) */}
          <div className={`lg:col-span-8 rounded-2xl border p-6 sm:p-8 shadow-sm transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100 shadow-2xl'
          }`}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Fast RFQ Profile Banner */}
                {hasProfileLoaded && (
                  <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">⚡ Fast RFQ Active:</span>
                      <span className="text-slate-300">Pre-filled from My Profile ({company || 'Profile'} · {projectLocation || 'Addis Ababa'}).</span>
                    </div>
                    {onOpenProfile && (
                      <button
                        type="button"
                        onClick={onOpenProfile}
                        className="text-[11px] underline font-mono text-cyan-300 hover:text-white cursor-pointer"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                )}

                {/* Direct DM / Call Banner */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-300">
                    <span className="font-bold text-amber-400">Direct Pricing Desk:</span> All prices are provided via official itemized proforma, direct WhatsApp DM, or phone call within 2 hours.
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://wa.me/251942992799?text=Hello%20DemaQ,%20I%20would%20like%20to%20request%20a%20direct%20quote%20and%20pricing%20for%20an%20LED%20video%20wall."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <span>💬 Direct WhatsApp DM</span>
                    </a>
                    <a
                      href="tel:+251942992799"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold font-mono text-[11px] flex items-center gap-1 cursor-pointer transition-colors border border-slate-700"
                    >
                      <span>📞 Call (+251 942 992 799)</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {t.rfq.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Solomon Gebre"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                          : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {t.rfq.company}
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. CBE Tower / Luxury Mall"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                          : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {t.rfq.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 9..."
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                          : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {t.rfq.email}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.et"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                          : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Installation Venue & Mounting Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Installation Venue & Site Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      placeholder="e.g. Bole Medhanealem / Sarbet, Addis Ababa"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                          : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Mounting Framework
                    </label>
                    <select
                      value={installationType}
                      onChange={(e: any) => setInstallationType(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                          : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-400'
                      }`}
                    >
                      <option value="Wall Mounted">Wall Mounted (Rigid Sub-frame)</option>
                      <option value="Hanging Rig / Truss">Hanging Rig / Aluminum Box Truss</option>
                      <option value="Ground Stack">Ground Stack / Mobile Stage</option>
                      <option value="Curved / Architectural">Curved / 90° Architectural Corner</option>
                      <option value="Pole Mount">Outdoor Steel Pylon / Pole Mount</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Hardware Platform
                    </label>
                    <input
                      type="text"
                      value={seriesInterest}
                      onChange={(e) => setSeriesInterest(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900'
                          : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Dimensions Width (M)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={widthM}
                      onChange={(e) => setWidthM(parseFloat(e.target.value))}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900'
                          : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Dimensions Height (M)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={heightM}
                      onChange={(e) => setHeightM(parseFloat(e.target.value))}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900'
                          : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {t.rfq.notes}
                  </label>
                  <textarea
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Specify venue ceiling height, delivery deadlines, or generator integration requirements..."
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                        : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-400'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-cyan-500 to-blue-600 hover:opacity-95 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.rfq.submitBtn}</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {t.rfq.successTitle}
                </h3>
                <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {t.rfq.successDesc}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setClientName('');
                      setDetails('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
