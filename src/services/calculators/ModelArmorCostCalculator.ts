import { ICostCalculator } from './ICostCalculator';
import { ResourceInput, BaseRates } from '../../types';

/**
 * Strategy for calculating Model Armor (GenAI Security) costs.
 */
export class ModelArmorCostCalculator implements ICostCalculator {
  calculate(resource: ResourceInput, rates: BaseRates): number {
    const operations = resource.modelArmorOps || 0;
    
    // Model Armor is priced per 1,000 operations
    return (operations / 1000) * rates.MODEL_ARMOR_1K_OPS;
  }
}
