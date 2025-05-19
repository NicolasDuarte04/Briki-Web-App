import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { apiGet } from '@/lib/api';
import { trackError } from '@/lib/analytics';

interface ApiStatusCheckProps {
  onStatusChange: (isAvailable: boolean) => void;
}

export function ApiStatusCheck({ onStatusChange }: ApiStatusCheckProps) {
  const [status, setStatus] = useState<'loading' | 'available' | 'unavailable'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkApiStatus = async () => {
    try {
      setIsChecking(true);
      setStatus('loading');
      
      // Check OpenAI API status via our backend health endpoint
      const result = await apiGet('/api/ai/health');
      
      if (result && result.status === 'ok') {
        setStatus('available');
        setErrorMessage(null);
        onStatusChange(true);
      } else {
        setStatus('unavailable');
        setErrorMessage(result?.message || 'The AI service is currently unavailable.');
        onStatusChange(false);
        trackError(`AI API unavailable: ${result?.message || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus('unavailable');
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(errorMsg);
      onStatusChange(false);
      trackError(`AI API check error: ${errorMsg}`);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
    // Check every 5 minutes
    const interval = setInterval(checkApiStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mb-4 border-0 shadow-md bg-white dark:bg-slate-900">
      <CardContent className="p-4">
        {status === 'loading' || isChecking ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Checking AI service availability...
              </span>
            </div>
          </div>
        ) : status === 'available' ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                AI service is available and ready to use
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={checkApiStatus}
              disabled={isChecking}
              className="h-8 px-2"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-500">
                  AI service is currently unavailable
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={checkApiStatus}
                disabled={isChecking}
                className="h-8 px-2"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            {errorMessage && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {errorMessage}
              </p>
            )}
            <style>
              {`
              .api-error-gradient {
                background: linear-gradient(135deg, #fef3c7 0%, #fef3c7 50%, #fecaca 100%);
              }
              `}
            </style>
          </div>
        )}
      </CardContent>
    </Card>
  );
}