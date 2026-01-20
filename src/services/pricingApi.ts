import { PricingRates } from '../types';
import ratesData from '../data/scc_rates.json';

export const fetchSCCPricing = async (): Promise<PricingRates> => {
  // In a real scenario, this could try to fetch from a static JSON url if hosted externally
  // For now, it returns the build-time JSON but wrapped in a promise to maintain the async interface
  console.log("Loading pricing rates...", ratesData);
  
  return new Promise((resolve) => {
    // Simulate network delay for UX effect or remove if instant is preferred
    setTimeout(() => {
        resolve(ratesData as unknown as PricingRates);
    }, 800);
  });
};