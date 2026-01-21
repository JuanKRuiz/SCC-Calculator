import { CostCalculatorFactory } from './calculators/CostCalculatorFactory';
import { ResourceInput, PricingRates, CostResult } from './types';

/**
 * Facade Pattern: Provides a simple interface for complex cost calculation logic.
 * Handles errors gracefully and ensures robust execution.
 */
export class SCCCostService {
  /**
   * Calculate SCC Premium costs for all resources
   * @param resources - Array of resource configurations
   * @param rates - Official pricing rates (PAYG and Org Level)
   * @param contactSalesText - Translation key for "contact sales" message
   * @returns Complete cost result with PAYG, Org, and Enterprise recommendations
   */
  static calculate(
    resources: ResourceInput[],
    rates: PricingRates,
    contactSalesText: string
  ): CostResult {
    try {
      // Validate pricing rates exist
      if (!rates?.project || !rates?.org) {
        console.error('Invalid pricing rates received:', rates);
        throw new Error('Pricing rates are invalid or missing');
      }

      // Calculate costs for each resource using Strategy pattern
      const details = resources.map(res => {
        try {
          const calculator = CostCalculatorFactory.create(res.type);
          
          // Calculate for both PAYG and Org Level
          const costPayg = calculator.calculate(res, rates.project);
          const costOrg = calculator.calculate(res, rates.org);

          return {
            resourceId: res.id,
            label: res.label,
            type: res.type,
            cost: costPayg,
            costOrg: costOrg
          };
        } catch (calcError) {
          console.error(`Failed to calculate cost for resource ${res.id}:`, calcError);
          // Return zero cost for this resource rather than failing entire calculation
          return {
            resourceId: res.id,
            label: res.label,
            type: res.type,
            cost: 0,
            costOrg: 0
          };
        }
      });

      // Aggregate totals
      const totalPayg = details.reduce((sum, d) => sum + d.cost, 0);
      const totalOrg = details.reduce((sum, d) => sum + d.costOrg, 0);

      // Separate Model Armor costs if needed
      const modelArmorCost = details
        .filter(d => d.type === 'MODEL_ARMOR')
        .reduce((sum, d) => sum + d.cost, 0);

      // Determine if Enterprise is recommended (threshold: $25k/month)
      const ENTERPRISE_THRESHOLD = 25000;
      const isEnterpriseRecommended = totalPayg > ENTERPRISE_THRESHOLD;

      return {
        totalMonthly: {
          standard: 0, // Standard tier not used in SCC Premium
          premiumPayGo: totalPayg,
          premiumSubscription: totalOrg,
          enterprise: contactSalesText,
          modelArmorCost: modelArmorCost
        },
        details: details.map(d => ({
          resourceId: d.resourceId,
          cost: d.cost
        })),
        isEnterpriseRecommended
      };

    } catch (error) {
      // Log error for debugging but return safe default
      console.error('Cost calculation failed completely:', error);
      
      // Return empty result rather than crashing the app
      return {
        totalMonthly: {
          standard: 0,
          premiumPayGo: 0,
          premiumSubscription: 0,
          enterprise: contactSalesText,
          modelArmorCost: 0
        },
        details: [],
        isEnterpriseRecommended: false
      };
    }
  }
}
