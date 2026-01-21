import { describe, it, expect } from 'vitest';
import { BigQueryCostCalculator } from '../BigQueryCostCalculator';
import { BaseRates, ResourceInput, ResourceType } from '../../../types';

describe('BigQueryCostCalculator', () => {
  const mockRates: BaseRates = {
    PREMIUM_VCORE_HOUR: 0.0071,
    GCS_CLASS_A_1K_OPS: 0.001,
    GCS_CLASS_B_1K_OPS: 0.0001,
    BQ_ON_DEMAND_GB: 0.01,
    BQ_SLOT_HOUR: 0.04,
    ARTIFACT_IMAGE_SCAN: 0.26,
    MODEL_ARMOR_1K_OPS: 0.50
  };

  it('should calculate On-Demand cost correctly', () => {
    const calculator = new BigQueryCostCalculator(true); // On-Demand
    const resource: Partial<ResourceInput> = {
      id: 'test-1',
      type: ResourceType.BIGQUERY_ON_DEMAND,
      dataProcessedGB: 1000 // 1TB = 1000 GB
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    
    // 1000 GB × $0.01/GB = $10.00
    expect(cost).toBe(10.00);
  });

  it('should calculate Capacity (Slots) cost correctly', () => {
    const calculator = new BigQueryCostCalculator(false); // Capacity
    const resource: Partial<ResourceInput> = {
      id: 'test-2',
      type: ResourceType.BIGQUERY_CAPACITY,
      slots: 100,
      hoursPerMonth: 730
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    
    // 100 slots × 730 hours × $0.04/slot-hr = $2,920
    expect(cost).toBe(2920);
  });

  it('should return 0 for On-Demand when dataProcessedGB is undefined', () => {
    const calculator = new BigQueryCostCalculator(true);
    const resource: Partial<ResourceInput> = {
      id: 'test-3',
      type: ResourceType.BIGQUERY_ON_DEMAND
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    expect(cost).toBe(0);
  });

  it('should return 0 for Capacity when slots is undefined', () => {
    const calculator = new BigQueryCostCalculator(false);
    const resource: Partial<ResourceInput> = {
      id: 'test-4',
      type: ResourceType.BIGQUERY_CAPACITY,
      hoursPerMonth: 730
    };

    const cost = calculator.calculate(resource as ResourceInput, mockRates);
    expect(cost).toBe(0);
  });
});
