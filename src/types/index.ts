export enum ResourceType {
  // Compute / Workloads (vCore-based)
  COMPUTE_ENGINE = 'Compute Engine',
  GKE_STANDARD = 'GKE Standard',
  GKE_AUTOPILOT = 'GKE Autopilot',
  APP_ENGINE_FLEX = 'App Engine Flex',
  CLOUD_SQL = 'Cloud SQL',
  DATAFLOW = 'Dataflow',
  DATAPROC = 'Dataproc',
  
  // Instance-based
  APP_ENGINE_STANDARD = 'App Engine Standard',

  // Storage Operations
  CLOUD_STORAGE_CLASS_A = 'Cloud Storage (Class A Ops)',
  CLOUD_STORAGE_CLASS_B = 'Cloud Storage (Class B Ops)',

  // BigQuery
  BIGQUERY_ON_DEMAND = 'BigQuery (On-Demand Analysis)',
  BIGQUERY_CAPACITY = 'BigQuery (Capacity/Slots)',

  // Artifacts
  ARTIFACT_REGISTRY = 'Artifact Registry (Scanning)',

  // GenAI Security
  MODEL_ARMOR = 'Model Armor (GenAI Security)'
}

export interface ResourceInput {
  id: string;
  type: ResourceType;
  label: string; // User defined label (e.g., 'Prod', 'Dev', 'Cluster-1')
  
  // Compute Inputs
  vCpus?: number;
  hoursPerMonth?: number;
  
  // Instance Inputs (App Engine Standard)
  instances?: number;

  // Storage Inputs
  monthlyOperations?: number; // Raw count

  // Data Inputs
  dataProcessedGB?: number;

  // Slot Inputs
  slots?: number;

  // Artifact Inputs
  imagesScanned?: number;

  // Model Armor Inputs
  modelArmorOps?: number; // 1k units
}

export interface CostBreakdown {
  standard: number; // Always 0
  premiumPayGo: number; // Project Level usage
  premiumSubscription: number; // Org Level (Estimated discount)
  enterprise: string; // "Contact Sales"
  modelArmorCost: number; // Separated cost
}

export interface CostResult {
  totalMonthly: CostBreakdown;
  details: {
    resourceId: string;
    cost: number;
  }[];
  isEnterpriseRecommended: boolean;
}

export interface BaseRates {
  // Core Infrastructure ($/vCore-hr or $/Instance-hr)
  PREMIUM_VCORE_HOUR: number; 
  
  // Storage ($/1,000 ops)
  GCS_CLASS_A_1K_OPS: number;
  GCS_CLASS_B_1K_OPS: number;

  // BigQuery
  BQ_ON_DEMAND_GB: number; // $/GB
  BQ_SLOT_HOUR: number; // $/Slot-hr

  // Artifacts
  ARTIFACT_IMAGE_SCAN: number; // $/Image

  // Model Armor ($/1,000 Text Records/Ops)
  MODEL_ARMOR_1K_OPS: number;
}

export interface PricingRates {
  project: BaseRates;
  org: BaseRates;
  lastUpdated: string;
  source: 'DEFAULT' | 'GCP_API' | 'WEB_SCRAPER' | 'WEB_SCRAPER_SELENIUM';
}

export const DEFAULT_PRICING_RATES: PricingRates = {
  project: {
    PREMIUM_VCORE_HOUR: 0.0071,
    GCS_CLASS_A_1K_OPS: 0.002,
    GCS_CLASS_B_1K_OPS: 0.0002,
    BQ_ON_DEMAND_GB: 0.00098,
    BQ_SLOT_HOUR: 0.00548,
    ARTIFACT_IMAGE_SCAN: 0.20,
    MODEL_ARMOR_1K_OPS: 0.0001,
  },
  org: {
    PREMIUM_VCORE_HOUR: 0.0057,
    GCS_CLASS_A_1K_OPS: 0.0016, 
    GCS_CLASS_B_1K_OPS: 0.00016,
    BQ_ON_DEMAND_GB: 0.0008, 
    BQ_SLOT_HOUR: 0.004384,
    ARTIFACT_IMAGE_SCAN: 0.20,
    MODEL_ARMOR_1K_OPS: 0.0001,
  },
  lastUpdated: 'January 20, 2026',
  source: 'DEFAULT'
};