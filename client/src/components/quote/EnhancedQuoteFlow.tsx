import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Shield, Clock, Users, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { InsurancePlan } from "@/types/insurance";

interface QuoteFormData {
  age: string;
  destination: string;
  tripDuration: string;
  travelers: string;
  tripValue: string;
  preExistingConditions: boolean;
  hazardousActivities: boolean;
  coverage: string[];
  addOns: string[];
}

interface EnhancedQuoteFlowProps {
  selectedPlan: InsurancePlan;
  onQuoteGenerated: (quote: any) => void;
  onCancel: () => void;
}

export function EnhancedQuoteFlow({ selectedPlan, onQuoteGenerated, onCancel }: EnhancedQuoteFlowProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    age: "",
    destination: "",
    tripDuration: "",
    travelers: "1",
    tripValue: "",
    preExistingConditions: false,
    hazardousActivities: false,
    coverage: [],
    addOns: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // Calculate real-time price based on form inputs
  const calculateEstimatedPrice = useMemo(() => {
    let basePrice = selectedPlan.basePrice || 100;
    let multiplier = 1;

    // Age multiplier
    const age = parseInt(formData.age);
    if (age > 65) multiplier += 0.4;
    else if (age > 45) multiplier += 0.2;

    // Trip duration multiplier
    const duration = parseInt(formData.tripDuration);
    if (duration > 30) multiplier += 0.3;
    else if (duration > 14) multiplier += 0.15;

    // Travelers multiplier
    const travelers = parseInt(formData.travelers);
    multiplier *= travelers;

    // Pre-existing conditions
    if (formData.preExistingConditions) multiplier += 0.25;

    // Hazardous activities
    if (formData.hazardousActivities) multiplier += 0.35;

    // Trip value impact
    const tripValue = parseInt(formData.tripValue) || 0;
    if (tripValue > 10000) multiplier += 0.1;

    // Add-ons
    formData.addOns.forEach(addon => {
      switch (addon) {
        case 'rental-car': multiplier += 0.15; break;
        case 'sports': multiplier += 0.2; break;
        case 'electronics': multiplier += 0.1; break;
        case 'cancel-any-reason': multiplier += 0.3; break;
      }
    });

    return Math.round(basePrice * multiplier);
  }, [formData, selectedPlan]);

  useEffect(() => {
    setEstimatedPrice(calculateEstimatedPrice);
  }, [calculateEstimatedPrice]);

  const updateFormData = (field: keyof QuoteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: 'coverage' | 'addOns', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const getAdaptiveFields = () => {
    const fields = [];
    
    // Always show basic fields
    fields.push('basic');
    
    // Show destination-specific fields based on plan features
    if (selectedPlan.features?.some(f => f.toLowerCase().includes('international'))) {
      fields.push('international');
    }
    
    // Show medical fields if medical coverage is included
    if (selectedPlan.features?.some(f => f.toLowerCase().includes('medical'))) {
      fields.push('medical');
    }
    
    // Show sports fields if adventure coverage is available
    if (selectedPlan.features?.some(f => f.toLowerCase().includes('sports') || f.toLowerCase().includes('adventure'))) {
      fields.push('sports');
    }
    
    return fields;
  };

  const availableAddOns = [
    { id: 'rental-car', label: 'Rental Car Coverage', price: 25 },
    { id: 'sports', label: 'Adventure Sports', price: 40 },
    { id: 'electronics', label: 'Electronics Protection', price: 15 },
    { id: 'cancel-any-reason', label: 'Cancel for Any Reason', price: 60 }
  ];

  const handleSubmit = () => {
    const quote = {
      planId: selectedPlan.planId,
      planName: selectedPlan.name,
      basePrice: selectedPlan.basePrice,
      estimatedPrice,
      formData,
      generatedAt: new Date().toISOString()
    };
    
    onQuoteGenerated(quote);
  };

  const renderStep = () => {
    const adaptiveFields = getAdaptiveFields();
    
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Your Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <Label htmlFor="travelers">Number of Travelers</Label>
                <Select value={formData.travelers} onValueChange={(value) => updateFormData('travelers', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} traveler{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => updateFormData('destination', e.target.value)}
                  placeholder="Where are you traveling?"
                />
              </div>
              <div>
                <Label htmlFor="duration">Trip Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.tripDuration}
                  onChange={(e) => updateFormData('tripDuration', e.target.value)}
                  placeholder="Number of days"
                />
              </div>
            </div>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="tripValue">Trip Value ($)</Label>
              <Input
                id="tripValue"
                type="number"
                value={formData.tripValue}
                onChange={(e) => updateFormData('tripValue', e.target.value)}
                placeholder="Total cost of your trip"
              />
            </div>
            
            {adaptiveFields.includes('medical') && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Medical Information</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preExisting"
                    checked={formData.preExistingConditions}
                    onCheckedChange={(checked) => updateFormData('preExistingConditions', checked)}
                  />
                  <Label htmlFor="preExisting">I have pre-existing medical conditions</Label>
                </div>
              </div>
            )}
            
            {adaptiveFields.includes('sports') && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hazardous"
                  checked={formData.hazardousActivities}
                  onCheckedChange={(checked) => updateFormData('hazardousActivities', checked)}
                />
                <Label htmlFor="hazardous">I plan to participate in adventure sports</Label>
              </div>
            )}
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Optional Add-ons</h3>
              <div className="space-y-3">
                {availableAddOns.map(addon => (
                  <div key={addon.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={formData.addOns.includes(addon.id)}
                        onCheckedChange={() => toggleArrayField('addOns', addon.id)}
                      />
                      <div>
                        <Label className="font-medium">{addon.label}</Label>
                        <p className="text-sm text-gray-600">Additional ${addon.price}</p>
                      </div>
                    </div>
                    <Badge variant="outline">${addon.price}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Get Your Quote
              </CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Step {currentStep} of 3</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
              
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onCancel()}
                >
                  {currentStep > 1 ? 'Previous' : 'Cancel'}
                </Button>
                
                {currentStep < 3 ? (
                  <Button onClick={() => setCurrentStep(currentStep + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmit}>
                    Generate Quote
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Price Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Price Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  ${estimatedPrice}
                </div>
                <p className="text-sm text-gray-600">Estimated premium</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base premium</span>
                  <span>${selectedPlan.basePrice || 100}</span>
                </div>
                {formData.age && parseInt(formData.age) > 45 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Age adjustment</span>
                    <span>+{parseInt(formData.age) > 65 ? '40%' : '20%'}</span>
                  </div>
                )}
                {formData.travelers && parseInt(formData.travelers) > 1 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Multiple travelers</span>
                    <span>×{formData.travelers}</span>
                  </div>
                )}
                {formData.addOns.length > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Add-ons ({formData.addOns.length})</span>
                    <span>+${formData.addOns.reduce((sum, addon) => {
                      const addonData = availableAddOns.find(a => a.id === addon);
                      return sum + (addonData?.price || 0);
                    }, 0)}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500">
                  * This is an estimate. Final price may vary based on underwriting.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}