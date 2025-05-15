import GenericRedirect from "./GenericRedirect";

/**
 * Redirect component for legacy auto insurance route
 */
export function AutoInsuranceRedirect() {
  return <GenericRedirect to="/explore/auto" />;
}

/**
 * Redirect component for legacy pet insurance route
 */
export function PetInsuranceRedirect() {
  return <GenericRedirect to="/explore/pet" />;
}

/**
 * Redirect component for legacy health insurance route
 */
export function HealthInsuranceRedirect() {
  return <GenericRedirect to="/explore/health" />;
}

/**
 * Redirect component for legacy travel insurance route
 */
export function TravelInsuranceRedirect() {
  return <GenericRedirect to="/explore/travel" />;
}