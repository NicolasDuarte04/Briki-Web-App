import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, FileBarChart, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompareStore } from '@/store/compare-store';
import { useToast } from '@/hooks/use-toast';

export default function ComparePlansDebug() {
  console.log("ComparePlansDebug component mounting");
  const [, navigate] = useLocation();
  const { selectedPlans, clearPlans } = useCompareStore();
  const { toast } = useToast();
  
  // Log selected plans on mount
  useEffect(() => {
    console.log("Current selected plans:", selectedPlans);
  }, [selectedPlans]);

  // Function to go back to insurance plans
  const goBackToPlans = () => {
    navigate('/insurance/travel');
  };

  // Function to clear all plans with confirmation
  const handleClearPlans = () => {
    if (window.confirm('Are you sure you want to clear all selected plans?')) {
      clearPlans();
      toast({
        title: "Plans cleared",
        description: "All plans have been removed from comparison.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
        <div>
          <Button 
            variant="outline" 
            onClick={goBackToPlans}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Travel Insurance
          </Button>
          
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileBarChart className="h-6 w-6 text-primary" />
            Comparison Tool Diagnostic Page
          </h1>
          <p className="text-muted-foreground mt-1">
            Debugging information for the comparison feature
          </p>
        </div>
        
        <Button 
          variant="destructive" 
          onClick={handleClearPlans}
          className="flex items-center gap-2"
          disabled={selectedPlans.length === 0}
        >
          <Trash size={16} />
          Clear All Plans
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Comparison Status</CardTitle>
          <CardDescription>Details about currently selected plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Selected Plans</h3>
              <p className="flex items-center gap-2">
                <Badge variant="outline">{selectedPlans.length}</Badge>
                <span>plans selected</span>
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Plan IDs</h3>
              {selectedPlans.length > 0 ? (
                <div className="space-y-2">
                  {selectedPlans.map(plan => (
                    <Badge key={plan.id} variant="outline" className="mr-2">
                      {plan.id}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No plans selected</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedPlans.map(plan => (
            <Card key={plan.id} className="border border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{plan.name || 'Unnamed Plan'}</CardTitle>
                <CardDescription>
                  ID: {plan.id} • Category: {plan.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Description:</strong> {plan.description || 'No description available'}</p>
                  <p><strong>Provider:</strong> {plan.provider || 'Unknown'}</p>
                  <p><strong>Price:</strong> {plan.price || 'Not specified'}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    clearPlans();
                    toast({
                      title: "Plan removed",
                      description: `${plan.name || 'Plan'} removed from comparison.`,
                    });
                  }}
                >
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-muted/50 p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">No Plans Selected</h2>
          <p className="text-muted-foreground mb-6">
            Select some insurance plans to compare their features and coverage.
          </p>
          <Button onClick={goBackToPlans}>
            Browse Insurance Plans
          </Button>
        </div>
      )}
    </div>
  );
}