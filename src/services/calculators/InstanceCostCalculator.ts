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
    
    // Instances × Hours × Premium vCore rate (same rate used for instance-based pricing)
    return instances * hours * rates.PREMIUM_VCORE_HOUR;
  }
}
