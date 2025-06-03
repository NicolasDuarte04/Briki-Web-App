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
import { useEffect, lazy, Suspense } from "react";
import { initGA, trackEvent } from "@/lib/analytics";
import { EventCategory } from "@/constants/analytics";
import { ColorProvider } from "@/contexts/color-context";
import { AnonymousUserProvider } from "@/contexts/anonymous-user-context";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/error-boundary";

// Core pages (loaded immediately)
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import DashboardRouter from "@/components/dashboard-router";
import AuthPage from "@/pages/AuthPage";

// Lazy-loaded pages for better performance
const TripInfoPage = lazy(() => import("@/pages/trip-info-page"));
const InsuranceCategoriesPage = lazy(() => import("@/pages/insurance-categories-page"));
const CheckoutPage = lazy(() => import("@/pages/checkout-page"));
const WeatherRiskPage = lazy(() => import("@/pages/weather-risk-page"));
const LearnMorePage = lazy(() => import("@/pages/learn-more-page"));
const TermsPage = lazy(() => import("@/pages/terms-page"));
const ProfilePage = lazy(() => import("@/pages/profile-page"));
const SettingsPage = lazy(() => import("@/pages/settings-page"));
const ApiSettingsPage = lazy(() => import("@/pages/api-settings-page"));
const ComparePlansFixed = lazy(() => import("@/pages/compare-plans-fixed"));

// Public site pages
const FeaturesPage = lazy(() => import("@/pages/features"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const AskBrikiPage = lazy(() => import("@/pages/ask-briki"));
const AskBrikiAIPage = lazy(() => import("@/pages/ask-briki-ai"));
const BlogPage = lazy(() => import("@/pages/blog"));
const BlogPostPage = lazy(() => import("@/pages/blog/[slug]"));
const ForumPage = lazy(() => import("@/pages/forum"));
const CareersPage = lazy(() => import("@/pages/careers"));
const ColorPaletteDemo = lazy(() => import("@/pages/color-palette-demo"));

// Insurance category pages
const TravelInsurance = lazy(() => import("@/pages/insurance/travel"));
const AutoInsurance = lazy(() => import("@/pages/insurance/auto"));
const PetInsurance = lazy(() => import("@/pages/insurance/pet"));
const HealthInsurance = lazy(() => import("@/pages/insurance/health"));

// Quote pages
const GetQuotePage = lazy(() => import("@/pages/get-quote"));
const QuoteConfirmationPage = lazy(() => import("@/pages/quote-confirmation"));
const QuoteHistoryPage = lazy(() => import("@/pages/quote-history"));
const InsuranceQuote = lazy(() => import("@/pages/insurance/[category]/quote"));

// Explore pages
const ExploreTravelInsurance = lazy(() => import("@/pages/explore/travel"));
const ExploreAutoInsurance = lazy(() => import("@/pages/explore/auto"));
const ExplorePetInsurance = lazy(() => import("@/pages/explore/pet"));
const ExploreHealthInsurance = lazy(() => import("@/pages/explore/health"));

// Company pages
const CompanyPage = lazy(() => import("@/pages/company-page"));
const CompanyLogin = lazy(() => import("@/pages/company-login"));
const CompanyRegister = lazy(() => import("@/pages/company-register"));
const CompanyDashboard = lazy(() => import("@/pages/company-dashboard"));
const CompanyUploadPage = lazy(() => import("@/pages/company-upload-page"));
const CompanyAnalysisPage = lazy(() => import("@/pages/company-analysis-page"));
const CompanyMarketplacePage = lazy(() => import("@/pages/company-marketplace-page"));
const CompanySettings = lazy(() => import("@/pages/company-settings-page"));
const CompanyPreviewPage = lazy(() => import("@/pages/company-preview-page"));
const CompanyRequestPilotPage = lazy(() => import("@/pages/company-request-pilot-page"));
const ContactSalesPage = lazy(() => import("@/pages/contact-sales-page"));
const CompanyPlans = lazy(() => import("@/pages/company-plans"));
const CompanyPlanEdit = lazy(() => import("@/pages/company-plan-edit"));
const CountdownPageNew = lazy(() => import("@/pages/countdown-page-new"));
const BrikiPilotPortal = lazy(() => import("@/pages/briki-pilot-portal"));

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

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center space-y-4">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-32 mx-auto" />
    </div>
  </div>
);

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
        <Route path="/countdown">
          <Suspense fallback={<PageLoader />}>
            <CountdownPageNew />
          </Suspense>
        </Route>
        <Route path="/home" component={DashboardRouter} />
        <Route path="/dashboard" component={DashboardRouter} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/categories">
          <Suspense fallback={<PageLoader />}>
            <InsuranceCategoriesPage />
          </Suspense>
        </Route>
        <Route path="/trip-info">
          <Suspense fallback={<PageLoader />}>
            <TripInfoPage />
          </Suspense>
        </Route>
        <Route path="/checkout/:planId">
          <Suspense fallback={<PageLoader />}>
            <CheckoutPage />
          </Suspense>
        </Route>
        <Route path="/weather-risk">
          <Suspense fallback={<PageLoader />}>
            <WeatherRiskPage />
          </Suspense>
        </Route>
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

        <Route path="/learn-more" component={LearnMorePage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/ai-assistant" component={() => {
          window.location.replace("/ask-briki-ai");
          return null;
        }} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/api-settings" component={ApiSettingsPage} />
        <Route path="/assistant" component={() => {
          window.location.replace("/ask-briki-ai");
          return null;
        }} />
        
        {/* Company/Partner Routes - Updated for consistency */}
        <Route path="/company" component={CompanyPage} />
        <Route path="/briki-pilot" component={BrikiPilotPortal} />
        <Route path="/company-login" component={CompanyLogin} />
        <Route path="/company-register" component={CompanyRegister} />
        
        {/* Backward compatibility redirects */}
        <Route path="/company-login-new" component={() => {
          window.location.replace("/company-login");
          return null;
        }} />
        <Route path="/company-register-new" component={() => {
          window.location.replace("/company-register");
          return null;
        }} />
        
        <Route path="/contact-sales" component={ContactSalesPage} />
        <Route path="/company-dashboard" component={CompanyDashboard} />
        
        {/* Redirect for legacy routes */}
        <Route path="/company-dashboard-redesigned" component={() => {
          window.location.replace("/company-dashboard");
          return null;
        }} />
        <Route path="/company-dashboard/upload" component={CompanyUploadPage} />
        <Route path="/company-dashboard/analysis" component={CompanyAnalysisPage} />
        <Route path="/company-dashboard/marketplace" component={CompanyMarketplacePage} />
        <Route path="/company-dashboard/settings" component={CompanySettings} />
        {/* Plan management routes */}
        <Route path="/company-plans" component={CompanyPlans} />
        <Route path="/company-plans/:id/edit" component={CompanyPlanEdit} />
        {/* Legacy routes */}
        <Route path="/company-dashboard/preview" component={CompanyPreviewPage} />
        <Route path="/company-dashboard/request-pilot" component={CompanyRequestPilotPage} />
        
        {/* New public site routes */}
        <Route path="/features" component={FeaturesPage} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/ask-briki" component={AskBrikiPage} />

        <Route path="/ask-briki-ai" component={AskBrikiAIPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/forum" component={ForumPage} />
        <Route path="/careers" component={CareersPage} />
        <Route path="/color-palette" component={ColorPaletteDemo} />
        
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}
function AppContent() {
  const { location } = useNavigation();
  const { user } = useAuth();

  // Marketing/public pages that should render as-is (no layout wrapper)
  const marketingRoutes = [
    '/features', 
    '/pricing', 
    '/ask-briki', 
    '/ask-briki-ai', 
    '/blog', 
    '/forum', 
    '/careers', 
    '/terms', 
    '/privacy', 
    '/contact',
    '/color-palette'
  ];

  // Check if current path is a marketing route
  const isMarketingRoute = marketingRoutes.some(route => 
    location === route || location.startsWith(`${route}/`)
  );

  // Public app routes that don't require authentication
  const publicAppRoutes = ['/trip-info', '/get-quote', '/dashboard', '/insurance'];
  const isPublicAppRoute = publicAppRoutes.some(path => 
    location === path || location.startsWith(path)
  );

  // List of paths where AI Assistant should NOT be provided
  const excludedPaths = ['/', '/auth', '/countdown', '/login', '/register', '/terms', '/learn-more', '/landing', '/ask-briki', '/ask-briki-ai'];
  const isExcludedPath = excludedPaths.some(path => 
    location === path || location.startsWith(`${path}/`)
  );

  // Debug logging for app render
  console.log("App render - Layout selection:", { 
    path: location, 
    isAuthenticated: !!user, 
    isExcludedPath,
    isPublicAppRoute,
    isMarketingRoute,
    shouldShowAI: (!!user || isPublicAppRoute) && !isExcludedPath
  });

  // Marketing routes render as-is (they have their own PublicLayout)
  if (isMarketingRoute) {
    return <Router />;
  }

  // For authenticated users on app pages - use AuthenticatedLayout with assistant
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

  // For public app routes - use MainLayout with limited assistant
  if (isPublicAppRoute) {
    return (
      <AIAssistantProvider>
        <MainLayout>
          <Router />
        </MainLayout>
      </AIAssistantProvider>
    );
  }

  // Use MainLayout for other B2C routes but not for auth pages
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
        <AnonymousUserProvider>
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
        </AnonymousUserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
