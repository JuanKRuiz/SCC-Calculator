import { describe, it, expect } from 'vitest';
import { InstanceCostCalculator } from '../InstanceCostCalculator';
import { BaseRates, ResourceInput, ResourceType } from '../../../types';

describe('InstanceCostCalculator', () => {
  const mockRates: BaseRates = {
    PREMIUM_VCORE_HOUR: 0.0071,
    GCS_CLASS_A_1K_OPS: 0.001,
    GCS_CLASS_B_1K_OPS: 0.0001,
    BQ_ON_DEMAND_GB: 0.01,
    BQ_SLOT_HOUR: 0.04,
    ARTIFACT_IMAGE_SCAN: 0.26,
    MODEL_ARMOR_1K_OPS: 0.50
  };

  const calculator = new InstanceCostCalculator();

  it('should calculate cost correctly for instance-based resources', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-1',
      type: ResourceType.APP_ENGINE_STANDARD,
      instances: 10,
      hoursPerMonth: 730
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    
    // 10 instances × 730 hours × $0.0071/instance-hr = $51.83
    expect(cost).toBe(51.83);
  });

  it('should return 0 when instances is undefined', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-2',
      type: ResourceType.APP_ENGINE_STANDARD,
      hoursPerMonth: 730
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    expect(cost).toBe(0);
  });

  it('should return 0 when hoursPerMonth is undefined', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-3',
      type: ResourceType.APP_ENGINE_STANDARD,
      instances: 10
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    expect(cost).toBe(0);
  });
});
