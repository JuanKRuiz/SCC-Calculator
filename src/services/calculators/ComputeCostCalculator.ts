import { ICostCalculator } from './ICostCalculator';
import { ResourceInput, BaseRates } from '../../types';

/**
 * Strategy for calculating costs of vCPU-based resources.
 * Applies to: Compute Engine, GKE Standard, GKE Autopilot, Cloud SQL,
 * App Engine Flex, Dataflow, Dataproc
 */
export class ComputeCostCalculator implements ICostCalculator {
  calculate(resource: ResourceInput, rates: BaseRates): number {
    const vCpus = resource.vCpus || 0;
    const hours = resource.hoursPerMonth || 0;
    
    // vCPUs × Hours × Premium vCore rate
    return vCpus * hoursPerMonth * rates.computeCus;PREMIUM_VCORE_HOUR;
  }
}
