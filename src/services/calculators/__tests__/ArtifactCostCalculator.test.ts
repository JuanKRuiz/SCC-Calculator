import { describe, it, expect } from 'vitest';
import { ArtifactCostCalculator } from '../ArtifactCostCalculator';
import { BaseRates, ResourceInput, ResourceType } from '../../../types';

describe('ArtifactCostCalculator', () => {
  const mockRates: BaseRates = {
    PREMIUM_VCORE_HOUR: 0.0071,
    GCS_CLASS_A_1K_OPS: 0.001,
    GCS_CLASS_B_1K_OPS: 0.0001,
    BQ_ON_DEMAND_GB: 0.01,
    BQ_SLOT_HOUR: 0.04,
    ARTIFACT_IMAGE_SCAN: 0.26,
    MODEL_ARMOR_1K_OPS: 0.50
  };

  const calculator = new ArtifactCostCalculator();

  it('should calculate container scanning cost correctly', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-1',
      type: ResourceType.ARTIFACT_REGISTRY,
      imagesScanned: 1000
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    
    // 1000 images × $0.26/image = $260
    expect(cost).toBe(260);
  });

  it('should return 0 when imagesScanned is undefined', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-2',
      type: ResourceType.ARTIFACT_REGISTRY
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    expect(cost).toBe(0);
  });

  it('should handle fractional scan counts', () => {
    const resource: Partial<ResourceInput> = {
      id: 'test-3',
      type: ResourceType.ARTIFACT_REGISTRY,
      imagesScanned: 5
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    
    // 5 images × $0.26 = $1.30
    expect(cost).toBe(1.30);
  });
});
