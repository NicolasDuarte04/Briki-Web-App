import React, { useEffect, useState } from 'react';
import { testAIAssistantConnection } from '@/services/ai-service';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent, EventCategory } from '@/lib/analytics';

interface ApiStatusCheckProps {
  onStatusChange?: (isAvailable: boolean) => void;
  showIndicator?: boolean;
}

/**
 * Component to check AI API availability and show status
 * This is used to provide fallbacks in case the OpenAI API is unreachable
 */
export const ApiStatusCheck: React.FC<ApiStatusCheckProps> = ({ 
  onStatusChange,
  showIndicator = false
}) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const checkApiStatus = async () => {
    setIsChecking(true);
    
    try {
      const result = await testAIAssistantConnection();
      
      setIsAvailable(result.success);
      setErrorDetails(result.error || null);
      
      if (onStatusChange) {
        onStatusChange(result.success);
      }
      
      // Track the status check result
      trackEvent(
        'ai_api_status_check',
        EventCategory.SYSTEM,
        result.success ? 'success' : 'failure',
        result.status
      );
    } catch (error) {
      setIsAvailable(false);
      setErrorDetails(error instanceof Error ? error.message : String(error));
      
      if (onStatusChange) {
        onStatusChange(false);
      }
      
      trackEvent(
        'ai_api_status_check_error',
        EventCategory.ERROR,
        'connection_error'
      );
    } finally {
      setIsChecking(false);
    }
  };
  
  // Check the API status when the component mounts
  useEffect(() => {
    checkApiStatus();
    
    // Re-check every 5 minutes
    const interval = setInterval(() => {
      checkApiStatus();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!showIndicator) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-2">
      {isAvailable === null ? (
        <Badge variant="outline" className="bg-gray-100 text-gray-500">
          <div className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Checking AI</span>
          </div>
        </Badge>
      ) : isAvailable ? (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>AI Ready</span>
          </div>
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>AI Unavailable</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 rounded-full ml-1 hover:bg-amber-100" 
              onClick={checkApiStatus}
              disabled={isChecking}
            >
              <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </Badge>
      )}
    </div>
  );
};

export default ApiStatusCheck;