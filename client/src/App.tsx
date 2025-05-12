import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { LanguageProvider } from "@/components/language-selector";
import { PageTransition } from "@/components/ui/transition-effect";
import { RecentlyViewedProvider } from "@/contexts/recently-viewed-context";
import { AIAssistantProvider, FloatingAssistantButton } from "@/components/layout";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import TripInfoPage from "@/pages/trip-info-page";
import InsurancePlansPage from "@/pages/insurance-plans-page";
import CheckoutPage from "@/pages/checkout-page";
import WeatherRiskPage from "@/pages/weather-risk-page";
import LearnMorePage from "@/pages/learn-more-page";
import TermsPage from "@/pages/terms-page";
import ProfilePage from "@/pages/profile-page";
import SettingsPage from "@/pages/settings-page";
import ApiSettingsPage from "@/pages/api-settings-page";
import AutoInsurancePage from "@/pages/auto-insurance-page";
import PetInsurancePage from "@/pages/pet-insurance-page";
import HealthInsurancePage from "@/pages/health-insurance-page";
import AutoQuotePage from "@/pages/auto-quote-page";
import AIAssistantDemo from "@/pages/ai-assistant-demo";
import CountdownPage from "@/pages/countdown-page";

function Router() {
  const [location] = useLocation();
  
  return (
    <PageTransition>
      <Switch>
        <Route path="/home" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/trip-info" component={TripInfoPage} />
        <ProtectedRoute path="/insurance-plans" component={InsurancePlansPage} />
        <ProtectedRoute path="/checkout/:planId" component={CheckoutPage} />
        <Route path="/weather-risk" component={WeatherRiskPage} />
        <Route path="/auto-insurance" component={AutoInsurancePage} />
        <Route path="/" component={CountdownPage} />
        <ProtectedRoute path="/auto-quote" component={AutoQuotePage} />
        <Route path="/auto-compare" component={AutoQuotePage} /> {/* Placeholder until we create AutoComparePage */}
        <Route path="/pet-insurance" component={PetInsurancePage} />
        <Route path="/pet-compare" component={PetInsurancePage} /> {/* Placeholder until we create PetComparePage */}
        <Route path="/health-insurance" component={HealthInsurancePage} />
        <Route path="/health-compare" component={HealthInsurancePage} /> {/* Placeholder until we create HealthComparePage */}
        <Route path="/learn-more" component={LearnMorePage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/ai-assistant" component={AIAssistantDemo} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <ProtectedRoute path="/settings" component={SettingsPage} />
        <ProtectedRoute path="/api-settings" component={ApiSettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <RecentlyViewedProvider>
            <TooltipProvider>
              <Toaster />
              <AIAssistantProvider>
                <Router />
                <FloatingAssistantButton />
              </AIAssistantProvider>
            </TooltipProvider>
          </RecentlyViewedProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
