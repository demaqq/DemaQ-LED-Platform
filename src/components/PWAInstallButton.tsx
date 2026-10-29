import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Wifi, WifiOff } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'portal' | 'compact';
  isLight?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  isLight = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // If already installed in standalone mode, show a small offline-ready status or hide
  if (isInstalled) {
    if (variant === 'portal') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Installed App (Offline Active)</span>
        </span>
      );
    }
    return null;
  }

  // If not installable and not iOS, render a manual fallback button on portal or null on header
  if (!isInstallable && !isIOS && variant === 'header') {
    return null;
  }

  return (
    <>
      {variant === 'portal' ? (
        <button
          onClick={handleInstallClick}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            isLight
              ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 shadow-2xs font-bold'
              : 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-500/40 text-amber-300 font-bold'
          }`}
          title="Install DemaQ App for full offline project timeline tracking"
        >
          <Download className="w-3.5 h-3.5 text-amber-500" />
          <span>Install Offline App</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className={`h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
            isLight
              ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 shadow-xs font-bold'
              : 'bg-amber-950/60 hover:bg-amber-900/80 border-amber-500/40 text-amber-300 font-bold'
          }`}
          title="Install DemaQ Web App for offline access"
          aria-label="Install App"
        >
          <Download className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="hidden lg:inline">Install App</span>
        </button>
      )}

      {/* iOS Safari Guided Install Sheet */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-sm rounded-2xl p-5 border shadow-2xl relative animate-in fade-in zoom-in-95 ${
              isLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display">Install on iOS Safari</h4>
                <p className="text-[11px] text-slate-400">Offline Client Portal Access</p>
              </div>
            </div>

            <ol className="text-xs space-y-2.5 text-slate-600 dark:text-slate-300 my-4 list-decimal list-inside leading-relaxed">
              <li>
                Tap the <strong className="text-cyan-500">Share</strong> button in Safari's bottom toolbar (the square with an arrow pointing up).
              </li>
              <li>
                Scroll down and select <strong className="text-amber-500">Add to Home Screen</strong>.
              </li>
              <li>
                Tap <strong className="text-emerald-500">Add</strong> in the top-right corner to launch DemaQ offline anytime.
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
