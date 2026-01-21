import { ICostCalculator } from './ICostCalculator';
import { ResourceInput, BaseRates } from '../../types';

/**
 * Strategy for calculating costs of instance-based resources.
 * Applies to: App Engine Standard
 */
export class InstanceCostCalculator implements ICostCalculator {
  calculate(resource: ResourceInput, rates: BaseRates): number {
    const instances = resource.instances || 0;
    const hours = resource.hoursPerMonth || 0;
    
    // Instances × Hours × Premium instance rate
    return instances * hours * rates.PREMIUM_INSTANCE_HOUR;
  }
}
