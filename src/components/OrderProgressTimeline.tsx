import React from 'react';
import {
  CheckCircle2, Clock, Truck, Wrench, ShieldCheck,
  Package, MapPin, Calendar, FileText, ChevronRight, Sparkles, AlertCircle
} from 'lucide-react';
import { LEDInquiry } from '../types';

export interface OrderProgressTimelineProps {
  order: LEDInquiry;
  isLight?: boolean;
}

export type OrderStage = 'processing' | 'shipping' | 'installation' | 'completed';

export interface StageDetail {
  key: OrderStage;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
  percent: number;
  substeps: { title: string; completed: boolean; timestamp?: string }[];
}

export const OrderProgressTimeline: React.FC<OrderProgressTimelineProps> = ({ order, isLight = false }) => {
  // Determine current order progress stage based on order status or details
  const getOrderStage = (inq: LEDInquiry): { stage: OrderStage; progressPercent: number } => {
    switch (inq.status) {
      case 'new':
      case 'engineering_review':
        return { stage: 'processing', progressPercent: 28 };
      case 'quotation_sent':
        return { stage: 'processing', progressPercent: 45 };
      case 'won':
        // If series contains 'In-Stock' or location mentions Addis, fast track to Shipping/Installation
        if (inq.details?.toLowerCase().includes('shipping') || inq.seriesInterest?.toLowerCase().includes('rental')) {
          return { stage: 'shipping', progressPercent: 72 };
        }
        if (inq.details?.toLowerCase().includes('install') || inq.details?.toLowerCase().includes('mounted')) {
          return { stage: 'installation', progressPercent: 88 };
        }
        return { stage: 'shipping', progressPercent: 65 };
      case 'closed':
        return { stage: 'completed', progressPercent: 100 };
      default:
        return { stage: 'processing', progressPercent: 30 };
    }
  };

  const { stage: currentStage, progressPercent } = getOrderStage(order);

  // Timeline Stage Configurations
  const stages: StageDetail[] = [
    {
      key: 'processing',
      label: 'Order Processing',
      shortLabel: 'Processing',
      icon: Package,
      percent: 30,
      description: 'Engineering verification, structural load checks & PCB module inspection.',
      substeps: [
        { title: 'Inquiry & Specifications Verified', completed: true, timestamp: 'Oct 26, 09:30 AM' },
        { title: 'Structural Steel & Electrical Calculation', completed: progressPercent >= 28, timestamp: 'Oct 26, 02:15 PM' },
        { title: 'Power Supply & Receiving Card Pre-Testing', completed: progressPercent >= 45, timestamp: progressPercent >= 45 ? 'Oct 27, 11:00 AM' : 'Pending' },
      ]
    },
    {
      key: 'shipping',
      label: 'Warehouse & Shipping',
      shortLabel: 'Shipping',
      icon: Truck,
      percent: 65,
      description: 'Flightcase packaging, Addis Warehouse staging & site dispatch.',
      substeps: [
        { title: 'Die-Cast Aluminum Cabinet Staging', completed: progressPercent >= 60, timestamp: progressPercent >= 60 ? 'Oct 27, 04:30 PM' : 'In Queue' },
        { title: 'Flightcase Sealing & Transit Inspection', completed: progressPercent >= 68, timestamp: progressPercent >= 68 ? 'Oct 28, 08:00 AM' : 'Pending Dispatch' },
        { title: 'En Route to Project Installation Site', completed: progressPercent >= 75, timestamp: 'Estimated Today' },
      ]
    },
    {
      key: 'installation',
      label: 'On-Site Installation',
      shortLabel: 'Installation',
      icon: Wrench,
      percent: 90,
      description: 'Frame mounting, front-service module setup & NovaStar color calibration.',
      substeps: [
        { title: 'Sub-Frame Mounting & Power Distribution', completed: progressPercent >= 85, timestamp: 'Scheduled' },
        { title: 'Front Service Module Magnetic Assembly', completed: progressPercent >= 92, timestamp: 'Pending Setup' },
        { title: 'NovaStar Photometer Calibration & 5-Yr Warranty', completed: progressPercent >= 100, timestamp: 'Final Step' },
      ]
    }
  ];

  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        isLight
          ? 'bg-white border-slate-300 shadow-md text-slate-900'
          : 'bg-slate-950/90 border-slate-800 text-slate-100 shadow-xl'
      }`}
    >
      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 mb-5 border-slate-200 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Real-Time Project Timeline</span>
            </span>
            {typeof navigator !== 'undefined' && !navigator.onLine ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1">
                OFFLINE CACHED
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold animate-pulse">
                LIVE TRACKING
              </span>
            )}
          </div>
          <h4 className="text-base font-bold font-display leading-tight">
            {order.company ? `${order.company} — ${order.clientName}` : order.clientName}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {order.dimensionsWidthM}m × {order.dimensionsHeightM}m · {order.pixelPitch} · {order.projectLocation || 'Addis Ababa'}
          </p>
        </div>

        {/* Overall Completion Percentage Badge */}
        <div className="text-right">
          <div className="text-2xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400">
            {progressPercent}%
          </div>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
            Overall Completion
          </div>
        </div>
      </div>

      {/* Main Continuous Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-mono font-semibold mb-2 text-slate-700 dark:text-slate-300">
          <span>Phase Status: <strong className="text-cyan-600 dark:text-cyan-400 capitalize">{currentStage}</strong></span>
          <span>Target Delivery: <strong className="text-emerald-600 dark:text-emerald-400">Within 24–48 Hours</strong></span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-400 transition-all duration-1000 ease-out shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Visual 3-Stage Milestone Nodes Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stages.map((stg, index) => {
          const Icon = stg.icon;
          const isCurrent = currentStage === stg.key;
          const isPast =
            (stg.key === 'processing' && (currentStage === 'shipping' || currentStage === 'installation' || currentStage === 'completed')) ||
            (stg.key === 'shipping' && (currentStage === 'installation' || currentStage === 'completed')) ||
            currentStage === 'completed';

          return (
            <div
              key={stg.key}
              className={`p-4 rounded-xl border relative transition-all ${
                isCurrent
                  ? isLight
                    ? 'bg-cyan-50/80 border-cyan-400 ring-2 ring-cyan-500/20 shadow-md'
                    : 'bg-cyan-950/40 border-cyan-500/60 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-950/30'
                  : isPast
                  ? isLight
                    ? 'bg-emerald-50/50 border-emerald-300 text-slate-800'
                    : 'bg-emerald-950/20 border-emerald-900/50 text-slate-300'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-80'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isPast
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-cyan-500 text-slate-950 animate-pulse'
                        : 'bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="font-bold text-xs font-display">{stg.label}</span>
                </div>

                <Icon className={`w-4 h-4 ${isCurrent ? 'text-cyan-500' : isPast ? 'text-emerald-500' : 'text-slate-400'}`} />
              </div>

              <p className="text-[11px] leading-relaxed mb-3 text-slate-600 dark:text-slate-400">
                {stg.description}
              </p>

              {/* Checklist Sub-steps */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-mono">
                {stg.substeps.map((sub, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        sub.completed
                          ? 'bg-emerald-500'
                          : isCurrent && sIdx === 0
                          ? 'bg-amber-500 animate-ping'
                          : 'bg-slate-400 dark:bg-slate-700'
                      }`} />
                      <span className={sub.completed ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-500'}>
                        {sub.title}
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 shrink-0">
                      {sub.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Action Footer */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Assigned DemaQ Field Engineers: Addis Ababa Staging Team</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={`https://wa.me/251942992799?text=${encodeURIComponent(
              `Hello DemaQ, I am tracking my active order (${order.dimensionsWidthM}x${order.dimensionsHeightM}m ${order.pixelPitch} for ${order.clientName}). Could you give me a status update on Shipping / On-site Installation?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chat Live with Dispatch</span>
          </a>
        </div>
      </div>
    </div>
  );
};
