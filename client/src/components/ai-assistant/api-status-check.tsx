import React, { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { checkAPIStatus } from '@/services/ai-service';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ApiStatusCheckProps {
  onStatusChange?: (isAvailable: boolean) => void;
}

export function ApiStatusCheck({ onStatusChange }: ApiStatusCheckProps) {
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Check API status when component mounts or when retry is triggered
  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const status = await checkAPIStatus();
        setIsAvailable(status);
        onStatusChange?.(status);
      } catch (error) {
        console.error('Error checking API status:', error);
        setIsAvailable(false);
        onStatusChange?.(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [onStatusChange, retryCount]);

  // Handle retry button click
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (isChecking) {
    return (
      <div className="flex items-center space-x-2 p-2 rounded-md bg-gray-50">
        <Spinner size="sm" className="text-blue-600" />
        <span className="text-sm text-gray-600">Checking assistant availability...</span>
      </div>
    );
  }

  if (isAvailable === false) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>AI Assistant Unavailable</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            The AI Assistant is currently unavailable. Please try again later or contact support if this issue persists.
          </p>
          <button
            onClick={handleRetry}
            className="text-sm underline hover:text-gray-800 focus:outline-none"
          >
            Retry connection
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isAvailable === true) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">AI Assistant Available</AlertTitle>
        <AlertDescription className="text-green-700">
          The AI assistant is ready to help you with your insurance questions.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}