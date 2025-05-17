import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, DownloadCloud, Send, Info, Printer } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { InsurancePlan } from "@/store/compare-store";
import { generatePlanInsights, PlanInsight } from "@/utils/ai-insights";
import { PlanInsightTag } from "@/components/plans/PlanInsightTag";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function QuoteSummary() {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const { toast } = useToast();
  const [plan, setPlan] = useState<InsurancePlan | null>(null);
  const [category, setCategory] = useState<string>("travel");
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [insights, setInsights] = useState<PlanInsight[]>([]);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const summaryCardRef = useRef<HTMLDivElement>(null);
  
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
      
      // Generate mock comparison plans to enable AI insights
      const mockComparisonPlans: InsurancePlan[] = [
        mockPlan,
        {
          id: "economy-plan",
          name: "Economy Plan",
          category: category,
          provider: "Budget Insurance",
          price: mockPlan.price * 0.7,
          features: mockPlan.features.slice(0, Math.max(1, mockPlan.features.length - 2)),
          description: "Basic coverage for essential needs only.",
          coverage: {
            medical: "$50,000",
            emergency: "$25,000",
            baggage: "$1,000",
            cancellation: "75% of trip cost"
          }
        },
        {
          id: "premium-plan",
          name: "Premium Gold Plan",
          category: category,
          provider: "Premium Protection Co.",
          price: mockPlan.price * 1.8,
          features: [
            ...mockPlan.features,
            "Premium 24/7 Concierge",
            "Luxury Transportation Upgrade",
            "VIP Medical Services"
          ],
          description: "The highest level of coverage and service for discerning travelers.",
          coverage: {
            medical: "$250,000",
            emergency: "$100,000",
            baggage: "$5,000",
            cancellation: "125% of trip cost",
            delay: "$2,000",
            evacuation: "Unlimited"
          }
        }
      ];
      
      // Generate AI insights for this plan
      const planInsights = generatePlanInsights(mockPlan, mockComparisonPlans);
      setInsights(planInsights);
    }
  }, [location, category]);
  
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
  
  const handleDownloadQuote = async () => {
    if (!plan || !summaryCardRef.current) return;
    
    try {
      setIsPdfGenerating(true);
      
      // Generate PDF from the summary card
      const canvas = await html2canvas(summaryCardRef.current, {
        scale: 2, // Better resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate dimensions to fit the image properly on the PDF
      const imgWidth = 210 - 40; // A4 width minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add Briki header
      pdf.setFontSize(22);
      pdf.setTextColor(41, 98, 255); // Primary blue color
      pdf.text('Briki Insurance', 20, 20);
      
      // Add quote reference number
      const referenceNumber = `BRK-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Reference: ${referenceNumber}`, 20, 30);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 35);
      
      // Add image of the card
      pdf.addImage(imgData, 'PNG', 20, 45, imgWidth, imgHeight);
      
      // Add footer
      const pageHeight = pdf.internal.pageSize.height;
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      pdf.text('This quote is valid for 30 days from the issue date. Terms and conditions apply.', 20, pageHeight - 10);
      
      // Category-specific disclaimer based on insurance type
      let disclaimer = '';
      switch(category) {
        case 'travel':
          disclaimer = 'Travel insurance requires verification of travel dates and destination prior to activation.';
          break;
        case 'auto':
          disclaimer = 'Auto insurance requires vehicle inspection and documentation verification.';
          break;
        case 'health':
          disclaimer = 'Health insurance may require medical history disclosure and examination.';
          break;
        case 'pet':
          disclaimer = 'Pet insurance requires verification of pet age and health status.';
          break;
        default:
          disclaimer = 'Insurance coverage is subject to underwriting and approval.';
      }
      
      pdf.text(disclaimer, 20, pageHeight - 15);
      
      // Save the PDF
      pdf.save(`Briki_${category}_insurance_quote_${referenceNumber}.pdf`);
      
      toast({
        title: "Quote downloaded",
        description: "Your quote details have been saved as a PDF.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Download failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPdfGenerating(false);
    }
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
              <Card className="mb-6" ref={summaryCardRef}>
                <CardHeader className="border-b bg-primary/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>
                        Provided by {plan.provider || "Insurance Provider"} • {plan.category.charAt(0).toUpperCase() + plan.category.slice(1)} Insurance
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end text-right">
                      <span className="text-sm text-muted-foreground">Quote ID</span>
                      <span className="font-medium">BRK-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
                      <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Display AI insights for this plan */}
                  {insights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {insights.map((insight, index) => (
                        <PlanInsightTag 
                          key={index} 
                          tag={insight.tag} 
                          reason={insight.reason} 
                          showTooltip={true} 
                        />
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2 text-primary">Plan Description</h3>
                      <p className="text-muted-foreground">{plan.description}</p>
                      
                      <h3 className="font-medium mb-2 mt-6 text-primary">Key Features</h3>
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
                      <h3 className="font-medium mb-3 text-primary">Coverage Details</h3>
                      <div className="space-y-3 bg-slate-50 p-4 rounded-md">
                        {plan.coverage ? (
                          Object.entries(plan.coverage).map(([key, value], index) => (
                            <div key={index} className="flex justify-between border-b pb-2">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                              <span className="font-semibold">{value}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">Coverage details not available</p>
                        )}
                      </div>
                      
                      {/* Category-specific variables */}
                      {category === 'travel' && (
                        <div className="mt-4 bg-primary/5 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Travel-Specific Coverage</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Trip Cancellation:</span>
                              <span className="font-medium">Up to 100% of trip cost</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Adventure Sports Coverage:</span>
                              <span className="font-medium">Included</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {category === 'auto' && (
                        <div className="mt-4 bg-primary/5 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Auto-Specific Coverage</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Collision Deductible:</span>
                              <span className="font-medium">$500</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Roadside Assistance:</span>
                              <span className="font-medium">Included</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {category === 'health' && (
                        <div className="mt-4 bg-primary/5 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Health-Specific Coverage</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Annual Deductible:</span>
                              <span className="font-medium">$1,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Telemedicine:</span>
                              <span className="font-medium">Included</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {category === 'pet' && (
                        <div className="mt-4 bg-primary/5 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Pet-Specific Coverage</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Exam Fees:</span>
                              <span className="font-medium">Covered</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Wellness Add-on:</span>
                              <span className="font-medium">Available</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">Monthly Premium</span>
                      <span className="text-2xl font-bold">${plan.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Per month, billed annually. Taxes may apply in your region.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-slate-50 border-t">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="gap-1"
                      title="Print quote details"
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadQuote}
                      disabled={isPdfGenerating}
                      className="gap-1"
                      title="Download quote as PDF"
                    >
                      <DownloadCloud className="h-4 w-4" />
                      {isPdfGenerating ? 'Generating...' : 'Download PDF'}
                    </Button>
                  </div>
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