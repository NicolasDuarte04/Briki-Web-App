import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, CloudDrizzle, CloudLightning, CloudRain, 
  Droplets, Flame, Snowflake, ThermometerSun, 
  Wind, MountainSnow, AlertTriangle, Shield 
} from 'lucide-react';
import { 
  RiskLevel, 
  DestinationRisk, 
  WeatherRiskFactor, 
  getRiskColor,
  destinationRisks,
  getDestinationsByMonth
} from '../data/weatherRiskData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/components/language-selector';

interface WeatherRiskVisualizationProps {
  selectedDestination?: string;
  onInsuranceRecommendation?: (recommendation: string) => void;
}

export function WeatherRiskVisualization({ 
  selectedDestination,
  onInsuranceRecommendation 
}: WeatherRiskVisualizationProps) {
  const { t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [destination, setDestination] = useState<DestinationRisk | null>(null);
  const [destinations, setDestinations] = useState<DestinationRisk[]>(getDestinationsByMonth(currentMonth));
  const [isRiskAnimating, setIsRiskAnimating] = useState(false);
  
  // Effect to animate risk indicators periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRiskAnimating(true);
      setTimeout(() => setIsRiskAnimating(false), 1000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Effect to update destination when selectedDestination changes
  useEffect(() => {
    if (selectedDestination) {
      const [country, city] = selectedDestination.split('-');
      const found = destinations.find(d => 
        d.country.toLowerCase() === country.toLowerCase() &&
        d.city.toLowerCase() === city.toLowerCase()
      );
      
      if (found) {
        setDestination(found);
        if (onInsuranceRecommendation) {
          onInsuranceRecommendation(found.insuranceRecommendation);
        }
      }
    }
  }, [selectedDestination, destinations, onInsuranceRecommendation]);
  
  // Update available destinations when month changes
  const handleMonthChange = (value: string) => {
    const month = parseInt(value);
    setCurrentMonth(month);
    setDestinations(getDestinationsByMonth(month));
    
    // If there's a selected destination, update its risks for the new month
    if (destination) {
      const updated = getDestinationsByMonth(month).find(
        d => d.country === destination.country && d.city === destination.city
      );
      if (updated) {
        setDestination(updated);
        if (onInsuranceRecommendation) {
          onInsuranceRecommendation(updated.insuranceRecommendation);
        }
      }
    }
  };
  
  // Select a destination to view risks
  const handleDestinationChange = (value: string) => {
    const [country, city] = value.split('-');
    const selected = destinations.find(
      d => d.country.toLowerCase() === country.toLowerCase() && 
           d.city.toLowerCase() === city.toLowerCase()
    );
    
    if (selected) {
      setDestination(selected);
      if (onInsuranceRecommendation) {
        onInsuranceRecommendation(selected.insuranceRecommendation);
      }
    }
  };
  
  // Function to get appropriate weather icon based on risk type
  const getRiskIcon = (type: string, className: string = "h-5 w-5") => {
    switch (type) {
      case 'hurricane':
        return <Wind className={className} />;
      case 'flood':
        return <Droplets className={className} />;
      case 'extreme_heat':
        return <ThermometerSun className={className} />;
      case 'wildfire':
        return <Flame className={className} />;
      case 'avalanche':
        return <MountainSnow className={className} />;
      case 'blizzard':
        return <Snowflake className={className} />;
      case 'drought':
        return <CloudLightning className={className} />;
      default:
        return <AlertTriangle className={className} />;
    }
  };
  
  // Risk indicator component with animations
  const RiskIndicator = ({ risk }: { risk: WeatherRiskFactor }) => {
    const colorClass = getRiskColor(risk.severity);
    
    // Add badge color based on risk severity
    const getBadgeColor = (severity: RiskLevel) => {
      switch (severity) {
        case RiskLevel.LOW:
          return "bg-green-100 text-green-800 hover:bg-green-200";
        case RiskLevel.MODERATE:
          return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
        case RiskLevel.HIGH:
          return "bg-orange-100 text-orange-800 hover:bg-orange-200";
        case RiskLevel.EXTREME:
          return "bg-red-100 text-red-800 hover:bg-red-200";
        default:
          return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      }
    };
    
    return (
      <motion.div 
        className={`p-3 rounded-lg shadow-sm ${colorClass} flex items-start gap-3 mb-3`}
        initial={{ opacity: 0.8, scale: 0.95 }}
        animate={{ 
          opacity: isRiskAnimating ? 1 : 0.8, 
          scale: isRiskAnimating ? 1.02 : 1,
          y: isRiskAnimating ? -5 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-shrink-0 mt-1">
          {getRiskIcon(risk.type)}
        </div>
        <div>
          <div className="font-medium capitalize">
            {risk.type.replace('_', ' ')}
            <Badge className={`ml-2 capitalize ${getBadgeColor(risk.severity)}`}>
              {risk.severity}
            </Badge>
          </div>
          <p className="text-sm mt-1">{risk.description}</p>
        </div>
      </motion.div>
    );
  };
  
  // Get month name translation based on month number
  const getMonthName = (monthNumber: number): string => {
    const monthKeys = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    return t(monthKeys[monthNumber - 1]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudDrizzle className="h-6 w-6 text-primary" />
            {t('weatherRisks')}
          </CardTitle>
          <CardDescription>
            {t('weatherRisksDescription')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">{t('travelMonth')}</label>
              <Select 
                value={currentMonth.toString()} 
                onValueChange={handleMonthChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectDestination')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t('january')}</SelectItem>
                  <SelectItem value="2">{t('february')}</SelectItem>
                  <SelectItem value="3">{t('march')}</SelectItem>
                  <SelectItem value="4">{t('april')}</SelectItem>
                  <SelectItem value="5">{t('may')}</SelectItem>
                  <SelectItem value="6">{t('june')}</SelectItem>
                  <SelectItem value="7">{t('july')}</SelectItem>
                  <SelectItem value="8">{t('august')}</SelectItem>
                  <SelectItem value="9">{t('september')}</SelectItem>
                  <SelectItem value="10">{t('october')}</SelectItem>
                  <SelectItem value="11">{t('november')}</SelectItem>
                  <SelectItem value="12">{t('december')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">{t('destination')}</label>
              <Select 
                value={destination ? `${destination.country.toLowerCase()}-${destination.city.toLowerCase()}` : ''}
                onValueChange={handleDestinationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectDestinationView')} />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((d) => (
                    <SelectItem 
                      key={`${d.country}-${d.city}`} 
                      value={`${d.country.toLowerCase()}-${d.city.toLowerCase()}`}
                    >
                      {d.city}, {d.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {destination ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {destination.city}, {destination.country}
                </h3>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">{t('safetyIndex')}:</span>
                  <span className="font-bold">{destination.safetyScore}/100</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">{t('safetyLevel')}:</label>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      destination.safetyScore > 80 ? "bg-green-500" :
                      destination.safetyScore > 60 ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}
                    style={{ width: `${destination.safetyScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className={`text-xs font-medium ${destination.safetyScore < 60 ? "text-red-600" : "text-gray-500"}`}>{t('highRisk')}</span>
                  <span className={`text-xs font-medium ${destination.safetyScore >= 60 && destination.safetyScore <= 80 ? "text-yellow-600" : "text-gray-500"}`}>{t('moderateRisk')}</span>
                  <span className={`text-xs font-medium ${destination.safetyScore > 80 ? "text-green-600" : "text-gray-500"}`}>{t('lowRisk')}</span>
                </div>
              </div>
              
              <AnimatePresence>
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">{t('climateRiskFactors')}:</h4>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="space-y-2"
                  >
                    {destination.weatherRisks.length > 0 ? (
                      destination.weatherRisks.map((risk, index) => (
                        <RiskIndicator key={`${risk.type}-${index}`} risk={risk} />
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        {t('noSignificantRisks')}
                      </div>
                    )}
                  </motion.div>
                </div>
              </AnimatePresence>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-2">
                  <div className="mt-1 flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">{t('insuranceRecommendation')}</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      {destination.insuranceRecommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CloudDrizzle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('selectDestinationView')}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between text-xs text-gray-500 border-t pt-4">
          <p>{t('dataUpdatedRegularly')}</p>
          <p>{t('dataSource')}</p>
        </CardFooter>
      </Card>
    </div>
  );
}