import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { User, Shield, FileText, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardAuthenticated() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.username) return user.username;
    return user?.email?.split('@')[0] || 'User';
  };

  // Quick action items for authenticated users
  const quickActions = [
    {
      title: "View Policies",
      description: "Manage your active insurance policies",
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      path: "/policies",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Submit Claim",
      description: "File a new insurance claim",
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      path: "/claims/new",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      title: "Account Settings",
      description: "Update your profile and preferences",
      icon: <Settings className="w-6 h-6 text-gray-600" />,
      path: "/settings",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full p-3">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {getUserName()}
                </h1>
                <p className="text-lg text-gray-600">
                  Manage your insurance policies and account
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/ask-briki')}
              className="hidden md:flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Get Help
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Coming soon notice */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-center text-white mb-12">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-4">Personalized Dashboard Coming Soon</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            We're building an enhanced dashboard experience just for you. Soon you'll be able to view your policies, 
            track claims, and get personalized insurance recommendations all in one place.
          </p>
          <Button 
            variant="secondary"
            onClick={() => navigate('/ask-briki')}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            Chat with AI Assistant
          </Button>
        </div>

        {/* Quick actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Card 
                key={action.title}
                className={`${action.bgColor} ${action.borderColor} border-2 hover:shadow-lg transition-all cursor-pointer group`}
                onClick={() => navigate(action.path)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-3">
                    {action.icon}
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-center">
                  <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                  <Button variant="ghost" size="sm" className="group-hover:bg-white/50">
                    Access
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Placeholder sections for future features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Policies overview placeholder */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Your Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Policy management features coming soon</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent activity placeholder */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Activity tracking features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}