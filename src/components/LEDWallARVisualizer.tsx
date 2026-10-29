import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, Eye, Maximize2, Move, RotateCw, Video, Sparkles, Download,
  CheckCircle2, Share2, Layers, RefreshCw, Sliders, ShieldCheck,
  AlertCircle, Phone, ArrowRight, Zap, Monitor, Building2, Church, Briefcase, ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ARWallConfig {
  widthM: number;
  heightM: number;
  pixelPitch: string;
  contentType: 'worship' | 'commercial' | 'cyberpunk' | 'control_room';
  perspectiveTiltX: number;
  perspectiveTiltY: number;
  scalePercent: number;
  brightnessPercent: number;
}

export const LEDWallARVisualizer: React.FC = () => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  const [activeMode, setActiveMode] = useState<'camera_ar' | 'virtual_room'>('virtual_room');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // AR Screen Configuration State
  const [config, setConfig] = useState<ARWallConfig>({
    widthM: 4.8,
    heightM: 2.7,
    pixelPitch: 'P2.5 GOB (In-Stock)',
    contentType: 'worship',
    perspectiveTiltX: 0,
    perspectiveTiltY: 0,
    scalePercent: 100,
    brightnessPercent: 95
  });

  // Virtual Room Preset
  const [roomPreset, setRoomPreset] = useState<'church' | 'boardroom' | 'retail' | 'outdoor'>('church');
  const [wallPosition, setWallPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Camera stream ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  // Pitch calculation specs
  const pitchMM = parseFloat(config.pixelPitch.replace(/[^0-9.]/g, '')) || 2.5;
  const areaM2 = config.widthM * config.heightM;
  const resolutionW = Math.round((config.widthM * 1000) / pitchMM);
  const resolutionH = Math.round((config.heightM * 1000) / pitchMM);
  const totalPixels = resolutionW * resolutionH;

  // Cabinet estimations (assuming standard 640x480mm or 500x500mm)
  const cabinetsWide = Math.ceil(config.widthM / 0.64);
  const cabinetsHigh = Math.ceil(config.heightM / 0.48);
  const totalCabinets = cabinetsWide * cabinetsHigh;

  // Power load calculations
  const avgPowerKW = ((areaM2 * 120) / 1000).toFixed(1);
  const maxPowerKW = ((areaM2 * 320) / 1000).toFixed(1);

  // Availability determination
  const isStock = config.pixelPitch.includes('In-Stock');

  // Handle starting camera stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setActiveMode('camera_ar');
    } catch (err: any) {
      console.warn('Camera permission denied or unavailable:', err);
      setCameraError('Camera access not available on this device or permission was denied. Falling back to the 3D Virtual Room Simulator.');
      setActiveMode('virtual_room');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle dragging the AR LED screen on screen
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - wallPosition.x, y: e.clientY - wallPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setWallPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - wallPosition.x,
        y: e.touches[0].clientY - wallPosition.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setWallPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Capture snapshot with composite dimensions HUD overlay
  const handleTakeSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2000);
  };

  // Content theme styles
  const contentThemes = {
    worship: {
      name: 'Worship / Sanctuary Stage',
      bg: 'from-amber-600 via-rose-700 to-indigo-950',
      text: 'HOPE · FAITH · GLORY',
      accent: 'text-amber-300'
    },
    commercial: {
      name: '4K Commercial Billboard',
      bg: 'from-cyan-500 via-blue-600 to-indigo-900',
      text: 'EXPERIENCE THE FUTURE · 8K ULTRA HDR',
      accent: 'text-cyan-300'
    },
    cyberpunk: {
      name: 'Concert & EDM Live Lightshow',
      bg: 'from-fuchsia-600 via-purple-700 to-slate-950',
      text: 'LIVE AT MILLENNIUM HALL · 7,680Hz',
      accent: 'text-fuchsia-300'
    },
    control_room: {
      name: 'Mission Control Telemetry',
      bg: 'from-slate-900 via-cyan-950 to-slate-950',
      text: 'NETWORK SOC · ALL SYSTEMS OPTIMAL',
      accent: 'text-emerald-300'
    }
  };

  const currentTheme = contentThemes[config.contentType];

  // Room backdrops for Virtual 3D Room mode
  const roomBackgrounds = {
    church: '/src/assets/images/led_worship_sanctuary_real_1790853041095.jpg',
    boardroom: '/src/assets/images/led_boardroom_real_1790853068703.jpg',
    retail: '/src/assets/images/led_retail_flexible_real_1790853123520.jpg',
    outdoor: '/src/assets/images/led_outdoor_dooh_real_1790853056151.jpg'
  };

  return (
    <section
      id="ar-visualizer"
      className={`py-20 sm:py-28 border-t relative overflow-hidden transition-colors duration-200 ${
        isLight ? 'bg-slate-100/70 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-amber-500/5 to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider">
            <span className={`px-2 py-0.5 rounded border font-bold uppercase ${
              isLight ? 'bg-cyan-100 border-cyan-300 text-cyan-800' : 'bg-cyan-950/80 border-cyan-800 text-cyan-300'
            }`}>
              NEW: AR Interactive Tool
            </span>
            <span>· Live Camera & 3D Spatial Simulator</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.ar.title}
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed font-normal ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {t.ar.subtitle}
          </p>
        </div>

        {/* Mode & Action Switcher Bar */}
        <div className={`flex flex-wrap items-center justify-between gap-3 mb-6 p-2 sm:p-3 border rounded-2xl ${
          isLight ? 'bg-white border-slate-200 text-slate-800 shadow-xs' : 'bg-slate-900/80 border-slate-800 text-slate-100'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveMode('virtual_room');
                stopCamera();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeMode === 'virtual_room'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4 text-cyan-500" />
              <span>{t.ar?.studioMode || '3D Virtual Room Studio'}</span>
            </button>

            <button
              onClick={startCamera}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeMode === 'camera_ar'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Camera className="w-4 h-4 text-amber-500" />
              <span>{t.ar?.cameraMode || 'Live Camera AR Mode'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {activeMode === 'virtual_room' && (
              <div className="flex items-center gap-1">
                {(['church', 'boardroom', 'retail', 'outdoor'] as const).map(preset => (
                  <button
                    key={preset}
                    onClick={() => setRoomPreset(preset)}
                    className={`px-2.5 py-1 rounded-lg capitalize cursor-pointer transition-colors ${
                      roomPreset === preset
                        ? isLight
                          ? 'bg-slate-200 text-slate-900 font-bold border border-slate-300'
                          : 'bg-slate-800 text-white font-bold border border-slate-700'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {preset === 'outdoor' ? (t.ar?.dooh || 'Outdoor DOOH') : (t.ar?.[preset as 'church' | 'boardroom' | 'retail'] || preset)}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setWallPosition({ x: 0, y: 0 })}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Reset position"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Center</span>
            </button>
          </div>
        </div>

        {cameraError && (
          <div className="mb-4 p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-300 flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Main AR Canvas & Control Deck Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Visualizer Stage (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col">
            {/* Viewport Canvas Frame */}
            <div
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[560px] bg-slate-950 overflow-hidden cursor-move select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Camera Feed or Virtual Room Backdrop */}
              {activeMode === 'camera_ar' ? (
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={roomBackgrounds[roomPreset]}
                    alt="Virtual Room Backdrop"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-[0.75]"
                  />
                  {/* Subtle 3D Perspective Floor Grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_0.75px,transparent_0.75px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
                </div>
              )}

              {/* Human Scale Reference (1.8m height) in Virtual Room Mode */}
              {activeMode === 'virtual_room' && (
                <div className="absolute bottom-4 left-6 pointer-events-none opacity-80 flex flex-col items-center">
                  <div className="w-7 h-28 border border-dashed border-cyan-400/80 rounded-t-full flex flex-col justify-end items-center pb-1 bg-cyan-950/20 backdrop-blur-xs">
                    <span className="text-[9px] font-mono text-cyan-300 font-bold">1.8m</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">Person</span>
                </div>
              )}

              {/* THE VIRTUAL LED VIDEO WALL DISPLAY (AR OVERLAY) */}
              <div
                style={{
                  transform: `translate(${wallPosition.x}px, ${wallPosition.y}px) perspective(900px) rotateX(${config.perspectiveTiltX}deg) rotateY(${config.perspectiveTiltY}deg) scale(${config.scalePercent / 100})`,
                  width: `${Math.min(85, Math.max(30, config.widthM * 9))}%`,
                  aspectRatio: `${config.widthM} / ${config.heightM}`
                }}
                className="absolute inset-0 m-auto rounded-lg overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_50px_rgba(6,182,212,0.45)] transition-all duration-75 group"
              >
                {/* Simulated Screen Content Loop */}
                <div
                  className={`w-full h-full bg-gradient-to-br ${currentTheme.bg} flex flex-col justify-between p-4 relative overflow-hidden`}
                  style={{ opacity: config.brightnessPercent / 100 }}
                >
                  {/* High-tech fine pixel matrix overlay grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000018_1px,transparent_1px),linear-gradient(to_bottom,#00000018_1px,transparent_1px)] bg-[size:4px_4px] pointer-events-none" />

                  {/* Top Bar of Screen */}
                  <div className="flex justify-between items-center text-white/90 font-mono text-[10px] z-10">
                    <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>DEMAQ LED · {config.pixelPitch.split(' ')[0]}</span>
                    </span>
                    <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                      {resolutionW} × {resolutionH} px
                    </span>
                  </div>

                  {/* Dynamic Motion Center Graphic */}
                  <div className="text-center z-10 space-y-1 my-auto">
                    <div className={`text-base sm:text-2xl font-black font-display tracking-tight text-white drop-shadow-md`}>
                      {currentTheme.text}
                    </div>
                    <div className="text-[11px] font-mono text-cyan-200/90 font-medium">
                      {config.widthM}m (W) × {config.heightM}m (H) · {areaM2.toFixed(1)} m²
                    </div>
                  </div>

                  {/* Bottom Telemetry of Screen */}
                  <div className="flex justify-between items-center text-[9px] font-mono text-white/80 z-10">
                    <span className="bg-black/50 px-1.5 py-0.5 rounded">
                      NovaStar GenLock · 7,680Hz
                    </span>
                    <span className="bg-black/50 px-1.5 py-0.5 rounded text-amber-300">
                      {isStock ? 'In-Stock: 24h Ready' : 'Custom Import COB'}
                    </span>
                  </div>
                </div>

                {/* Cabinet Seam Lines Simulator */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.3) 1px, transparent 1px)`,
                    backgroundSize: `${100 / cabinetsWide}% ${100 / cabinetsHigh}%`
                  }}
                />
              </div>

              {/* Move instruction badge */}
              <div className="absolute top-3 left-3 pointer-events-none bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-cyan-400" />
                <span>Drag to place on wall · Pinch/Slide to size</span>
              </div>

              {/* Live Status Tag */}
              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>AR Sizer Active</span>
              </div>
            </div>

            {/* Bottom Visualizer Toolbar */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[11px]">Display Content:</span>
                {(['worship', 'commercial', 'cyberpunk', 'control_room'] as const).map(theme => (
                  <button
                    key={theme}
                    onClick={() => setConfig({ ...config, contentType: theme })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize cursor-pointer transition-colors ${
                      config.contentType === theme
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50'
                        : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                    }`}
                  >
                    {theme.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTakeSnapshot}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-mono text-[11px]"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{snapshotTaken ? 'Saved!' : 'Snap AR Photo'}</span>
                </button>

                <a
                  href={`https://wa.me/251942992799?text=${encodeURIComponent(
                    `Hello DemaQ! I tested my wall in your AR Visualizer with dimensions: ${config.widthM}m (W) × ${config.heightM}m (H) · ${config.pixelPitch}. Estimated Area: ${areaM2.toFixed(1)} m². Could you quote for our venue in Addis Ababa?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Send to WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* AR Sizing & Telemetry Control Deck (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Live Dimensions Sliders Card */}
            <div className={`p-5 border rounded-2xl space-y-4 shadow-xl ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-white'
            }`}>
              <div className={`flex items-center justify-between pb-2 border-b ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <span className={`text-xs font-bold uppercase tracking-wider font-display flex items-center gap-1.5 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  <Sliders className="w-4 h-4 text-cyan-500" />
                  <span>AR Wall Dimensions</span>
                </span>
                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-300">Real-Time CAD</span>
              </div>

              {/* Width Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Screen Width:</span>
                  <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{config.widthM.toFixed(1)} meters ({(config.widthM * 3.28084).toFixed(1)} ft)</span>
                </div>
                <input
                  type="range"
                  min={1.2}
                  max={16.0}
                  step={0.2}
                  value={config.widthM}
                  onChange={(e) => setConfig({ ...config, widthM: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Height Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Screen Height:</span>
                  <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{config.heightM.toFixed(1)} meters ({(config.heightM * 3.28084).toFixed(1)} ft)</span>
                </div>
                <input
                  type="range"
                  min={0.9}
                  max={8.0}
                  step={0.1}
                  value={config.heightM}
                  onChange={(e) => setConfig({ ...config, heightM: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Pixel Pitch Selection */}
              <div className="space-y-1.5 pt-1">
                <label className={`block text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>LED Hardware Pitch & Series:</label>
                <select
                  value={config.pixelPitch}
                  onChange={(e) => setConfig({ ...config, pixelPitch: e.target.value })}
                  className={`w-full px-3 py-2 text-xs border rounded-lg font-mono focus:outline-none focus:border-cyan-500 cursor-pointer ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                  }`}
                >
                  <option value="P2.5 GOB (In-Stock)">P2.5 Shield-GOB Armored (In-Stock Addis Ababa)</option>
                  <option value="P3.0 GOB (In-Stock)">P3.0 Shield-GOB Retail (In-Stock)</option>
                  <option value="P2.6 Rental (In-Stock)">P2.6 Apex-Rental Touring (In-Stock)</option>
                  <option value="P4.81 Outdoor (In-Stock)">P4.81 Horizon-DOOH (In-Stock)</option>
                  <option value="P0.93 COB (Custom Import)">P0.93 Nova-Pitch Flip-Chip COB (Custom Import)</option>
                  <option value="P1.25 COB (Custom Import)">P1.25 Nova-Pitch Micro-LED (Custom Import)</option>
                  <option value="P1.56 COB (Custom Import)">P1.56 Cinema-XR Studio (Custom Import)</option>
                </select>
              </div>

              {/* Perspective Sliders for matching wall slant */}
              <div className={`grid grid-cols-2 gap-3 pt-1 border-t text-[11px] font-mono ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <div>
                  <span className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Perspective Tilt:</span>
                  <input
                    type="range"
                    min={-35}
                    max={35}
                    value={config.perspectiveTiltY}
                    onChange={(e) => setConfig({ ...config, perspectiveTiltY: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
                <div>
                  <span className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Scale Zoom:</span>
                  <input
                    type="range"
                    min={50}
                    max={150}
                    value={config.scalePercent}
                    onChange={(e) => setConfig({ ...config, scalePercent: parseInt(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Live Engineering Telemetry Summary */}
            <div className={`p-5 border rounded-2xl space-y-3 font-mono text-xs ${
              isLight ? 'bg-white border-slate-200 text-slate-800 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-100 shadow-xl'
            }`}>
              <div className={`font-bold text-xs uppercase tracking-wider font-display mb-2 flex items-center gap-1.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Calculated Engineering Specs</span>
              </div>

              <div className={`flex justify-between py-1.5 border-b ${isLight ? 'border-slate-100' : 'border-slate-900'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Total Active Area:</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{areaM2.toFixed(2)} m²</span>
              </div>

              <div className={`flex justify-between py-1.5 border-b ${isLight ? 'border-slate-100' : 'border-slate-900'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Pixel Resolution:</span>
                <span className="text-cyan-600 dark:text-cyan-300 font-bold">{resolutionW} × {resolutionH} px</span>
              </div>

              <div className={`flex justify-between py-1.5 border-b ${isLight ? 'border-slate-100' : 'border-slate-900'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Estimated Cabinets:</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{totalCabinets} units</span>
              </div>

              <div className={`flex justify-between py-1.5 border-b ${isLight ? 'border-slate-100' : 'border-slate-900'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Power Consumption:</span>
                <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>{avgPowerKW} kW (Avg) / {maxPowerKW} kW (Peak)</span>
              </div>

              <div className={`flex justify-between py-1.5 border-b ${isLight ? 'border-slate-100' : 'border-slate-900'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Stock Availability:</span>
                <span className={isStock ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>
                  {isStock ? '24-48h Local Delivery' : '14-21 Days Air Import'}
                </span>
              </div>

              <div className={`flex justify-between py-2 px-3 rounded-lg border text-xs ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}>
                <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>Official Quotation:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">Quoted after Request / Direct DM</span>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <a
                  href="#rfq"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-400 to-amber-300 hover:opacity-90 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md text-xs font-sans"
                >
                  <span>Request Quotation for this Wall</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://wa.me/251942992799?text=${encodeURIComponent(
                    `Hello DemaQ, I tested a ${config.widthM}m x ${config.heightM}m wall in AR (${config.pixelPitch}). Please provide an official quotation and proforma.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  <span>💬 Direct WhatsApp DM (+251 942 992 799)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
