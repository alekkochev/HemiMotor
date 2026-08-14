export type Language = 'mk' | 'en' | 'sq';

export type MotoCategory = 'all' | 'scooters' | 'motorcycles' | 'atv-quad' | 'electric' | 'shop';

export type MotoSubCategory =
  | 'all-sub'
  | 'scooter-50-2t'
  | 'scooter-50-4t'
  | 'scooter-125'
  | 'scooter-150'
  | 'scooter-200'
  | 'scooter-300'
  | 'cross-enduro'
  | 'street-naked'
  | 'cruiser-chopper'
  | 'adventure-rally'
  | 'atv-junior'
  | 'atv-utility'
  | 'electric-cp'
  | 'helmets'
  | 'apparel'
  | 'parts'
  | 'oils'
  | 'tires'
  | 'accessories';

export interface Motorcycle {
  id: string;
  name: string;
  brand: 'HAMACHI' | 'HMC' | 'ZONTES' | 'SYM' | 'KOVE' | 'QJMOTOR' | 'ITALJET';
  subtitle: string;
  category: MotoCategory;
  subCategory: MotoSubCategory;
  ccNumber: number;
  displacement: string;
  priceMkd: number;
  priceMkdFormatted: string;
  priceEur: number;
  priceEurFormatted: string;
  oldPriceMkd?: number;
  monthlyInstallmentMkd: number;
  engine: string;
  engineType: '2-тактен' | '4-тактен' | 'V-Twin' | '3-Цилиндри' | 'Електричен';
  cooling: string;
  power: string;
  torque: string;
  topSpeed: string;
  acceleration0100: string;
  weight: string;
  fuelCapacity: string;
  brakes: string;
  tires: string;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  inStock: boolean;
  stockSalons: string[];
  warrantyYears: number;
  badge?: string;
  telemetry: {
    maxRpm: number;
    compressionRatio: string;
    brakes: string;
    suspension: string;
    electronics: string;
    dynoPeakHp: number;
  };
  b2bEligible: boolean;
  /** Реални податоци од Supabase / hamachi */
  handle?: string;
  descriptionHtml?: string;
  specs?: Record<string, string>;
  available?: boolean;
}

export interface ShopProduct {
  id: string;
  name: string;
  brand: string;
  category: 'helmets' | 'apparel' | 'parts' | 'oils' | 'tires' | 'accessories';
  categoryLabel: string;
  priceMkd: number;
  priceMkdFormatted: string;
  priceEur: number;
  priceEurFormatted: string;
  oldPriceMkd?: number;
  image: string;
  inStock: boolean;
  stockCount: number;
  compatibility: string;
  description: string;
  specifications: Record<string, string>;
  rating: number;
  reviewsCount: number;
}

export interface ServicePackage {
  id: string;
  name: string;
  category: 'maintenance' | 'dyno-tuning' | 'chassis-laser' | 'ecu-telemetry' | 'overhaul';
  priceEstimateMkd: string;
  priceEstimateEur: string;
  duration: string;
  isoStandard: string;
  description: string;
  benefits: string[];
  equipmentUsed: string;
  recommendedInterval: string;
  warrantyMonths: number;
}

export interface OemPart {
  id: string;
  partNumber: string;
  name: string;
  category: 'engine' | 'braking' | 'exhaust' | 'electronics' | 'suspension' | 'transmission';
  manufacturer: string;
  priceMkd: number;
  priceMkdFormatted: string;
  priceEur: number;
  priceEurFormatted: string;
  compatibility: string[];
  inStock: boolean;
  stockCount: number;
  warranty: string;
  technicalSpecs: Record<string, string>;
  image: string;
}

export interface FleetTier {
  id: string;
  name: string;
  subtitle: string;
  targetAudience: string;
  baseMonthlyRatePerUnit: string;
  recommendedFleetSize: string;
  slaResponseTime: string;
  features: string[];
  includedMaintenance: string;
  telemetryIntegration: boolean;
}

export interface CaseStudy {
  id: string;
  client: string;
  logoText: string;
  industry: string;
  projectScope: string;
  unitsDeployed: number;
  uptimeAchieved: string;
  maintenanceCostSaved: string;
  quote: string;
  author: string;
  authorRole: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  organization: string;
  comment: string;
  rating: number;
  projectType: string;
}

