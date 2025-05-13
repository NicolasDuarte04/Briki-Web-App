import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, AlertCircle, Trophy, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { InsuranceCategory } from '@/services/api/insurance-providers';
import { 
  AppleTravelIcon, 
  AppleAutoIcon, 
  ApplePetIcon, 
  AppleHealthIcon 
} from '@/components/icons/apple-style-icons';

interface PlanRecommenderProps {
  category?: InsuranceCategory;
  criteria?: Record<string, any>;
  className?: string;
  onRecommendationGenerated?: (recommendation: string) => void;
}

/**
 * Component that shows AI-generated insurance plan recommendations
 */
export default function PlanRecommender({
  category = 'travel',
  criteria = {},
  className = '',
  onRecommendationGenerated
}: PlanRecommenderProps) {
  const [activeCategory, setActiveCategory] = useState<InsuranceCategory>(category);
  const [recommendation, setRecommendation] = useState('');
  const { getRecommendation, isRecommendationLoading } = useAIAssistant();

  // Criteria templates for different insurance categories
  const criteriaSets: Record<InsuranceCategory, Record<string, any>> = {
    travel: {
      destination: criteria.destination || 'Mexico',
      duration: criteria.duration || '14 days',
      activities: criteria.activities || 'General tourism, hiking',
      travelers: criteria.travelers || 2,
      age: criteria.age || '30-40',
      budget: criteria.budget || 'Medium ($100-200)'
    },
    auto: {
      vehicleType: criteria.vehicleType || 'Sedan',
      vehicleYear: criteria.vehicleYear || 2020,
      driverAge: criteria.driverAge || 35,
      drivingHistory: criteria.drivingHistory || 'No accidents',
      usage: criteria.usage || 'Daily commute (15 miles)',
      budget: criteria.budget || 'Medium ($500-1000/year)'
    },
    pet: {
      petType: criteria.petType || 'Dog',
      breed: criteria.breed || 'Mixed',
      age: criteria.age || 3,
      preExistingConditions: criteria.preExistingConditions || 'None',
      coverageType: criteria.coverageType || 'Accident and illness',
      budget: criteria.budget || 'Medium ($30-50/month)'
    },
    health: {
      age: criteria.age || 35,
      preExistingConditions: criteria.preExistingConditions || 'None',
      coverageNeeds: criteria.coverageNeeds || 'General checkups, emergency care',
      dependents: criteria.dependents || 0,
      medicationNeeds: criteria.medicationNeeds || 'Occasional',
      budget: criteria.budget || 'Medium ($200-400/month)'
    }
  };

  const handleCategoryChange = (category: InsuranceCategory) => {
    setActiveCategory(category);
    setRecommendation('');
  };

  const handleGetRecommendation = async () => {
    const currentCriteria = criteriaSets[activeCategory];
    
    try {
      const result = await getRecommendation(activeCategory, currentCriteria);
      setRecommendation(result);
      
      if (onRecommendationGenerated) {
        onRecommendationGenerated(result);
      }
    } catch (error) {
      console.error('Error getting recommendation:', error);
      setRecommendation('Sorry, I had trouble generating a recommendation. Please try again.');
    }
  };

  const categoryLabels: Record<InsuranceCategory, string> = {
    travel: 'Travel',
    auto: 'Auto',
    pet: 'Pet',
    health: 'Health'
  };
  
  // Format criteria for display
  const formatCriteria = (criteria: Record<string, any>) => {
    return Object.entries(criteria).map(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
      return { 
        label: capitalizedKey, 
        value: value.toString() 
      };
    });
  };

  return (
    <Card className={`shadow-glow-sm border-primary/20 backdrop-blur-sm bg-background/90 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-primary" />
          AI Insurance Recommendations
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue={activeCategory} onValueChange={(val) => handleCategoryChange(val as InsuranceCategory)}>
          <TabsList className="grid grid-cols-4 w-full">
            {Object.entries(categoryLabels).map(([value, label]) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1">
                {value === 'travel' && <AppleTravelIcon className="w-4 h-4" />}
                {value === 'auto' && <AppleAutoIcon className="w-4 h-4" />}
                {value === 'pet' && <ApplePetIcon className="w-4 h-4" />}
                {value === 'health' && <AppleHealthIcon className="w-4 h-4" />}
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.keys(categoryLabels).map((category) => (
            <TabsContent key={category} value={category} className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8">
                    {category === 'travel' && <AppleTravelIcon className="h-full w-full" />}
                    {category === 'auto' && <AppleAutoIcon className="h-full w-full" />}
                    {category === 'pet' && <ApplePetIcon className="h-full w-full" />}
                    {category === 'health' && <AppleHealthIcon className="h-full w-full" />}
                  </div>
                  <div className="text-sm font-medium">Insurance criteria</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {formatCriteria(criteriaSets[category as InsuranceCategory]).map((item, index) => (
                    <div key={index} className="text-xs border rounded-md p-2 bg-muted/40">
                      <span className="font-medium">{item.label}:</span> {item.value}
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleGetRecommendation}
                disabled={isRecommendationLoading}
              >
                {isRecommendationLoading ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : recommendation ? (
                  <>
                    <RefreshCw size={16} className="mr-2" />
                    Regenerate Recommendation
                  </>
                ) : (
                  <>
                    <SparklesIcon size={16} className="mr-2" />
                    Get AI Recommendation
                  </>
                )}
              </Button>
              
              {recommendation && !isRecommendationLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="default" className="bg-primary/10 border-primary/20">
                    <Trophy className="h-4 w-4 text-primary" />
                    <AlertTitle>Your Personalized Recommendation</AlertTitle>
                    <AlertDescription className="mt-2 text-sm">
                      {recommendation.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-2">{paragraph}</p>
                      ))}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
              
              {isRecommendationLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[95%]" />
                  <Skeleton className="h-4 w-[85%]" />
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-0">
        <div className="text-xs text-muted-foreground italic">
          Recommendations based on specified criteria
        </div>
        <div className="flex items-center gap-1 text-xs">
          <AlertCircle size={10} className="text-yellow-500" />
          <span>Results are suggestions only</span>
        </div>
      </CardFooter>
    </Card>
  );
}