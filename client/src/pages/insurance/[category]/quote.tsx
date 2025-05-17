import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigation } from "@/hooks/use-navigation";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ClipboardCheck, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { InsuranceCategory } from "@/components/plans/PlanCard";

export default function InsuranceQuote() {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const { goBack } = useNavigation();
  const [planId, setPlanId] = useState<string | null>(null);
  const [category, setCategory] = useState<InsuranceCategory>("travel");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Extract category from URL (e.g., /insurance/travel/quote)
    const pathParts = location.split('/');
    if (pathParts.length >= 3) {
      const extractedCategory = pathParts[2] as InsuranceCategory;
      setCategory(extractedCategory);
    }
    
    // Extract planId from query string if present
    const queryParams = new URLSearchParams(window.location.search);
    const extractedPlanId = queryParams.get('planId');
    if (extractedPlanId) {
      setPlanId(extractedPlanId);
    }
  }, [location]);

  const getCategoryTitle = (): string => {
    switch (category) {
      case "travel":
        return "Travel Insurance Quote";
      case "auto":
        return "Auto Insurance Quote";
      case "pet":
        return "Pet Insurance Quote";
      case "health":
        return "Health Insurance Quote";
      default:
        return "Insurance Quote";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission and redirect to quote summary
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/insurance/${category}/quote-summary?planId=${planId}`);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8 px-4 md:py-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-1"
            onClick={goBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">{getCategoryTitle()}</h1>
            <p className="text-muted-foreground mt-2">
              Complete the form below to get a personalized quote for your insurance needs.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {planId ? "Selected Plan Quote" : "Request Quote"}
              </CardTitle>
              <CardDescription>
                {planId
                  ? `You're requesting a quote for plan ${planId}`
                  : "Fill out the information to get your personalized quote"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <ClipboardCheck className="h-16 w-16 text-primary opacity-80" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Quote Request Form</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    This feature is currently under development. In the future, you'll be able to
                    get personalized quotes instantly.
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>Processing<span className="animate-pulse">...</span></>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}