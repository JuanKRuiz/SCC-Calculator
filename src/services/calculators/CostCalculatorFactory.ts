import { ICostCalculator } from './ICostCalculator';
import { ComputeCostCalculator } from './ComputeCostCalculator';
import { InstanceCostCalculator } from './InstanceCostCalculator';
import { StorageCostCalculator } from './StorageCostCalculator';
import { BigQueryCostCalculator } from './BigQueryCostCalculator';
import { ArtifactCostCalculator } from './ArtifactCostCalculator';
import { ModelArmorCostCalculator } from './ModelArmorCostCalculator';
import { ResourceType } from '../../types';

/**
 * Factory Pattern: Instantiates the correct calculator based on resource type.
 * Centralizes creation logic and makes it easy to add new resource types.
 */
export class CostCalculatorFactory {
  static create(type: ResourceType): ICostCalculator {
    switch (type) {
      // vCPU-based resources
      case ResourceType.COMPUTE_ENGINE:
      case ResourceType.GKE_STANDARD:
      case ResourceType.GKE_AUTOPILOT:
      case ResourceType.CLOUD_SQL:
      case ResourceType.APP_ENGINE_FLEX:
      case ResourceType.DATAFLOW:
      case ResourceType.DATAPROC:
        return new ComputeCostCalculator();

      // Instance-based resources
      case ResourceType.APP_ENGINE_STANDARD:
        return new InstanceCostCalculator();

      // Storage operations
      case ResourceType.CLOUD_STORAGE_CLASS_A:
        return new StorageCostCalculator(true); // Class A
      case ResourceType.CLOUD_STORAGE_CLASS_B:
        return new StorageCostCalculator(false); // Class B

      // BigQuery
      case ResourceType.BIGQUERY_ON_DEMAND:
        return new BigQueryCostCalculator(true); // On-Demand
      case ResourceType.BIGQUERY_CAPACITY:
        return new BigQueryCostCalculator(false); // Capacity

      // Artifacts
      case ResourceType.ARTIFACT_REGISTRY:
        return new ArtifactCostCalculator();

      // GenAI Security
      case ResourceType.MODEL_ARMOR:
        return new ModelArmorCostCalculator();

      default:
        throw new Error(`Unknown resource type: ${type}`);
    }
  }
}
