import { describe, it, expect } from 'vitest';
import { StorageCostCalculator } from '../StorageCostCalculator';
import { BaseRates, ResourceInput, ResourceType } from '../../../types';

describe('StorageCostCalculator', () => {
  const mockRates: BaseRates = {
    PREMIUM_VCORE_HOUR: 0.0071,
    GCS_CLASS_A_1K_OPS: 0.001,
    GCS_CLASS_B_1K_OPS: 0.0001,
    BQ_ON_DEMAND_GB: 0.01,
    BQ_SLOT_HOUR: 0.04,
    ARTIFACT_IMAGE_SCAN: 0.26,
    MODEL_ARMOR_1K_OPS: 0.50
  };

  it('should calculate Class A operations cost correctly', () => {
    const calculator = new StorageCostCalculator(true); // Class A
    const resource: Partial<ResourceInput> = {
      id: 'test-1',
      type: ResourceType.CLOUD_STORAGE_CLASS_A,
      monthlyOperations: 1000000 // 1 million operations
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    
    // 1,000,000 ops ÷ 1,000 × $0.001/1k ops = $1.00
    expect(cost).toBe(1.00);
  });

  it('should calculate Class B operations cost correctly', () => {
    const calculator = new StorageCostCalculator(false); // Class B
    const resource: Partial<ResourceInput> = {
      id: 'test-2',
      type: ResourceType.CLOUD_STORAGE_CLASS_B,
      monthlyOperations: 5000000 // 5 million operations
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    
    // 5,000,000 ops ÷ 1,000 × $0.0001/1k ops = $0.50
    expect(cost).toBe(0.5);
  });

  it('should return 0 when monthlyOperations is undefined', () => {
    const calculator = new StorageCostCalculator(true);
    const resource: Partial<ResourceInput> = {
      id: 'test-3',
      type: ResourceType.CLOUD_STORAGE_CLASS_A
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    expect(cost).toBe(0);
  });

  it('should handle fractional thousands correctly', () => {
    const calculator = new StorageCostCalculator(true);
    const resource: Partial<ResourceInput> = {
      id: 'test-4',
      type: ResourceType.CLOUD_STORAGE_CLASS_A,
      monthlyOperations: 2500 // 2.5k operations
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    
    // 2,500 ÷ 1,000 × $0.001 = $0.0025
    expect(cost).toBe(0.0025);
  });
});
