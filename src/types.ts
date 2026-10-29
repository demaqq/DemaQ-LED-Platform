export type LEDCategory =
  | 'in_stock_commercial'
  | 'fine_pitch_cob'
  | 'outdoor_dooh'
  | 'rental_staging'
  | 'xr_cinema'
  | 'flexible_creative';

export type AvailabilityStatus = 'in_stock' | 'import_by_order';

export interface LEDProduct {
  id: string;
  seriesName: string;
  category: LEDCategory;
  packagingTech: 'GOB (Glue-On-Board)' | 'COB (Flip-Chip Chip-On-Board)' | 'SMD Standard' | 'Flexible Silicone';
  availability: AvailabilityStatus;
  deliveryLeadTime: string;
  tagline: string;
  description: string;
  pixelPitches: string[];
  brightnessNits: number;
  refreshRateHz: number;
  contrastRatio: string;
  cabinetSize: string;
  cabinetRatio: '16:9' | '1:1' | '1:2' | 'custom';
  ipRating: string;
  maintenance: 'Front Only' | 'Front & Rear' | 'Toolless Magnetic Front';
  powerAvgW: number;
  powerMaxW: number;
  weightPerCabinetKg: number;
  viewingDistanceMinM: number;
  highlights: string[];
  image: string;
  accentBadge?: string;
}

export interface LEDSolution {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  recommendedPitch: string;
  availabilityNote: string;
  features: string[];
  applications: string[];
  image: string;
}

export interface DirectCitationLink {
  title: string;
  url: string;
  organization?: string;
  publisher?: string;
  category?: string;
  standardCode?: string;
  verifiedDate?: string;
  verifiedStatus?: 'official_standard' | 'manufacturer_spec' | 'regulatory_agency' | 'empirical_telemetry';
}

export interface ScientificFormula {
  label?: string;
  name?: string;
  formula?: string;
  latex?: string;
  parameters?: string;
  explanation?: string;
  resultInterpretation?: string;
}

export interface EmpiricalMetric {
  metric?: string;
  parameter?: string;
  measuredValue: string;
  baselineValue?: string;
  standardRef?: string;
}

export interface LEDCaseStudy {
  id: string;
  client: string;
  projectName: string;
  location: string;
  category: string;
  pitch: string;
  packaging: string;
  screenDimensions: string;
  totalArea: string;
  resolution: string;
  image: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string }[];
  technologies: string[];
  automated?: boolean;
  engineeringStandard?: string;
  scientificFormulas?: ScientificFormula[];
  directLinks?: DirectCitationLink[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  venue: string;
  location: string;
  screenSize: string;
  pitch: string;
  category: string;
  image: string;
  metric: string;
}

export type BlogCategory =
  | 'Technical'
  | 'Industry News'
  | 'Projects'
  | 'Technology & Hardware'
  | 'Buyer Guide'
  | 'Processors & Systems'
  | string;

export interface BlogPost {
  id: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  readTime: string;
  date: string;
  image: string;
  tags: string[];
  automated?: boolean;
  author?: string;
  published?: boolean;
  realtimeDataPoints?: string[];
  sources?: string[];
  grounded?: boolean;
  directLinks?: DirectCitationLink[];
  scientificFormulas?: ScientificFormula[];
  empiricalMetrics?: EmpiricalMetric[];
}

export interface MaintenanceRequest {
  id: string;
  clientName: string;
  company: string;
  phone: string;
  email: string;
  screenLocation: string;
  pixelPitch: string;
  controllerBrand: 'NovaStar' | 'Huidu' | 'Colorlight' | 'Linsn' | 'Brompton' | 'Other / Not Sure';
  issueType: 'Dead Pixels / Dark Modules' | 'Sending Card / Signal Loss' | 'Power Supply Failure' | 'Flickering / Scan Lines' | 'Configuration / Software Setup' | 'Physical Damage';
  description: string;
  urgency: 'Emergency (Within 4h)' | 'Urgent (Same Day)' | 'Standard (24-48h)';
  imageAttachment?: string;
  timestamp: string;
  status: 'pending_quote' | 'technician_assigned' | 'in_progress' | 'resolved';
}

export interface LEDInquiry {
  id: string;
  clientName: string;
  company: string;
  email: string;
  phone: string;
  application: string;
  seriesInterest: string;
  pixelPitch: string;
  availabilityRequirement: 'In-Stock Immediate (P2.5+)' | 'Custom Import by Order (<P2.5 / COB)';
  dimensionsWidthM: number;
  dimensionsHeightM: number;
  installationType: 'Wall Mounted' | 'Hanging Rig / Truss' | 'Ground Stack' | 'Curved / Architectural' | 'Pole Mount';
  projectLocation: string;
  budgetRange: string;
  details: string;
  timestamp: string;
  status: 'new' | 'engineering_review' | 'quotation_sent' | 'won' | 'closed';
}

export interface LEDWallCalcResult {
  widthM: number;
  heightM: number;
  cabinetsWide: number;
  cabinetsHigh: number;
  totalCabinets: number;
  resolutionW: number;
  resolutionH: number;
  totalPixels: number;
  actualWidthM: number;
  actualHeightM: number;
  actualAreaM2: number;
  aspectRatio: string;
  isStandard16_9: boolean;
  totalWeightKg: number;
  powerMaxKW: number;
  powerAvgKW: number;
  minViewingDistM: number;
  optViewingDistM: number;
  availability: AvailabilityStatus;
  leadTime: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroDescription: string;
  contactEmail: string;
  phone: string;
  location: string;
  city: string;
  country: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  telegramUrl: string;
  whatsappUrl: string;
  certifications: string;
  warrantyPeriod: string;
}

export interface AdminAlertSettings {
  enableSms: boolean;
  enableEmail: boolean;
  enableWhatsapp: boolean;
  adminPhone: string;
  adminEmail: string;
  adminWhatsapp: string;
  webhookUrl: string;
  soundAlert: boolean;
  smsGateway: 'Ethio Telecom SMS' | 'Twilio SMS' | 'DemaQ Direct Gateway';
  autoReplyWhatsapp: boolean;
}

export interface AlertNotification {
  id: string;
  timestamp: string;
  title: string;
  channel: 'SMS' | 'Email' | 'WhatsApp';
  recipient: string;
  status: 'dispatched' | 'delivered' | 'failed';
  inquiryType: 'RFQ / Proforma' | 'Wall Calculator Quote' | 'Maintenance Urgent Ticket';
  clientName: string;
  clientPhone: string;
  summary: string;
  payloadText: string;
}

export interface ProformaItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPriceETB: number;
  totalETB: number;
}

export interface ProformaQuote {
  proformaNumber: string;
  date: string;
  validUntil: string;
  clientName: string;
  company: string;
  phone: string;
  email: string;
  location: string;
  items: ProformaItem[];
  subtotalETB: number;
  vatRate: number; // e.g. 0.15 for 15% VAT
  vatAmountETB: number;
  grandTotalETB: number;
  leadTime: string;
  paymentTerms: string;
  warranty: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    telebirrMerchant?: string;
  };
}

export interface ClientProfile {
  fullName: string;
  company: string;
  phone: string;
  email: string;
  industry: string;
  installationAddress: string;
  mountingType: string;
  preferredContact: 'WhatsApp' | 'Phone Call' | 'Email';
  tinNumber?: string;
  updatedAt?: string;
}
