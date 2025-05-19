import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Plane, Car, Dog, Heart, 
  MapPin, Calendar, Users, Activity, 
  Shield, CircleCheck, X, 
  RefreshCw, Edit, Trash2
} from 'lucide-react';
import { useQuoteStore, InsuranceCategory } from '@/store/quote-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface QuoteSummaryProps {
  category: InsuranceCategory;
}

export function QuoteSummary({ category }: QuoteSummaryProps) {
  const [, navigate] = useLocation();
  const { 
    travelQuote, autoQuote, petQuote, healthQuote,
    submittedQuotes, clearQuote 
  } = useQuoteStore();
  
  // Check if there's a submitted quote for the current category
  const hasSubmittedQuote = submittedQuotes.has(category);
  
  // Get the current quote based on category
  const quote = (() => {
    switch(category) {
      case 'travel': return travelQuote;
      case 'auto': return autoQuote;
      case 'pet': return petQuote;
      case 'health': return healthQuote;
      default: return null;
    }
  })();
  
  // Early return if no quote is available
  if (!hasSubmittedQuote || !quote) {
    return (
      <Card className="mb-6 bg-gray-50 border-dashed border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-gray-400 mb-3">
            {getCategoryIcon(category, "h-10 w-10")}
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No {category} insurance quote provided
          </h3>
          <p className="text-gray-500 text-center mb-4 max-w-md">
            {getEmptyQuoteMessage(category)}
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/insurance/${category}/quote`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Get a Quote
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Render the quote summary based on the category
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="bg-white shadow-sm border-blue-100">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium gap-1.5">
                {getCategoryIcon(category, "h-3.5 w-3.5")}
                Your {capitalizeFirstLetter(category)} Quote
              </Badge>
              <CircleCheck className="ml-2 h-4 w-4 text-green-600" />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-gray-500"
                onClick={() => navigate(`/insurance/${category}/quote`)}
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-red-500"
                onClick={() => clearQuote(category)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            </div>
          </div>
          
          {/* Quote Details */}
          <div className="space-y-4">
            {renderQuoteDetails(category, quote)}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Using this information to find best matches
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1.5"
              onClick={() => navigate(`/insurance/${category}/quote`)}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper functions
function getCategoryIcon(category: InsuranceCategory, className: string = "h-5 w-5") {
  switch(category) {
    case 'travel': return <Plane className={className} />;
    case 'auto': return <Car className={className} />;
    case 'pet': return <Dog className={className} />;
    case 'health': return <Heart className={className} />;
    default: return <Shield className={className} />;
  }
}

function getEmptyQuoteMessage(category: InsuranceCategory): string {
  switch(category) {
    case 'travel':
      return "Share your trip details to find the best travel insurance plans for your journey.";
    case 'auto':
      return "Enter your vehicle information to get personalized auto insurance recommendations.";
    case 'pet':
      return "Tell us about your furry friend to find the right pet insurance coverage.";
    case 'health':
      return "Provide your health details to discover health insurance plans that fit your needs.";
    default:
      return "Fill out a quote form to see personalized insurance recommendations.";
  }
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderQuoteDetails(category: InsuranceCategory, quote: any) {
  switch(category) {
    case 'travel':
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Destination</p>
                <p className="font-medium">{quote.destination}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Users className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Travelers</p>
                <p className="font-medium">{quote.travelers} {quote.travelers === 1 ? 'person' : 'people'}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5">
              <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Trip Dates</p>
                <p className="font-medium">
                  {format(new Date(quote.departureDate), 'MMM d, yyyy')} - {format(new Date(quote.returnDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Coverage Level</p>
                <p className="font-medium capitalize">{quote.coverage}</p>
              </div>
            </div>
          </div>
          
          {quote.activities && quote.activities.length > 0 && (
            <div className="flex items-start gap-2.5">
              <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Activities</p>
                <div className="flex flex-wrap gap-1.5">
                  {quote.activities.map((activity: string) => (
                    <Badge variant="outline" key={activity} className="capitalize">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      );
    
    case 'auto':
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5">
              <Car className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Vehicle</p>
                <p className="font-medium">{quote.vehicleMake} {quote.vehicleModel} ({quote.vehicleYear})</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Coverage Type</p>
                <p className="font-medium capitalize">{quote.coverageType}</p>
              </div>
            </div>
          </div>
          
          {quote.primaryDriver && (
            <div className="flex items-start gap-2.5">
              <Users className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Primary Driver</p>
                <p className="font-medium">
                  Age: {quote.primaryDriver.age}, Experience: {quote.primaryDriver.drivingExperience} years, 
                  Accident History: {quote.primaryDriver.accidentHistory}
                </p>
              </div>
            </div>
          )}
        </>
      );
      
    case 'pet':
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5">
              <Dog className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Pet</p>
                <p className="font-medium capitalize">{quote.petType}, {quote.breed}, {quote.age} years old</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Coverage Level</p>
                <p className="font-medium capitalize">{quote.coverageLevel}</p>
              </div>
            </div>
          </div>
          
          {quote.medicalHistory && quote.medicalHistory.length > 0 && (
            <div className="flex items-start gap-2.5">
              <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Medical History</p>
                <div className="flex flex-wrap gap-1.5">
                  {quote.medicalHistory.map((condition: string) => (
                    <Badge variant="outline" key={condition} className="capitalize">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      );
      
    case 'health':
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5">
              <Users className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Personal Details</p>
                <p className="font-medium">{quote.age} years old, {quote.gender}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Smoker</p>
                <p className="font-medium">{quote.smoker ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
          
          {quote.preExistingConditions && quote.preExistingConditions.length > 0 && (
            <div className="flex items-start gap-2.5">
              <Heart className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Pre-existing Conditions</p>
                <div className="flex flex-wrap gap-1.5">
                  {quote.preExistingConditions.map((condition: string) => (
                    <Badge variant="outline" key={condition} className="capitalize">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {quote.coverageNeeds && quote.coverageNeeds.length > 0 && (
            <div className="flex items-start gap-2.5">
              <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Coverage Needs</p>
                <div className="flex flex-wrap gap-1.5">
                  {quote.coverageNeeds.map((need: string) => (
                    <Badge variant="outline" key={need} className="capitalize">
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      );
      
    default:
      return <p>No quote details available.</p>;
  }
}