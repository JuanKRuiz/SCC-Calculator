import { ICostCalculator } from './ICostCalculator';
import { ResourceInput, BaseRates } from '../../types';

/**
 * Strategy for calculating BigQuery costs.
 * Handles both On-Demand Analysis and Capacity (Slots) pricing.
 */
export class BigQueryCostCalculator implements ICostCalculator {
  private readonly isOnDemand: boolean;

  constructor(isOnDemand: boolean = true) {
    this.isOnDemand = isOnDemand;
  }

  calculate(resource: ResourceInput, rates: BaseRates): number {
    if (this.isOnDemand) {
      // On-Demand: GB of data analyzed
      const gbAnalyzed = resource.dataProcessedGB || 0;
      return gbAnalyzed * rates.BQ_ON_DEMAND_GB;
    } else {
      // Capacity: Slots × Hours
      const slots = resource.slots || 0;
      const hours = resource.hoursPerMonth || 0;
      return slots * hours * rates.BQ_SLOT_HOUR;
    }
  }
}
