import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPrice } from "@/lib/utils";
import { TravelQuote, INSURANCE_CATEGORIES } from "@shared/schema";
import { useQuoteStore } from "@/store/quote-store";

interface QuoteSummaryProps {
  className?: string;
  compact?: boolean;
}

export function QuoteSummary({ className, compact = false }: QuoteSummaryProps) {
  const { submittedQuotes } = useQuoteStore();
  const [mostRecentQuote, setMostRecentQuote] = useState<TravelQuote | null>(null);
  
  useEffect(() => {
    if (submittedQuotes.length > 0) {
      const travelQuotes = submittedQuotes.filter(
        q => q.category === INSURANCE_CATEGORIES.TRAVEL
      );
      
      if (travelQuotes.length > 0) {
        // Find the most recent quote
        const latestQuote = [...travelQuotes].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })[0];
        
        setMostRecentQuote(latestQuote);
      }
    }
  }, [submittedQuotes]);
  
  if (!mostRecentQuote) {
    return null;
  }
  
  const calculateTripDuration = () => {
    if (mostRecentQuote.departureDate && mostRecentQuote.returnDate) {
      const departure = new Date(mostRecentQuote.departureDate);
      const returnDate = new Date(mostRecentQuote.returnDate);
      const diffTime = returnDate.getTime() - departure.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return null;
  };
  
  const tripDuration = calculateTripDuration();

  return (
    <Card className={className}>
      <CardHeader className={compact ? "p-4" : undefined}>
        <CardTitle className={compact ? "text-lg" : "text-xl"}>Your Quote Summary</CardTitle>
      </CardHeader>
      <CardContent className={compact ? "p-4 pt-0" : undefined}>
        <div className="space-y-4">
          {mostRecentQuote.category === INSURANCE_CATEGORIES.TRAVEL && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium">{mostRecentQuote.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Travelers</p>
                  <p className="font-medium">{mostRecentQuote.travelers}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Departure Date</p>
                  <p className="font-medium">{formatDate(mostRecentQuote.departureDate, "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Return Date</p>
                  <p className="font-medium">{formatDate(mostRecentQuote.returnDate, "MMM d, yyyy")}</p>
                </div>
              </div>
              
              {tripDuration !== null && (
                <div className="p-2 bg-muted rounded-md">
                  <p className="text-sm font-medium">Trip Duration: {tripDuration} days</p>
                </div>
              )}
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Coverage Level</p>
                <p className="font-medium capitalize">{mostRecentQuote.coverageLevel || "Standard"}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Selected Options</p>
                <ul className="space-y-1">
                  {mostRecentQuote.includesMedical && (
                    <li className="text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Medical Coverage
                    </li>
                  )}
                  {mostRecentQuote.includesCancellation && (
                    <li className="text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Trip Cancellation
                    </li>
                  )}
                  {mostRecentQuote.includesValuables && (
                    <li className="text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Valuables Protection
                    </li>
                  )}
                  {(!mostRecentQuote.includesMedical && !mostRecentQuote.includesCancellation && !mostRecentQuote.includesValuables) && (
                    <li className="text-sm text-muted-foreground">No additional options selected</li>
                  )}
                </ul>
              </div>
              
              {mostRecentQuote.activities && mostRecentQuote.activities.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Activities</p>
                  <div className="flex flex-wrap gap-1">
                    {mostRecentQuote.activities.map((activity) => (
                      <span key={activity} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}