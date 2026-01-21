import { describe, it, expect } from 'vitest';
import { ModelArmorCostCalculator } from '../ModelArmorCostCalculator';
import { BaseRates, ResourceInput, ResourceType } from '../../../types';

describe('ModelArmorCostCalculator', () => {
  const mockRates: BaseRates = {
    PREMIUM_VCORE_HOUR: 0.0071,
    GCS_CLASS_A_1K_OPS: 0.001,
    GCS_CLASS_B_1K_OPS: 0.0001,
    BQ_ON_DEMAND_GB: 0.01,
    BQ_SLOT_HOUR: 0.04,
    ARTIFACT_IMAGE_SCAN: 0.26,
    MODEL_ARMOR_1K_OPS: 0.50
  };

  const calculator = new ModelArmorCostCalculator();

  it('should calculate GenAI security cost correctly', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-1',
      type: ResourceType.MODEL_ARMOR,
      modelArmorOps: 100 // 100k operations
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    
    // 100k ops ÷ 1,000 × $0.50/1k ops = $50.00
    expect(cost).toBe(50.00);
  });

  it('should return 0 when modelArmorOps is undefined', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-2',
      type: ResourceType.MODEL_ARMOR
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    expect(cost).toBe(0);
  });

  it('should handle small operation counts correctly', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-3',
      type: ResourceType.MODEL_ARMOR,
      modelArmorOps: 5 // 5k operations
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    
    // 5k ops ÷ 1,000 × $0.50 = $2.50
    expect(cost).toBe(2.50);
  });
});
