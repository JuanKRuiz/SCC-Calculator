import { ResourceInput, BaseRates } from '../../types';

/**
 * Interface for the Strategy Pattern.
 * Each resource type will have its own calculator implementation.
 */
export interface ICostCalculator {
  /**
   * Calculate the cost for a single resource
   * @param resource - The resource configuration
   * @param rates - The applicable pricing rates (PAYG or Org Level)
   * @returns Monthly cost in USD
   */
  calculate(resource: ResourceInput, rates: BaseRates): number;
}
