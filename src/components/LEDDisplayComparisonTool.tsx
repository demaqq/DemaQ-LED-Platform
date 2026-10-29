import React, { useState } from 'react';
import {
  Layers, Check, Sparkles, ArrowRight, ShieldCheck,
  Eye, Zap, Truck, Clock, RefreshCw, Plus, Minus,
  Cpu, Monitor, Radio, Server, Sliders, ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type ComparisonCategory = 'fixed' | 'rental' | 'systems';

export interface DisplaySpecModel {
  id: string;
  name: string;
  tagline: string;
  categoryType: 'fixed' | 'rental';
  pitch: string;
  pitchMm: number;
  pixelDensity: string;
  packaging: string;
  scanMode: string;
  refreshRate: string;
  contrast: string;
  brightness: string;
  protection: string;
  impactResistance: string;
  powerAvg: string;
  powerPeak: string;
  availability: 'in_stock' | 'import_order';
  leadTime: string;
  idealVenues: string;
  isPopular?: boolean;
}

export interface SystemEcosystemModel {
  id: string;
  brand: string;
  tagline: string;
  primaryControllers: string;
  receivingCards: string;
  maxPixelCap: string;
  portsGigabit: string;
  softwareSuite: string;
  cloudPlatform: string;
  colorDepth: string;
  driverICSupport: string;
  audioHandling: string;
  mobileControl: string;
  addisStockStatus: string;
  idealUseCases: string;
  isIndustryStandard?: boolean;
}

const FIXED_MODELS: DisplaySpecModel[] = [
  {
    id: 'cob-p078',
    name: 'DEMAQ Nova-Pitch COB P0.78',
    tagline: 'Flagship Micro-LED Flip-Chip Ultra-Fine Matrix',
    categoryType: 'fixed',
    pitch: 'P0.78 mm',
    pitchMm: 0.78,
    pixelDensity: '1,642,850 px / m²',
    packaging: 'COB (Flip-Chip Chip-On-Board Micro-LED)',
    scanMode: '1/32 Scan Dynamic Constant Current',
    refreshRate: '3,840 Hz (Optional 7,680 Hz XR)',
    contrast: '10,000 : 1 (Cinema Deep Black)',
    brightness: '600 – 800 nits (Cold-Screen Tech)',
    protection: 'IP65 Full Front Surface Seal',
    impactResistance: 'Solid-State Encapsulation (Wire-Free)',
    powerAvg: '80 W / m²',
    powerPeak: '240 W / m²',
    availability: 'import_order',
    leadTime: 'Import by Order (14–21 Days Air Cargo)',
    idealVenues: 'Executive Boardrooms, Mission-Critical NOCs, Premium TV Studios'
  },
  {
    id: 'cob-p125',
    name: 'DEMAQ Nova-Pitch COB P1.25',
    tagline: 'High-Density Micro-LED Control Room Standard',
    categoryType: 'fixed',
    pitch: 'P1.25 mm',
    pitchMm: 1.25,
    pixelDensity: '640,000 px / m²',
    packaging: 'COB (Flip-Chip Chip-On-Board)',
    scanMode: '1/32 Scan High PWM Driver',
    refreshRate: '3,840 Hz Refresh',
    contrast: '10,000 : 1 (True Black Polycarbonate Mask)',
    brightness: '800 nits (12°C Cooler Operation)',
    protection: 'IP65 Front Water/Dust Seal',
    impactResistance: 'Anti-Static & High Anti-Collision',
    powerAvg: '95 W / m²',
    powerPeak: '280 W / m²',
    availability: 'import_order',
    leadTime: 'Import by Order (14–21 Days Air Cargo)',
    idealVenues: 'Bank Command Centers, Traffic Control, Security Operations',
    isPopular: true
  },
  {
    id: 'cob-p187',
    name: 'DEMAQ Nova-Pitch COB P1.87',
    tagline: 'Cost-Effective Fine Pitch Flip-Chip Micro Display',
    categoryType: 'fixed',
    pitch: 'P1.87 mm',
    pitchMm: 1.87,
    pixelDensity: '284,800 px / m²',
    packaging: 'COB (Flip-Chip Multi-Chip Bonding)',
    scanMode: '1/28 Scan PWM Drive',
    refreshRate: '3,840 Hz',
    contrast: '8,000 : 1',
    brightness: '900 nits',
    protection: 'IP54 Front Seal',
    impactResistance: 'High Mechanical Shock Resistance',
    powerAvg: '110 W / m²',
    powerPeak: '310 W / m²',
    availability: 'import_order',
    leadTime: 'Import by Order (14–21 Days Air Cargo)',
    idealVenues: 'Luxury Conference Rooms, High-End Retail Flagships'
  },
  {
    id: 'gob-p25',
    name: 'DEMAQ Shield-GOB P2.5',
    tagline: 'Optical Epoxy Armored Commercial & Worship Display',
    categoryType: 'fixed',
    pitch: 'P2.5 mm',
    pitchMm: 2.5,
    pixelDensity: '160,000 px / m²',
    packaging: 'GOB (Glue-On-Board Optical Epoxy Resin)',
    scanMode: '1/16 Scan Standard Constant Current',
    refreshRate: '3,840 Hz High Refresh Rate',
    contrast: '6,000 : 1',
    brightness: '900 – 1,100 nits (Full Daylight Room Clear)',
    protection: 'Front IP54 (Wipe-Clean Dust & Liquid Resistant)',
    impactResistance: '100% Collision-Proof (Knock & Bump Resistant)',
    powerAvg: '120 W / m²',
    powerPeak: '360 W / m²',
    availability: 'in_stock',
    leadTime: 'In-Stock Addis Ababa (24–48h Delivery)',
    idealVenues: 'Churches, Auditoriums, Malls, Supermarkets, Schools',
    isPopular: true
  },
  {
    id: 'gob-p30',
    name: 'DEMAQ Shield-GOB P3.0',
    tagline: 'Rugged Commercial Epoxy Display for Large Sanctuaries',
    categoryType: 'fixed',
    pitch: 'P3.0 mm',
    pitchMm: 3.0,
    pixelDensity: '111,111 px / m²',
    packaging: 'GOB (Glue-On-Board Polyurethane Armor)',
    scanMode: '1/16 Scan',
    refreshRate: '1,920 Hz – 3,840 Hz',
    contrast: '5,500 : 1',
    brightness: '1,000 – 1,200 nits',
    protection: 'Front IP54 Wipe-Clean Armor',
    impactResistance: '100% Anti-Knock Epoxy Bond',
    powerAvg: '125 W / m²',
    powerPeak: '370 W / m²',
    availability: 'in_stock',
    leadTime: 'In-Stock Addis Ababa (24–48h Delivery)',
    idealVenues: 'Houses of Worship, Multipurpose Halls, Sports Lounges'
  },
  {
    id: 'smd-p40',
    name: 'DEMAQ Fixed-SMD P4.0',
    tagline: 'Standard Indoor Commercial Large-Scale Video Wall',
    categoryType: 'fixed',
    pitch: 'P4.0 mm',
    pitchMm: 4.0,
    pixelDensity: '62,500 px / m²',
    packaging: 'SMD 2121 Black Body',
    scanMode: '1/16 Scan',
    refreshRate: '1,920 Hz',
    contrast: '4,000 : 1',
    brightness: '1,000 nits',
    protection: 'Front IP40 Indoor',
    impactResistance: 'Standard SMD with Louver Mask',
    powerAvg: '130 W / m²',
    powerPeak: '390 W / m²',
    availability: 'in_stock',
    leadTime: 'In-Stock Modules (Immediate Addis Assembly)',
    idealVenues: 'Hotel Atriums, Exhibition Centers, Gymnasiums'
  },
  {
    id: 'dooh-p481',
    name: 'DEMAQ Horizon-DOOH P4.81',
    tagline: 'High-Brightness Outdoor Commercial Billboard',
    categoryType: 'fixed',
    pitch: 'P4.81 mm',
    pitchMm: 4.81,
    pixelDensity: '43,264 px / m²',
    packaging: 'SMD 1921 High-Power Gold Wire',
    scanMode: '1/8 Scan Common-Cathode Energy Saving',
    refreshRate: '3,840 Hz Outdoor Flicker-Free',
    contrast: '5,000 : 1',
    brightness: '8,500 – 10,000 nits (Direct Sunlight Visible)',
    protection: 'IP66 Industrial Storm & Torrential Rain Proof',
    impactResistance: 'Heavy-Duty Die-Cast / Extruded Aluminum',
    powerAvg: '180 W / m²',
    powerPeak: '550 W / m²',
    availability: 'in_stock',
    leadTime: 'In-Stock Modules (Rapid Assembly in Addis)',
    idealVenues: 'Building Facades, Shopping Plaza Pylons, Stadium Scoreboards',
    isPopular: true
  },
  {
    id: 'dooh-p80',
    name: 'DEMAQ Horizon-DOOH P8.0',
    tagline: 'Highway & Long-Distance Billboard Matrix',
    categoryType: 'fixed',
    pitch: 'P8.0 mm',
    pitchMm: 8.0,
    pixelDensity: '15,625 px / m²',
    packaging: 'SMD 3535 High-Lumen Outdoor',
    scanMode: '1/4 Scan High Efficiency',
    refreshRate: '1,920 Hz',
    contrast: '5,000 : 1',
    brightness: '9,000 – 10,500 nits',
    protection: 'IP66 Front / IP54 Rear Storm Proof',
    impactResistance: 'Industrial Structural Steel / Aluminum Chassis',
    powerAvg: '190 W / m²',
    powerPeak: '580 W / m²',
    availability: 'in_stock',
    leadTime: 'In-Stock Modules (Addis Warehouse)',
    idealVenues: 'Expressways, Roundabouts, Toll Stations, Airport Roads'
  },
  {
    id: 'dooh-p10',
    name: 'DEMAQ Horizon-DOOH P10.0',
    tagline: 'Massive Distance Outdoor Pylon & Stadium Wall',
    categoryType: 'fixed',
    pitch: 'P10.0 mm',
    pitchMm: 10.0,
    pixelDensity: '10,000 px / m²',
    packaging: 'DIP / SMD 3535 Rugged Sealed',
    scanMode: '1/2 or Static Drive',
    refreshRate: '1,920 Hz',
    contrast: '4,500 : 1',
    brightness: '10,000 nits Ultra-Bright',
    protection: 'IP68 Marine/Desert Ingress Rating',
    impactResistance: 'Reinforced Aluminum Alloy',
    powerAvg: '210 W / m²',
    powerPeak: '620 W / m²',
    availability: 'in_stock',
    leadTime: 'In-Stock Addis Warehouse',
    idealVenues: 'Mega Highway Gantries, Football Stadium Exterior Walls'
  }
];

const RENTAL_MODELS: DisplaySpecModel[] = [
  {
    id: 'rental-p195',
    name: 'DEMAQ Apex-Rental P1.95 Ultra',
    tagline: 'Broadcast Studio & XR Virtual Production Stage',
    categoryType: 'rental',
    pitch: 'P1.95 mm',
    pitchMm: 1.95,
    pixelDensity: '262,144 px / m²',
    packaging: 'Black SMD 1515 with Matte Mask',
    scanMode: '1/32 Scan High Grayscale Drive',
    refreshRate: '7,680 Hz (Camera Genlock 240fps)',
    contrast: '8,000 : 1 (Non-Reflective Surface)',
    brightness: '1,200 – 1,500 nits (Adjustable)',
    protection: 'Front IP43 with Corner Protectors',
    impactResistance: 'Flightcase Packed with Rapid Corner Bumpers',
    powerAvg: '130 W / m²',
    powerPeak: '390 W / m²',
    availability: 'import_order',
    leadTime: 'Import by Order (14–21 Days)',
    idealVenues: 'Film XR Stages, Corporate Keynotes, TV Broadcast Sets'
  },
  {
    id: 'rental-p260',
    name: 'DEMAQ Apex-Rental P2.60 Curve-Lock',
    tagline: 'Fast-Rigging Touring Cabinet with -10° to +10° Arc Curve',
    categoryType: 'rental',
    pitch: 'P2.60 mm',
    pitchMm: 2.60,
    pixelDensity: '147,456 px / m²',
    packaging: 'SMD 1515 Black Body Die-Cast Magnesium',
    scanMode: '1/16 Scan PWM High Refresh',
    refreshRate: '3,840 Hz Smooth Shutter',
    contrast: '5,000 : 1',
    brightness: '1,000 – 1,200 nits',
    protection: 'IP43 Front / IP30 Rear',
    impactResistance: 'Magnesium Alloy with Quick-Latch System',
    powerAvg: '135 W / m²',
    powerPeak: '410 W / m²',
    availability: 'in_stock',
    leadTime: 'In-Stock Addis Staging Inventory (Immediate)',
    idealVenues: 'Indoor Concerts, Award Galas, Fashion Shows, Conferences',
    isPopular: true
  },
  {
    id: 'rental-p297',
    name: 'DEMAQ Apex-Rental P2.97 Event-Pro',
    tagline: 'Workhorse Touring Screen for Staging & Concerts',
    categoryType: 'rental',
    pitch: 'P2.97 mm',
    pitchMm: 2.97,
    pixelDensity: '112,896 px / m²',
    packaging: 'SMD 2020 Touring Enclosure 500x500mm',
    scanMode: '1/14 Scan Dynamic Drive',
    refreshRate: '3,840 Hz',
    contrast: '4,500 : 1',
    brightness: '1,200 nits',
    protection: 'IP43 Front / Magnetic Fast Maintenance',
    impactResistance: 'Die-Cast Magnesium with Flightcase Pack',
    powerAvg: '135 W / m²',
    powerPeak: '410 W / m²',
    availability: 'in_stock',
    leadTime: 'In-Stock Addis Warehouse (Same-Day Delivery)',
    idealVenues: 'Corporate Conventions, Church Conferences, Music Festivals'
  },
  {
    id: 'rental-p391',
    name: 'DEMAQ Apex-Rental P3.91 All-Weather',
    tagline: 'Indoor/Outdoor Dual-Use Rainproof Touring System',
    categoryType: 'rental',
    pitch: 'P3.91 mm',
    pitchMm: 3.91,
    pixelDensity: '65,536 px / m²',
    packaging: 'SMD 1921 Waterproof IP65 Front & Rear',
    scanMode: '1/16 Scan High Voltage Common-Cathode',
    refreshRate: '3,840 Hz Outdoor Camera Ready',
    contrast: '4,500 : 1',
    brightness: '4,500 – 5,500 nits (Full Daylight Outdoor)',
    protection: 'IP65 Heavy Rainproof & Dust Tight',
    impactResistance: 'Rugged Die-Cast Magnesium with Hang/Stack Bar',
    powerAvg: '145 W / m²',
    powerPeak: '450 W / m²',
    availability: 'in_stock',
    leadTime: 'In-Stock Addis Ababa (Immediate Staging Ready)',
    idealVenues: 'Outdoor Concerts, Rallies, Sports Fan Zones, Festivals',
    isPopular: true
  },
  {
    id: 'rental-p481',
    name: 'DEMAQ Apex-Rental P4.81 Heavy-Touring',
    tagline: 'High-Power Sunlight Outdoor Touring Stage Screen',
    categoryType: 'rental',
    pitch: 'P4.81 mm',
    pitchMm: 4.81,
    pixelDensity: '43,264 px / m²',
    packaging: 'SMD 2727 High-Power Outdoor Die-Cast',
    scanMode: '1/8 Scan High Brightness',
    refreshRate: '3,840 Hz',
    contrast: '5,000 : 1',
    brightness: '6,500 – 7,500 nits',
    protection: 'IP65 All-Weather Storm Proof',
    impactResistance: 'Rigid Magnesium Touring Truss Fast-Locks',
    powerAvg: '160 W / m²',
    powerPeak: '490 W / m²',
    availability: 'in_stock',
    leadTime: 'In-Stock Addis Ababa Warehouse',
    idealVenues: 'Stadium Stage Backdrops, Outdoor Political Rallies, Marathons'
  }
];

const SYSTEM_ECOSYSTEMS: SystemEcosystemModel[] = [
  {
    id: 'novastar',
    brand: 'NovaStar Control Ecosystem',
    tagline: 'Global Industry Benchmark for Video Processing & Screen Calibration',
    primaryControllers: 'VX400 (2.6M), VX600 (3.9M), VX1000 (6.5M), VX16s (10.4M), NovaPro UHD, MX40 Pro COEX',
    receivingCards: 'MRV208 (Standard), MRV416, Armor A5s Plus, Armor A8s, A10s Pro (18-bit+)',
    maxPixelCap: '650,000 Pixels per Gigabit Ethernet Port (Up to 10.4M on VX16s)',
    portsGigabit: '2 to 16 Gigabit RJ45 Outputs + 10G Optical SFP Fiber Ports',
    softwareSuite: 'NovaLCT (Hardware Mapping), SmartLCT (Creative Layout), V-Can (Switcher Control)',
    cloudPlatform: 'VNNOX Cloud & Taurus TB30/TB50/TB60 4G/Wi-Fi Media Players',
    colorDepth: '18-bit+ Grayscale, Chroma Calibration, HDR10 & HLG, Ultra-Low Latency',
    driverICSupport: 'Full Support: MBI5153, ICN2053, PWM5153, Chipone, Macroblock',
    audioHandling: '3.5mm Analog Audio In/Out + HDMI Embedded Audio Pass-Through',
    mobileControl: 'ViPlex Handy / ViPlex Express Mobile App for Taurus Series',
    addisStockStatus: 'IN-STOCK ADDIS ABABA: VX400, VX600, VX1000 & MRV208 Receiving Cards',
    idealUseCases: 'All Mission-Critical Video Walls, Churches, Boardrooms, Concerts, Broadcast',
    isIndustryStandard: true
  },
  {
    id: 'colorlight',
    brand: 'Colorlight Control Ecosystem',
    tagline: 'High-Performance Video Processors with Superior Picture Enhancement',
    primaryControllers: 'C3/C4 Cloud, X2 (1.3M), X4e (2.6M), X6 (3.9M), X8 (5.2M), X16e (10.4M), Z6 PRO 4K',
    receivingCards: '5A-75B, 5A-75E (High-Speed), i5+, i9+ (18-bit High Grayscale)',
    maxPixelCap: '650,000 Pixels per Gigabit Port (4K@60Hz native processing on Z6 PRO)',
    portsGigabit: '2 to 16 Gigabit RJ45 Ports + 10G Optical Fiber Out',
    softwareSuite: 'LEDVISION (Mapping & Calibration), PlayerMaster, Colorlight iSet',
    cloudPlatform: 'Colorlight Cloud (Traffic & Media Clustering via C-Series Players)',
    colorDepth: 'Super-Resolution Upscaling, HDR10, Precise Color Management, 3D LUT',
    driverICSupport: 'Full Support: ICN2153, MBI5252, SUM2030, SM16380',
    audioHandling: 'HDMI/DVI Embedded Audio + Multi-Channel Output',
    mobileControl: 'LEDVISION Mobile App & Cloud Web Dashboard',
    addisStockStatus: 'IN-STOCK / IMPORT: X4e, X6 Series Controllers & 5A-75E Receiving Cards',
    idealUseCases: 'Commercial Billboards, High-End Corporate Displays, Retail Video Walls'
  },
  {
    id: 'huidu',
    brand: 'Huidu Control Ecosystem',
    tagline: 'Cost-Effective All-in-One Processors with Audio Extraction & Easy Mobile App',
    primaryControllers: 'HD-A3L, HD-A4/A6, HD-VP410 (1.3M), HD-VP620 (2.6M), HD-VP820 (3.9M), HD-VP1220 (7.8M), HD-VP1640',
    receivingCards: 'HD-R512S, HD-R512T, HD-R516T, HD-R712 (HUB75 High-Density)',
    maxPixelCap: '650,000 Pixels per Gigabit Port (Up to 10.4M on VP1640)',
    portsGigabit: '2 to 16 Gigabit RJ45 Outputs + HDMI 2.0 Loop',
    softwareSuite: 'HDPlayer (Simple Windows Mapping), HDSet, HD Show',
    cloudPlatform: 'XiaoHui Cloud (Free 4G/Cloud Server Clustering & Remote CMS)',
    colorDepth: '14-16 Bit Grayscale, Point-by-Point Brightness & Chroma Correction',
    driverICSupport: 'Full Support: DP3264, ICN2038S, SM16208, FM6124, MBI5024',
    audioHandling: 'Built-in 3.5mm Stereo Audio Output directly from USB/HDMI inputs',
    mobileControl: 'LedArt Mobile App (iOS / Android) for direct phone Wi-Fi video upload',
    addisStockStatus: 'IN-STOCK ADDIS ABABA: HD-VP410, HD-VP620, HD-R512S & Cloud Boxes',
    idealUseCases: 'Retail Stores, Shopping Malls, Restaurant Digital Signage, Small Churches'
  },
  {
    id: 'linsn',
    brand: 'Linsn Control Ecosystem',
    tagline: 'Pioneer Industrial Hardware Sender Cards with Superior Noise Immunity',
    primaryControllers: 'TS802D Sender, TS901/TS921, X100, X200 (2.3M), X800 (3.9M), X2000 (8.2M), X8216',
    receivingCards: 'RV908M32 (Built-in 12x HUB75), RV901T, RV926, RV907',
    maxPixelCap: '650,000 Pixels per Port (Up to 8.2M on X2000 multi-port)',
    portsGigabit: '2 to 12 Gigabit RJ45 Outputs + Fiber Optical Extender Support',
    softwareSuite: 'LEDStudio (Classic Industrial Mapping & Diagnostic Software)',
    cloudPlatform: 'Linsn Cloud Central Controller & Smart Hub',
    colorDepth: '16-bit Grayscale, Manual Hardware EDID Management, Refresh up to 3840Hz',
    driverICSupport: 'Full Support: MBI5038, ICN2053, SM16380, TC7258',
    audioHandling: 'Audio Transmission via Gigabit Cable + 3.5mm Audio Output',
    mobileControl: 'LEDStudio Mobile Tools',
    addisStockStatus: 'IN-STOCK: TS802D Sender Cards, RV908M Receiving Cards & Spare Hubs',
    idealUseCases: 'Outdoor Highway Gantries, Industrial Plant Status Displays, Harsh Power Grids'
  }
];

interface LEDDisplayComparisonToolProps {
  onSelectForCalculator?: (pitchSeries: string) => void;
  onNavigateToRFQ?: (seriesName: string) => void;
}

export const LEDDisplayComparisonTool: React.FC<LEDDisplayComparisonToolProps> = ({
  onSelectForCalculator,
  onNavigateToRFQ
}) => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  // Category Tab: Fixed vs Rental vs Systems
  const [activeCategory, setActiveCategory] = useState<ComparisonCategory>('fixed');

  // Selected models for side-by-side comparison (max 3)
  const [selectedFixedIds, setSelectedFixedIds] = useState<string[]>([
    'gob-p25',
    'cob-p125',
    'dooh-p481'
  ]);

  const [selectedRentalIds, setSelectedRentalIds] = useState<string[]>([
    'rental-p260',
    'rental-p391',
    'rental-p195'
  ]);

  const [selectedSystemIds, setSelectedSystemIds] = useState<string[]>([
    'novastar',
    'huidu',
    'colorlight'
  ]);

  const toggleFixedModel = (id: string) => {
    if (selectedFixedIds.includes(id)) {
      if (selectedFixedIds.length > 1) {
        setSelectedFixedIds(selectedFixedIds.filter((m) => m !== id));
      }
    } else {
      if (selectedFixedIds.length < 3) {
        setSelectedFixedIds([...selectedFixedIds, id]);
      } else {
        setSelectedFixedIds([selectedFixedIds[1], selectedFixedIds[2], id]);
      }
    }
  };

  const toggleRentalModel = (id: string) => {
    if (selectedRentalIds.includes(id)) {
      if (selectedRentalIds.length > 1) {
        setSelectedRentalIds(selectedRentalIds.filter((m) => m !== id));
      }
    } else {
      if (selectedRentalIds.length < 3) {
        setSelectedRentalIds([...selectedRentalIds, id]);
      } else {
        setSelectedRentalIds([selectedRentalIds[1], selectedRentalIds[2], id]);
      }
    }
  };

  const toggleSystemModel = (id: string) => {
    if (selectedSystemIds.includes(id)) {
      if (selectedSystemIds.length > 1) {
        setSelectedSystemIds(selectedSystemIds.filter((m) => m !== id));
      }
    } else {
      if (selectedSystemIds.length < 3) {
        setSelectedSystemIds([...selectedSystemIds, id]);
      } else {
        setSelectedSystemIds([selectedSystemIds[1], selectedSystemIds[2], id]);
      }
    }
  };

  const activeFixedList = FIXED_MODELS.filter((m) => selectedFixedIds.includes(m.id));
  const activeRentalList = RENTAL_MODELS.filter((m) => selectedRentalIds.includes(m.id));
  const activeSystemList = SYSTEM_ECOSYSTEMS.filter((s) => selectedSystemIds.includes(s.id));

  return (
    <section
      id="comparison-matrix"
      className={`py-20 sm:py-24 border-y relative transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/50 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold mb-2 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-cyan-500" />
            <span>{t.comparison.tag}</span>
            <span>· Engineering Specifications & Ecosystem Comparison</span>
          </div>

          <h2 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.comparison.title}
          </h2>

          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            Compare detailed engineering metrics across Fixed Commercial Installations, Rental Staging Systems, and Video Processor Controller Ecosystems without marketing hype.
          </p>
        </div>

        {/* 3 Main Comparison Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b pb-4 border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveCategory('fixed')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategory === 'fixed'
                ? 'bg-cyan-600 text-white shadow-sm'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Fixed Installation Pitches (P0.78 – P10)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 font-mono">{FIXED_MODELS.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('rental')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategory === 'rental'
                ? 'bg-cyan-600 text-white shadow-sm'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Rental & Staging Pitches (P1.95 – P4.81)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 font-mono">{RENTAL_MODELS.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('systems')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategory === 'systems'
                ? 'bg-cyan-600 text-white shadow-sm'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Devices, Cards & Systems (NovaStar · Huidu · Colorlight · Linsn)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 font-mono">4 Systems</span>
          </button>
        </div>

        {/* 1. FIXED INSTALLATION COMPARISON VIEW */}
        {activeCategory === 'fixed' && (
          <div>
            {/* Model Selector Bar */}
            <div className={`p-4 rounded-2xl border mb-6 flex flex-wrap items-center justify-between gap-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
            }`}>
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select up to 3 Fixed Display Series to compare:
              </div>

              <div className="flex flex-wrap gap-1.5">
                {FIXED_MODELS.map((model) => {
                  const isSelected = selectedFixedIds.includes(model.id);
                  return (
                    <button
                      key={model.id}
                      onClick={() => toggleFixedModel(model.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1 border ${
                        isSelected
                          ? isLight
                            ? 'bg-cyan-600 border-cyan-600 text-white font-bold shadow-2xs'
                            : 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                          : isLight
                          ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3" />}
                      <span>{model.pitch}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comparison Matrix Table Card */}
            <div className={`rounded-2xl border overflow-x-auto transition-all ${
              isLight ? 'bg-white/80 backdrop-blur-xl border-slate-300/80 text-slate-900 shadow-xl shadow-slate-900/8 ring-1 ring-slate-900/5' : 'bg-slate-950 border-slate-800 text-slate-100 shadow-xl shadow-black/50'
            }`}>
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className={`border-b ${isLight ? 'border-slate-200/80 bg-slate-100/60 backdrop-blur-md' : 'border-slate-800 bg-slate-900/60'}`}>
                    <th className={`p-4 sm:p-5 text-xs font-mono font-bold uppercase tracking-wider w-1/4 ${
                      isLight ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      Engineering Spec
                    </th>
                    {activeFixedList.map((m) => (
                      <th key={m.id} className="p-4 sm:p-5 w-1/4 align-top">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              m.availability === 'in_stock'
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300'
                            }`}>
                              {m.availability === 'in_stock' ? 'In-Stock Addis' : 'Import by Order'}
                            </span>
                            {m.isPopular && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                                ★ Popular
                              </span>
                            )}
                          </div>
                          <span className={`text-base font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {m.name}
                          </span>
                          <span className={`text-[11px] font-normal mt-0.5 leading-tight ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            {m.tagline}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className={`divide-y text-xs ${isLight ? 'divide-slate-200' : 'divide-slate-800/80'}`}>
                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Pixel Pitch & Density</td>
                    {activeFixedList.map((m) => (
                      <td key={m.id} className="p-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        <div>{m.pitch}</div>
                        <div className="text-[11px] font-normal text-slate-500">{m.pixelDensity}</div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Packaging Technology</td>
                    {activeFixedList.map((m) => (
                      <td key={m.id} className={`p-4 font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {m.packaging}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Scan Mode & Refresh Rate</td>
                    {activeFixedList.map((m) => (
                      <td key={m.id} className="p-4">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">{m.refreshRate}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{m.scanMode}</div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Contrast & Peak Brightness</td>
                    {activeFixedList.map((m) => (
                      <td key={m.id} className="p-4">
                        <div className="font-mono font-bold text-amber-600 dark:text-amber-400">{m.brightness}</div>
                        <div className="text-[11px] font-mono text-slate-500">Contrast: {m.contrast}</div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Surface Protection & Impact</td>
                    {activeFixedList.map((m) => (
                      <td key={m.id} className="p-4">
                        <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{m.protection}</span>
                        <span className={`block text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {m.impactResistance}
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Power Draw (Avg / Peak)</td>
                    {activeFixedList.map((m) => (
                      <td key={m.id} className={`p-4 font-mono ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        <div>Avg: {m.powerAvg}</div>
                        <div className="text-[11px] text-slate-500">Peak: {m.powerPeak}</div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Inventory & Delivery</td>
                    {activeFixedList.map((m) => (
                      <td key={m.id} className="p-4">
                        <div className="flex items-center gap-1.5 font-semibold">
                          {m.availability === 'in_stock' ? (
                            <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                          )}
                          <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>{m.leadTime}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Ideal Venues & Applications</td>
                    {activeFixedList.map((m) => (
                      <td key={m.id} className={`p-4 text-[11px] leading-snug ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {m.idealVenues}
                      </td>
                    ))}
                  </tr>

                  <tr className={isLight ? 'bg-slate-50/80' : 'bg-slate-900/40'}>
                    <td className="p-4 font-semibold text-slate-400">Engineering Action</td>
                    {activeFixedList.map((m) => (
                      <td key={m.id} className="p-4">
                        <div className="flex flex-col gap-1.5">
                          {onSelectForCalculator && (
                            <button
                              onClick={() => onSelectForCalculator(m.name)}
                              className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] transition-colors cursor-pointer text-center shadow-xs"
                            >
                              Configure in Calculator
                            </button>
                          )}
                          {onNavigateToRFQ && (
                            <button
                              onClick={() => onNavigateToRFQ(m.name)}
                              className={`w-full py-1.5 px-3 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer text-center ${
                                isLight
                                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                              }`}
                            >
                              Request Technical RFQ
                            </button>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. RENTAL & STAGING COMPARISON VIEW */}
        {activeCategory === 'rental' && (
          <div>
            {/* Model Selector Bar */}
            <div className={`p-4 rounded-2xl border mb-6 flex flex-wrap items-center justify-between gap-3 ${
              isLight ? 'bg-white/70 backdrop-blur-md border-slate-300/80 shadow-xs' : 'bg-slate-950/80 border-slate-800'
            }`}>
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-slate-400">
                Select up to 3 Rental & Staging Series to compare:
              </div>

              <div className="flex flex-wrap gap-1.5">
                {RENTAL_MODELS.map((model) => {
                  const isSelected = selectedRentalIds.includes(model.id);
                  return (
                    <button
                      key={model.id}
                      onClick={() => toggleRentalModel(model.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1 border ${
                        isSelected
                          ? isLight
                            ? 'bg-cyan-600 border-cyan-600 text-white font-bold shadow-2xs'
                            : 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                          : isLight
                          ? 'bg-white/80 border-slate-300 text-slate-700 hover:bg-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3" />}
                      <span>{model.pitch}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comparison Matrix Table Card */}
            <div className={`rounded-2xl border overflow-x-auto transition-all ${
              isLight ? 'bg-white/80 backdrop-blur-xl border-slate-300/80 text-slate-900 shadow-xl shadow-slate-900/8 ring-1 ring-slate-900/5' : 'bg-slate-950 border-slate-800 text-slate-100 shadow-xl shadow-black/50'
            }`}>
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className={`border-b ${isLight ? 'border-slate-200/80 bg-slate-100/60 backdrop-blur-md' : 'border-slate-800 bg-slate-900/60'}`}>
                    <th className={`p-4 sm:p-5 text-xs font-mono font-bold uppercase tracking-wider w-1/4 ${
                      isLight ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      Rental & Touring Metric
                    </th>
                    {activeRentalList.map((m) => (
                      <th key={m.id} className="p-4 sm:p-5 w-1/4 align-top">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              m.availability === 'in_stock'
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300'
                            }`}>
                              {m.availability === 'in_stock' ? 'In-Stock Staging Ready' : 'Import by Order'}
                            </span>
                          </div>
                          <span className={`text-base font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {m.name}
                          </span>
                          <span className={`text-[11px] font-normal mt-0.5 leading-tight ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            {m.tagline}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className={`divide-y text-xs ${isLight ? 'divide-slate-200' : 'divide-slate-800/80'}`}>
                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Pixel Pitch & Array Density</td>
                    {activeRentalList.map((m) => (
                      <td key={m.id} className="p-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        <div>{m.pitch}</div>
                        <div className="text-[11px] font-normal text-slate-500">{m.pixelDensity}</div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Cabinet & Rigging Mechanics</td>
                    {activeRentalList.map((m) => (
                      <td key={m.id} className={`p-4 font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {m.packaging}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Camera Sync & Refresh Rate</td>
                    {activeRentalList.map((m) => (
                      <td key={m.id} className="p-4">
                        <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{m.refreshRate}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{m.scanMode}</div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Brightness & Weatherproofing</td>
                    {activeRentalList.map((m) => (
                      <td key={m.id} className="p-4">
                        <div className="font-mono font-bold text-amber-600 dark:text-amber-400">{m.brightness}</div>
                        <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-300">{m.protection}</div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Touring Durability & Transport</td>
                    {activeRentalList.map((m) => (
                      <td key={m.id} className={`p-4 text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {m.impactResistance}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Power Draw (Avg / Peak)</td>
                    {activeRentalList.map((m) => (
                      <td key={m.id} className={`p-4 font-mono ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        <div>Avg: {m.powerAvg}</div>
                        <div className="text-[11px] text-slate-500">Peak: {m.powerPeak}</div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Best Suited Events</td>
                    {activeRentalList.map((m) => (
                      <td key={m.id} className={`p-4 text-[11px] leading-snug ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {m.idealVenues}
                      </td>
                    ))}
                  </tr>

                  <tr className={isLight ? 'bg-slate-50/80' : 'bg-slate-900/40'}>
                    <td className="p-4 font-semibold text-slate-400">Action</td>
                    {activeRentalList.map((m) => (
                      <td key={m.id} className="p-4">
                        <div className="flex flex-col gap-1.5">
                          {onSelectForCalculator && (
                            <button
                              onClick={() => onSelectForCalculator(m.name)}
                              className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] transition-colors cursor-pointer text-center shadow-xs"
                            >
                              Configure Rental Wall
                            </button>
                          )}
                          {onNavigateToRFQ && (
                            <button
                              onClick={() => onNavigateToRFQ(m.name)}
                              className={`w-full py-1.5 px-3 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer text-center ${
                                isLight
                                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                              }`}
                            >
                              Reserve Staging Flightcases
                            </button>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. DEVICES, CARDS & SYSTEMS COMPARISON VIEW */}
        {activeCategory === 'systems' && (
          <div>
            {/* System Selector Bar */}
            <div className={`p-4 rounded-2xl border mb-6 flex flex-wrap items-center justify-between gap-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
            }`}>
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select up to 3 Controller & Card Ecosystems to compare:
              </div>

              <div className="flex flex-wrap gap-1.5">
                {SYSTEM_ECOSYSTEMS.map((sys) => {
                  const isSelected = selectedSystemIds.includes(sys.id);
                  return (
                    <button
                      key={sys.id}
                      onClick={() => toggleSystemModel(sys.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? isLight
                            ? 'bg-cyan-600 border-cyan-600 text-white shadow-2xs'
                            : 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : isLight
                          ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{sys.brand.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comparison Matrix Table Card */}
            <div className={`rounded-2xl border overflow-x-auto shadow-sm transition-colors ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
            }`}>
              <table className="w-full text-left border-collapse min-w-[780px]">
                <thead>
                  <tr className={`border-b ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/60'}`}>
                    <th className={`p-4 sm:p-5 text-xs font-mono font-bold uppercase tracking-wider w-1/4 ${
                      isLight ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      Control Ecosystem
                    </th>
                    {activeSystemList.map((sys) => (
                      <th key={sys.id} className="p-4 sm:p-5 w-1/4 align-top">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-cyan-500/20 text-cyan-600 dark:text-cyan-300">
                              {sys.brand.split(' ')[0]} Ecosystem
                            </span>
                            {sys.isIndustryStandard && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                                #1 Global Standard
                              </span>
                            )}
                          </div>
                          <span className={`text-base font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {sys.brand}
                          </span>
                          <span className={`text-[11px] font-normal mt-0.5 leading-tight ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            {sys.tagline}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className={`divide-y text-xs ${isLight ? 'divide-slate-200' : 'divide-slate-800/80'}`}>
                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Primary Video Processors</td>
                    {activeSystemList.map((sys) => (
                      <td key={sys.id} className={`p-4 font-mono font-medium text-xs leading-relaxed ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {sys.primaryControllers}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Receiving Cards & HUBs</td>
                    {activeSystemList.map((sys) => (
                      <td key={sys.id} className="p-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {sys.receivingCards}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Pixel Capacity & Ports</td>
                    {activeSystemList.map((sys) => (
                      <td key={sys.id} className="p-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{sys.maxPixelCap}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{sys.portsGigabit}</div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Configuration Software Suite</td>
                    {activeSystemList.map((sys) => (
                      <td key={sys.id} className={`p-4 font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {sys.softwareSuite}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Cloud & Media Management</td>
                    {activeSystemList.map((sys) => (
                      <td key={sys.id} className={`p-4 text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {sys.cloudPlatform}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Color Calibration & Grayscale</td>
                    {activeSystemList.map((sys) => (
                      <td key={sys.id} className="p-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {sys.colorDepth}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Driver IC Support</td>
                    {activeSystemList.map((sys) => (
                      <td key={sys.id} className="p-4 font-mono text-[11px] text-slate-500">
                        {sys.driverICSupport}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Audio & Phone App Control</td>
                    {activeSystemList.map((sys) => (
                      <td key={sys.id} className="p-4">
                        <div className="font-medium text-slate-900 dark:text-white">{sys.audioHandling}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{sys.mobileControl}</div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={`p-4 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Stock in Addis Ababa</td>
                    {activeSystemList.map((sys) => (
                      <td key={sys.id} className="p-4 font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        {sys.addisStockStatus}
                      </td>
                    ))}
                  </tr>

                  <tr className={isLight ? 'bg-slate-50/80' : 'bg-slate-900/40'}>
                    <td className="p-4 font-semibold text-slate-400">Integration Support</td>
                    {activeSystemList.map((sys) => (
                      <td key={sys.id} className="p-4">
                        {onNavigateToRFQ && (
                          <button
                            onClick={() => onNavigateToRFQ(`${sys.brand} Controller & Card Integration`)}
                            className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] transition-colors cursor-pointer text-center shadow-xs"
                          >
                            Inquire {sys.brand.split(' ')[0]} Hardware
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
