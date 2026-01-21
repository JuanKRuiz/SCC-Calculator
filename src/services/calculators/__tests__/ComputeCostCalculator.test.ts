import { describe, it, expect } from 'vitest';
import { ComputeCostCalculator } from '../ComputeCostCalculator';
import { BaseRates, ResourceInput, ResourceType } from '../../../types';

describe('ComputeCostCalculator', () => {
  const mockRates: BaseRates = {
    PREMIUM_VCORE_HOUR: 0.0071,
    GCS_CLASS_A_1K_OPS: 0.001,
    GCS_CLASS_B_1K_OPS: 0.0001,
    BQ_ON_DEMAND_GB: 0.01,
    BQ_SLOT_HOUR: 0.04,
    ARTIFACT_IMAGE_SCAN: 0.26,
    MODEL_ARMOR_1K_OPS: 0.50
  };

  const calculator = new ComputeCostCalculator();

  it('should calculate cost correctly for vCPU-based resources', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-1',
      type: ResourceType.COMPUTE_ENGINE,
      vCpus: 24,
      hoursPerMonth: 730
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    
    // 24 vCPUs × 730 hours × $0.0071/vCore-hr = $124.392
    // 24 vCPUs × 730 hours × $0.0071/vCore-hr = $124.392
    expect(cost).toBeCloseTo(124.392, 3);
  });

  it('should return 0 when vCpus is undefined', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-2',
      type: ResourceType.GKE_STANDARD,
      hoursPerMonth: 730
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    expect(cost).toBe(0);
  });

  it('should return 0 when hoursPerMonth is undefined', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-3',
      type: ResourceType.CLOUD_SQL,
      vCpus: 16
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    expect(cost).toBe(0);
  });

  it('should handle zero values correctly', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-4',
      type: ResourceType.DATAFLOW,
      vCpus: 0,
      hoursPerMonth: 730
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    expect(cost).toBe(0);
  });
});
