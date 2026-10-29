import React, { useState } from 'react';
import { MaintenanceRequest } from '../types';
import { Wrench, Upload, Check, AlertCircle, Phone, Clock, ShieldAlert, FileText, Image as ImageIcon, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LEDMaintenancePortalProps {
  onCaptureMaintenanceRequest: (request: Omit<MaintenanceRequest, 'id' | 'timestamp' | 'status'>) => void;
}

export const LEDMaintenancePortal: React.FC<LEDMaintenancePortalProps> = ({
  onCaptureMaintenanceRequest
}) => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [screenLocation, setScreenLocation] = useState('');
  const [pixelPitch, setPixelPitch] = useState('P2.5 GOB');
  const [controllerBrand, setControllerBrand] = useState<MaintenanceRequest['controllerBrand']>('NovaStar');
  const [issueType, setIssueType] = useState<MaintenanceRequest['issueType']>('Dead Pixels / Dark Modules');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<MaintenanceRequest['urgency']>('Urgent (Same Day)');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone) return;

    const newTicketId = `MAINT-${Math.floor(1000 + Math.random() * 9000)}`;

    onCaptureMaintenanceRequest({
      clientName,
      company: company || 'Commercial Venue',
      phone,
      email: email || 'contact@client.com',
      screenLocation: screenLocation || 'Addis Ababa',
      pixelPitch,
      controllerBrand,
      issueType,
      description: description || `Reported ${issueType} on ${pixelPitch} screen with ${controllerBrand} processor.`,
      urgency,
      imageAttachment: imagePreview || undefined
    });

    setTicketId(newTicketId);
  };

  return (
    <section
      id="maintenance"
      className={`py-20 sm:py-24 border-t transition-colors duration-200 ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider">
            07. Diagnostic & Field Engineering Service
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.maintenance.title}
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {t.maintenance.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Emergency Info Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-100'
            }`}>
              <div className="flex items-center gap-2.5 text-amber-500 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <span>{t.maintenance?.emergencyTitle || 'Emergency 4-Hour On-Site Service'}</span>
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {t.maintenance?.emergencyDesc || 'For live concerts, church Sunday broadcasts, or commercial billboard outages in Addis Ababa, our rapid-response van carries spare modules, power supplies, and NovaStar/Huidu/Colorlight cards for same-day recovery.'}
              </p>
              <div className={`p-3 rounded-xl border text-xs font-mono ${
                isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-amber-950/30 border-amber-800/40 text-amber-300'
              }`}>
                {t.maintenance?.directLine || 'Direct Emergency Line:'}
                <a href="tel:+251942992799" className="block text-sm font-bold mt-0.5 hover:underline text-cyan-600 dark:text-cyan-400">
                  +251 942 992 799
                </a>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 text-xs font-mono shadow-sm ${
              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              <div className={`font-bold text-sm font-sans mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t.maintenance?.commonRepairsTitle || 'Common Repairs Handled:'}
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.maintenance?.repairDeadPixels || 'Dead pixel & cold solder diode re-working'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.maintenance?.repairCards || 'NovaStar/Huidu/Colorlight card replacement'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.maintenance?.repairPower || 'Burned MeanWell power supply swaps'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.maintenance?.repairMapping || 'Recovery of lost .rcfgx mapping files'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.maintenance?.repairChroma || 'Chroma & luminance uniformity calibration'}</span>
              </div>
            </div>
          </div>

          {/* Issue Submission & Quotation Request Form (8 cols) */}
          <div className={`lg:col-span-8 rounded-2xl border p-6 sm:p-8 shadow-sm transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100 shadow-2xl'
          }`}>
            {!ticketId ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className={`flex items-center justify-between pb-3 border-b ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}>
                  <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    <Wrench className="w-4 h-4 text-cyan-500" />
                    <span>{t.maintenance?.formTitle || 'Upload Issue & Request Repair Quotation'}</span>
                  </span>
                  <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                    {t.maintenance?.step1Title || 'Step 1 of 2: Diagnostic Submission'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {t.maintenance.clientName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Dawit Alemayehu"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                          : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {t.maintenance.company}
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Edna Mall Cinema / St. Paul Church"
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
                      {t.maintenance.phone} *
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
                      {t.maintenance.email}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.et"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                          : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {t.maintenance.issueType}
                    </label>
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value as any)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none cursor-pointer ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900'
                          : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    >
                      <option>{t.maintenance.issueDeadPixels}</option>
                      <option>{t.maintenance.issueSignal}</option>
                      <option>{t.maintenance.issuePower}</option>
                      <option>{t.maintenance.issueFlicker}</option>
                      <option>{t.maintenance.issueSetup}</option>
                      <option>{t.maintenance.issuePhysical}</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {t.maintenance.controllerBrand}
                    </label>
                    <select
                      value={controllerBrand}
                      onChange={(e) => setControllerBrand(e.target.value as any)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none cursor-pointer ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900'
                          : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    >
                      <option value="NovaStar">NovaStar (TB30/50, VX1000)</option>
                      <option value="Huidu">Huidu (HDPlayer, C16/36)</option>
                      <option value="Colorlight">Colorlight (Z6 PRO, X8)</option>
                      <option value="Linsn">Linsn (TS802/TS901)</option>
                      <option value="Brompton">Brompton (Tessera SX40)</option>
                      <option value="Unknown">Other / Not Sure</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {t.maintenance.urgency}
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none cursor-pointer ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900'
                          : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    >
                      <option>{t.maintenance.urgency4h}</option>
                      <option>{t.maintenance.urgencySameDay}</option>
                      <option>{t.maintenance.urgencyStandard}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {t.maintenance.description}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe which section of the wall is failing, recent power cuts, or error codes in NovaLCT..."
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                        : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-400'
                    }`}
                  />
                </div>

                {/* Photo Upload Zone */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {t.maintenance.photoUpload}
                  </label>
                  <div className={`p-4 border-2 border-dashed rounded-xl flex items-center justify-between gap-4 ${
                    isLight ? 'border-slate-300 bg-slate-50' : 'border-slate-800 bg-slate-900/50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                      <div>
                        <div className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                          {t.maintenance.choosePhoto}
                        </div>
                        <div className="text-[10px] text-slate-500">JPG, PNG, WebP up to 10MB</div>
                      </div>
                    </div>
                    <label className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:opacity-80 text-xs font-semibold cursor-pointer transition-opacity">
                      <span>Browse Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                      <img src={imagePreview} alt="Fault Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-cyan-500 to-blue-600 hover:opacity-95 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.maintenance.submitBtn}</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {t.maintenance.trackingTitle}
                </h3>
                <div className="text-xs font-mono px-3 py-1 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-lg inline-block">
                  Reference: #{ticketId}
                </div>
                <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {t.maintenance.trackingDesc}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setTicketId(null);
                      setClientName('');
                      setDescription('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    Submit Another Ticket
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
