import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Activity, 
  Shield,
  Car,
  Cat,
  Heart,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  useQuoteStore, 
  TravelQuoteData, 
  AutoQuoteData, 
  PetQuoteData, 
  HealthQuoteData 
} from '@/store/quote-store';
import { InsuranceCategory } from '@/components/plans/PlanCard';
import { format, differenceInDays } from 'date-fns';

interface QuoteSummaryProps {
  category: InsuranceCategory;
}

export const QuoteSummary: React.FC<QuoteSummaryProps> = ({ category }) => {
  const {
    submittedTravelQuote,
    showTravelQuoteSummary,
    resetTravelQuote,
    
    submittedAutoQuote,
    showAutoQuoteSummary,
    resetAutoQuote,
    
    submittedPetQuote,
    showPetQuoteSummary,
    resetPetQuote,
    
    submittedHealthQuote,
    showHealthQuoteSummary,
    resetHealthQuote,
  } = useQuoteStore();

  const getActiveSummary = () => {
    switch (category) {
      case 'travel':
        return showTravelQuoteSummary && submittedTravelQuote;
      case 'auto':
        return showAutoQuoteSummary && submittedAutoQuote;
      case 'pet':
        return showPetQuoteSummary && submittedPetQuote;
      case 'health':
        return showHealthQuoteSummary && submittedHealthQuote;
      default:
        return false;
    }
  };

  const handleReset = () => {
    switch (category) {
      case 'travel':
        resetTravelQuote();
        break;
      case 'auto':
        resetAutoQuote();
        break;
      case 'pet':
        resetPetQuote();
        break;
      case 'health':
        resetHealthQuote();
        break;
      default:
        break;
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'travel':
        return <CalendarDays className="h-5 w-5 text-blue-500" />;
      case 'auto':
        return <Car className="h-5 w-5 text-blue-500" />;
      case 'pet':
        return <Cat className="h-5 w-5 text-blue-500" />;
      case 'health':
        return <Heart className="h-5 w-5 text-blue-500" />;
      default:
        return <Shield className="h-5 w-5 text-blue-500" />;
    }
  };

  const renderTravelQuoteSummary = (data: TravelQuoteData) => {
    // Calculate trip length
    const departureDate = new Date(data.departureDate);
    const returnDate = new Date(data.returnDate);
    const tripLength = differenceInDays(returnDate, departureDate);

    return (
      <>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Destination:</span>
            <span>{data.destination}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Travel dates:</span>
            <span>
              {format(new Date(data.departureDate), 'MMM d, yyyy')} to {format(new Date(data.returnDate), 'MMM d, yyyy')}
              <Badge variant="outline" className="ml-2">
                {tripLength} {tripLength === 1 ? 'day' : 'days'}
              </Badge>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Travelers:</span>
            <span>{data.travelers}</span>
          </div>
          
          {data.activities && data.activities.length > 0 && (
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Activities:</span>
              <div className="flex flex-wrap gap-1">
                {data.activities.map((activity) => (
                  <Badge key={activity} variant="secondary" className="mr-1">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Coverage level:</span>
            <span className="capitalize">{data.coverage}</span>
          </div>
        </div>
      </>
    );
  };

  const renderAutoQuoteSummary = (data: AutoQuoteData) => {
    return (
      <>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Vehicle:</span>
            <span>{data.vehicleYear} {data.vehicleMake} {data.vehicleModel}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Vehicle value:</span>
            <span>${data.vehicleValue.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Driver:</span>
            <span>{data.primaryDriver.age} years old, {data.primaryDriver.drivingExperience} years of experience</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Accident history:</span>
            <Badge variant={data.primaryDriver.accidentHistory === 'none' ? 'success' : 'secondary'}>
              {data.primaryDriver.accidentHistory === 'none' ? 'No accidents' : 
               data.primaryDriver.accidentHistory === 'minor' ? 'Minor accidents' :
               data.primaryDriver.accidentHistory === 'one' ? 'One accident' : 'Multiple accidents'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Coverage type:</span>
            <span className="capitalize">{data.coverageType}</span>
          </div>
        </div>
      </>
    );
  };

  const renderPetQuoteSummary = (data: PetQuoteData) => {
    return (
      <>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Cat className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Pet:</span>
            <span className="capitalize">{data.petType}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Breed:</span>
            <span>{data.breed}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Age:</span>
            <span>{data.age} {data.age === 1 ? 'year' : 'years'}</span>
          </div>
          
          {data.medicalHistory && data.medicalHistory.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Medical history:</span>
              <div className="flex flex-wrap gap-1">
                {data.medicalHistory.map((condition) => (
                  <Badge key={condition} variant="secondary" className="mr-1">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Coverage level:</span>
            <span className="capitalize">{data.coverageLevel}</span>
          </div>
        </div>
      </>
    );
  };

  const renderHealthQuoteSummary = (data: HealthQuoteData) => {
    return (
      <>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Profile:</span>
            <span>{data.age} years old, {data.gender}</span>
            {data.smoker && (
              <Badge variant="secondary">Smoker</Badge>
            )}
          </div>
          
          {data.preExistingConditions && data.preExistingConditions.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="font-medium">Conditions:</span>
              <div className="flex flex-wrap gap-1">
                {data.preExistingConditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="mr-1">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-500 mt-1" />
            <span className="font-medium mt-1">Coverage needs:</span>
            <div className="flex flex-wrap gap-1">
              {data.coverageNeeds.map((need) => (
                <Badge key={need} className="mr-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {need}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderSummary = () => {
    if (category === 'travel' && submittedTravelQuote) {
      return renderTravelQuoteSummary(submittedTravelQuote);
    } else if (category === 'auto' && submittedAutoQuote) {
      return renderAutoQuoteSummary(submittedAutoQuote);
    } else if (category === 'pet' && submittedPetQuote) {
      return renderPetQuoteSummary(submittedPetQuote);
    } else if (category === 'health' && submittedHealthQuote) {
      return renderHealthQuoteSummary(submittedHealthQuote);
    }
    return null;
  };

  if (!getActiveSummary()) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <Card className="bg-white shadow-md border-blue-100">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon()}
            <CardTitle className="text-lg">Your Quote Details</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={handleReset}
          >
            <span className="sr-only">Reset quote</span>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {renderSummary()}
        </CardContent>
      </Card>
    </motion.div>
  );
};