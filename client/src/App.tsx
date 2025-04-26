import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { LanguageProvider } from "@/components/language-selector";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import TripInfoPage from "@/pages/trip-info-page";
import InsurancePlansPage from "@/pages/insurance-plans-page";
import CheckoutPage from "@/pages/checkout-page";
import WeatherRiskPage from "@/pages/weather-risk-page";
import LearnMorePage from "@/pages/learn-more-page";
import TermsPage from "@/pages/terms-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/trip-info" component={TripInfoPage} />
      <ProtectedRoute path="/insurance-plans" component={InsurancePlansPage} />
      <ProtectedRoute path="/checkout/:planId" component={CheckoutPage} />
      <Route path="/weather-risk" component={WeatherRiskPage} />
      <Route path="/learn-more" component={LearnMorePage} />
      <Route path="/terms" component={TermsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
