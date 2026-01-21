import { describe, it, expect } from 'vitest';
import { SCCCostService } from '../SCCCostService';
import { ResourceInput, ResourceType, PricingRates } from '../../types';

describe('SCCCostService', () => {
  const mockPricingRates: PricingRates = {
    project: {
      PREMIUM_VCORE_HOUR: 0.0071,
      GCS_CLASS_A_1K_OPS: 0.001,
      GCS_CLASS_B_1K_OPS: 0.0001,
      BQ_ON_DEMAND_GB: 0.01,
      BQ_SLOT_HOUR: 0.04,
      ARTIFACT_IMAGE_SCAN: 0.26,
      MODEL_ARMOR_1K_OPS: 0.50
    },
    org: {
      PREMIUM_VCORE_HOUR: 0.0057, // ~20% discount
      GCS_CLASS_A_1K_OPS: 0.0008,
      GCS_CLASS_B_1K_OPS: 0.00008,
      BQ_ON_DEMAND_GB: 0.008,
      BQ_SLOT_HOUR: 0.032,
      ARTIFACT_IMAGE_SCAN: 0.21,
      MODEL_ARMOR_1K_OPS: 0.40
    },
    lastUpdated: '2026-01-20',
    source: 'DEFAULT'
  };

  it('should calculate total costs correctly for multiple resources', () => {
    const resources: ResourceInput[] = [
      {
        id: '1',
        type: ResourceType.COMPUTE_ENGINE,
        label: 'Prod Cluster',
        vCpus: 24,
        hoursPerMonth: 730
      },
      {
        id: '2',
        type: ResourceType.APP_ENGINE_STANDARD,
        label: 'API Backend',
        instances: 10,
        hoursPerMonth: 730
      }
    ];

    const result = SCCCostService.calculate(resources, mockPricingRates, 'Contact Sales');

    // Compute: 24 × 730 × 0.0071 = $124.392
    // App Engine: 10 × 730 × 0.0071 = $51.83
    // Total PAYG: $176.222
    expect(result.totalMonthly.premiumPayGo).toBeCloseTo(176.222, 2);
    
    // Org should be cheaper
    expect(result.totalMonthly.premiumSubscription).toBeLessThan(result.totalMonthly.premiumPayGo);
  });

  it('should handle empty resource list gracefully', () => {
    const result = SCCCostService.calculate([], mockPricingRates, 'Contact Sales');

    expect(result.totalMonthly.premiumPayGo).toBe(0);
    expect(result.totalMonthly.premiumSubscription).toBe(0);
    expect(result.isEnterpriseRecommended).toBe(false);
  });

  it('should recommend Enterprise for high-cost scenarios', () => {
    const resources: ResourceInput[] = [
      {
        id: '1',
        type: ResourceType.COMPUTE_ENGINE,
        label: 'Large Cluster',
        vCpus: 5000, // Very large deployment
        hoursPerMonth: 730
      }
    ];

    const result = SCCCostService.calculate(resources, mockPricingRates, 'Contact Sales');

    // 5000 × 730 × 0.0071 = $25,915 > $25,000 threshold
    expect(result.isEnterpriseRecommended).toBe(true);
  });

  it('should not recommend Enterprise for low-cost scenarios', () => {
    const resources: ResourceInput[] = [
      {
        id: '1',
        type: ResourceType.COMPUTE_ENGINE,
        label: 'Small Cluster',
        vCpus: 16,
        hoursPerMonth: 730
      }
    ];

    const result = SCCCostService.calculate(resources, mockPricingRates, 'Contact Sales');

    expect(result.isEnterpriseRecommended).toBe(false);
  });

  it('should return safe defaults when pricing rates are invalid', () => {
    const resources: ResourceInput[] = [
      {
        id: '1',
        type: ResourceType.COMPUTE_ENGINE,
        label: 'Test',
        vCpus: 24,
        hoursPerMonth: 730
      }
    ];

    // @ts-ignore - intentionally passing invalid rates
    const result = SCCCostService.calculate(resources, {}, 'Contact Sales');

    expect(result.totalMonthly.premiumPayGo).toBe(0);
    expect(result.details).toEqual([]);
  });

  it('should separate Model Armor costs correctly', () => {
    const resources: ResourceInput[] = [
      {
        id: '1',
        type: ResourceType.COMPUTE_ENGINE,
        label: 'Compute',
        vCpus: 24,
        hoursPerMonth: 730
      },
      {
        id: '2',
        type: ResourceType.MODEL_ARMOR,
        label: 'GenAI Security',
        modelArmorOps: 100 // 100k ops
      }
    ];

    const result = SCCCostService.calculate(resources, mockPricingRates, 'Contact Sales');

    // Model Armor: 100 ÷ 1000 × $0.50 = $50
    expect(result.totalMonthly.modelArmorCost).toBeCloseTo(50, 2);
  });
});
