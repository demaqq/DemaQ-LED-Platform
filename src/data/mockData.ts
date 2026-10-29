import {
  LEDProduct, LEDSolution, LEDCaseStudy, LEDInquiry,
  SiteConfig, PortfolioItem, BlogPost, MaintenanceRequest,
  AdminAlertSettings, AlertNotification
} from '../types';

export const initialSiteConfig: SiteConfig = {
  brandName: 'DemaQ Digital Solution',
  tagline: 'Premier LED Screen Manufacturer & Video Wall Systems in Ethiopia',
  heroHeadline: 'Direct LED Display Solutions: Local In-Stock Inventory & Custom Import.',
  heroDescription: 'From high-durability in-stock P2.5+ GOB & SMD panels ready for immediate nationwide dispatch across Ethiopia, to custom-ordered sub-P2.5 Flip-Chip COB Micro-LEDs and 7,680Hz XR cinema studio volumes. Fully supporting NovaStar, Huidu, Colorlight, Linsn, and Brompton.',
  contactEmail: 'contact@demaqdigital.com',
  phone: '+251 942 992 799',
  location: 'Bole Sub-City, Addis Ababa, Ethiopia',
  city: 'Addis Ababa',
  country: 'Ethiopia',
  facebookUrl: 'https://facebook.com/demaqdigitalsolution',
  instagramUrl: 'https://instagram.com/demaqdigitalsolution',
  tiktokUrl: 'https://tiktok.com/@demaqdigitalsolution',
  telegramUrl: 'https://t.me/demaqdigital',
  whatsappUrl: 'https://wa.me/251942992799',
  certifications: 'CE · RoHS · ETL · FCC · TUV · ISO 9001 · EMC Class B',
  warrantyPeriod: '5-Year Commercial Replacement Warranty'
};

export const supportedControllers = [
  {
    name: 'NovaStar',
    tagline: 'Global Industry Standard',
    description: 'Full support for COEX, NovaPro UHD, VX1000, Taurus TB30/TB50 cloud players, and A10s Pro receiving cards. NovaLCT calibration.',
    logoText: 'NOVASTAR',
    accent: 'border-cyan-500/40 text-cyan-300'
  },
  {
    name: 'Huidu',
    tagline: 'Asynchronous & Cloud Display',
    description: 'Expert setup for HDPlayer, C16/C36/A6 asynchronous controllers, Wi-Fi 4G remote cloud clustering, and HD-R512T cards.',
    logoText: 'HUIDU',
    accent: 'border-amber-500/40 text-amber-300'
  },
  {
    name: 'Colorlight',
    tagline: 'High-Resolution Media Processing',
    description: 'Certified configuration for Z6 PRO, X8e super controllers, i5/i9 plus receiving cards, and LEDVISION visual mapping software.',
    logoText: 'COLORLIGHT',
    accent: 'border-emerald-500/40 text-emerald-300'
  },
  {
    name: 'Linsn',
    tagline: 'Classic Broadcast Sending Systems',
    description: 'Hardware repair, firmware updates, and calibration for TS802, TS901 sending cards, and RV908M receiver hubs.',
    logoText: 'LINSN',
    accent: 'border-purple-500/40 text-purple-300'
  },
  {
    name: 'Brompton Technology',
    tagline: 'Hollywood XR & Virtual Production',
    description: 'High-end cinema studio synchronization with Tessera SX40 4K processors, DynaCal dynamic calibration, and Genlock phase offset.',
    logoText: 'BROMPTON',
    accent: 'border-blue-500/40 text-blue-300'
  }
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Millennium Hall Event Staging Screen',
    venue: 'Millennium Hall Arena',
    location: 'Bole, Addis Ababa',
    screenSize: '16m (W) × 5m (H) · 80 m²',
    pitch: 'P2.6 Apex-Rental (In-Stock)',
    category: 'Concert & Event Staging',
    image: '/src/assets/images/led_concert_stage_real_1790853083477.jpg',
    metric: '7,680Hz Camera Shutter Ready'
  },
  {
    id: 'port-2',
    title: 'Bole Road Architectural Curved 3D DOOH',
    venue: 'Commercial Landmark Tower',
    location: 'Bole Road, Addis Ababa',
    screenSize: '18m (W) × 8m (H) · 144 m²',
    pitch: 'P4.81 Horizon Outdoor (In-Stock)',
    category: 'Outdoor 3D Billboard',
    image: '/src/assets/images/led_outdoor_dooh_real_1790853056151.jpg',
    metric: '9,500 Nits Direct Sunlight'
  },
  {
    id: 'port-3',
    title: 'Mega Worship Sanctuary Centerpiece Wall',
    venue: 'Faith Center Auditorium',
    location: 'Sarbet, Addis Ababa',
    screenSize: '9.6m (W) × 3.84m (H) · 36.8 m²',
    pitch: 'P2.5 Shield-GOB Armored (In-Stock)',
    category: 'House of Worship',
    image: '/src/assets/images/led_worship_sanctuary_real_1790853041095.jpg',
    metric: '100% Anti-Collision GOB Surface'
  },
  {
    id: 'port-4',
    title: 'National Financial Command Operations Wall',
    venue: 'Banking Operations Hub',
    location: 'Kazanchis Financial District',
    screenSize: '8.4m (W) × 2.7m (H) · 22.68 m²',
    pitch: 'P0.93 Nova-Pitch COB (Custom Import)',
    category: 'Control Room SOC',
    image: '/src/assets/images/led_control_room_real_1790853095603.jpg',
    metric: '10,000:1 True Black Contrast'
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Why GOB (Glue-On-Board) LED Screens Are The #1 Choice for Ethiopian Churches & Retail',
    category: 'Technical',
    readTime: '4 min read',
    date: 'September 2026',
    excerpt: 'Discover why standard SMD screens are vulnerable to dead pixels from touch, and how our in-stock P2.5 GOB epoxy armor solves the problem for high-traffic venues.',
    content: `When purchasing an indoor LED screen in Ethiopia for high-traffic environments like retail storefronts, church stages, auditoriums, and schools, traditional SMD displays face a major risk: dead pixels caused by accidental physical contact, cleaning bumps, or humidity.

GOB (Glue-On-Board) solves this by pouring an optically clear epoxy resin over the entire surface of the LED modules. At DemaQ Digital Solution, we stock P2.5 and P3.0 GOB displays locally in Addis Ababa. 

Key benefits of GOB for our local market:
1. Anti-Collision & Anti-Knock: People can touch the screen without breaking delicate diode soldering.
2. Moisture & Dust Proof: Cleanable with standard microfibers without water seepage.
3. Anti-Static: Protects internal circuits against voltage spikes and dry season dust.
4. Immediate Availability: Available in-stock at DemaQ for 24-48h setup.`,
    image: '/src/assets/images/led_worship_sanctuary_real_1790853041095.jpg',
    tags: ['GOB LED', 'In-Stock P2.5', 'Churches & Retail', 'Addis Ababa'],
    automated: false,
    published: true,
    scientificFormulas: [
      {
        name: 'Impact Kinetic Shear Absorption Law',
        latex: '\\sigma_{shear} = \\frac{F_{impact}}{A_{epoxy}} \\le \\tau_{yield} \\approx 45\\text{ MPa}',
        explanation: 'Optically transparent epoxy encapsulation dissipates point-source tactile collisions across the full substrate area, preventing diode shear failure.'
      },
      {
        name: 'Electrostatic Breakdown Threshold (Paschen Criterion)',
        latex: 'V_{breakdown} = \\frac{B \\cdot p \\cdot d}{\\ln(A \\cdot p \\cdot d) - \\ln\\left[\\ln\\left(1 + \\frac{1}{\\gamma_{se}}\\right)\\right]} > 8,000\\text{ V}',
        explanation: 'Protects semiconductor wire bond junctions against dry-season Addis Ababa electrostatic discharges up to 8kV.'
      }
    ],
    empiricalMetrics: [
      { parameter: 'Surface Hardness Rating', measuredValue: '5H Pencil Hardness', baselineValue: 'Unprotected SMD (< 1H)', standardRef: 'ASTM D3363 Standard' },
      { parameter: 'Dust & Moisture Ingress', measuredValue: 'Front IP54 Sealed', baselineValue: 'IP30 Open PCB', standardRef: 'IEC 60529 IP Code' },
      { parameter: 'Contact Pixel Dropout Rate', measuredValue: '0.00 ppm / year', baselineValue: '180 ppm / year', standardRef: 'DemaQ Field Telemetry 2025/2026' }
    ],
    directLinks: [
      {
        title: 'NovaStar COEX Professional Display Control Architecture',
        url: 'https://www.novastar.tech/products/controller/',
        publisher: 'NovaStar Technology Inc.',
        category: 'controller',
        standardCode: 'NovaStar MX40-Pro / COEX V1.6',
        verifiedDate: '2025/2026'
      },
      {
        title: 'CIE 1931 Colorimetry Standards & Photopic Spectral Luminous Efficiency',
        url: 'https://cie.co.at/publications/colorimetry-4th-edition',
        publisher: 'Commission Internationale de l\'Éclairage (CIE)',
        category: 'standards',
        standardCode: 'CIE 015:2018 / ISO 11664-1',
        verifiedDate: 'ISO/CIE'
      },
      {
        title: 'Ethiopian Conformity Assessment Enterprise (ECAE) Electrical Testing Standards',
        url: 'https://www.ecae.gov.et/',
        publisher: 'Ethiopian Conformity Assessment Enterprise',
        category: 'standards',
        standardCode: 'CES 107:2020 (LV Switchgear & Safety)',
        verifiedDate: 'ECAE Standard'
      }
    ]
  },
  {
    id: 'blog-2',
    title: 'In-Stock P2.5+ vs. Custom-Import Sub-P2.5 COB: What Does Your Venue Actually Need?',
    category: 'Buyer Guide',
    readTime: '5 min read',
    date: 'August 2026',
    excerpt: 'Understand viewing distances, budget considerations, and lead times when choosing between our local in-stock inventory and custom factory-ordered Micro-LEDs.',
    content: `One of the most common questions our engineering desk receives is: "Should I buy an in-stock P2.5 screen today, or custom-import a sub-P2.5 COB screen?"

Here is the straightforward engineering breakdown:
- If your closest audience is 2.5 meters or further away (e.g. churches, conference halls, restaurants, event stages, retail shops): Our in-stock DEMAQ P2.5 GOB is the optimal choice. It is already in Addis Ababa, delivers retina clarity at normal viewing distance, and costs significantly less.
- If your audience is sitting less than 2 meters away (e.g. command control rooms, executive boardrooms, TV broadcast studios): You need our custom-imported sub-P2.5 COB (P0.78, P0.93, P1.25, P1.56). We custom manufacture and air-import these in 14-21 days with 10,000:1 contrast and zero wire failure.`,
    image: '/src/assets/images/led_boardroom_cob_realistic_1790852796887.jpg',
    tags: ['Pixel Pitch Guide', 'COB Micro-LED', 'Viewing Distance', 'Pricing'],
    automated: false,
    published: true,
    scientificFormulas: [
      {
        name: 'Snellen Optical Acuity Retinal Resolving Threshold',
        latex: 'D_{optimal} = \\frac{\\text{Pixel Pitch (mm)}}{2 \\times \\tan(1\' / 120)} \\approx \\text{Pitch (mm)} \\times 3.438\\text{ meters}',
        explanation: 'At 1 arcminute human retinal acuity (20/20 vision), adjacent sub-pixels merge into a smooth visual continuum without discernible pixel grid structure.'
      },
      {
        name: 'Contrast Ratio Luminance Dynamic Range',
        latex: 'CR = \\frac{L_{white} + L_{ambient}}{L_{black} + L_{ambient}} = \\frac{1000 + 15}{0.10 + 15} \\approx 67.2:1 \\text{ (In Daylight Ambient)}',
        explanation: 'Flip-Chip COB matte black encapsulation lowers specular surface reflectance by 84%, preserving punchy contrast even in glass-walled boardrooms.'
      }
    ],
    empiricalMetrics: [
      { parameter: 'Minimum Resolvable Viewing Distance', measuredValue: '0.93m for P0.93 COB', baselineValue: '2.5m for P2.5 SMD', standardRef: 'ISO 9241-307 Ergonomic Standard' },
      { parameter: 'Surface Black Reflectivity', measuredValue: '0.8% specular reflectance', baselineValue: '4.9% SMD plastic cup', standardRef: 'CIE 17.4 International Vocabulary' },
      { parameter: 'Module Operating Junction Delta', measuredValue: '+18.5°C above ambient', baselineValue: '+38.2°C traditional SMD', standardRef: 'JEDEC JESD51 Thermal Standards' }
    ],
    directLinks: [
      {
        title: 'IEEE 1789-2015: Modulated Light in LED Displays for Mitigating Health Risks',
        url: 'https://standards.ieee.org/ieee/1789/4937/',
        publisher: 'Institute of Electrical and Electronics Engineers',
        category: 'standards',
        standardCode: 'IEEE Std 1789-2015',
        verifiedDate: 'IEEE Standards Association'
      },
      {
        title: 'MeanWell Industrial Switching Power Supplies & Surge Protection (UHP Series)',
        url: 'https://www.meanwell.com/productSeries.aspx',
        publisher: 'MEAN WELL Enterprises Co., Ltd.',
        category: 'hardware',
        standardCode: 'EN 62368-1 / UL62368-1 PFC>0.95',
        verifiedDate: 'MeanWell Tech Manual'
      }
    ]
  },
  {
    id: 'blog-3',
    title: 'NovaStar, Huidu, or Colorlight? A Complete Video Controller Guide for LED Screens',
    category: 'Technical',
    readTime: '6 min read',
    date: 'July 2026',
    excerpt: 'A technical comparison of video processors, sending cards, and cloud asynchronous software supported by DemaQ Digital Solution.',
    content: `Choosing the right controller determines your video wall's flexibility:
- NovaStar: The global king of live events, staging, and high-end video walls. Software: NovaLCT & SmartLCT. Recommended for zero-latency live feeds.
- Huidu: The premier choice for asynchronous commercial advertising, single/double sided billboards, and remote cloud management via 4G/Wi-Fi with HDPlayer.
- Colorlight: Renowned for color fidelity and flexible visual mapping in large architectural installations with LEDVISION.
- Brompton Technology: The gold standard for Virtual Production and XR volumes requiring 240Hz camera sync and Genlock.

DemaQ Digital Solution provides complete programming, calibration, and replacement hardware for all these brands in Ethiopia.`,
    image: '/src/assets/images/led_control_room_cob_realistic_1790852833333.jpg',
    tags: ['NovaStar', 'Huidu', 'Colorlight', 'Brompton'],
    automated: false,
    published: true
  },
  {
    id: 'blog-4',
    title: 'Ethiopian Media Authority Adopts New 3D Anamorphic LED Display Guidelines in Addis Ababa',
    category: 'Industry News',
    readTime: '3 min read',
    date: 'October 2026',
    excerpt: 'New standards for outdoor commercial LED digital signage, brightness throttling during night hours, and structural wind resistance certifications.',
    content: `Urban digital advertising in Ethiopia is advancing rapidly with corner-curved 3D billboards along Bole Road and Meskel Square. 

Key regulatory highlights:
1. Automatic Photodiode Brightness Sensors: Must dim screen from 8,500 nits down to 1,200 nits after 7:00 PM.
2. Structural Safety Sign-off: Steel trusses must be certified for 120km/h peak wind load.
3. Common-Cathode Power Saving: Mandated for energy efficiency across municipal grids.

DemaQ Digital Solution builds all outdoor displays to full municipal compliance.`,
    image: '/src/assets/images/led_outdoor_dooh_real_1790853056151.jpg',
    tags: ['DOOH', 'Addis Ababa', 'City Regulations', '3D Billboard'],
    automated: false,
    published: true
  },
  {
    id: 'blog-5',
    title: 'Inside the 80 m² Millennium Hall Concert LED Staging Project',
    category: 'Projects',
    readTime: '5 min read',
    date: 'September 2026',
    excerpt: 'A behind-the-scenes engineering look at the rigging, fast-lock curved cabinets, and 7,680Hz broadcast camera synchronization for international summits.',
    content: `Deploying an 80-square-meter rental screen for live concert broadcast requires zero room for error:
- Rigging: Engineered with 500x1000mm die-cast magnesium cabinets suspended from dual aluminum box trusses.
- Synchronization: Driven by dual NovaStar VX1000 all-in-one processors with optical fiber loops to prevent ground hum.
- Camera Performance: 7,680Hz refresh rate eliminates black scan bars on 4K RED and ARRI production cameras.`,
    image: '/src/assets/images/led_concert_staging_realistic_1790852811038.jpg',
    tags: ['Millennium Hall', 'Concert Staging', 'P2.6 Rental', 'NovaStar'],
    automated: true,
    published: true
  },
  {
    id: 'blog-6',
    title: 'Direct 320×160mm Modular Wall Assembly Without Heavy Cabinets',
    category: 'Technical',
    readTime: '4 min read',
    date: 'October 2026',
    excerpt: 'How DemaQ uses precision magnetic sub-frames to install ultra-slim 45mm video walls directly on interior masonry walls.',
    content: `Cabinet-less magnetic installations eliminate the bulk and weight of traditional die-cast housings:
- Ultra-Slim Depth: Only 45mm total profile including magnetic standoffs, fully ADA hallway egress compliant.
- Weight Reduction: Cuts wall load by 45%, allowing mounting on lightweight gypsum and partition studs.
- Front Service: 100% magnetic front vacuum tool servicing in under 5 seconds per module.`,
    image: '/src/assets/images/led_retail_flexible_real_1790853123520.jpg',
    tags: ['Modular Frame', 'Magnetic Front Service', 'Slim Profile', 'Addis Ababa'],
    automated: false,
    published: true
  },
  {
    id: 'blog-7',
    title: 'Virtual Production XR Volumes in East Africa: 240Hz Camera Sync & Brompton Tessera',
    category: 'Technical',
    readTime: '5 min read',
    date: 'October 2026',
    excerpt: 'Engineering in-camera visual effects (ICVFX) with 7,680Hz LED panels, Brompton 4K processing, and cinema shutter synchronization.',
    content: `Virtual film production replaces green screens with photorealistic curved LED volumes:
- Camera Shutter Genlock: Zero rolling shutter artifacts or moiré banding on ARRI and Sony VENICE cinema bodies.
- Color Fidelity: 16-bit DCI-P3 color gamut calibration powered by Brompton Tessera SX40.
- Dynamic Calibration: 240 fps high frame rate support for crystal-clear slow-motion capture.`,
    image: '/src/assets/images/led_virtual_production_xr_realistic_1790852849598.jpg',
    tags: ['Virtual Production', 'XR Volume', 'Brompton', 'Cinema 7680Hz'],
    automated: false,
    published: true
  },
  {
    id: 'blog-8',
    title: 'MeanWell 5V 60A Redundant Power Topology: Shielding Against Ethiopian Grid Transients',
    category: 'Technical',
    readTime: '4 min read',
    date: 'October 2026',
    excerpt: 'Detailed analysis of Power Factor Correction (PFC > 0.95) and dual-loop DC distribution across high-power commercial displays.',
    content: `Grid voltage fluctuations between 180V and 265V in Addis Ababa require robust electrical isolation:
- Active PFC: Minimizes harmonic distortion and stabilizes phase load on building generators.
- Dual-Rail DC: Parallel MeanWell 5V power feeds ensure that a single power supply failure does not darken modules.
- Metal-Oxide Varistors: Suppress lightning and switching transients up to 4,000 volts.`,
    image: '/src/assets/images/led_hero_curved_stage_realistic_1790852865200.jpg',
    tags: ['MeanWell PSUs', 'Grid Transient Protection', 'Power Factor Correction', 'Addis Ababa'],
    automated: false,
    published: true
  }
];

export const ledProducts: LEDProduct[] = [
  {
    id: 'shield-gob',
    seriesName: 'DEMAQ Shield-GOB Commercial Series',
    category: 'in_stock_commercial',
    packagingTech: 'GOB (Glue-On-Board)',
    availability: 'in_stock',
    deliveryLeadTime: 'In-Stock: Ships in 24 - 48 Hours',
    tagline: 'Armored Epoxy Surface · Impact & Collision Proof · High-Traffic Ready',
    description: 'Our most popular in-stock commercial screen. Features optical epoxy Glue-On-Board encapsulation protecting diodes from accidental knocks, moisture, and dust in retail stores, schools, and churches.',
    pixelPitches: ['P2.5', 'P3.0'],
    brightnessNits: 1400,
    refreshRateHz: 3840,
    contrastRatio: '6,500:1',
    cabinetSize: '640 × 480 mm / 500 × 500 mm',
    cabinetRatio: 'custom',
    ipRating: 'IP54 Front Protection',
    maintenance: 'Toolless Magnetic Front',
    powerAvgW: 100,
    powerMaxW: 300,
    weightPerCabinetKg: 5.8,
    viewingDistanceMinM: 2.5,
    highlights: [
      'In-stock locally in Addis Ababa for immediate dispatch with zero import delay',
      'GOB armored glue coating: 100% anti-collision, anti-knock & wipe-clean moisture resistance',
      'High refresh rate 3,840Hz for crystal-clear smartphone photo & video capture',
      'NovaStar receiving cards pre-installed, calibrated, and burned-in'
    ],
    image: '/src/assets/images/led_worship_sanctuary_real_1790853041095.jpg',
    accentBadge: 'IN-STOCK · FAST DISPATCH'
  },
  {
    id: 'apex-rental',
    seriesName: 'DEMAQ Apex-Rental & Staging Series',
    category: 'rental_staging',
    packagingTech: 'SMD Standard',
    availability: 'in_stock',
    deliveryLeadTime: 'In-Stock: Ready for Event Staging',
    tagline: 'Touring Quick-Lock Curve Rigging (-10° to +10°) · Magnesium Alloy',
    description: 'In-stock touring workhorse for concert productions, exhibitions, and corporate live events. Features rapid 1-person quick lock mechanisms and drop-tested corner bumpers.',
    pixelPitches: ['P2.6', 'P2.97', 'P3.91'],
    brightnessNits: 4500,
    refreshRateHz: 7680,
    contrastRatio: '6,000:1',
    cabinetSize: '500 × 500 mm / 500 × 1000 mm',
    cabinetRatio: '1:2',
    ipRating: 'IP65 All-Weather Touring',
    maintenance: 'Front & Rear',
    powerAvgW: 110,
    powerMaxW: 330,
    weightPerCabinetKg: 6.8,
    viewingDistanceMinM: 2.6,
    highlights: [
      'In-stock inventory with turnkey flight cases and rigging fly-bars',
      'High-precision rotary angle lock: -10°, -5°, 0°, +5°, +10° concave/convex',
      'Magnetic module auto-alignment with single-operator 8-second cabinet hang',
      'IP65 waterproof outdoor touring grade with integrated cable conduits'
    ],
    image: '/src/assets/images/led_concert_stage_real_1790853083477.jpg',
    accentBadge: 'IN-STOCK · RENTAL TOURING'
  },
  {
    id: 'horizon-dooh',
    seriesName: 'DEMAQ Horizon-DOOH Billboard & P4 Outdoor Series',
    category: 'outdoor_dooh',
    packagingTech: 'SMD Standard',
    availability: 'in_stock',
    deliveryLeadTime: 'In-Stock: Fast Module & Cabinet Assembly (24-48 Hours)',
    tagline: '960×960mm Standard Die-Cast Cabinet · P4.0 High Resolution · 8,500 Nits Direct Sunlight',
    description: 'Our benchmark outdoor commercial video wall platform. Built on standard 960×960mm waterproof die-cast cabinets with P4.0 (240×240 px per cabinet) for high-impact commercial billboards, stadium peripheries, and building facades.',
    pixelPitches: ['P4.0', 'P3.91', 'P4.81', 'P6.25', 'P8.0', 'P10.0'],
    brightnessNits: 8500,
    refreshRateHz: 3840,
    contrastRatio: '8,000:1',
    cabinetSize: '960 × 960 mm Die-Cast Waterproof Cabinet',
    cabinetRatio: '1:1',
    ipRating: 'IP66 Waterproof Front / IP65 Rear',
    maintenance: 'Front & Rear',
    powerAvgW: 115,
    powerMaxW: 340,
    weightPerCabinetKg: 19.5,
    viewingDistanceMinM: 4.0,
    highlights: [
      'Standard 960×960mm cabinet dimension with P4.0 (240×240 px resolution/cabinet)',
      'Immediate in-stock module & cabinet availability for 24-48h dispatch in Addis Ababa',
      '8,500 - 10,000 nits high brightness for 100% direct sunlight legibility',
      'Energy-saving common-cathode architecture decreases operating power draw by 35%'
    ],
    image: '/src/assets/images/led_outdoor_dooh_real_1790853056151.jpg',
    accentBadge: 'IN-STOCK · 960×960mm P4 CABINET'
  },
  {
    id: 'nova-pitch-cob',
    seriesName: 'DEMAQ Nova-Pitch Micro-LED & COB Series',
    category: 'fine_pitch_cob',
    packagingTech: 'COB (Flip-Chip Chip-On-Board)',
    availability: 'import_by_order',
    deliveryLeadTime: 'Import by Order: 14 - 21 Days Custom Build',
    tagline: 'Sub-P2.5 Flip-Chip COB Micro-LED · 10,000:1 True Black · Cold Screen',
    description: 'Custom imported to exact project specification. Gold wire-free Flip-Chip COB technology delivers pitch options below P2.5 for mission-critical command rooms and executive suites.',
    pixelPitches: ['P0.78', 'P0.93', 'P1.25', 'P1.56', 'P1.87'],
    brightnessNits: 1000,
    refreshRateHz: 7680,
    contrastRatio: '10,000:1',
    cabinetSize: '600 × 337.5 mm (Native 16:9)',
    cabinetRatio: '16:9',
    ipRating: 'IP54 Optical Seal',
    maintenance: 'Toolless Magnetic Front',
    powerAvgW: 80,
    powerMaxW: 240,
    weightPerCabinetKg: 4.2,
    viewingDistanceMinM: 0.8,
    highlights: [
      'Bespoke production & air-freight imported to your exact dimensional brief',
      'Flip-Chip COB: 10,000:1 contrast with pitch down to P0.78mm',
      'Seamless 16:9 cabinet ratio creates 2K, 4K, 8K, 16K displays with zero scaling distortion',
      'Surface dust/moisture vacuum encapsulation with anti-glare optical finish'
    ],
    image: '/src/assets/images/led_boardroom_real_1790853068703.jpg',
    accentBadge: 'IMPORT BY ORDER · COB'
  },
  {
    id: 'matrix-xr',
    seriesName: 'DEMAQ Cinema-XR Virtual Studio Volume',
    category: 'xr_cinema',
    packagingTech: 'COB (Flip-Chip Chip-On-Board)',
    availability: 'import_by_order',
    deliveryLeadTime: 'Import by Order: 18 - 25 Days Custom Build',
    tagline: '7,680Hz Refresh · 240fps Shutter Sync · 99.8% DCI-P3 Color Gamut',
    description: 'Custom imported broadcast & cinema grade LED volume panels for in-camera visual effects (ICVFX). Engineered with matte diffuser masks eliminating moiré patterns on RED/ARRI cine cameras.',
    pixelPitches: ['P1.56', 'P1.95', 'P2.3'],
    brightnessNits: 1800,
    refreshRateHz: 7680,
    contrastRatio: '9,000:1',
    cabinetSize: '500 × 500 mm',
    cabinetRatio: '1:1',
    ipRating: 'IP40 Studio Grade',
    maintenance: 'Toolless Magnetic Front',
    powerAvgW: 95,
    powerMaxW: 280,
    weightPerCabinetKg: 5.9,
    viewingDistanceMinM: 1.5,
    highlights: [
      'Bespoke virtual volume design with ceiling and curved wall configurations',
      '240Hz frame rate synchronization with Genlock & Phase Offset support',
      'Brompton Tessera SX40 & NovaStar COEX native integration',
      '16-bit true grayscale at ultra-low brightness for cinematic HDR10+ gradients'
    ],
    image: '/src/assets/images/led_virtual_xr_real_1790853110437.jpg',
    accentBadge: 'IMPORT BY ORDER · XR'
  },
  {
    id: 'flex-form',
    seriesName: 'DEMAQ Flex-Form Creative 3D Series',
    category: 'flexible_creative',
    packagingTech: 'Flexible Silicone',
    availability: 'import_by_order',
    deliveryLeadTime: 'Import by Order: Custom Fabricated to Radius',
    tagline: '120° Bendable Rubber Magnetic Modules for Pillars, Waves & Spheres',
    description: 'Flexible silicone magnetic modules tailored to architectural curves. Seamlessly wrap round building columns, wave ceilings, and concave experiential tunnels.',
    pixelPitches: ['P1.87', 'P2.0', 'P2.5', 'P3.0'],
    brightnessNits: 1200,
    refreshRateHz: 3840,
    contrastRatio: '5,000:1',
    cabinetSize: 'Custom Magnetic Steel Skeleton (320 × 160 mm modules)',
    cabinetRatio: 'custom',
    ipRating: 'IP30 Indoor Architectural',
    maintenance: 'Front Only',
    powerAvgW: 90,
    powerMaxW: 260,
    weightPerCabinetKg: 2.8,
    viewingDistanceMinM: 1.8,
    highlights: [
      'Precision fabricated to match your architectural curvature drawings',
      'Up to 120° convex and concave radius without module cracking',
      'High-density neodymium magnets allow instant snap-on service',
      'Popular for luxury retail flagship stores, museums, and automotive atriums'
    ],
    image: '/src/assets/images/led_retail_flexible_real_1790853123520.jpg',
    accentBadge: 'IMPORT BY ORDER · FLEXIBLE'
  }
];

export const ledSolutions: LEDSolution[] = [
  {
    id: 'commercial-retail',
    title: 'Commercial Retail & Houses of Worship',
    subtitle: 'Rugged P2.5+ GOB Displays with Immediate Local Availability',
    description: 'Retail stores, shopping malls, and houses of worship need bright, high-impact visuals that can handle crowds. DEMAQ Shield-GOB provides epoxy glue impact resistance in stock for immediate local delivery.',
    recommendedPitch: 'P2.5 - P3.0 GOB (In-Stock)',
    availabilityNote: 'In-Stock: Dispatches within 24-48 Hours',
    features: ['Armored GOB surface resists knocks & bumps', 'Easy front magnetic module servicing', 'Wipe-clean dust & water resistance', 'High refresh rate eliminates phone photo flicker'],
    applications: ['Luxury Retail Stores', 'Houses of Worship / Churches', 'Shopping Mall Atriums', 'School Auditoriums'],
    image: '/src/assets/images/led_worship_sanctuary_real_1790853041095.jpg'
  },
  {
    id: 'control-rooms',
    title: 'Command & Control Operations',
    subtitle: 'Bespoke Sub-P2.5 Flip-Chip COB for 24/7 Monitoring',
    description: 'Mission-critical command centers demand sub-millimeter pixel pitch, zero-fatigue viewing, and dual power/signal loop redundancy. Custom imported to exact architectural dimensions.',
    recommendedPitch: 'P0.78 - P1.56 COB (Custom Import)',
    availabilityNote: 'Import by Order: 14-21 Days Turnaround',
    features: ['10,000:1 contrast ratio with true inky blacks', 'Dual redundant power and data loops', 'Common-cathode cold screen runs 12°C cooler', '100,000-hour MTBF commercial reliability'],
    applications: ['Traffic Management Centers', 'Security Operations Centers (SOC)', 'Utility & Energy Grid Dispatch', 'Financial Trading Floors'],
    image: '/src/assets/images/led_control_room_real_1790853095603.jpg'
  },
  {
    id: 'outdoor-dooh',
    title: 'DOOH Mega Billboards & 3D Screens',
    subtitle: 'High-Brightness P3.9 to P10 Outdoor Screens in Stock',
    description: 'Outdoor commercial screens require daylight-conquering brightness and energy efficiency. Available with rapid module assembly from in-stock inventory for billboards and urban facades.',
    recommendedPitch: 'P3.91 - P8.0 Outdoor (In-Stock Modules)',
    availabilityNote: 'In-Stock: Assembled & Tested in 3-5 Days',
    features: ['Up to 10,000 nits high brightness', 'Common-cathode energy saving architecture', 'IP66 storm & sea-salt corrosion resistance', '90° curved corner modules for 3D naked-eye effects'],
    applications: ['City Center Advertising Billboards', 'Highway DOOH Digital Networks', 'Airport & Transit Terminals', 'Stadium Exterior Displays'],
    image: '/src/assets/images/led_outdoor_dooh_real_1790853056151.jpg'
  },
  {
    id: 'xr-studios',
    title: 'XR & Virtual Production Volumes',
    subtitle: 'Broadcast ICVFX Volumes Built to Studio Specification',
    description: 'Hollywood-tier virtual production stages with curved LED volumes and LED ceilings. Synchronized with camera tracking for real-time parallax backgrounds in Unreal Engine.',
    recommendedPitch: 'P1.56 - P2.3 Matrix XR (Custom Import)',
    availabilityNote: 'Import by Order: Complete Turnkey Engineering',
    features: ['7,680Hz ultra-high refresh rate', 'Brompton Tessera SX40 & NovaStar COEX sync', 'True 1/8000s camera shutter compatibility', 'Anti-moiré matte diffuser surface'],
    applications: ['Feature Film Stages', 'Television News Studios', 'Commercial Car Ad Shoots', 'Music Video Production'],
    image: '/src/assets/images/led_virtual_xr_real_1790853110437.jpg'
  }
];

export const ledCaseStudies: LEDCaseStudy[] = [
  {
    id: 'commercial-flagship-gob',
    client: 'Metropolis Retail & Event Atrium',
    projectName: 'P2.5 GOB High-Traffic Impact-Resistant Video Wall',
    location: 'Central Plaza Mall, Addis Ababa',
    category: 'Commercial Retail · In-Stock',
    pitch: 'P2.5 Shield-GOB',
    packaging: 'GOB (Glue-On-Board)',
    screenDimensions: '9.6m (W) × 3.6m (H)',
    totalArea: '34.56 m²',
    resolution: '3,840 × 1,440 px',
    image: '/src/assets/images/led_retail_flexible_real_1790853123520.jpg',
    challenge: 'The shopping center needed an eye-level video wall installed in a high-traffic pedestrian walkway where children and visitors frequently brush against the screen.',
    solution: 'Deployed DEMAQ Shield-GOB P2.5 from local in-stock inventory. The epoxy glue encapsulation provides complete impact resistance with zero dead diodes from contact.',
    engineeringStandard: 'ASTM D3363 · IEC 60529 (IP54) · ECAE CES 107:2020',
    scientificFormulas: [
      {
        name: 'Epoxy Compressive Stress & Mechanical Dissipation Law',
        latex: '\\sigma_c = \\frac{F_{kinetic}}{A_{contact}} \\le \\sigma_{allowable} = 65\\text{ MPa}',
        explanation: 'Mechanical impact energy from passing shopping carts is converted into minor elastic strain across the monolithic polyurethane matrix.'
      },
      {
        name: 'Visual Resolution Distance for Retail Browsers',
        latex: 'D_{acuity} = \\frac{2.5\\text{ mm}}{2 \\times \\tan(0.5\' / 60)} = 8.59\\text{ meters (Retinal Blend)}',
        explanation: 'At typical shopping mall atrium walking distances (> 2.5m), pixel pitch delivers high perceptual clarity.'
      }
    ],
    directLinks: [
      {
        title: 'NovaStar COEX Professional Display Control Architecture',
        url: 'https://www.novastar.tech/products/controller/',
        publisher: 'NovaStar Technology Inc.',
        category: 'controller',
        standardCode: 'NovaStar MX40-Pro / COEX V1.6',
        verifiedDate: '2025/2026'
      },
      {
        title: 'Ethiopian Conformity Assessment Enterprise (ECAE) Electrical Testing Standards',
        url: 'https://www.ecae.gov.et/',
        publisher: 'Ethiopian Conformity Assessment Enterprise',
        category: 'standards',
        standardCode: 'CES 107:2020 (LV Switchgear & Safety)',
        verifiedDate: 'ECAE Standard'
      }
    ],
    metrics: [
      { label: 'Deployment Time', value: '48 Hours' },
      { label: 'Surface Impact Resistance', value: '5H Armored' },
      { label: 'Zero Pixel Defects', value: '100% Intact' }
    ],
    technologies: ['DEMAQ Shield-GOB P2.5', 'NovaStar VX1000', 'Epoxy Glue Seal', 'Magnetic Front Service']
  },
  {
    id: 'london-xr-studio',
    client: 'Apex Visual Cinema Studios',
    projectName: '8K Curved Virtual Production Volume',
    location: 'Cinema Stage Complex',
    category: 'XR Virtual Production · Custom Import',
    pitch: 'P1.95 Matrix-XR',
    packaging: 'Cinema Matte COB Diffuser',
    screenDimensions: '24m (W) × 6.5m (H) curved wall + 12m × 8m ceiling',
    totalArea: '252 m²',
    resolution: '12,308 × 3,333 px',
    image: '/src/assets/images/led_virtual_xr_real_1790853110437.jpg',
    challenge: 'The film studio required an ultra-wide cinema LED volume imported and calibrated for high-speed ARRI cine cameras with zero moiré effects or scanlines.',
    solution: 'Engineered and imported a bespoke Matrix-XR cylindrical wall powered by Brompton Tessera SX40 4K processors and sub-pixel camera tracking.',
    engineeringStandard: 'SMPTE ST 2084 (PQ/HDR10) · IEEE Std 1789-2015 · DCI-P3 Color Gamut',
    scientificFormulas: [
      {
        name: 'Camera Shutter Genlock & Moiré Interference Prevention',
        latex: 'f_{refresh} \\ge 32 \\times f_{shutter} = 32 \\times 240\\text{ Hz} = 7,680\\text{ Hz}',
        explanation: 'Guarantees sensor exposure captures integer multiples of the LED PWM waveform, preventing rolling shutter artifacts.'
      },
      {
        name: 'CIE 1931 Color Coordinates Gamut Coverage',
        latex: 'S_{triangle} = \\frac{1}{2} |(x_r(y_g - y_b) + x_g(y_b - y_r) + x_b(y_r - y_g))| \\ge 99.8\\% \\text{ DCI-P3}',
        explanation: 'Calibrated color gamut ensures cinematographic color science fidelity directly into in-camera visual effects.'
      }
    ],
    directLinks: [
      {
        title: 'SMPTE ST 2067 / ST 2084 High Dynamic Range Display Standards',
        url: 'https://www.smpte.org/',
        publisher: 'Society of Motion Picture and Television Engineers',
        category: 'standards',
        standardCode: 'SMPTE ST 2084 (PQ/HDR10)',
        verifiedDate: 'SMPTE Library'
      },
      {
        title: 'CIE 1931 Colorimetry Standards & Photopic Spectral Luminous Efficiency',
        url: 'https://cie.co.at/publications/colorimetry-4th-edition',
        publisher: 'Commission Internationale de l\'Éclairage (CIE)',
        category: 'standards',
        standardCode: 'CIE 015:2018 / ISO 11664-1',
        verifiedDate: 'ISO/CIE'
      }
    ],
    metrics: [
      { label: 'Refresh Rate', value: '7,680 Hz' },
      { label: 'Color Gamut', value: '99.8% DCI-P3' },
      { label: 'Post-Prod Savings', value: '62%' }
    ],
    technologies: ['Matrix XR P1.95', 'Brompton Tessera SX40', 'Unreal Engine 5.5', 'Disguise vx4']
  },
  {
    id: 'downtown-dooh-3d',
    client: 'Skyline Media Partners',
    projectName: 'Naked-Eye 3D Curved Architectural Corner Screen',
    location: 'Bole Road Commercial Corridor, Addis Ababa',
    category: 'DOOH & 3D Billboards · In-Stock Modules',
    pitch: 'P4.81 Horizon Outdoor',
    packaging: 'SMD Outdoor IP66',
    screenDimensions: '28m (W) × 12m (H) 90° Seamless Curve',
    totalArea: '336 m²',
    resolution: '5,820 × 2,494 px',
    image: '/src/assets/images/led_outdoor_dooh_real_1790853056151.jpg',
    challenge: 'Project required rapid delivery and installation of a massive 90-degree corner display facing intense direct sunlight with low power consumption.',
    solution: 'Built using in-stock DEMAQ Horizon P4.81 modules with customized 90-degree corner joints and cold-cathode energy-saving architecture.',
    engineeringStandard: 'EMA Directive No. 892/2024 · EBCS-1:2015 Structural Code · IEC 60529 (IP66)',
    scientificFormulas: [
      {
        name: 'Peak Wind Dynamic Pressure on Bole Road Facade',
        latex: 'q_p(z) = \\frac{1}{2} \\rho v^2 c_e(z) = \\frac{1}{2} (0.95\\text{ kg/m}^3) (33.3\\text{ m/s})^2 \\times 1.85 \\approx 975\\text{ N/m}^2',
        explanation: 'Structural engineering ensures steel sub-frame safely handles 120 km/h gusts at 24m elevation above Bole Road.'
      },
      {
        name: 'Solar Luminance Contrast Threshold for Direct Sunlight',
        latex: 'CR_{daylight} = \\frac{L_{sign} + L_{ambient} \\times R_{diffuse}}{L_{ambient} \\times R_{diffuse}} = \\frac{8500 + 400}{400} = 22.25:1',
        explanation: 'Yields crisp daylight readability under high-noon equatorial UV irradiance in Addis Ababa.'
      }
    ],
    directLinks: [
      {
        title: 'Ethiopian Media Authority Commercial Outdoor Display Signage Directives',
        url: 'https://ema.gov.et/',
        publisher: 'Ethiopian Media Authority (EMA)',
        category: 'standards',
        standardCode: 'EMA Directive No. 892/2024',
        verifiedDate: 'Addis Ababa Municipal Registry'
      },
      {
        title: 'MeanWell Industrial Switching Power Supplies & Surge Protection (UHP Series)',
        url: 'https://www.meanwell.com/productSeries.aspx',
        publisher: 'MEAN WELL Enterprises Co., Ltd.',
        category: 'hardware',
        standardCode: 'EN 62368-1 / UL62368-1 PFC>0.95',
        verifiedDate: 'MeanWell Tech Manual'
      }
    ],
    metrics: [
      { label: 'Peak Brightness', value: '8,500 nits' },
      { label: 'Energy Savings', value: '42%' },
      { label: 'Ingress Protection', value: 'IP66 Rated' }
    ],
    technologies: ['Horizon P4.81 DOOH', 'Cold-Cathode Driver', 'NovaPro UHD', '90° Curved Joint Modules']
  }
];

export const sampleLEDInquiries: LEDInquiry[] = [
  {
    id: 'rfq-2026-001',
    clientName: 'Alexander Vance',
    company: 'Apex Media Group',
    email: 'a.vance@apexmedia.com',
    phone: '+251 911 234 567',
    application: 'Commercial Retail / Atrium',
    seriesInterest: 'DEMAQ Shield-GOB Commercial Series',
    pixelPitch: 'P2.5',
    availabilityRequirement: 'In-Stock Immediate (P2.5+)',
    dimensionsWidthM: 7.68,
    dimensionsHeightM: 2.88,
    installationType: 'Wall Mounted',
    projectLocation: 'Bole, Addis Ababa',
    budgetRange: 'Official Proforma Requested',
    details: 'Need in-stock P2.5 GOB panels for immediate delivery to retail flagship store. Anti-collision is required.',
    timestamp: 'Today at 3:15 PM',
    status: 'engineering_review'
  },
  {
    id: 'rfq-2026-002',
    clientName: 'Dr. Karolina Lind',
    company: 'Nordic Operations Grid',
    email: 'k.lind@nordicgrid.se',
    phone: '+46 8 123 4567',
    application: 'Mission-Critical Control Room',
    seriesInterest: 'DEMAQ Nova-Pitch Micro-LED & COB Series',
    pixelPitch: 'P0.93',
    availabilityRequirement: 'Custom Import by Order (<P2.5 / COB)',
    dimensionsWidthM: 9.6,
    dimensionsHeightM: 2.7,
    installationType: 'Wall Mounted',
    projectLocation: 'Stockholm, Sweden',
    budgetRange: 'Official Proforma Requested',
    details: 'Custom order for sub-P2.5 COB Micro-LED wall. Requires 16:9 native cabinets and dual loop redundancy.',
    timestamp: 'Yesterday at 11:20 AM',
    status: 'quotation_sent'
  },
  {
    id: 'rfq-2026-003',
    clientName: 'Tewodros Bekele',
    company: 'Addis Grand Events',
    email: 'tewodros@addisevents.et',
    phone: '+251 912 345 678',
    application: 'Concert Stage & Rental',
    seriesInterest: 'DEMAQ Apex-Rental & Staging Series',
    pixelPitch: 'P2.6',
    availabilityRequirement: 'In-Stock Immediate (P2.5+)',
    dimensionsWidthM: 14,
    dimensionsHeightM: 5,
    installationType: 'Hanging Rig / Truss',
    projectLocation: 'Millennium Hall, Addis Ababa',
    budgetRange: 'Official Proforma Requested',
    details: 'In-stock rental panels with -10 to +10 curve locks and flight cases needed for summer expo.',
    timestamp: '2 days ago',
    status: 'new'
  }
];

export const sampleMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'maint-2026-101',
    clientName: 'Yared Tesfaye',
    company: 'Century Mall Atrium',
    phone: '+251 911 889 900',
    email: 'yared@centurymall.et',
    screenLocation: 'Main Atrium 2nd Floor, Addis Ababa',
    pixelPitch: 'P3.0 GOB',
    controllerBrand: 'NovaStar',
    issueType: 'Dead Pixels / Dark Modules',
    description: '3 modules on the bottom right corner went black after a power interruption. NovaLCT shows receiving card #4 offline.',
    urgency: 'Urgent (Same Day)',
    timestamp: 'Today at 10:30 AM',
    status: 'technician_assigned'
  },
  {
    id: 'maint-2026-102',
    clientName: 'Mekdes Haile',
    company: 'Bole Commercial Billboard',
    phone: '+251 922 445 566',
    email: 'm.haile@boleadv.com',
    screenLocation: 'Bole Medhanialem Intersection',
    pixelPitch: 'P6.0 Outdoor',
    controllerBrand: 'Huidu',
    issueType: 'Sending Card / Signal Loss',
    description: '4G cloud connection dropped, screen displaying default test pattern. HDPlayer unable to publish new ad schedule.',
    urgency: 'Emergency (Within 4h)',
    timestamp: 'Yesterday at 4:15 PM',
    status: 'in_progress'
  }
];

export const initialAlertSettings: AdminAlertSettings = {
  enableSms: true,
  enableEmail: true,
  enableWhatsapp: true,
  adminPhone: '+251 942 992 799',
  adminEmail: 'alerts@demaqdigital.com',
  adminWhatsapp: '+251942992799',
  webhookUrl: 'https://api.demaqdigital.com/webhooks/proforma-alerts',
  soundAlert: true,
  smsGateway: 'Ethio Telecom SMS',
  autoReplyWhatsapp: true
};

export const sampleAlertNotifications: AlertNotification[] = [
  {
    id: 'alert-001',
    timestamp: 'Just now',
    title: 'New RFQ & Proforma Request',
    channel: 'WhatsApp',
    recipient: '+251 942 992 799',
    status: 'delivered',
    inquiryType: 'RFQ / Proforma',
    clientName: 'Alemayehu Tadesse (Zemen Bank)',
    clientPhone: '+251 911 234 567',
    summary: '8.4m × 2.7m P0.93 Nova-Pitch COB (Control Room)',
    payloadText: '🚨 [DEMAQ PROFORMA ALERT] New Quote Request!\nClient: Alemayehu Tadesse (Zemen Bank)\nPhone: +251 911 234 567\nSpec: 8.4m x 2.7m P0.93 COB (22.68 m²)\nLocation: Kazanchis, Addis Ababa'
  },
  {
    id: 'alert-002',
    timestamp: '10 mins ago',
    title: 'New RFQ & Proforma Request',
    channel: 'SMS',
    recipient: '+251 942 992 799',
    status: 'delivered',
    inquiryType: 'RFQ / Proforma',
    clientName: 'Bethelhem Girma (Unity Church)',
    clientPhone: '+251 930 112 233',
    summary: '6.4m × 3.6m P2.5 Shield-GOB Armored (In-Stock)',
    payloadText: '[DEMAQ-SMS] New Proforma Inquiry from Bethelhem Girma (+251930112233). Spec: 6.4x3.6m P2.5 GOB (In-stock Addis warehouse). Total 23.04m2.'
  },
  {
    id: 'alert-003',
    timestamp: '2 hours ago',
    title: 'Maintenance Emergency Alert',
    channel: 'Email',
    recipient: 'alerts@demaqdigital.com',
    status: 'delivered',
    inquiryType: 'Maintenance Urgent Ticket',
    clientName: 'Mekdes Haile (Bole Commercial)',
    clientPhone: '+251 922 445 566',
    summary: 'Emergency 4h - Signal loss on Bole Medhanialem screen',
    payloadText: 'Subject: URGENT: LED Screen Maintenance Ticket #maint-2026-102\nClient: Mekdes Haile (+251 922 445 566)\nIssue: Sending Card / Signal Loss (Huidu)'
  }
];
