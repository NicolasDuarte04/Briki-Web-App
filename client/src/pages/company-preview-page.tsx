import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import CompanyLayout from "@/components/layout/company-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, ArrowRight, Info, Award, Shield, CheckCircle2, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white">Placement Preview</h1>
          <p className="text-gray-400">See how your insurance plan would look in different parts of Briki</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Alert className="bg-[#002050] border border-[#0074FF]/30 text-white">
            <Info className="h-4 w-4 text-[#33BFFF]" />
            <AlertTitle className="text-[#33BFFF] font-medium">Preview Mode</AlertTitle>
            <AlertDescription className="text-gray-300">
              This is a simulation showing how your insurance plans would appear in various placements throughout Briki.
            </AlertDescription>
          </Alert>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preview tabs */}
          <motion.div 
            className="md:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Preview</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  How users will see your plan in different sections
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {/* Using proper Tabs structure */}
                <Tabs defaultValue={selectedTab} className="w-full" onValueChange={setSelectedTab}>
                  <TabsList className="grid grid-cols-3 bg-[#002050] border border-[#003087] mb-6">
                    <TabsTrigger 
                      value="standard-view" 
                      className="data-[state=active]:bg-[#0055CC] data-[state=active]:text-white"
                    >
                      Standard
                    </TabsTrigger>
                    <TabsTrigger 
                      value="compare-view"
                      className="data-[state=active]:bg-[#0055CC] data-[state=active]:text-white"
                    >
                      Compare
                    </TabsTrigger>
                    <TabsTrigger 
                      value="ai-view"
                      className="data-[state=active]:bg-[#0055CC] data-[state=active]:text-white"
                    >
                      AI Assistant
                    </TabsTrigger>
                  </TabsList>
                  
                {/* Standard view */}
                <TabsContent value="standard-view" className="mt-0">
                  <div className="border rounded-lg p-6 bg-[#001E47]/70 border-[#002C7A]">
                    <div className="max-w-md mx-auto">
                      <Card className={`bg-[#001A40]/80 shadow border-[#002C7A] ${selectedPlacement !== "standard" ? "ring-2 ring-[#0074FF] relative" : ""}`}>
                        {selectedPlacement !== "standard" && (
                          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#003087] to-[#0074FF] text-white text-xs px-3 py-1 rounded-full shadow-[0_0_10px_rgba(51,191,255,0.3)]">
                            {selectedPlacement === "premium" && "Premium Position"}
                            {selectedPlacement === "featured" && "Featured"}
                            {selectedPlacement === "category-top" && "Top Placement"}
                            {selectedPlacement === "ai-preferred" && "AI Recommended"}
                          </div>
                        )}
                        <CardHeader className="pb-2 border-b border-[#002C7A]">
                          <div className="flex justify-between items-center">
                            <Badge className="bg-[#002C7A] text-[#33BFFF] hover:bg-[#003087] border border-[#0074FF]/30">
                              {samplePlan.type}
                            </Badge>
                            <span className="text-xs text-gray-400">Plan ID: {samplePlan.id}</span>
                          </div>
                          <CardTitle className="mt-2 text-white">{samplePlan.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div>
                              <p className="text-gray-300 text-sm">{samplePlan.description}</p>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-400">Coverage Amount</div>
                              <div className="text-lg font-bold text-white">${samplePlan.coverage.toLocaleString()}</div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-400 mb-2">Key Features</div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {samplePlan.features.map((feature, index) => (
                                  <div key={index} className="flex items-center">
                                    <CheckCircle2 className="h-4 w-4 text-[#33BFFF] mr-2" />
                                    <span className="text-gray-300">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t border-[#002C7A] pt-4 flex justify-between items-center">
                          <div className="text-2xl font-bold text-[#33BFFF]">${samplePlan.price}</div>
                          <Button className="bg-[#0074FF] hover:bg-[#0055CC] text-white">Get Quote</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Compare view */}
                <TabsContent value="compare-view" className="mt-0">
                  <div className="border rounded-lg p-6 bg-[#001E47]/70 border-[#002C7A]">
                    <div className="flex flex-nowrap space-x-4 overflow-auto pb-2">
                      {/* Competitor Plan 1 */}
                      <Card className="bg-[#001A40]/40 shadow border-[#002C7A]/50 min-w-[250px] max-w-[250px] opacity-70">
                        <CardHeader className="pb-2 border-b border-[#002C7A]/50">
                          <Badge className="bg-[#002C7A]/70 text-gray-300 border border-[#002C7A]">
                            Travel Insurance
                          </Badge>
                          <CardTitle className="mt-2 text-base text-gray-300">Basic Travel Cover</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-gray-400">Coverage Amount</div>
                              <div className="text-base font-bold text-gray-300">$100,000</div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Key Features</div>
                              <div className="space-y-1 text-xs">
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-gray-400">Medical Expenses</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-gray-400">Trip Cancellation</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t border-[#002C7A]/50 pt-3 flex justify-between items-center">
                          <div className="text-lg font-bold text-gray-400">$49.99</div>
                          <Button size="sm" variant="outline" className="text-gray-300 border-[#002C7A]">Details</Button>
                        </CardFooter>
                      </Card>
                      
                      {/* Your Plan (Highlighted) */}
                      <Card className={`bg-[#001A40]/80 shadow min-w-[280px] max-w-[280px] ${selectedPlacement !== "standard" ? "ring-2 ring-[#0074FF] scale-105 relative border-[#0074FF]/50" : "border-[#002C7A]"}`}>
                        {selectedPlacement !== "standard" && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#003087] to-[#0074FF] text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-[0_0_10px_rgba(51,191,255,0.3)]">
                            {selectedPlacement === "premium" && "Premium Position"}
                            {selectedPlacement === "featured" && "Featured Plan"}
                            {selectedPlacement === "category-top" && "Top Rated"}
                            {selectedPlacement === "ai-preferred" && "AI Recommended"}
                          </div>
                        )}
                        <CardHeader className="pb-2 border-b border-[#002C7A]">
                          <Badge className="bg-[#002C7A] text-[#33BFFF] hover:bg-[#003087] border border-[#0074FF]/30">
                            {samplePlan.type}
                          </Badge>
                          <CardTitle className="mt-2 text-base text-white">{samplePlan.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-gray-400">Coverage Amount</div>
                              <div className="text-base font-bold text-white">${samplePlan.coverage.toLocaleString()}</div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Key Features</div>
                              <div className="space-y-1 text-xs">
                                {samplePlan.features.slice(0, 4).map((feature, index) => (
                                  <div key={index} className="flex items-center">
                                    <CheckCircle2 className="h-3 w-3 text-[#33BFFF] mr-1" />
                                    <span className="text-gray-300">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t border-[#002C7A] pt-3 flex justify-between items-center">
                          <div className="text-lg font-bold text-[#33BFFF]">${samplePlan.price}</div>
                          <Button size="sm" className="bg-[#0074FF] hover:bg-[#0055CC] text-white">Get Quote</Button>
                        </CardFooter>
                      </Card>
                      
                      {/* Competitor Plan 2 */}
                      <Card className="bg-[#001A40]/40 shadow border-[#002C7A]/50 min-w-[250px] max-w-[250px] opacity-70">
                        <CardHeader className="pb-2 border-b border-[#002C7A]/50">
                          <Badge className="bg-[#002C7A]/70 text-gray-300 border border-[#002C7A]">
                            Travel Insurance
                          </Badge>
                          <CardTitle className="mt-2 text-base text-gray-300">Economy Travel Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-gray-400">Coverage Amount</div>
                              <div className="text-base font-bold text-gray-300">$150,000</div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Key Features</div>
                              <div className="space-y-1 text-xs">
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-gray-400">Medical Expenses</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-gray-400">Trip Cancellation</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-gray-400">Lost Baggage</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t border-[#002C7A]/50 pt-3 flex justify-between items-center">
                          <div className="text-lg font-bold text-gray-400">$69.99</div>
                          <Button size="sm" variant="outline" className="text-gray-300 border-[#002C7A]">Details</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                {/* AI Assistant view */}
                <TabsContent value="ai-view" className="mt-0">
                  <div className="border rounded-lg p-6 bg-[#001E47]/70 border-[#002C7A]">
                    <div className="max-w-2xl mx-auto bg-[#002050]/80 p-4 rounded-lg space-y-4 border border-[#002C7A]">
                      {/* User question */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#003087] flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-300" />
                        </div>
                        <div className="flex-1 bg-[#001A40] p-3 rounded-lg shadow-sm border border-[#002C7A]">
                          <p className="text-gray-300">
                            I need a good travel insurance plan for my trip to Mexico for 2 weeks. What would you recommend?
                          </p>
                        </div>
                      </div>
                      
                      {/* AI response */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#003087] to-[#0074FF] flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(51,191,255,0.3)]">
                          B
                        </div>
                        <div className="flex-1">
                          <div className="bg-[#001A40] p-3 rounded-lg shadow-sm border border-[#002C7A]">
                            <p className="text-gray-300">
                              Based on your 2-week trip to Mexico, I would recommend the <span className={`font-semibold ${selectedPlacement === "ai-preferred" ? "text-[#33BFFF]" : "text-white"}`}>Premium Travel Protection</span> plan:
                            </p>
                            
                            {/* Card preview in AI chat */}
                            <div className={`mt-4 p-4 bg-[#001E47] border ${selectedPlacement === "ai-preferred" ? "border-[#0074FF] ring-1 ring-[#0074FF]/30" : "border-[#002C7A]"} rounded-lg relative overflow-hidden`}>
                              {selectedPlacement === "ai-preferred" && (
                                <div className="absolute top-0 right-0">
                                  <Badge className="bg-gradient-to-r from-[#003087] to-[#0074FF] text-white border-none shadow-[0_0_10px_rgba(51,191,255,0.3)]">
                                    <Zap className="h-3 w-3 mr-1" />
                                    AI Recommended
                                  </Badge>
                                </div>
                              )}
                              <div className="flex justify-between items-start">
                                <div>
                                  <Badge className="bg-[#002C7A] text-[#33BFFF] border border-[#0074FF]/30 mb-2">
                                    {samplePlan.type}
                                  </Badge>
                                  <h3 className="font-bold text-white mb-1">{samplePlan.name}</h3>
                                  <div className="flex items-center text-xs text-gray-400 mb-2">
                                    <Shield className="h-3 w-3 mr-1 text-[#33BFFF]" />
                                    <span>${samplePlan.coverage.toLocaleString()} coverage</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {samplePlan.features.slice(0, 3).map((feature, i) => (
                                      <span key={i} className="text-xs bg-[#002C7A]/80 text-gray-300 px-2 py-0.5 rounded-full">
                                        {feature}
                                      </span>
                                    ))}
                                    <span className="text-xs bg-[#002C7A]/80 text-gray-300 px-2 py-0.5 rounded-full">
                                      +{samplePlan.features.length - 3} more
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-[#33BFFF]">${samplePlan.price}</div>
                                  <Button size="sm" className="mt-2 bg-[#0074FF] hover:bg-[#0055CC] text-white">
                                    View Plan
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <p className="mt-4 text-gray-300">
                              This plan offers comprehensive coverage for your Mexico trip, including medical expenses up to $250,000, trip cancellation, emergency evacuation, and 24/7 assistance - all essential for international travel. Would you like more details?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Placement options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)]">
              <CardHeader>
                <CardTitle className="text-white">Placement Options</CardTitle>
                <CardDescription className="text-gray-400">
                  Select different placement options to see how they look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue={selectedPlacement} 
                  onValueChange={setSelectedPlacement}
                  className="space-y-4"
                >
                  {placementOptions.map((option) => (
                    <div 
                      key={option.id}
                      className={`
                        flex items-center space-x-2 rounded-lg p-3 cursor-pointer transition-all duration-300
                        ${selectedPlacement === option.id ? 'bg-[#002C7A]/80 border border-[#0074FF]/30' : 'bg-[#001E47]/40 border border-[#002C7A]'}
                        ${option.highlighted ? 'hover:border-[#0074FF]/30' : 'hover:border-[#002C7A]'}
                      `}
                    >
                      <RadioGroupItem 
                        value={option.id} 
                        id={option.id}
                        className="text-[#33BFFF] border-[#0074FF]"
                      />
                      <div className="flex-1">
                        <Label 
                          htmlFor={option.id} 
                          className={`
                            text-base font-medium cursor-pointer
                            ${selectedPlacement === option.id ? 'text-white' : 'text-gray-300'}
                          `}
                        >
                          {option.name}
                        </Label>
                        <p 
                          className={`
                            text-sm
                            ${selectedPlacement === option.id ? 'text-[#33BFFF]' : 'text-gray-400'}
                          `}
                        >
                          {option.price}
                        </p>
                      </div>
                      {option.highlighted && (
                        <Badge 
                          className={`
                            ${selectedPlacement === option.id 
                              ? 'bg-[#0074FF] text-white' 
                              : 'bg-[#002C7A] text-[#33BFFF]'
                            } border border-[#0074FF]/30
                          `}
                        >
                          Recommended
                        </Badge>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-[#002C7A] pt-4">
                <Button className="bg-[#0074FF] hover:bg-[#0055CC] text-white">
                  Update Placement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </CompanyLayout>
  );
}