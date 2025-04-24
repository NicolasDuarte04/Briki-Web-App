import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";
import { useEffect } from "react";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading, refetchUser } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // If not loading and no user, try to refetch once before redirecting
    if (!isLoading && !user) {
      refetchUser().then((result) => {
        // No need to navigate here, the component will re-render with the updated user state
      }).catch(() => {
        // Only navigate on error to prevent double redirects
        navigate("/auth");
      });
    }
  }, [user, isLoading, refetchUser, navigate]);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
