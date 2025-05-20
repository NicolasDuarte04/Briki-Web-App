import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { LanguageProvider } from "@/components/language-selector";
import { PageTransition } from "@/components/ui/transition-effect";
import { RecentlyViewedProvider } from "@/contexts/recently-viewed-context";
import { AIAssistantProvider, AuthenticatedLayout, MainLayout } from "@/components/layout";
import { LoginNotification } from "@/components/login-notification";
import { useNavigation } from "@/lib/navigation";
import { useAnalytics } from "@/hooks/use-analytics";
import { useEffect } from "react";
import { initGA, trackEvent } from "@/lib/analytics";
import { EventCategory } from "@/constants/analytics";
import { ColorProvider } from "@/contexts/color-context";

import NotFound from "@/pages/not-found";
import HomePageNew from "@/pages/home-page-new";
import Dashboard from "@/pages/dashboard-enhanced";
// Import our new unified authentication screen
import AuthPage from "@/pages/AuthPage";
import TripInfoPage from "@/pages/trip-info-page";
import InsuranceCategoriesPage from "@/pages/insurance-categories-page";
import CheckoutPage from "@/pages/checkout-page";
import WeatherRiskPage from "@/pages/weather-risk-page";
import LearnMorePage from "@/pages/learn-more-page";
import TermsPage from "@/pages/terms-page";
import ProfilePage from "@/pages/profile-page";
import SettingsPage from "@/pages/settings-page";
import ApiSettingsPage from "@/pages/api-settings-page";
// Import comparison screens
import ComparePlansPage from "@/pages/compare-plans";  // Original comparison component
import ComparePlansFixed from "@/pages/compare-plans-fixed";  // Fixed version of comparison component

// Import new public site pages
import FeaturesPage from "@/pages/features";
import PricingPage from "@/pages/pricing";
import AskBrikiPage from "@/pages/ask-briki";
import BlogPage from "@/pages/blog";
import ForumPage from "@/pages/forum";
import CareersPage from "@/pages/careers";
import ColorPaletteDemo from "@/pages/color-palette-demo";

// Import redirects from their respective files
import { 
  AutoInsuranceRedirect,
  PetInsuranceRedirect,
  HealthInsuranceRedirect,
  TravelInsuranceRedirect
} from "@/pages/redirects/insurance-redirects";

import { 
  InsurancePlansRedirect 
} from "@/pages/redirects/plans-redirects";
import AIAssistantDemo from "@/pages/ai-assistant-demo";
import AIAssistantScreen from "@/pages/assistant";
import CountdownPageNew from "@/pages/countdown-page-new";
import BrikiPilotPortal from "@/pages/briki-pilot-portal";
import LandingPage from "@/pages/landing-page";

// New insurance category pages
import TravelInsurance from "@/pages/insurance/travel";
import AutoInsurance from "@/pages/insurance/auto";
import PetInsurance from "@/pages/insurance/pet";
import HealthInsurance from "@/pages/insurance/health";

// Quote pages
import GetQuotePage from "@/pages/get-quote";
import QuoteConfirmationPage from "@/pages/quote-confirmation";
import QuoteHistoryPage from "@/pages/quote-history";

// Comparison pages
import ComparePlansDemo from "@/pages/compare-plans-demo";
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
import CompanyUploadPage from "@/pages/company-upload-page";
import CompanyAnalysisPage from "@/pages/company-analysis-page";
import CompanyMarketplacePage from "@/pages/company-marketplace-page";
import CompanySettingsPage from "@/pages/company-settings-page";
import CompanyPreviewPage from "@/pages/company-preview-page";
import CompanyRequestPilotPage from "@/pages/company-request-pilot-page";
import ContactSalesPage from "@/pages/contact-sales-page";

// Removed unused ConditionalAIProvider

function Router() {
  const { location } = useNavigation();
  
  // Track page views with Google Analytics
  useAnalytics();
  
  // Log landing page view for primary page
  useEffect(() => {
    if (location === '/') {
      console.log('Landing page viewed');
      trackEvent('page_view', EventCategory.Navigation, 'landing_page');
    }
  }, [location]);
  
  return (
    <PageTransition>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/countdown" component={CountdownPageNew} />
        <Route path="/home" component={Dashboard} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/categories" component={InsuranceCategoriesPage} />
        <Route path="/trip-info" component={TripInfoPage} />
        <Route path="/checkout/:planId" component={CheckoutPage} />
        <Route path="/weather-risk" component={WeatherRiskPage} />
        {/* Legacy routes - redirected to new paths */}
        <Route path="/auto-insurance" component={AutoInsuranceRedirect} />
        <Route path="/pet-insurance" component={PetInsuranceRedirect} />
        <Route path="/health-insurance" component={HealthInsuranceRedirect} />
        <Route path="/travel-insurance" component={TravelInsuranceRedirect} />
        <Route path="/insurance-plans" component={InsurancePlansRedirect} />
        
        {/* New insurance category routes (for authenticated app) */}
        <Route path="/insurance/travel" component={TravelInsurance} />
        <Route path="/insurance/auto" component={AutoInsurance} />
        <Route path="/insurance/pet" component={PetInsurance} />
        <Route path="/insurance/health" component={HealthInsurance} />
        {/* Use the fixed version of the comparison page */}
        <Route path="/compare-plans" component={ComparePlansFixed} />
        
        {/* Keep old version accessible for testing */}
        <Route path="/compare-plans-original" component={ComparePlansPage} />
        
        {/* Public-facing explore pages (for SEO and non-authenticated users) */}
        <Route path="/explore/travel" component={ExploreTravelInsurance} />
        <Route path="/explore/auto" component={ExploreAutoInsurance} />
        <Route path="/explore/pet" component={ExplorePetInsurance} />
        <Route path="/explore/health" component={ExploreHealthInsurance} />
        
        {/* Quote pages for each insurance category */}
        <Route path="/insurance/:category/quote" component={InsuranceQuote} />
        <Route path="/get-quote" component={GetQuotePage} />
        <Route path="/quote-confirmation" component={QuoteConfirmationPage} />
        <Route path="/quote-history" component={QuoteHistoryPage} />
        <Route path="/compare-plans-demo" component={ComparePlansDemo} />
        <Route path="/learn-more" component={LearnMorePage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/ai-assistant" component={AIAssistantDemo} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/api-settings" component={ApiSettingsPage} />
        <Route path="/assistant" component={AIAssistantScreen} />
        
        {/* Company/Partner Routes */}
        <Route path="/company" component={CompanyPage} />
        <Route path="/briki-pilot" component={BrikiPilotPortal} />
        <Route path="/company-login" component={CompanyLoginPage} />
        <Route path="/company-register" component={CompanyRegisterPage} />
        <Route path="/contact-sales" component={ContactSalesPage} />
        <Route path="/company-dashboard" component={CompanyDashboardPage} />
        <Route path="/company-dashboard/upload" component={CompanyUploadPage} />
        <Route path="/company-dashboard/analysis" component={CompanyAnalysisPage} />
        <Route path="/company-dashboard/marketplace" component={CompanyMarketplacePage} />
        <Route path="/company-dashboard/settings" component={CompanySettingsPage} />
        {/* Legacy routes */}
        <Route path="/company-dashboard/preview" component={CompanyPreviewPage} />
        <Route path="/company-dashboard/request-pilot" component={CompanyRequestPilotPage} />
        
        {/* New public site routes */}
        <Route path="/features" component={FeaturesPage} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/ask-briki" component={AskBrikiPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/forum" component={ForumPage} />
        <Route path="/careers" component={CareersPage} />
        <Route path="/color-palette" component={ColorPaletteDemo} />
        
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

/**
 * Component that wraps the Router with AI Assistant only when appropriate
 */
function AppContent() {
  const { location } = useNavigation();
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
      <AIAssistantProvider>
        <MainLayout>
          <Router />
        </MainLayout>
      </AIAssistantProvider>
    );
  }
  
  // Auth pages and B2B routes don't use MainLayout
  return <Router />;
}

function App() {
  // Initialize Google Analytics on app mount
  useEffect(() => {
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    } else {
      console.warn('Google Analytics Measurement ID not provided');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ColorProvider>
          <LanguageProvider>
            <RecentlyViewedProvider>
              <TooltipProvider>
                <Toaster />
                <AppContent />
              </TooltipProvider>
            </RecentlyViewedProvider>
          </LanguageProvider>
        </ColorProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
