import { useEffect, useState } from "react";
import { InsurancePlan } from "../../../shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, X, ArrowLeft, Info, Star, Shield, DollarSign, CreditCard, Briefcase, MapPin, Calendar, AlertTriangle, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface CompareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: InsurancePlan[];
}

export default function CompareModal({ open, onOpenChange, plans }: CompareModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Format price as currency
  const formatPrice = (price: number | undefined) => {
    if (!price) return "Not Included";
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Determine best values for highlighting
  const [bestValues, setBestValues] = useState<Record<string, number>>({});
  const [differences, setDifferences] = useState<string[]>([]);

  useEffect(() => {
    if (plans.length > 0) {
      // Find the best values for each numeric field
      const bestMedical = Math.max(...plans.map(p => p.medicalCoverage));
      const bestBaggage = Math.max(...plans.map(p => p.baggageProtection));
      const bestEvacuation = Math.max(...plans.map(p => p.emergencyEvacuation || 0));
      const bestRental = Math.max(...plans.map(p => p.rentalCarCoverage || 0));
      const bestPrice = Math.min(...plans.map(p => p.basePrice));
      
      setBestValues({
        medicalCoverage: bestMedical,
        baggageProtection: bestBaggage,
        emergencyEvacuation: bestEvacuation,
        rentalCarCoverage: bestRental,
        basePrice: bestPrice
      });
      
      // Find key differences
      const diffs: string[] = [];
      
      // Check price differences
      const priceRange = Math.max(...plans.map(p => p.basePrice)) - Math.min(...plans.map(p => p.basePrice));
      if (priceRange > 15) {
        diffs.push("price");
      }
      
      // Check medical coverage differences
      const medicalDiff = Math.max(...plans.map(p => p.medicalCoverage)) - Math.min(...plans.map(p => p.medicalCoverage));
      if (medicalDiff > 50000) {
        diffs.push("medical");
      }
      
      // Check adventure activities
      const someHaveAdventure = plans.some(p => p.adventureActivities);
      const someNoAdventure = plans.some(p => !p.adventureActivities);
      if (someHaveAdventure && someNoAdventure) {
        diffs.push("adventure");
      }
      
      // Check trip cancellation differences
      const someHave100 = plans.some(p => p.tripCancellation.includes("100%"));
      const someNoHave100 = plans.some(p => !p.tripCancellation.includes("100%"));
      if (someHave100 && someNoHave100) {
        diffs.push("cancellation");
      }
      
      setDifferences(diffs);
    }
  }, [plans]);

  // iOS-style feature indicators
  const FeatureIndicator = ({ value, type }: { value: any; type: 'boolean' | 'price' | 'text' }) => {
    if (type === 'boolean') {
      return value ? 
        <div className="flex items-center">
          <span className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-3.5 w-3.5 text-green-600" />
          </span>
          <span className="ml-2 text-sm font-medium text-gray-700">Included</span>
        </div> :
        <div className="flex items-center">
          <span className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
            <X className="h-3.5 w-3.5 text-gray-600" />
          </span>
          <span className="ml-2 text-sm font-medium text-gray-400">Not included</span>
        </div>;
    }
    
    if (type === 'price') {
      return (
        <div className="text-sm font-medium text-gray-700">
          {value}
        </div>
      );
    }
    
    return (
      <div className="text-sm font-medium text-gray-700">
        {value}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md overflow-hidden rounded-xl sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <div className="px-5 pt-4">
          <div className="flex items-center justify-between mb-2">
            <button 
              className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-xl font-bold">Compare Plans</h2>
            <div className="w-8"></div> {/* Spacer to center the title */}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex bg-gray-100 p-1 rounded-xl mb-4">
              <TabsTrigger 
                value="overview" 
                className="flex-1 text-sm rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="flex-1 text-sm rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="differences" 
                className="flex-1 text-sm rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Key Differences
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-2 pb-6">
              <AnimatePresence>
                <div className="space-y-4">
                {plans.map((plan, index) => (
                  <motion.div 
                    key={plan.id} 
                    className="briki-card p-4 mb-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.1, 
                      ease: "easeOut" 
                    }}
                  >
                    <motion.div 
                      className="flex justify-between items-center mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    >
                      <div className="flex items-center">
                        <motion.div 
                          className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(var(--primary-rgb), 0.2)" }}
                        >
                          <Shield className="h-5 w-5 text-primary" />
                        </motion.div>
                        <div className="ml-3">
                          <h3 className="text-lg font-bold">{plan.name}</h3>
                          <div className="flex items-center space-x-1">
                            <motion.div
                              initial={{ rotate: -30, opacity: 0 }}
                              animate={{ rotate: 0, opacity: 1 }}
                              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                            >
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            </motion.div>
                            <span className="text-xs text-gray-500">{plan.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.div 
                          className="text-xl font-bold text-primary"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        >
                          ${plan.basePrice}
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="grid grid-cols-2 gap-3 mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      {/* Medical Coverage */}
                      <motion.div 
                        className="flex items-center"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                        whileHover={{ scale: 1.03, x: 2 }}
                      >
                        <motion.div 
                          className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center mr-2"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                        >
                          <Shield className="h-3.5 w-3.5 text-blue-500" />
                        </motion.div>
                        <div>
                          <div className="text-xs text-gray-500">Medical</div>
                          <div className="text-sm font-medium">{formatPrice(plan.medicalCoverage)}</div>
                        </div>
                      </motion.div>
                      
                      {/* Trip Cancellation */}
                      <motion.div 
                        className="flex items-center"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.45 + index * 0.05 }}
                        whileHover={{ scale: 1.03, x: -2 }}
                      >
                        <motion.div 
                          className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center mr-2"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                        >
                          <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        </motion.div>
                        <div>
                          <div className="text-xs text-gray-500">Cancellation</div>
                          <div className="text-sm font-medium">{plan.tripCancellation}</div>
                        </div>
                      </motion.div>
                      
                      {/* Baggage Protection */}
                      <motion.div 
                        className="flex items-center"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                        whileHover={{ scale: 1.03, x: 2 }}
                      >
                        <motion.div 
                          className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center mr-2"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                        >
                          <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                        </motion.div>
                        <div>
                          <div className="text-xs text-gray-500">Baggage</div>
                          <div className="text-sm font-medium">{formatPrice(plan.baggageProtection)}</div>
                        </div>
                      </motion.div>
                      
                      {/* Emergency Evacuation */}
                      <motion.div 
                        className="flex items-center"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.55 + index * 0.05 }}
                        whileHover={{ scale: 1.03, x: -2 }}
                      >
                        <motion.div 
                          className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center mr-2"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                        >
                          <AlertTriangle className="h-3.5 w-3.5 text-blue-500" />
                        </motion.div>
                        <div>
                          <div className="text-xs text-gray-500">Evacuation</div>
                          <div className="text-sm font-medium">{formatPrice(plan.emergencyEvacuation || undefined)}</div>
                        </div>
                      </motion.div>
                    </motion.div>
                    
                    {bestValues.basePrice === plan.basePrice && (
                      <div className="briki-badge briki-badge-success">Best Value</div>
                    )}
                    {bestValues.medicalCoverage === plan.medicalCoverage && (
                      <div className="briki-badge briki-badge-primary ml-2">Best Medical</div>
                    )}
                  </motion.div>
                ))}
                </div>
              </AnimatePresence>
            </TabsContent>
            
            <TabsContent value="details" className="pt-2 pb-6">
              <ScrollArea className="h-[60vh]">
                <div className="space-y-6">
                  <div className="briki-compare-table">
                    <div className="briki-compare-header">
                      <h3 className="font-semibold">Coverage Details</h3>
                    </div>
                    
                    <motion.div 
                      className="briki-compare-row"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.7)" }}
                    >
                      <motion.div 
                        className="briki-compare-label"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        Medical Coverage
                      </motion.div>
                      <div className="briki-compare-value">
                        {plans.map((plan, idx) => (
                          <motion.span 
                            key={plan.id} 
                            className={bestValues.medicalCoverage === plan.medicalCoverage ? "font-semibold text-primary" : ""}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
                            whileHover={bestValues.medicalCoverage === plan.medicalCoverage ? { scale: 1.05 } : {}}
                          >
                            {formatPrice(plan.medicalCoverage)}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                    
                    <div className="briki-compare-row">
                      <div className="briki-compare-label">Trip Cancellation</div>
                      <div className="briki-compare-value">
                        {plans.map(plan => (
                          <span key={plan.id} className={plan.tripCancellation.includes("100%") ? "font-semibold text-primary" : ""}>
                            {plan.tripCancellation}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="briki-compare-row">
                      <div className="briki-compare-label">Baggage Protection</div>
                      <div className="briki-compare-value">
                        {plans.map(plan => (
                          <span key={plan.id} className={bestValues.baggageProtection === plan.baggageProtection ? "font-semibold text-primary" : ""}>
                            {formatPrice(plan.baggageProtection)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="briki-compare-row">
                      <div className="briki-compare-label">Emergency Evacuation</div>
                      <div className="briki-compare-value">
                        {plans.map(plan => (
                          <span key={plan.id} className={bestValues.emergencyEvacuation === (plan.emergencyEvacuation || 0) ? "font-semibold text-primary" : ""}>
                            {formatPrice(plan.emergencyEvacuation || undefined)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="briki-compare-row">
                      <div className="briki-compare-label">Adventure Activities</div>
                      <div className="briki-compare-value">
                        {plans.map(plan => (
                          <span key={plan.id}>
                            {plan.adventureActivities ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="briki-compare-row">
                      <div className="briki-compare-label">Rental Car Coverage</div>
                      <div className="briki-compare-value">
                        {plans.map(plan => (
                          <span key={plan.id} className={plan.rentalCarCoverage && bestValues.rentalCarCoverage === plan.rentalCarCoverage ? "font-semibold text-primary" : ""}>
                            {plan.rentalCarCoverage ? formatPrice(plan.rentalCarCoverage) : "—"}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="briki-compare-table">
                    <div className="briki-compare-header">
                      <h3 className="font-semibold">Provider Details</h3>
                    </div>
                    
                    <div className="briki-compare-row">
                      <div className="briki-compare-label">Provider</div>
                      <div className="briki-compare-value">
                        {plans.map(plan => (
                          <span key={plan.id}>
                            {plan.provider}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="briki-compare-row">
                      <div className="briki-compare-label">Rating</div>
                      <div className="briki-compare-value">
                        {plans.map(plan => (
                          <span key={plan.id} className="flex items-center">
                            <Star className="h-3.5 w-3.5 fill-current text-yellow-400 mr-1" />
                            {plan.rating}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="briki-compare-row">
                      <div className="briki-compare-label">24/7 Assistance</div>
                      <div className="briki-compare-value">
                        {plans.map(plan => (
                          <span key={plan.id}>
                            <Check className="h-5 w-5 text-green-500" />
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="briki-compare-row">
                      <div className="briki-compare-label">Price</div>
                      <div className="briki-compare-value">
                        {plans.map(plan => (
                          <span key={plan.id} className={bestValues.basePrice === plan.basePrice ? "font-semibold text-primary" : ""}>
                            {formatPrice(plan.basePrice)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="differences" className="pt-2 pb-6">
              <ScrollArea className="h-[60vh]">
                <div className="space-y-5">
                  {differences.length === 0 ? (
                    <motion.div 
                      className="p-4 bg-gray-50 rounded-xl text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
                      >
                        <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      </motion.div>
                      <motion.p 
                        className="text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        These plans are similar in all key aspects.
                        Review the details tab for more specific comparisons.
                      </motion.p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {differences.includes("price") && (
                        <motion.div 
                          className="briki-compare-table"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <div className="p-4 bg-blue-50 rounded-t-xl">
                            <div className="flex items-center">
                              <DollarSign className="h-5 w-5 text-blue-500 mr-2" />
                              <h3 className="font-semibold text-blue-700">Price Difference</h3>
                            </div>
                            <p className="text-sm text-blue-600 mt-1">
                              There's a significant price difference between these plans.
                            </p>
                          </div>
                          
                          <div className="p-4">
                            <div className="space-y-3">
                              {plans.map((plan, idx) => (
                                <motion.div 
                                  key={plan.id} 
                                  className="flex justify-between items-center"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
                                >
                                  <span className="text-sm font-medium">{plan.name}</span>
                                  <span className={`text-sm ${bestValues.basePrice === plan.basePrice ? "font-bold text-green-600" : ""}`}>
                                    {formatPrice(plan.basePrice)}
                                    {bestValues.basePrice === plan.basePrice && " (Best)"}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {differences.includes("medical") && (
                        <motion.div 
                          className="briki-compare-table"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <div className="p-4 bg-green-50 rounded-t-xl">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-green-500 mr-2" />
                              <h3 className="font-semibold text-green-700">Medical Coverage Difference</h3>
                            </div>
                            <p className="text-sm text-green-600 mt-1">
                              Medical coverage amounts vary significantly between plans.
                            </p>
                          </div>
                          
                          <div className="p-4">
                            <div className="space-y-3">
                              {plans.map((plan, idx) => (
                                <motion.div 
                                  key={plan.id} 
                                  className="flex justify-between items-center"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                                >
                                  <span className="text-sm font-medium">{plan.name}</span>
                                  <span className={`text-sm ${bestValues.medicalCoverage === plan.medicalCoverage ? "font-bold text-green-600" : ""}`}>
                                    {formatPrice(plan.medicalCoverage)}
                                    {bestValues.medicalCoverage === plan.medicalCoverage && " (Best)"}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {differences.includes("adventure") && (
                        <motion.div 
                          className="briki-compare-table"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        >
                          <div className="p-4 bg-orange-50 rounded-t-xl">
                            <div className="flex items-center">
                              <MapPin className="h-5 w-5 text-orange-500 mr-2" />
                              <h3 className="font-semibold text-orange-700">Adventure Activities Coverage</h3>
                            </div>
                            <p className="text-sm text-orange-600 mt-1">
                              Some plans include adventure activities coverage, others don't.
                            </p>
                          </div>
                          
                          <div className="p-4">
                            <div className="space-y-3">
                              {plans.map((plan, idx) => (
                                <motion.div 
                                  key={plan.id} 
                                  className="flex justify-between items-center"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                                >
                                  <span className="text-sm font-medium">{plan.name}</span>
                                  <span className={`text-sm flex items-center ${plan.adventureActivities ? "text-green-600" : "text-red-500"}`}>
                                    {plan.adventureActivities ? (
                                      <>
                                        <Check className="h-4 w-4 mr-1" />
                                        Included
                                      </>
                                    ) : (
                                      <>
                                        <X className="h-4 w-4 mr-1" />
                                        Not included
                                      </>
                                    )}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {differences.includes("cancellation") && (
                        <motion.div 
                          className="briki-compare-table"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                        >
                          <div className="p-4 bg-purple-50 rounded-t-xl">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                              <h3 className="font-semibold text-purple-700">Trip Cancellation</h3>
                            </div>
                            <p className="text-sm text-purple-600 mt-1">
                              Trip cancellation coverage varies between plans.
                            </p>
                          </div>
                          
                          <div className="p-4">
                            <div className="space-y-3">
                              {plans.map((plan, idx) => (
                                <motion.div 
                                  key={plan.id} 
                                  className="flex justify-between items-center"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.5 + idx * 0.1 }}
                                >
                                  <span className="text-sm font-medium">{plan.name}</span>
                                  <span className={`text-sm ${plan.tripCancellation.includes("100%") ? "font-bold text-green-600" : ""}`}>
                                    {plan.tripCancellation}
                                    {plan.tripCancellation.includes("100%") && " (Best)"}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="px-5 py-4 border-t border-gray-100">
          <Button onClick={() => onOpenChange(false)} className="briki-button">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
