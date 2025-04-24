import { useEffect, useState } from "react";
import { InsurancePlan } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface CompareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: InsurancePlan[];
}

export default function CompareModal({ open, onOpenChange, plans }: CompareModalProps) {
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
    }
  }, [plans]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Compare Insurance Plans</DialogTitle>
          <DialogDescription>
            Compare the features and coverage of your selected plans side by side.
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-x-auto py-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Features</TableHead>
                {plans.map(plan => (
                  <TableHead key={plan.id}>{plan.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Price</TableCell>
                {plans.map(plan => (
                  <TableCell 
                    key={plan.id} 
                    className={bestValues.basePrice === plan.basePrice ? "font-semibold bg-green-50" : ""}
                  >
                    {formatPrice(plan.basePrice)}
                  </TableCell>
                ))}
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Medical Coverage</TableCell>
                {plans.map(plan => (
                  <TableCell 
                    key={plan.id}
                    className={bestValues.medicalCoverage === plan.medicalCoverage ? "font-semibold bg-green-50" : ""}
                  >
                    {formatPrice(plan.medicalCoverage)}
                  </TableCell>
                ))}
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Trip Cancellation</TableCell>
                {plans.map(plan => (
                  <TableCell 
                    key={plan.id}
                    className={plan.tripCancellation.includes("100%") ? "font-semibold bg-green-50" : ""}
                  >
                    {plan.tripCancellation}
                  </TableCell>
                ))}
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Baggage Protection</TableCell>
                {plans.map(plan => (
                  <TableCell 
                    key={plan.id}
                    className={bestValues.baggageProtection === plan.baggageProtection ? "font-semibold bg-green-50" : ""}
                  >
                    {formatPrice(plan.baggageProtection)}
                  </TableCell>
                ))}
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Emergency Evacuation</TableCell>
                {plans.map(plan => (
                  <TableCell 
                    key={plan.id}
                    className={bestValues.emergencyEvacuation === (plan.emergencyEvacuation || 0) ? "font-semibold bg-green-50" : ""}
                  >
                    {formatPrice(plan.emergencyEvacuation)}
                  </TableCell>
                ))}
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">24/7 Assistance</TableCell>
                {plans.map(plan => (
                  <TableCell key={plan.id}>
                    <Check className="h-5 w-5 text-green-500" />
                  </TableCell>
                ))}
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Adventure Activities Coverage</TableCell>
                {plans.map(plan => (
                  <TableCell key={plan.id} className={plan.adventureActivities ? "bg-green-50" : ""}>
                    {plan.adventureActivities ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Rental Car Coverage</TableCell>
                {plans.map(plan => (
                  <TableCell 
                    key={plan.id}
                    className={plan.rentalCarCoverage && bestValues.rentalCarCoverage === plan.rentalCarCoverage ? "font-semibold bg-green-50" : ""}
                  >
                    {plan.rentalCarCoverage ? formatPrice(plan.rentalCarCoverage) : "Not Included"}
                  </TableCell>
                ))}
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Provider</TableCell>
                {plans.map(plan => (
                  <TableCell key={plan.id}>
                    {plan.provider}
                  </TableCell>
                ))}
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Rating</TableCell>
                {plans.map(plan => (
                  <TableCell key={plan.id}>
                    {plan.rating} / 5 ({plan.reviews} reviews)
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
