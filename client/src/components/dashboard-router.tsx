import { useAuth } from "../hooks/use-auth";
import DashboardPublic from "../pages/dashboard-public";
import DashboardAuthenticated from "../pages/dashboard-authenticated";

export default function DashboardRouter() {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Route to appropriate dashboard based on authentication state
  return user ? <DashboardAuthenticated /> : <DashboardPublic />;
}