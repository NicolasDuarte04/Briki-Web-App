import React, { useEffect } from "react";
import { useCompareStore } from "@/store/compare-store";
import CategoryComparisonTable from "@/components/comparison/CategoryComparisonTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, PlusCircle } from "lucide-react";
import { Link } from "wouter";
import { sampleInsurancePlans } from "@/data/sample-insurance-plans";

export default function ComparePlansDemo() {
  const { 
    selectedPlans, 
    addPlan,
    clearPlans, 
    removePlan, 
    getSelectedCategories,
    getComparisonReady,
    isPlanSelected
  } = useCompareStore();
  
  // Auto-populate the comparison tool with sample plans if none are selected
  useEffect(() => {
    if (selectedPlans.length === 0) {
      // Add one plan from each category to demonstrate cross-category comparison
      const travelPlan = sampleInsurancePlans.find(p => p.category === 'travel');
      const autoPlan = sampleInsurancePlans.find(p => p.category === 'auto');
      const petPlan = sampleInsurancePlans.find(p => p.category === 'pet');
      const healthPlan = sampleInsurancePlans.find(p => p.category === 'health');
      
      if (travelPlan) addPlan(travelPlan);
      if (autoPlan) addPlan(autoPlan);
      if (petPlan) addPlan(petPlan);
      if (healthPlan) addPlan(healthPlan);
    }
  }, []);
  
  const categories = getSelectedCategories();
  const isComparisonReady = getComparisonReady();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="sm" asChild className="mr-3">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Multi-Category Insurance Comparison</h1>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => clearPlans()}
          disabled={selectedPlans.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>
      
      {selectedPlans.length === 0 ? (
        <Card className="text-center p-10">
          <CardContent className="pt-6">
            <p className="text-lg text-muted-foreground mb-6">
              No insurance plans selected for comparison.
            </p>
            <Button asChild>
              <Link href="/insurance/travel">Browse Plans</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Plans Selected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{selectedPlans.length}</p>
                <p className="text-sm text-muted-foreground">from {categories.length} {categories.length === 1 ? 'category' : 'categories'}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <div 
                      key={category}
                      className={`px-3 py-1 rounded-full text-sm capitalize
                        ${category === 'travel' ? 'bg-blue-100 text-blue-800' : ''}
                        ${category === 'auto' ? 'bg-green-100 text-green-800' : ''}
                        ${category === 'pet' ? 'bg-orange-100 text-orange-800' : ''}
                        ${category === 'health' ? 'bg-purple-100 text-purple-800' : ''}
                      `}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Comparison View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground mb-2">Choose how to view the comparison:</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="category" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="category">Group by Category</TabsTrigger>
                <TabsTrigger value="unified">Unified View</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="category" className="mt-0">
              <CategoryComparisonTable plans={selectedPlans} groupByCategory={true} />
            </TabsContent>
            
            <TabsContent value="unified" className="mt-0">
              <CategoryComparisonTable plans={selectedPlans} groupByCategory={false} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}