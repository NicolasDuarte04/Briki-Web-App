import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trip } from "../../../shared/schema";
import { useLocation } from "wouter";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { PlaneIcon, Users, CalendarRange, PencilIcon } from "lucide-react";

export default function TripSummary() {
  const [, navigate] = useLocation();
  const [tripDuration, setTripDuration] = useState<number>(0);
  
  // Fetch latest trip
  const { data: trips, isLoading, error } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
  });
  
  // Get the most recent trip
  const latestTrip = trips && trips.length > 0 ? trips[trips.length - 1] : null;
  
  // Calculate trip duration
  useEffect(() => {
    if (latestTrip) {
      const start = new Date(latestTrip.departureDate);
      const end = new Date(latestTrip.returnDate);
      const durationMs = end.getTime() - start.getTime();
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
      setTripDuration(durationDays);
    }
  }, [latestTrip]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getDestinationName = (code: string) => {
    const destinations = {
      'europe': 'Europe',
      'asia': 'Asia',
      'northAmerica': 'North America',
      'southAmerica': 'South America',
      'africa': 'Africa',
      'oceania': 'Oceania'
    };
    return destinations[code as keyof typeof destinations] || code;
  };
  
  const getTripTypeName = (code: string) => {
    const tripTypes = {
      'leisure': 'Leisure',
      'business': 'Business',
      'study': 'Study',
      'mixed': 'Mixed'
    };
    return tripTypes[code as keyof typeof tripTypes] || code;
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 flex justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
      </Card>
    );
  }

  if (error || !latestTrip) {
    return (
      <Card className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-8">
        <div className="flex items-center">
          <p className="text-sm">No trip information found. Please enter your trip details first.</p>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto text-red-800 border-red-300 hover:bg-red-100"
            onClick={() => navigate("/trip-info")}
          >
            Enter Trip Details
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-primary">
            <PlaneIcon className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">
              Trip to {getDestinationName(latestTrip.destination)}
            </h3>
            <div className="text-xs text-gray-500">
              {formatDate(latestTrip.departureDate)} - {formatDate(latestTrip.returnDate)} ({tripDuration} days)
            </div>
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="mr-6 mb-2 sm:mb-0 flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">Travelers</div>
              <div className="text-sm font-medium">
                {latestTrip.travelers} {latestTrip.travelers === 1 ? 'Adult' : 'Adults'}
              </div>
            </div>
          </div>
          <div className="mr-6 mb-2 sm:mb-0 flex items-center">
            <CalendarRange className="h-4 w-4 mr-1 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">Trip Type</div>
              <div className="text-sm font-medium">{getTripTypeName(latestTrip.tripType)}</div>
            </div>
          </div>
          <div>
            <Button 
              variant="link" 
              className="inline-flex items-center text-xs font-medium text-primary hover:text-blue-600 p-0 h-auto"
              onClick={() => navigate("/trip-info")}
            >
              <PencilIcon className="h-3 w-3 mr-1" />
              Edit Trip Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
