import { ICostCalculator } from './ICostCalculator';
import { ResourceInput, BaseRates } from '../../types';

/**
 * Strategy for calculating Artifact Registry container scanning costs.
 */
export class ArtifactCostCalculator implements ICostCalculator {
  calculate(resource: ResourceInput, rates: BaseRates): number {
    const imagesScanned = resource.imagesScanned || 0;
    
    // Images scanned × Image scanning rate
    return imagesScanned * rates.ARTIFACT_IMAGE_SCAN;
  }
}
