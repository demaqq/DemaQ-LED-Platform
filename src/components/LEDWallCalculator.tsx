import React, { useState, useMemo } from 'react';
import { LEDInquiry, AvailabilityStatus } from '../types';
import {
  Calculator, Check, Download, Layers, ShieldCheck,
  Sparkles, Zap, Eye, Monitor, Maximize2, ArrowRight,
  Truck, Clock, Cpu, Magnet, Box, Sliders, CheckCircle2, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LEDWallCalculatorProps {
  onCaptureInquiry: (inquiry: Omit<LEDInquiry, 'id' | 'timestamp' | 'status'>) => void;
  onNavigateToRFQ: () => void;
}

interface CabinetPreset {
  id: string;
  name: string;
  category: string;
  packagingTech: string;
  cabWidthMm: number;
  cabHeightMm: number;
  defaultPitchMm: number;
  availablePitches: {
    pitch: string;
    mm: number;
    availability: AvailabilityStatus;
    leadTime: string;
  }[];
  weightKgPerCab: number;
  powerMaxWPerCab: number;
  powerAvgWPerCab: number;
}

interface ModularPitchOption {
  pitch: string;
  mm: number;
  name: string;
  packaging: string;
  availability: AvailabilityStatus;
  leadTime: string;
  weightKgPerMod: number;
  powerMaxWPerMod: number;
  powerAvgWPerMod: number;
}

const CABINET_PRESETS: CabinetPreset[] = [
  {
    id: 'shield-gob',
    name: 'DEMAQ Shield-GOB (P2.5+ In-Stock)',
    category: 'Commercial Retail / Houses of Worship',
    packagingTech: 'GOB (Glue-On-Board Epoxy Armor)',
    cabWidthMm: 640,
    cabHeightMm: 480,
    defaultPitchMm: 2.5,
    availablePitches: [
      { pitch: 'P2.5', mm: 2.5, availability: 'in_stock', leadTime: 'In-Stock Addis: Ships in 24 - 48h' },
      { pitch: 'P3.0', mm: 3.0, availability: 'in_stock', leadTime: 'In-Stock Addis: Ships in 24 - 48h' },
    ],
    weightKgPerCab: 5.8,
    powerMaxWPerCab: 110,
    powerAvgWPerCab: 38,
  },
  {
    id: 'demaq-p4-outdoor-960',
    name: 'DEMAQ Outdoor P4 Standard DOOH (960×960mm Cabinet)',
    category: 'Outdoor Commercial Billboards & Stadiums',
    packagingTech: 'SMD High-Brightness IP66 Waterproof',
    cabWidthMm: 960,
    cabHeightMm: 960,
    defaultPitchMm: 4.0,
    availablePitches: [
      { pitch: 'P4.0', mm: 4.0, availability: 'in_stock', leadTime: 'In-Stock Addis: Fast 24-48h Assembly (240×240 px/cab)' },
      { pitch: 'P4.81', mm: 4.81, availability: 'in_stock', leadTime: 'In-Stock Addis: Fast Assembly (200×200 px/cab)' },
      { pitch: 'P6.00', mm: 6.0, availability: 'in_stock', leadTime: 'In-Stock Addis: Fast Assembly (160×160 px/cab)' },
      { pitch: 'P8.00', mm: 8.0, availability: 'in_stock', leadTime: 'In-Stock Addis: Fast Assembly (120×120 px/cab)' },
      { pitch: 'P10.0', mm: 10.0, availability: 'in_stock', leadTime: 'In-Stock Addis: Fast Assembly (96×96 px/cab)' },
    ],
    weightKgPerCab: 19.5,
    powerMaxWPerCab: 340,
    powerAvgWPerCab: 115,
  },
  {
    id: 'nova-pitch-cob',
    name: 'DEMAQ Nova-Pitch (<P2.5 COB Micro-LED)',
    category: 'Mission-Critical Control & Boardroom',
    packagingTech: 'COB (Flip-Chip Chip-On-Board)',
    cabWidthMm: 600,
    cabHeightMm: 337.5,
    defaultPitchMm: 1.25,
    availablePitches: [
      { pitch: 'P0.78', mm: 0.78, availability: 'import_by_order', leadTime: 'Import by Order: 14 - 21 Days' },
      { pitch: 'P0.93', mm: 0.93, availability: 'import_by_order', leadTime: 'Import by Order: 14 - 21 Days' },
      { pitch: 'P1.25', mm: 1.25, availability: 'import_by_order', leadTime: 'Import by Order: 14 - 21 Days' },
      { pitch: 'P1.56', mm: 1.56, availability: 'import_by_order', leadTime: 'Import by Order: 14 - 21 Days' },
      { pitch: 'P1.87', mm: 1.87, availability: 'import_by_order', leadTime: 'Import by Order: 14 - 21 Days' },
    ],
    weightKgPerCab: 4.2,
    powerMaxWPerCab: 75,
    powerAvgWPerCab: 25,
  },
  {
    id: 'apex-rental',
    name: 'DEMAQ Apex-Rental (P2.6 - P3.91 Staging)',
    category: 'Event Staging & Concert Touring',
    packagingTech: 'SMD Touring Grade Magnesium',
    cabWidthMm: 500,
    cabHeightMm: 500,
    defaultPitchMm: 2.6,
    availablePitches: [
      { pitch: 'P2.60', mm: 2.60, availability: 'in_stock', leadTime: 'In-Stock Addis: Event Staging Ready' },
      { pitch: 'P2.97', mm: 2.97, availability: 'in_stock', leadTime: 'In-Stock Addis: Event Staging Ready' },
      { pitch: 'P3.91', mm: 3.91, availability: 'in_stock', leadTime: 'In-Stock Addis: Event Staging Ready' },
    ],
    weightKgPerCab: 6.8,
    powerMaxWPerCab: 120,
    powerAvgWPerCab: 40,
  },
  {
    id: 'horizon-dooh',
    name: 'DEMAQ Horizon-DOOH (P3.9 - P10 Outdoor)',
    category: 'Outdoor Commercial Billboards',
    packagingTech: 'SMD High-Brightness IP66',
    cabWidthMm: 960,
    cabHeightMm: 960,
    defaultPitchMm: 4.81,
    availablePitches: [
      { pitch: 'P3.91', mm: 3.91, availability: 'in_stock', leadTime: 'In-Stock Modules: Fast Assembly' },
      { pitch: 'P4.81', mm: 4.81, availability: 'in_stock', leadTime: 'In-Stock Modules: Fast Assembly' },
      { pitch: 'P6.25', mm: 6.25, availability: 'in_stock', leadTime: 'In-Stock Modules: Fast Assembly' },
      { pitch: 'P8.00', mm: 8.00, availability: 'in_stock', leadTime: 'In-Stock Modules: Fast Assembly' },
      { pitch: 'P10.0', mm: 10.0, availability: 'in_stock', leadTime: 'In-Stock Modules: Fast Assembly' },
    ],
    weightKgPerCab: 18.5,
    powerMaxWPerCab: 320,
    powerAvgWPerCab: 110,
  }
];

// Universal industry standard modular direct mounting (32cm x 16cm / 320mm x 160mm)
const MODULAR_PITCH_OPTIONS: ModularPitchOption[] = [
  {
    pitch: 'P1.86',
    mm: 1.86,
    name: 'Universal Modular P1.86 High-Definition',
    packaging: 'SMD 1515 Matte Black / GOB',
    availability: 'import_by_order',
    leadTime: 'Import by Order (14–21 Days)',
    weightKgPerMod: 0.45,
    powerMaxWPerMod: 22,
    powerAvgWPerMod: 7.5
  },
  {
    pitch: 'P2.0',
    mm: 2.0,
    name: 'Universal Modular P2.0 Fine-Pitch',
    packaging: 'SMD 1515 / GOB Resin',
    availability: 'import_by_order',
    leadTime: 'Import by Order (14–21 Days)',
    weightKgPerMod: 0.45,
    powerMaxWPerMod: 20,
    powerAvgWPerMod: 7.0
  },
  {
    pitch: 'P2.5',
    mm: 2.5,
    name: 'DEMAQ Shield-GOB P2.5 Module (32×16cm)',
    packaging: 'GOB Optical Epoxy Polymer Armor',
    availability: 'in_stock',
    leadTime: 'IN-STOCK ADDIS ABABA (Immediate Dispatch)',
    weightKgPerMod: 0.48,
    powerMaxWPerMod: 18,
    powerAvgWPerMod: 6.2
  },
  {
    pitch: 'P3.0',
    mm: 3.0,
    name: 'DEMAQ Shield-GOB P3.0 Module (32×16cm)',
    packaging: 'GOB Anti-Collision Epoxy Armor',
    availability: 'in_stock',
    leadTime: 'IN-STOCK ADDIS ABABA (Immediate Dispatch)',
    weightKgPerMod: 0.48,
    powerMaxWPerMod: 18,
    powerAvgWPerMod: 6.0
  },
  {
    pitch: 'P3.076',
    mm: 3.076,
    name: 'Universal Standard P3.076 Module (32×16cm)',
    packaging: 'SMD 2121 Black Face',
    availability: 'in_stock',
    leadTime: 'IN-STOCK ADDIS ABABA (24–48h Delivery)',
    weightKgPerMod: 0.42,
    powerMaxWPerMod: 17,
    powerAvgWPerMod: 5.8
  },
  {
    pitch: 'P4.0',
    mm: 4.0,
    name: 'Universal Indoor/Outdoor P4.0 Module (32×16cm)',
    packaging: 'SMD 2121 / SMD 1921',
    availability: 'in_stock',
    leadTime: 'IN-STOCK ADDIS ABABA (Immediate Dispatch)',
    weightKgPerMod: 0.44,
    powerMaxWPerMod: 19,
    powerAvgWPerMod: 6.5
  },
  {
    pitch: 'P5.0',
    mm: 5.0,
    name: 'Universal Outdoor High-Bright P5.0 Module (32×16cm)',
    packaging: 'SMD 2727 Waterproof IP65 Face',
    availability: 'in_stock',
    leadTime: 'IN-STOCK ADDIS ABABA',
    weightKgPerMod: 0.52,
    powerMaxWPerMod: 24,
    powerAvgWPerMod: 8.0
  },
  {
    pitch: 'P8.0',
    mm: 8.0,
    name: 'Universal Outdoor Billboard P8.0 Module (32×16cm)',
    packaging: 'SMD 3535 IP66 Outdoor',
    availability: 'in_stock',
    leadTime: 'IN-STOCK ADDIS ABABA',
    weightKgPerMod: 0.55,
    powerMaxWPerMod: 26,
    powerAvgWPerMod: 9.0
  },
  {
    pitch: 'P10.0',
    mm: 10.0,
    name: 'Universal Outdoor Highway P10.0 Module (32×16cm)',
    packaging: 'SMD 3535 / DIP IP68 Sealed',
    availability: 'in_stock',
    leadTime: 'IN-STOCK ADDIS ABABA',
    weightKgPerMod: 0.58,
    powerMaxWPerMod: 28,
    powerAvgWPerMod: 9.5
  }
];

export const LEDWallCalculator: React.FC<LEDWallCalculatorProps> = ({ onCaptureInquiry, onNavigateToRFQ }) => {
  const { theme, t } = useApp();
  const isLight = theme === 'light';

  // Mode: Standard Cabinet vs Frameless 32cm*16cm Direct Module
  const [calcMode, setCalcMode] = useState<'cabinet' | 'modular'>('cabinet');

  // Cabinet Mode States
  const [selectedPresetId, setSelectedPresetId] = useState<string>('shield-gob');
  const [selectedPitchIdx, setSelectedPitchIdx] = useState<number>(0);

  // Modular Mode States
  const [selectedModularPitchIdx, setSelectedModularPitchIdx] = useState<number>(2); // Default to in-stock P2.5

  // Sizing Targets
  const [targetWidthM, setTargetWidthM] = useState<number>(5.12);
  const [targetHeightM, setTargetHeightM] = useState<number>(2.88);

  // RFQ capture state
  const [showRfqForm, setShowRfqForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [company, setCompany] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const activePreset = useMemo(() => {
    return CABINET_PRESETS.find(p => p.id === selectedPresetId) || CABINET_PRESETS[0];
  }, [selectedPresetId]);

  const activeCabinetPitch = useMemo(() => {
    return activePreset.availablePitches[selectedPitchIdx] || activePreset.availablePitches[0];
  }, [activePreset, selectedPitchIdx]);

  const activeModularPitch = useMemo(() => {
    return MODULAR_PITCH_OPTIONS[selectedModularPitchIdx] || MODULAR_PITCH_OPTIONS[2];
  }, [selectedModularPitchIdx]);

  // Comprehensive Calculations
  const calc = useMemo(() => {
    if (calcMode === 'cabinet') {
      const cabW = activePreset.cabWidthMm / 1000;
      const cabH = activePreset.cabHeightMm / 1000;

      const unitsWide = Math.max(1, Math.round(targetWidthM / cabW));
      const unitsHigh = Math.max(1, Math.round(targetHeightM / cabH));
      const totalUnits = unitsWide * unitsHigh;

      const actualWidthM = +(unitsWide * cabW).toFixed(3);
      const actualHeightM = +(unitsHigh * cabH).toFixed(3);
      const actualAreaM2 = +(actualWidthM * actualHeightM).toFixed(2);

      const pitchMm = activeCabinetPitch.mm;
      const pixelsPerUnitW = Math.round(activePreset.cabWidthMm / pitchMm);
      const pixelsPerUnitH = Math.round(activePreset.cabHeightMm / pitchMm);

      const resolutionW = unitsWide * pixelsPerUnitW;
      const resolutionH = unitsHigh * pixelsPerUnitH;
      const totalPixels = resolutionW * resolutionH;

      const ratioVal = actualWidthM / actualHeightM;
      let aspectRatioStr = `${actualWidthM.toFixed(1)} : ${actualHeightM.toFixed(1)}`;
      const isStandard16_9 = Math.abs(ratioVal - 16 / 9) < 0.08;
      if (isStandard16_9) aspectRatioStr = '16 : 9 (Native 1080p/4K/8K)';
      else if (Math.abs(ratioVal - 21 / 9) < 0.1) aspectRatioStr = '21 : 9 (Ultrawide)';
      else if (Math.abs(ratioVal - 1) < 0.05) aspectRatioStr = '1 : 1 (Square)';

      const totalWeightKg = Math.round(totalUnits * activePreset.weightKgPerCab);
      const powerMaxKW = +((totalUnits * activePreset.powerMaxWPerCab) / 1000).toFixed(1);
      const powerAvgKW = +((totalUnits * activePreset.powerAvgWPerCab) / 1000).toFixed(1);

      const minViewingDistM = +(pitchMm * 1.0).toFixed(1);
      const optViewingDistM = +(pitchMm * 2.5).toFixed(1);

      // Power Supplies & Receiving Cards for Cabinet Wall
      const receivingCardsCount = totalUnits; // 1 card per cabinet
      const powerSuppliesCount = totalUnits; // 1 PSU per cabinet

      // Controller selection by pixel capacity
      let recommendedController = 'NovaStar VX400 (2.6M px, 4x RJ45)';
      if (totalPixels <= 650000) recommendedController = 'NovaStar TB1 / Taurus TB30 (650K px)';
      else if (totalPixels <= 1300000) recommendedController = 'NovaStar VX400 / TB2 (1.3M px)';
      else if (totalPixels <= 2600000) recommendedController = 'NovaStar VX400 (2.6M px, 4-Port Output)';
      else if (totalPixels <= 3900000) recommendedController = 'NovaStar VX600 (3.9M px, 6-Port Output)';
      else if (totalPixels <= 6500000) recommendedController = 'NovaStar VX1000 (6.5M px, 10-Port Output, 4K In)';
      else if (totalPixels <= 10400000) recommendedController = 'NovaStar VX16s / NovaPro UHD Jr (10.4M px, 16-Port 4K)';
      else recommendedController = 'NovaStar MX40 Pro COEX Modular System';

      return {
        mode: 'cabinet' as const,
        pitchLabel: activeCabinetPitch.pitch,
        pitchMm,
        seriesName: activePreset.name,
        packagingTech: activePreset.packagingTech,
        unitsWide,
        unitsHigh,
        totalUnits,
        unitWidthMm: activePreset.cabWidthMm,
        unitHeightMm: activePreset.cabHeightMm,
        unitLabel: 'Cabinets',
        actualWidthM,
        actualHeightM,
        actualAreaM2,
        resolutionW,
        resolutionH,
        totalPixels,
        aspectRatio: aspectRatioStr,
        isStandard16_9,
        totalWeightKg,
        powerMaxKW,
        powerAvgKW,
        minViewingDistM,
        optViewingDistM,
        availability: activeCabinetPitch.availability,
        leadTime: activeCabinetPitch.leadTime,
        powerSuppliesCount,
        receivingCardsCount,
        magnetsCount: 0,
        recommendedController
      };
    } else {
      // MODULAR 32cm x 16cm (320mm x 160mm) FRAMLESS DIRECT MOUNT
      const modW = 0.32; // 32cm
      const modH = 0.16; // 16cm

      const unitsWide = Math.max(1, Math.round(targetWidthM / modW));
      const unitsHigh = Math.max(1, Math.round(targetHeightM / modH));
      const totalUnits = unitsWide * unitsHigh;

      const actualWidthM = +(unitsWide * modW).toFixed(3);
      const actualHeightM = +(unitsHigh * modH).toFixed(3);
      const actualAreaM2 = +(actualWidthM * actualHeightM).toFixed(2);

      const pitchMm = activeModularPitch.mm;
      const pixelsPerUnitW = Math.round(320 / pitchMm);
      const pixelsPerUnitH = Math.round(160 / pitchMm);

      const resolutionW = unitsWide * pixelsPerUnitW;
      const resolutionH = unitsHigh * pixelsPerUnitH;
      const totalPixels = resolutionW * resolutionH;

      const ratioVal = actualWidthM / actualHeightM;
      let aspectRatioStr = `${actualWidthM.toFixed(1)} : ${actualHeightM.toFixed(1)}`;
      const isStandard16_9 = Math.abs(ratioVal - 16 / 9) < 0.08;
      if (isStandard16_9) aspectRatioStr = '16 : 9 (Native 1080p/4K/8K)';
      else if (Math.abs(ratioVal - 21 / 9) < 0.1) aspectRatioStr = '21 : 9 (Ultrawide)';
      else if (Math.abs(ratioVal - 1) < 0.05) aspectRatioStr = '1 : 1 (Square)';

      const totalWeightKg = Math.round(totalUnits * activeModularPitch.weightKgPerMod + (totalUnits * 0.15)); // including frame brackets
      const powerMaxKW = +((totalUnits * activeModularPitch.powerMaxWPerMod) / 1000).toFixed(1);
      const powerAvgKW = +((totalUnits * activeModularPitch.powerAvgWPerMod) / 1000).toFixed(1);

      const minViewingDistM = +(pitchMm * 1.0).toFixed(1);
      const optViewingDistM = +(pitchMm * 2.5).toFixed(1);

      // Hardware Bill of Materials for Frameless 32cm*16cm Module Installation
      // 1 MeanWell 5V 40A/60A PSU powers approximately 4-6 modules of 32x16cm
      const powerSuppliesCount = Math.ceil(totalUnits / 5);
      // 1 Receiving card (MRV208 / HD-R512S) can typically handle 8 to 16 modules (128x64 or 160x80 each)
      const modulesPerCard = pitchMm <= 2.0 ? 8 : 16;
      const receivingCardsCount = Math.ceil(totalUnits / modulesPerCard);
      // 4 High-Strength Magnetic Studs per 32x16cm module
      const magnetsCount = totalUnits * 4;

      // Controller selection by pixel capacity
      let recommendedController = 'NovaStar VX400 (2.6M px, 4x RJ45)';
      if (totalPixels <= 650000) recommendedController = 'NovaStar TB1 / Taurus TB30 (650K px)';
      else if (totalPixels <= 1300000) recommendedController = 'NovaStar VX400 / TB2 (1.3M px)';
      else if (totalPixels <= 2600000) recommendedController = 'NovaStar VX400 (2.6M px, 4-Port Output)';
      else if (totalPixels <= 3900000) recommendedController = 'NovaStar VX600 (3.9M px, 6-Port Output)';
      else if (totalPixels <= 6500000) recommendedController = 'NovaStar VX1000 (6.5M px, 10-Port Output, 4K In)';
      else if (totalPixels <= 10400000) recommendedController = 'NovaStar VX16s / NovaPro UHD Jr (10.4M px, 16-Port 4K)';
      else recommendedController = 'NovaStar MX40 Pro COEX Modular System';

      return {
        mode: 'modular' as const,
        pitchLabel: activeModularPitch.pitch,
        pitchMm,
        seriesName: activeModularPitch.name,
        packagingTech: activeModularPitch.packaging,
        unitsWide,
        unitsHigh,
        totalUnits,
        unitWidthMm: 320,
        unitHeightMm: 160,
        unitLabel: 'Modules (32×16cm)',
        actualWidthM,
        actualHeightM,
        actualAreaM2,
        resolutionW,
        resolutionH,
        totalPixels,
        aspectRatio: aspectRatioStr,
        isStandard16_9,
        totalWeightKg,
        powerMaxKW,
        powerAvgKW,
        minViewingDistM,
        optViewingDistM,
        availability: activeModularPitch.availability,
        leadTime: activeModularPitch.leadTime,
        powerSuppliesCount,
        receivingCardsCount,
        magnetsCount,
        recommendedController
      };
    }
  }, [calcMode, activePreset, activeCabinetPitch, activeModularPitch, targetWidthM, targetHeightM]);

  const handleApplyQuickPreset = (w: number, h: number) => {
    setTargetWidthM(w);
    setTargetHeightM(h);
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;

    onCaptureInquiry({
      clientName,
      company: company || 'Commercial Client',
      email: clientEmail,
      phone: '',
      application: calc.mode === 'cabinet' ? activePreset.category : 'Frameless Magnetic 32×16cm Module Installation',
      seriesInterest: calc.seriesName,
      pixelPitch: calc.pitchLabel,
      availabilityRequirement: calc.availability === 'in_stock' ? 'In-Stock Immediate (P2.5+)' : 'Custom Import by Order (<P2.5 / COB)',
      dimensionsWidthM: calc.actualWidthM,
      dimensionsHeightM: calc.actualHeightM,
      installationType: 'Wall Mounted',
      projectLocation: projectLocation || 'Worldwide Delivery',
      budgetRange: 'Engineering Quote Requested',
      details: `Calculated Configuration: ${calc.actualWidthM}m × ${calc.actualHeightM}m (${calc.actualAreaM2}m²), Resolution: ${calc.resolutionW}×${calc.resolutionH}px (${(calc.totalPixels / 1000000).toFixed(2)} MP), Array: ${calc.unitsWide}W × ${calc.unitsHigh}H (${calc.totalUnits} ${calc.unitLabel}). Controller: ${calc.recommendedController}, Power: ${calc.powerMaxKW}kW Max. Lead Time: ${calc.leadTime}`
    });

    setSubmitted(true);
  };

  const handleDownloadSpecSheet = () => {
    const content = `# DEMAQ LED DISPLAY SYSTEMS - VIDEO WALL ENGINEERING REPORT
Report ID: DEMAQ-CALC-${Date.now()}
Date Generated: ${new Date().toLocaleDateString()}
Installation Mode: ${calc.mode === 'cabinet' ? 'Standard Die-Cast Aluminum Cabinets' : 'Frameless Magnetic Mount (Direct 32cm × 16cm Modules - No Cabinets)'}

## 1. HARDWARE SPECIFICATION & INVENTORY
- Product Series: ${calc.seriesName}
- Packaging Technology: ${calc.packagingTech}
- Pixel Pitch: ${calc.pitchLabel} (${calc.pitchMm} mm)
- Unit Dimension: ${calc.unitWidthMm}mm (W) × ${calc.unitHeightMm}mm (H)
- Unit Array: ${calc.unitsWide} Wide × ${calc.unitsHigh} High (${calc.totalUnits} ${calc.unitLabel} Total)
- Inventory Lead Time: ${calc.leadTime}

## 2. OPTICAL & RESOLUTION METRICS
- Active Dimensions: ${calc.actualWidthM} m (W) × ${calc.actualHeightM} m (H)
- Total Active Surface Area: ${calc.actualAreaM2} m²
- Video Wall Resolution: ${calc.resolutionW} × ${calc.resolutionH} Pixels
- Total Pixel Count: ${calc.totalPixels.toLocaleString()} Pixels (${(calc.totalPixels / 1000000).toFixed(2)} MP)
- Aspect Ratio: ${calc.aspectRatio}
- Minimum Viewing Distance: ${calc.minViewingDistM} meters
- Optimal Viewing Distance: ${calc.optViewingDistM} meters

## 3. ELECTRICAL & AUXILIARY BILL OF MATERIALS
- Total System Net Weight: ~${calc.totalWeightKg} kg
- Maximum Power Load: ${calc.powerMaxKW} kW
- Average Operating Power: ${calc.powerAvgKW} kW
- 5V DC MeanWell Power Supplies: ~${calc.powerSuppliesCount} Units (5V 40A/60A)
- Receiving Cards Required: ${calc.receivingCardsCount} Units (NovaStar MRV208 / Huidu HD-R512S)
${calc.magnetsCount > 0 ? `- Magnetic Mounting Studs: ${calc.magnetsCount} Units (4 magnets per 32×16cm module)\n` : ''}- Recommended Video Processor: ${calc.recommendedController}

Generated by DEMAQ Video Wall Engineering Configurator.
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demaq-led-spec-${calc.actualWidthM}x${calc.actualHeightM}m.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="calculator"
      className={`py-20 sm:py-24 border-y relative transition-colors duration-200 ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mb-2 font-bold uppercase tracking-wider">
            01. {t.calc.title}
          </div>
          <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold font-display tracking-tight [text-wrap:balance] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.calc.subtitle}
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            Precision video wall engineering configurator. Choose between standard Die-Cast Aluminum Cabinets or direct Frameless Module Installation (universal 32cm × 16cm size without cabinets).
          </p>
        </div>

        {/* Installation Mode Toggle (Cabinets vs Modular 32x16cm) */}
        <div className={`p-2 rounded-2xl border mb-8 max-w-2xl flex items-center gap-2 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950 border-slate-800'
        }`}>
          <button
            type="button"
            onClick={() => setCalcMode('cabinet')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              calcMode === 'cabinet'
                ? 'bg-cyan-600 text-white shadow-sm'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Standard Die-Cast Cabinets</span>
            <span className="hidden sm:inline text-[10px] font-mono opacity-80">(640×480, 500×500)</span>
          </button>

          <button
            type="button"
            onClick={() => setCalcMode('modular')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              calcMode === 'modular'
                ? 'bg-gradient-to-r from-amber-500 to-cyan-600 text-slate-950 font-extrabold shadow-sm'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Magnet className="w-4 h-4" />
            <span>Modular Direct Mount</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-700 dark:text-amber-300">
              32cm × 16cm (No Cabinets)
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Mode Specific Platform Selection */}
            {calcMode === 'cabinet' ? (
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-3 ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  1. Choose Cabinet Hardware Series
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CABINET_PRESETS.map((preset) => {
                    const isSelected = preset.id === selectedPresetId;
                    const isInStock = preset.availablePitches.some(p => p.availability === 'in_stock');

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSelectedPresetId(preset.id);
                          setSelectedPitchIdx(0);
                        }}
                        className={`p-3.5 text-left rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? isLight
                              ? 'bg-cyan-50/80 border-cyan-500 text-cyan-950 ring-1 ring-cyan-500 shadow-sm'
                              : 'bg-cyan-950/50 border-cyan-400 text-white shadow-sm'
                            : isLight
                            ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-mono font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                            {preset.category}
                          </span>
                          {isInStock ? (
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                              isLight
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              IN-STOCK (P2.5+)
                            </span>
                          ) : (
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              isLight
                                ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                                : 'bg-cyan-500/20 text-cyan-300'
                            }`}>
                              IMPORT BY ORDER
                            </span>
                          )}
                        </div>
                        <div className={`text-sm font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {preset.name}
                        </div>
                        <div className={`text-[11px] mt-0.5 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {preset.packagingTech} · {preset.cabWidthMm}×{preset.cabHeightMm}mm
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`block text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    1. Choose Modular Pitch (Universal 320×160mm / 32×16cm Modules)
                  </label>
                  <span className="text-[11px] font-mono text-amber-500 font-bold flex items-center gap-1">
                    <Magnet className="w-3.5 h-3.5" /> Magnetic Front Service
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MODULAR_PITCH_OPTIONS.map((mOpt, idx) => {
                    const isSelected = idx === selectedModularPitchIdx;
                    return (
                      <button
                        key={mOpt.pitch}
                        type="button"
                        onClick={() => setSelectedModularPitchIdx(idx)}
                        className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? isLight
                              ? 'bg-amber-50/80 border-amber-500 text-amber-950 ring-1 ring-amber-500 shadow-sm'
                              : 'bg-amber-950/40 border-amber-400 text-white shadow-sm'
                            : isLight
                            ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono font-bold">{mOpt.pitch}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            mOpt.availability === 'in_stock'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                              : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300'
                          }`}>
                            {mOpt.availability === 'in_stock' ? 'IN-STOCK' : 'IMPORT'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">
                          320×160mm · {Math.round(320/mOpt.mm)}×{Math.round(160/mOpt.mm)}px
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Pitch Selector for Cabinet Mode */}
            {calcMode === 'cabinet' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    2. Pitch Selection ({activePreset.name})
                  </label>
                  <div className="text-xs font-mono">
                    {activeCabinetPitch.availability === 'in_stock' ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                        <Truck className="w-3.5 h-3.5" /> In-Stock: Fast 24-48h Dispatch
                      </span>
                    ) : (
                      <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Import by Order: 14-21 Days
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activePreset.availablePitches.map((p, idx) => {
                    const isSelected = idx === selectedPitchIdx;
                    return (
                      <button
                        key={p.pitch}
                        type="button"
                        onClick={() => setSelectedPitchIdx(idx)}
                        className={`p-3 text-center rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 border-cyan-500 font-bold shadow-sm'
                            : isLight
                            ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-base font-mono">{p.pitch}</div>
                        <div className={`text-[10px] mt-0.5 ${
                          isSelected ? 'text-slate-950 font-medium' : isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {p.availability === 'in_stock' ? 'In-Stock Addis' : 'Import Air'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Screen Dimensions Sliders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={`text-xs font-semibold uppercase tracking-wider ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  {calcMode === 'cabinet' ? '3.' : '2.'} Target Wall Dimensions
                </label>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">Quick Standard 16:9 Ratios:</span>
                  {[
                    { label: '3.8×2.1m (175")', w: 3.84, h: 2.16 },
                    { label: '5.1×2.9m (230")', w: 5.12, h: 2.88 },
                    { label: '6.4×3.6m (290")', w: 6.40, h: 3.60 },
                    { label: '8.0×4.5m (360")', w: 7.68, h: 4.32 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplyQuickPreset(preset.w, preset.h)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {preset.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Target Width:</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{targetWidthM} meters ({Math.round(targetWidthM * 3.28084)} ft)</span>
                  </div>
                  <input
                    type="range"
                    min="1.6"
                    max="15.0"
                    step="0.16"
                    value={targetWidthM}
                    onChange={(e) => setTargetWidthM(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Target Height:</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{targetHeightM} meters ({Math.round(targetHeightM * 3.28084)} ft)</span>
                  </div>
                  <input
                    type="range"
                    min="0.96"
                    max="9.0"
                    step="0.16"
                    value={targetHeightM}
                    onChange={(e) => setTargetHeightM(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Modular Frame Notice if in Modular Mode */}
            {calcMode === 'modular' && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                isLight ? 'bg-amber-50 border-amber-200 text-amber-950' : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
              }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-700 dark:text-amber-300">
                  <Magnet className="w-4 h-4" />
                  <span>Frameless Modular Installation Engineering:</span>
                </div>
                <p>
                  No heavy die-cast cabinets needed. Modules (320mm × 160mm) are secured via <strong>4× neodymium magnetic pillars</strong> per module onto a flat steel structure. Power is routed from 5V MeanWell supplies mounted behind the array with HUB75 ribbon cascades.
                </p>
              </div>
            )}
          </div>

          {/* Output & Engineering Metrics Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-6 sm:p-7 rounded-2xl border transition-colors relative overflow-hidden ${
              isLight ? 'bg-white border-slate-300 shadow-2xl shadow-slate-900/10 text-slate-900 ring-1 ring-slate-900/5' : 'bg-slate-950 border-slate-800 text-slate-100 shadow-2xl shadow-black/80'
            }`}>
              <div className="flex items-center justify-between border-b pb-4 mb-5 border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold">
                    {calc.mode === 'cabinet' ? 'CABINET ARRAY SPECS' : '32×16CM MODULAR SPECS'}
                  </span>
                  <h3 className="text-xl font-bold font-display mt-1 text-slate-900 dark:text-white">
                    {calc.actualWidthM}m × {calc.actualHeightM}m
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-medium">INVENTORY STATUS</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {calc.leadTime}
                  </span>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-900 border-slate-800'}`}>
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-medium">Array Count</span>
                  <span className="text-sm font-bold font-mono text-cyan-600 dark:text-cyan-400">
                    {calc.unitsWide}W × {calc.unitsHigh}H
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5 font-medium">
                    {calc.totalUnits} {calc.unitLabel}
                  </span>
                </div>

                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-900 border-slate-800'}`}>
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-medium">Total Resolution</span>
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                    {calc.resolutionW} × {calc.resolutionH} px
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5 font-medium">
                    {(calc.totalPixels / 1000000).toFixed(2)} Megapixels
                  </span>
                </div>

                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-900 border-slate-800'}`}>
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-medium">Aspect Ratio</span>
                  <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-500">
                    {calc.aspectRatio}
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5 font-medium">
                    {calc.actualAreaM2} m² Total Area
                  </span>
                </div>

                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-slate-900 border-slate-800'}`}>
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-medium">Electrical Power & Generator</span>
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                    {calc.powerAvgKW} kW (Peak {calc.powerMaxKW} kW)
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5 font-medium">
                    ~{Math.round((calc.powerMaxKW * 1000) / 220)}A @ 220V · Gen: ~{(calc.powerMaxKW * 1.25).toFixed(1)} kVA
                  </span>
                </div>
              </div>

              {/* Hardware Bill of Materials Box */}
              <div className={`p-3.5 rounded-xl border mb-5 text-xs ${
                isLight ? 'bg-slate-100/70 border-slate-300 shadow-xs text-slate-800' : 'bg-slate-900/80 border-slate-800 text-slate-200'
              }`}>
                <div className="font-bold font-mono text-[11px] text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Calculated Hardware & Accessory Kit</span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Power Supplies (5V 40/60A):</span>
                    <span className="font-bold text-slate-900 dark:text-white">~{calc.powerSuppliesCount} Units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Receiving Cards (MRV/HD-R):</span>
                    <span className="font-bold text-slate-900 dark:text-white">{calc.receivingCardsCount} Cards</span>
                  </div>
                  {calc.magnetsCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Magnetic Mounting Studs:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{calc.magnetsCount} Studs</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Video Processor:</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 truncate max-w-[200px]">{calc.recommendedController}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setShowRfqForm(!showRfqForm)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-cyan-500 to-blue-600 hover:opacity-90 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Request Engineering Pro-Forma Quote</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSpecSheet}
                  className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full Technical Spec Sheet (.md)</span>
                </button>
              </div>

              {/* RFQ Form Drawer */}
              {showRfqForm && (
                <form onSubmit={handleRfqSubmit} className={`mt-5 pt-5 border-t space-y-3 ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Direct RFQ Dispatch to Bole Technical Desk
                  </h4>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Your Email Address *"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Company / Church Name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Submit Configuration for Official Quote
                  </button>

                  {submitted && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Thank you! Your configuration was submitted. Our lead engineer will contact you within 2 hours.</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
