import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, RefreshCw, AlertCircle, Wifi, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiError } from '@/services/api/insurance-providers';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  code?: number;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'critical' | 'warning' | 'info' | 'network';
  retryable?: boolean;
}

/**
 * Component to display user-friendly error messages
 */
export function ErrorDisplay({
  title,
  message,
  code,
  onRetry,
  onDismiss,
  variant = 'warning',
  retryable = true
}: ErrorDisplayProps) {
  // Set defaults based on variant
  const icons = {
    critical: <AlertCircle className="h-10 w-10 text-red-600" />,
    warning: <AlertTriangle className="h-10 w-10 text-amber-500" />,
    info: <Info className="h-10 w-10 text-blue-500" />,
    network: <CloudOff className="h-10 w-10 text-gray-500" />
  };
  
  const defaultTitles = {
    critical: 'Error Occurred',
    warning: 'Something Went Wrong',
    info: 'Information',
    network: 'Connection Issue'
  };
  
  const colorClasses = {
    critical: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
    network: 'bg-gray-50 border-gray-200'
  };
  
  const headerColors = {
    critical: 'text-red-700',
    warning: 'text-amber-700',
    info: 'text-blue-700',
    network: 'text-gray-700'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${colorClasses[variant]} border shadow-sm`}>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          {icons[variant]}
          <CardTitle className={`text-lg ${headerColors[variant]}`}>
            {title || defaultTitles[variant]}
            {code && <span className="ml-2 text-sm opacity-75">({code})</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{message}</p>
        </CardContent>
        {(onRetry || onDismiss) && (
          <CardFooter className="flex justify-end gap-2 pt-2">
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                Dismiss
              </Button>
            )}
            {retryable && onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="gap-1">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}

/**
 * Component to display a collection of API errors
 */
export function ApiErrorsSummary({
  errors,
  onRetryAll
}: {
  errors: Record<string, ApiError>;
  onRetryAll?: () => void;
}) {
  const errorCount = Object.keys(errors).length;
  
  if (errorCount === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="font-medium text-gray-900">
            {errorCount === 1 
              ? '1 provider encountered an error' 
              : `${errorCount} providers encountered errors`}
          </h3>
        </div>
        {onRetryAll && (
          <Button variant="outline" size="sm" onClick={onRetryAll} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Retry All
          </Button>
        )}
      </div>
      
      <div className="space-y-2 mt-2">
        {Object.entries(errors).map(([provider, error]) => (
          <div 
            key={provider} 
            className="text-sm bg-gray-50 border border-gray-100 rounded-lg p-3 flex justify-between items-center"
          >
            <div>
              <span className="font-medium">{provider}:</span>{' '}
              <span className="text-gray-600">{error.message}</span>
            </div>
            {error.retryable && onRetryAll && (
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Component to display when all providers failed
 */
export function AllProvidersFailedError({
  onRetry
}: {
  onRetry?: () => void;
}) {
  return (
    <div className="py-10 px-4 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <Wifi className="h-10 w-10 text-red-600" />
      </div>
      
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        Could not connect to insurance providers
      </h3>
      
      <p className="mt-2 text-sm text-gray-500">
        We're having trouble connecting to our insurance partners. This could be due to network 
        issues or temporary service disruptions.
      </p>
      
      <div className="mt-6">
        <Button onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}