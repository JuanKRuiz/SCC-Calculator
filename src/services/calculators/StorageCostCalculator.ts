import { ICostCalculator } from './ICostCalculator';
import { ResourceInput, BaseRates } from '../../types';

/**
 * Strategy for calculating costs of Cloud Storage operations.
 * Handles both Class A and Class B operations.
 */
export class StorageCostCalculator implements ICostCalculator {
  private readonly isClassA: boolean;

  constructor(isClassA: boolean = true) {
    this.isClassA = isClassA;
  }

  calculate(resource: ResourceInput, rates: BaseRates): number {
    const operations = resource.monthlyOperations || 0;
    
    // Storage  is priced per 1,000 operations
    const rate = this.isClassA 
      ? rates.GCS_CLASS_A_1K_OPS
      : rates.GCS_CLASS_B_1K_OPS;
    
    return (operations / 1000) * rate;
  }
}
