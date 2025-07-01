import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { InsuranceCategory } from '../../types/insurance';
import { useNavigation } from '../../lib/navigation';
import { trackEvent } from '../../lib/analytics';
import { EventCategory } from '../../constants/analytics';

interface PlanRecommenderProps {
  category?: InsuranceCategory;
  onClose?: () => void;
}

/**
 * AI Assistant component that helps recommend insurance plans
 * based on user preferences and history
 */
export const PlanRecommender: React.FC<PlanRecommenderProps> = ({ 
  category = 'travel',
  onClose 
}) => {
  const { toast } = useToast();
  const { navigate } = useNavigation();
  
  const handleSelectCategory = (selectedCategory: InsuranceCategory) => {
    // Track selection in analytics
    trackEvent('plan_recommender_select', EventCategory.ENGAGEMENT, selectedCategory);
    
    // Navigate to the selected category page
    navigate(`/insurance/${selectedCategory}`);
    
    // Show confirmation toast
    toast({
      title: "Category selected",
      description: `You've selected ${selectedCategory} insurance. Showing available plans.`,
    });
    
    // Close the assistant if a callback was provided
    if (onClose) {
      onClose();
    }
  };

  return (
    <Card className="w-full bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Insurance Plan Recommender</CardTitle>
        <CardDescription>
          Select an insurance category to view recommended plans
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Button 
          variant={category === 'travel' ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => handleSelectCategory('travel')}
        >
          Travel Insurance
        </Button>
        <Button 
          variant={category === 'auto' ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => handleSelectCategory('auto')}
        >
          Auto Insurance
        </Button>
        <Button 
          variant={category === 'pet' ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => handleSelectCategory('pet')}
        >
          Pet Insurance
        </Button>
        <Button 
          variant={category === 'health' ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => handleSelectCategory('health')}
        >
          Health Insurance
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
        <Button 
          size="sm"
          onClick={() => handleSelectCategory(category)}
        >
          View All Plans
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanRecommender;