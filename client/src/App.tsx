import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import { useAuth } from "./hooks/use-auth";
import { LanguageProvider } from "./components/language-selector";
import { PageTransition } from "./components/ui/transition-effect";
import { AIAssistantProvider, MainLayout } from "./components/layout";
import { useNavigation } from "./lib/navigation";
import { useAnalytics } from "./hooks/use-analytics";
import { useEffect } from "react";
import { initGA, trackEvent } from "./lib/analytics";
import { EventCategory } from "./constants/analytics";
import { ColorProvider } from "./contexts/color-context";
import { AnonymousUserProvider } from "./contexts/anonymous-user-context";
import { Analytics } from '@vercel/analytics/react';

import NotFound from "./pages/not-found";
import LandingPage from "./pages/landing-page";

// Import authentication
import AuthPage from "./pages/auth/AuthPage";
import TestAuthPage from "./pages/test-auth";

// Import user pages
import ProfilePage from "./pages/profile-page";
import SettingsPage from "./pages/settings-page";

// Import marketing pages
import FeaturesPage from "./pages/features";
import PricingPage from "./pages/pricing";
import AskBrikiPage from "./pages/ask-briki";
import AskBrikiAIPage from "./pages/ask-briki-ai";
import BlogPage from "./pages/blog";
import BlogPostPage from "./pages/blog/[slug]";
import ForumPage from "./pages/forum";
import CareersPage from "./pages/careers";
import LearnMorePage from "./pages/learn-more-page";
import TermsPage from "./pages/terms-page";

// Import SEO/explore pages
import ExploreTravelInsurance from "./pages/explore/travel";
import ExploreAutoInsurance from "./pages/explore/auto";
import ExplorePetInsurance from "./pages/explore/pet";
import ExploreHealthInsurance from "./pages/explore/health";

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
        {/* Core pages */}
        <Route path="/" component={LandingPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/test-auth" component={TestAuthPage} />
        <Route path="/ask-briki-ai" component={AskBrikiAIPage} />
        
        {/* Auth redirects */}
        <Route path="/sign-in" component={() => {
          window.location.replace("/auth");
          return null;
        }} />
        <Route path="/sign-up" component={() => {
          window.location.replace("/auth");
          return null;
        }} />
        <Route path="/ai-assistant" component={() => {
          window.location.replace("/ask-briki-ai");
          return null;
        }} />
        <Route path="/assistant" component={() => {
          window.location.replace("/ask-briki-ai");
          return null;
        }} />
        
        {/* User pages */}
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
        
        {/* Marketing pages */}
        <Route path="/features" component={FeaturesPage} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/ask-briki" component={AskBrikiPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/forum" component={ForumPage} />
        <Route path="/careers" component={CareersPage} />
        <Route path="/learn-more" component={LearnMorePage} />
        <Route path="/terms" component={TermsPage} />
        
        {/* SEO/Explore pages */}
        <Route path="/explore/travel" component={ExploreTravelInsurance} />
        <Route path="/explore/auto" component={ExploreAutoInsurance} />
        <Route path="/explore/pet" component={ExplorePetInsurance} />
        <Route path="/explore/health" component={ExploreHealthInsurance} />
        
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
    '/ask-briki-ai',  // AI Assistant should be standalone
    '/blog', 
    '/forum', 
    '/careers', 
    '/terms', 
    '/learn-more',
    '/privacy'
  ];

  // Check if current path is a marketing route
  const isMarketingRoute = marketingRoutes.some(route => 
    location === route || location.startsWith(`${route}/`)
  );

  // List of paths where AI Assistant should NOT be provided
  const excludedPaths = ['/', '/auth', '/login', '/register', '/terms', '/learn-more', '/ask-briki', '/ask-briki-ai'];
  const isExcludedPath = excludedPaths.some(path => 
    location === path || location.startsWith(`${path}/`)
  );

  // Debug logging for app render
  console.log("App render - Layout selection:", { 
    path: location, 
    isAuthenticated: !!user, 
    isExcludedPath,
    isMarketingRoute
  });

  // Marketing routes and AI assistant render as-is (they have their own layout)
  if (isMarketingRoute) {
    return <Router />;
  }

  // For landing page, just render the Router directly (it has its own layout)
  if (location === '/') {
    return <Router />;
  }

  // For explore pages, render the Router directly (they have their own self-contained layout)
  if (location.startsWith('/explore')) {
    return <Router />;
  }

  // For authenticated users on profile/settings - use MainLayout
  if (user && (location === '/profile' || location === '/settings')) {
    return (
      <AIAssistantProvider>
        <MainLayout>
          <Router />
        </MainLayout>
      </AIAssistantProvider>
    );
  }

  // Auth pages don't use MainLayout
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
      <SupabaseAuthProvider>
        <AnonymousUserProvider>
          <ColorProvider>
            <LanguageProvider>
              <TooltipProvider>
                <AppContent />
                <Analytics />
              </TooltipProvider>
            </LanguageProvider>
          </ColorProvider>
        </AnonymousUserProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
