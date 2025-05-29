import { useLocation } from "wouter";
import { BarChart3, Shield, Car, Plane, Heart, PawPrint } from "lucide-react";
import { useLanguage } from "@/components/language-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPublic() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  // Insurance categories for quick access
  const categories = [
    {
      id: "travel",
      title: "Travel Insurance",
      description: "Protection for your trips abroad",
      icon: <Plane className="w-8 h-8 text-blue-600" />,
      path: "/insurance/travel",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "auto",
      title: "Auto Insurance",
      description: "Comprehensive vehicle coverage",
      icon: <Car className="w-8 h-8 text-emerald-600" />,
      path: "/insurance/auto",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      id: "pet",
      title: "Pet Insurance",
      description: "Keep your furry friends healthy",
      icon: <PawPrint className="w-8 h-8 text-amber-600" />,
      path: "/insurance/pet",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      id: "health",
      title: "Health Insurance",
      description: "Essential medical coverage",
      icon: <Heart className="w-8 h-8 text-rose-600" />,
      path: "/insurance/health",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200"
    }
  ];

  // Main action buttons
  const mainActions = [
    {
      title: "Compare Plans",
      description: "Find the best insurance deals",
      path: "/compare-plans",
      variant: "default" as const
    },
    {
      title: "Get Quote",
      description: "Quick personalized quotes",
      path: "/get-quote",
      variant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Briki Insurance
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compare insurance plans, get personalized quotes, and find the perfect coverage for your needs.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Primary actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {mainActions.map((action) => (
            <Card key={action.title} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{action.title}</CardTitle>
                <p className="text-gray-600">{action.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  variant={action.variant}
                  className="w-full"
                  onClick={() => navigate(action.path)}
                >
                  {action.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insurance categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Choose Your Insurance Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`${category.bgColor} ${category.borderColor} border-2 hover:shadow-lg transition-all cursor-pointer group`}
                onClick={() => navigate(category.path)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-3">
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-center">
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <Button variant="ghost" size="sm" className="group-hover:bg-white/50">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Simple CTA section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Ready to Get Protected?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of customers who trust Briki for their insurance needs. 
            Get personalized recommendations in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/compare-plans')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Compare Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/get-quote')}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Get Quote
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}