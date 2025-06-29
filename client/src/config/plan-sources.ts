/**
 * Plan Sources Configuration
 * Manages which data source to use for insurance plans
 */

// Global flag to toggle between mock and real plans
export const PLAN_SOURCE_CONFIG = {
  useMockPlans: process.env.VITE_USE_MOCK_PLANS === 'true' || false,
  enableMixedMode: process.env.VITE_ENABLE_MIXED_PLANS === 'true' || false, // Show both mock and real plans
};

// Helper function to get the current plan source
export function getPlanSource(): 'mock' | 'real' | 'mixed' {
  if (PLAN_SOURCE_CONFIG.enableMixedMode) {
    return 'mixed';
  }
  return PLAN_SOURCE_CONFIG.useMockPlans ? 'mock' : 'real';
}

// Helper to check if we should show mock plans
export function shouldShowMockPlans(): boolean {
  return PLAN_SOURCE_CONFIG.useMockPlans || PLAN_SOURCE_CONFIG.enableMixedMode;
}

// Helper to check if we should show real plans
export function shouldShowRealPlans(): boolean {
  return !PLAN_SOURCE_CONFIG.useMockPlans || PLAN_SOURCE_CONFIG.enableMixedMode;
}

// Function to toggle plan source (for testing)
export function togglePlanSource() {
  PLAN_SOURCE_CONFIG.useMockPlans = !PLAN_SOURCE_CONFIG.useMockPlans;
  console.log(`Plan source switched to: ${getPlanSource()}`);
  
  // Store in localStorage for persistence
  localStorage.setItem('briki_use_mock_plans', PLAN_SOURCE_CONFIG.useMockPlans.toString());
}

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
  const storedValue = localStorage.getItem('briki_use_mock_plans');
  if (storedValue !== null) {
    PLAN_SOURCE_CONFIG.useMockPlans = storedValue === 'true';
  }
} 