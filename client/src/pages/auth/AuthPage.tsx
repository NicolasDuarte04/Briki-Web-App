import React, { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "../../hooks/use-auth";
import UnifiedAuthForm from "../../components/auth/UnifiedAuthForm";
import { PublicLayout } from "../../components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { LoaderCircle } from "lucide-react";

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const [, params] = useRoute<{ tab?: string }>("/auth/:tab?");
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // Get returnTo parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const returnTo = urlParams.get('returnTo');
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check for quote intent after successful auth
      const quoteIntentPlanId = sessionStorage.getItem('quoteIntentPlanId');
      if (quoteIntentPlanId) {
        sessionStorage.removeItem('quoteIntentPlanId');
        navigate(`/cotizar/${quoteIntentPlanId}`);
      } else if (returnTo) {
        navigate(returnTo);
      } else {
        // Let the auth hook handle role-based redirection
        navigate("/profile");
      }
    }
  }, [isLoading, isAuthenticated, navigate, returnTo]);
  
  // Show loading state
  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }
  
  const isSignup = params?.tab === "signup";
  
  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">B</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isSignup ? "Crea tu cuenta" : "Inicia sesión"}
            </h1>
            <p className="mt-2 text-gray-600">
              {isSignup 
                ? "Únete a Briki para comparar seguros fácilmente" 
                : "Bienvenido de vuelta a Briki"}
            </p>
          </div>
          
          {/* Auth Form Card */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <UnifiedAuthForm 
                mode={isSignup ? "signup" : "login"} 
                onSuccess={() => {
                  // Check for quote intent after successful auth
                  const quoteIntentPlanId = sessionStorage.getItem('quoteIntentPlanId');
                  if (quoteIntentPlanId) {
                    sessionStorage.removeItem('quoteIntentPlanId');
                    navigate(`/cotizar/${quoteIntentPlanId}`);
                  } else if (returnTo) {
                    navigate(returnTo);
                  } else {
                    // Let the auth hook handle role-based redirection
                  }
                }}
              />
            </CardContent>
          </Card>
          
          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Al continuar, aceptas nuestros{" "}
              <a href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
                Términos de Servicio
              </a>{" "}
              y{" "}
              <a href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
                Política de Privacidad
              </a>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}