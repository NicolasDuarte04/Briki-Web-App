import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { LanguageProvider } from "@/components/language-selector";
import { PageTransition } from "@/components/ui/transition-effect";
import { RecentlyViewedProvider } from "@/contexts/recently-viewed-context";
import { AIAssistantProvider, AuthenticatedLayout, MainLayout } from "@/components/layout";
import { LoginNotification } from "@/components/login-notification";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import HomePageNew from "@/pages/home-page-new";
import AuthPage from "@/pages/auth-page";
import AuthPageNew from "@/pages/auth-page-new";
import AuthPageEnhanced from "@/pages/auth-page-enhanced";
import TripInfoPage from "@/pages/trip-info-page";
import InsurancePlansPage from "@/pages/insurance-plans-page";
import InsuranceCategoriesPage from "@/pages/insurance-categories-page";
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

// Import redirects from barrel file
import { 
  AutoInsuranceRedirect,
  PetInsuranceRedirect,
  HealthInsuranceRedirect,
  TravelInsuranceRedirect
} from "@/pages/redirects";
import AIAssistantDemo from "@/pages/ai-assistant-demo";
import CountdownPage from "@/pages/countdown-page";
import CountdownPageNew from "@/pages/countdown-page-new";
import BrikiPilotPortal from "@/pages/briki-pilot-portal";
import LandingPage from "@/pages/landing-page";

// New insurance category pages
import TravelInsurance from "@/pages/insurance/travel";
import AutoInsurance from "@/pages/insurance/auto";
import PetInsurance from "@/pages/insurance/pet";
import HealthInsurance from "@/pages/insurance/health";
import InsuranceQuote from "@/pages/insurance/[category]/quote";

// Explore pages (public-facing SEO pages without app layout)
import ExploreTravelInsurance from "@/pages/explore/travel";
import ExploreAutoInsurance from "@/pages/explore/auto";
import ExplorePetInsurance from "@/pages/explore/pet";
import ExploreHealthInsurance from "@/pages/explore/health";

// Company pages
import CompanyPage from "@/pages/company-page";
import CompanyLoginPage from "@/pages/company-login-page";
import CompanyRegisterPage from "@/pages/company-register-page";
import CompanyDashboardPage from "@/pages/company-dashboard-page";
import CompanyQuoteUploadPage from "@/pages/company-quote-upload-page";
import CompanyPreviewPage from "@/pages/company-preview-page";
import CompanyRequestPilotPage from "@/pages/company-request-pilot-page";
import ContactSalesPage from "@/pages/contact-sales-page";

// Removed unused ConditionalAIProvider

function Router() {
  const [location] = useLocation();
  
  return (
    <PageTransition>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/countdown" component={CountdownPage} />
        <Route path="/home" component={HomePageNew} />
        <Route path="/auth" component={AuthPageEnhanced} />
        <Route path="/categories" component={InsuranceCategoriesPage} />
        <ProtectedRoute path="/trip-info" component={TripInfoPage} />
        <ProtectedRoute path="/insurance-plans" component={InsurancePlansPage} />
        <ProtectedRoute path="/checkout/:planId" component={CheckoutPage} />
        <Route path="/weather-risk" component={WeatherRiskPage} />
        {/* Legacy routes - redirected to new paths */}
        <Route path="/auto-insurance" component={AutoInsuranceRedirect} />
        <Route path="/pet-insurance" component={PetInsuranceRedirect} />
        <Route path="/health-insurance" component={HealthInsuranceRedirect} />
        <Route path="/travel-insurance" component={TravelInsuranceRedirect} />
        
        {/* New insurance category routes (for authenticated app) */}
        <Route path="/insurance/travel" component={TravelInsurance} />
        <Route path="/insurance/auto" component={AutoInsurance} />
        <Route path="/insurance/pet" component={PetInsurance} />
        <Route path="/insurance/health" component={HealthInsurance} />
        
        {/* Public-facing explore pages (for SEO and non-authenticated users) */}
        <Route path="/explore/travel" component={ExploreTravelInsurance} />
        <Route path="/explore/auto" component={ExploreAutoInsurance} />
        <Route path="/explore/pet" component={ExplorePetInsurance} />
        <Route path="/explore/health" component={ExploreHealthInsurance} />
        
        {/* Quote pages for each insurance category */}
        <Route path="/insurance/:category/quote" component={InsuranceQuote} />
        <Route path="/learn-more" component={LearnMorePage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/ai-assistant" component={AIAssistantDemo} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <ProtectedRoute path="/settings" component={SettingsPage} />
        <ProtectedRoute path="/api-settings" component={ApiSettingsPage} />
        
        {/* Company/Partner Routes */}
        <Route path="/company" component={CompanyPage} />
        <Route path="/briki-pilot" component={BrikiPilotPortal} />
        <Route path="/company-login" component={CompanyLoginPage} />
        <Route path="/company-register" component={CompanyRegisterPage} />
        <Route path="/contact-sales" component={ContactSalesPage} />
        <ProtectedRoute path="/company-dashboard" component={CompanyDashboardPage} />
        <ProtectedRoute path="/company-dashboard/upload" component={CompanyQuoteUploadPage} />
        <ProtectedRoute path="/company-dashboard/preview" component={CompanyPreviewPage} />
        <ProtectedRoute path="/company-dashboard/request-pilot" component={CompanyRequestPilotPage} />
        
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

/**
 * Component that wraps the Router with AI Assistant only when appropriate
 */
function AppContent() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // List of paths where AI Assistant should NOT be provided
  const excludedPaths = ['/', '/auth', '/countdown', '/login', '/register', '/terms', '/learn-more', '/landing'];
  const isExcludedPath = excludedPaths.some(path => 
    location === path || location.startsWith(`${path}/`)
  );
  
  // Debug logging for AI assistant visibility
  console.log("App render - AI Assistant visibility:", { 
    path: location, 
    isAuthenticated: !!user, 
    isExcludedPath,
    shouldShowAI: !!user && !isExcludedPath
  });
  
  // Only show AI Assistant if user is logged in AND not on excluded paths
  if (user && !isExcludedPath) {
    return (
      <AIAssistantProvider>
        <AuthenticatedLayout>
          <LoginNotification />
          <Router />
        </AuthenticatedLayout>
      </AIAssistantProvider>
    );
  }
  
  // For landing page, just render the Router directly (it has its own layout)
  if (location === '/') {
    return <Router />;
  }
  
  // For explore pages, render the Router directly (they have their own self-contained layout)
  if (location.startsWith('/explore')) {
    return <Router />;
  }
  
  // Use MainLayout for B2C routes but not for auth pages (they have their own optimized layout)
  if (location !== '/auth' && !location.startsWith('/company') && !location.startsWith('/briki-pilot')) {
    return (
      <MainLayout>
        <Router />
      </MainLayout>
    );
  }
  
  // Auth pages and B2B routes don't use MainLayout
  return <Router />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <RecentlyViewedProvider>
            <TooltipProvider>
              <Toaster />
              <AppContent />
            </TooltipProvider>
          </RecentlyViewedProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
