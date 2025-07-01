import React from 'react';
import { useLocation } from 'wouter';
import { Card } from '../ui/card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Plane, Car, Cat, HeartPulse, BarChart3 } from 'lucide-react';
import { InsuranceCategory } from '../../../../shared/schema';
import NavButton from '../common/NavButton';
import { useCompareStore } from '../../store/compare-store';

interface CategoryNavProps {
  transparent?: boolean;
  showCount?: boolean;
}

export default function CategoryNav({ transparent = false, showCount = true }: CategoryNavProps) {
  const [location] = useLocation();
  const { getSelectedPlansByCategory } = useCompareStore();
  
  // Mapping of routes to category types
  const routeToCategory: Record<string, InsuranceCategory> = {
    '/insurance/travel': 'travel',
    '/insurance/auto': 'auto',
    '/insurance/pet': 'pet',
    '/insurance/health': 'health'
  };
  
  // Get current category from route
  const currentCategory = Object.entries(routeToCategory)
    .find(([route]) => location.startsWith(route))?.[1] as InsuranceCategory | undefined;
    
  // Get badge count for each category
  const getTravelCount = () => showCount ? getSelectedPlansByCategory('travel').length || null : null;
  const getAutoCount = () => showCount ? getSelectedPlansByCategory('auto').length || null : null;
  const getPetCount = () => showCount ? getSelectedPlansByCategory('pet').length || null : null;
  const getHealthCount = () => showCount ? getSelectedPlansByCategory('health').length || null : null;
  
  return (
    <Card className={`mb-4 ${transparent ? 'bg-transparent border-0 shadow-none' : ''}`}>
      <div className="flex justify-center p-2">
        <Tabs 
          defaultValue={currentCategory || 'travel'} 
          className="w-full max-w-3xl"
        >
          <TabsList className="w-full grid grid-cols-4 mb-2">
            <TabsTrigger 
              value="travel" 
              className="flex items-center justify-center gap-2"
              asChild
            >
              <NavButton 
                to="/insurance/travel"
                icon={<Plane className="h-4 w-4" />}
                label="Travel"
                badge={getTravelCount()}
                variant="ghost"
                className="w-full"
              />
            </TabsTrigger>
            <TabsTrigger 
              value="auto" 
              className="flex items-center justify-center gap-2"
              asChild
            >
              <NavButton 
                to="/insurance/auto"
                icon={<Car className="h-4 w-4" />}
                label="Auto"
                badge={getAutoCount()}
                variant="ghost"
                className="w-full"
              />
            </TabsTrigger>
            <TabsTrigger 
              value="pet" 
              className="flex items-center justify-center gap-2"
              asChild
            >
              <NavButton 
                to="/insurance/pet"
                icon={<Cat className="h-4 w-4" />}
                label="Pet"
                badge={getPetCount()}
                variant="ghost"
                className="w-full"
              />
            </TabsTrigger>
            <TabsTrigger 
              value="health" 
              className="flex items-center justify-center gap-2"
              asChild
            >
              <NavButton 
                to="/insurance/health"
                icon={<HeartPulse className="h-4 w-4" />}
                label="Health"
                badge={getHealthCount()}
                variant="ghost"
                className="w-full"
              />
            </TabsTrigger>
          </TabsList>
          
          {/* Comparison button */}
          <div className="flex justify-center">
            <NavButton 
              to="/compare-plans-demo"
              icon={<BarChart3 className="h-4 w-4" />}
              label="Compare All Categories"
              variant="outline"
              className="mt-2 w-full md:w-auto"
            />
          </div>
        </Tabs>
      </div>
    </Card>
  );
}