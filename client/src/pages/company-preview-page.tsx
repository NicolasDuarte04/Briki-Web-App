import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import CompanyLayout from "@/components/layout/company-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, ArrowRight, Info, Award, Shield, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Sample plan data
const samplePlan = {
  name: "Premium Travel Protection",
  id: "TRVL-PREM-2023",
  type: "Travel Insurance",
  price: 89.99,
  coverage: 250000,
  description: "Comprehensive travel insurance covering medical expenses, trip cancellation, lost baggage, and emergency evacuation.",
  features: [
    "Medical Expenses",
    "Trip Cancellation",
    "Lost Baggage",
    "Emergency Evacuation",
    "24/7 Assistance"
  ]
};

// List of placement options
const placementOptions = [
  { id: "standard", name: "Standard Listing", price: "Included", highlighted: false },
  { id: "premium", name: "Premium Position", price: "$150/month", highlighted: true },
  { id: "featured", name: "Featured Banner", price: "$300/month", highlighted: true },
  { id: "ai-preferred", name: "AI Assistant Preferred", price: "$250/month", highlighted: true },
  { id: "category-top", name: "Category Top Placement", price: "$200/month", highlighted: true },
  { id: "bundle", name: "Complete Visibility Bundle", price: "$750/month", highlighted: true },
];

export default function CompanyPreviewPage() {
  const [selectedTab, setSelectedTab] = useState("standard-view");
  const [selectedPlacement, setSelectedPlacement] = useState("standard");
  const { toast } = useToast();
  
  return (
    <CompanyLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Placement Preview</h1>
          <p className="text-gray-600">See how your insurance plan would look in different parts of Briki</p>
        </div>
        
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <Info className="h-4 w-4" />
          <AlertTitle>Preview Mode</AlertTitle>
          <AlertDescription>
            This is a simulation showing how your insurance plans would appear in various placements throughout Briki.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preview tabs */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-white border-blue-100 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Preview</CardTitle>
                  <Tabs defaultValue={selectedTab} className="w-[400px]" onValueChange={setSelectedTab}>
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="standard-view">Standard</TabsTrigger>
                      <TabsTrigger value="compare-view">Compare</TabsTrigger>
                      <TabsTrigger value="ai-view">AI Assistant</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <CardDescription>
                  How users will see your plan in different sections
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {/* Standard view */}
                <TabsContent value="standard-view" className="mt-0">
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <div className="max-w-md mx-auto">
                      <Card className={`bg-white shadow border-blue-100 ${selectedPlacement !== "standard" ? "ring-2 ring-blue-500 relative" : ""}`}>
                        {selectedPlacement !== "standard" && (
                          <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                            {selectedPlacement === "premium" && "Premium Position"}
                            {selectedPlacement === "featured" && "Featured"}
                            {selectedPlacement === "category-top" && "Top Placement"}
                          </div>
                        )}
                        <CardHeader className="pb-2 border-b border-blue-50">
                          <div className="flex justify-between items-center">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                              {samplePlan.type}
                            </Badge>
                            <span className="text-xs text-gray-500">Plan ID: {samplePlan.id}</span>
                          </div>
                          <CardTitle className="mt-2">{samplePlan.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div>
                              <p className="text-gray-600 text-sm">{samplePlan.description}</p>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-500">Coverage Amount</div>
                              <div className="text-lg font-bold">${samplePlan.coverage.toLocaleString()}</div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-500 mb-2">Key Features</div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {samplePlan.features.map((feature, index) => (
                                  <div key={index} className="flex items-center">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t border-blue-50 pt-4 flex justify-between items-center">
                          <div className="text-2xl font-bold text-blue-600">${samplePlan.price}</div>
                          <Button>Get Quote</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Compare view */}
                <TabsContent value="compare-view" className="mt-0">
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <div className="flex flex-nowrap space-x-4 overflow-auto pb-2">
                      {/* Competitor Plan 1 */}
                      <Card className="bg-white shadow border-gray-200 min-w-[250px] max-w-[250px] opacity-70">
                        <CardHeader className="pb-2 border-b">
                          <Badge className="bg-gray-100 text-gray-800">
                            Travel Insurance
                          </Badge>
                          <CardTitle className="mt-2 text-base">Basic Travel Cover</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-gray-500">Coverage Amount</div>
                              <div className="text-base font-bold">$100,000</div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Key Features</div>
                              <div className="space-y-1 text-xs">
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                                  <span>Medical Expenses</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                                  <span>Trip Cancellation</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex justify-between items-center">
                          <div className="text-lg font-bold text-gray-600">$49.99</div>
                          <Button size="sm" variant="outline">Details</Button>
                        </CardFooter>
                      </Card>
                      
                      {/* Your Plan (Highlighted) */}
                      <Card className={`bg-white shadow min-w-[280px] max-w-[280px] ${selectedPlacement !== "standard" ? "ring-2 ring-blue-500 scale-105 relative" : "border-blue-100"}`}>
                        {selectedPlacement !== "standard" && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                            {selectedPlacement === "premium" && "Premium Position"}
                            {selectedPlacement === "featured" && "Featured Plan"}
                            {selectedPlacement === "category-top" && "Top Rated"}
                          </div>
                        )}
                        <CardHeader className="pb-2 border-b border-blue-50">
                          <Badge className="bg-blue-100 text-blue-800">
                            {samplePlan.type}
                          </Badge>
                          <CardTitle className="mt-2 text-base">{samplePlan.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-gray-500">Coverage Amount</div>
                              <div className="text-base font-bold">${samplePlan.coverage.toLocaleString()}</div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Key Features</div>
                              <div className="space-y-1 text-xs">
                                {samplePlan.features.slice(0, 4).map((feature, index) => (
                                  <div key={index} className="flex items-center">
                                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t border-blue-50 pt-3 flex justify-between items-center">
                          <div className="text-lg font-bold text-blue-600">${samplePlan.price}</div>
                          <Button size="sm">Get Quote</Button>
                        </CardFooter>
                      </Card>
                      
                      {/* Competitor Plan 2 */}
                      <Card className="bg-white shadow border-gray-200 min-w-[250px] max-w-[250px] opacity-70">
                        <CardHeader className="pb-2 border-b">
                          <Badge className="bg-gray-100 text-gray-800">
                            Travel Insurance
                          </Badge>
                          <CardTitle className="mt-2 text-base">Economy Travel Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-gray-500">Coverage Amount</div>
                              <div className="text-base font-bold">$150,000</div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Key Features</div>
                              <div className="space-y-1 text-xs">
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                                  <span>Medical Expenses</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                                  <span>Trip Cancellation</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                                  <span>Lost Baggage</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex justify-between items-center">
                          <div className="text-lg font-bold text-gray-600">$69.99</div>
                          <Button size="sm" variant="outline">Details</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                {/* AI Assistant view */}
                <TabsContent value="ai-view" className="mt-0">
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <div className="max-w-2xl mx-auto bg-slate-100 p-4 rounded-lg space-y-4">
                      {/* User question */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-gray-800">
                            I need a good travel insurance plan for my trip to Mexico for 2 weeks. What would you recommend?
                          </p>
                        </div>
                      </div>
                      
                      {/* AI response */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          B
                        </div>
                        <div className="flex-1">
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-gray-800">
                              Based on your 2-week trip to Mexico, I would recommend the <span className={`font-semibold ${selectedPlacement === 'ai-preferred' ? 'text-blue-600' : ''}`}>Premium Travel Protection</span> plan. This comprehensive plan provides:
                            </p>
                            <ul className="mt-2 space-y-1 text-gray-700">
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>$250,000 in medical coverage</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>Trip cancellation protection</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>Emergency evacuation</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>Lost baggage coverage</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>24/7 travel assistance</span>
                              </li>
                            </ul>
                            
                            {selectedPlacement === 'ai-preferred' && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center">
                                  <Award className="h-4 w-4 text-blue-600 mr-2" />
                                  <span className="text-blue-800 font-medium">AI Recommended Choice</span>
                                </div>
                                <p className="text-sm text-blue-700 mt-1">
                                  This plan offers the best value for your specific trip requirements to Mexico.
                                </p>
                              </div>
                            )}
                            
                            <p className="mt-3 text-gray-800">
                              At only $89.99 for your entire trip, it provides excellent coverage for Mexico where medical costs for tourists can be high.
                            </p>
                            
                            <div className="mt-3">
                              <Button className="w-full">
                                View Premium Travel Protection Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {selectedPlacement === 'featured' && (
                            <div className="mt-4 bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500">
                              <div className="flex items-center text-blue-700 mb-2">
                                <Shield className="h-4 w-4 mr-2" />
                                <span className="font-medium">Featured Plan</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Premium Travel Protection</p>
                                  <p className="text-sm text-gray-600">Complete coverage for international travel</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-blue-600">$89.99</p>
                                  <Button size="sm" className="mt-1">Get Quote</Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </div>
          
          {/* Placement options */}
          <div className="space-y-6">
            <Card className="bg-white border-blue-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Placement Options</CardTitle>
                <CardDescription>
                  Choose visibility options for your plans
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {placementOptions.map((option) => (
                    <div 
                      key={option.id}
                      className={`border rounded-lg p-3 hover:bg-blue-50 cursor-pointer transition-colors ${
                        selectedPlacement === option.id 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedPlacement(option.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{option.name}</h3>
                          <p className="text-sm text-gray-500">{option.price}</p>
                        </div>
                        {option.highlighted && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Enhanced
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={selectedPlacement === "standard" ? "outline" : "default"}
                  onClick={() => {
                    if (selectedPlacement !== "standard") {
                      toast({
                        title: "Premium Placement Selected",
                        description: `You've selected the ${
                          placementOptions.find(o => o.id === selectedPlacement)?.name
                        } option.`,
                      });
                    }
                  }}
                >
                  {selectedPlacement === "standard" 
                    ? "Continue with Standard Placement" 
                    : "Request Premium Placement"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white border-blue-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Stats & Benefits</CardTitle>
                <CardDescription>
                  Average performance improvements with premium placements
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Click-through Rate</span>
                    <span className="text-sm font-medium text-green-600">+127%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full w-[72%]"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="text-sm font-medium text-green-600">+86%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full w-[58%]"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quote Requests</span>
                    <span className="text-sm font-medium text-green-600">+152%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full w-[82%]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}