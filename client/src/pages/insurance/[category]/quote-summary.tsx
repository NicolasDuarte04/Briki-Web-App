import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, DownloadCloud, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { InsurancePlan } from "@/store/compare-store";

export default function QuoteSummary() {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const { toast } = useToast();
  const [plan, setPlan] = useState<InsurancePlan | null>(null);
  const [category, setCategory] = useState<string>("travel");
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Extract category from URL (e.g., /insurance/travel/quote-summary)
    const pathParts = location.split('/');
    if (pathParts.length >= 3) {
      setCategory(pathParts[2]);
    }
    
    // Extract plan data from query params or localStorage
    const queryParams = new URLSearchParams(window.location.search);
    const planId = queryParams.get('planId');
    
    if (planId) {
      // In a real app, we'd fetch plan details from API
      // For now, let's create mock data based on the ID
      const mockPlan: InsurancePlan = {
        id: planId,
        name: `${planId.charAt(0).toUpperCase() + planId.slice(1).replace(/-/g, ' ')} Plan`,
        category: category,
        provider: "Briki Insurance Partners",
        price: Math.floor(Math.random() * 100) + 50,
        description: "This plan offers comprehensive coverage tailored to your needs.",
        features: [
          "24/7 Emergency Assistance",
          "Medical Coverage",
          "Trip Cancellation",
          "Lost Baggage Protection"
        ],
        coverage: {
          medical: "$100,000",
          emergency: "$50,000",
          baggage: "$2,000",
          cancellation: "100% of trip cost"
        }
      };
      
      setPlan(mockPlan);
    }
  }, [location]);
  
  const handleGoBack = () => {
    navigate(`/insurance/${category}/quote?planId=${plan?.id}`);
  };
  
  const handleSubmitQuote = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionComplete(true);
      
      toast({
        title: "Quote submitted successfully!",
        description: "We've received your request and will contact you shortly.",
      });
    }, 1500);
  };
  
  const handleDownloadQuote = () => {
    toast({
      title: "Quote downloaded",
      description: "Your quote details have been saved as a PDF.",
    });
  };
  
  const handleReturnHome = () => {
    navigate(`/insurance/${category}`);
  };
  
  if (!plan) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-12 px-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No plan selected. Please select a plan first.</p>
              <Button onClick={() => navigate(`/insurance/${category}`)} className="mt-4">
                Browse Plans
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container max-w-4xl py-8 px-4 md:py-12">
        {!submissionComplete ? (
          <>
            <div className="mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 gap-1"
                onClick={handleGoBack}
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold tracking-tight">Quote Summary</h1>
                <p className="text-muted-foreground mt-2">
                  Review your selected plan details before proceeding with your quote request.
                </p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    Provided by {plan.provider || "Insurance Provider"} • {plan.category.charAt(0).toUpperCase() + plan.category.slice(1)} Insurance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Plan Description</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Key Features</h3>
                      <ul className="space-y-1">
                        {plan.features ? (
                          plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              {feature}
                            </li>
                          ))
                        ) : (
                          <li className="text-muted-foreground">Features information not available</li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Coverage Details</h3>
                      {plan.coverage ? (
                        <div className="space-y-1 text-sm">
                          {Object.entries(plan.coverage).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Coverage details not available</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Premium:</span>
                      <span className="text-xl font-bold text-primary">${plan.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Per month, billed annually. Taxes may apply.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={handleSubmitQuote} 
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>Processing<span className="animate-pulse">...</span></>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Quote Request
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="text-center py-8">
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">Quote Request Submitted!</h1>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Thank you for your interest in {plan.name}. Your quote request has been 
                    received and our team will process it shortly.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Reference Number</h3>
                  <p className="bg-muted px-4 py-2 rounded-md font-mono inline-block">
                    BRK-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                  </p>
                </div>
                
                <div className="pt-4 space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadQuote}
                    className="gap-2"
                  >
                    <DownloadCloud className="h-4 w-4" />
                    Download Quote Details
                  </Button>
                  
                  <div>
                    <Button onClick={handleReturnHome}>
                      Return to Insurance Plans
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}