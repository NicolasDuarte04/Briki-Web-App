import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Wifi, Shield, Key, Clock } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { ApiError } from '../../services/api/insurance-providers';
import { Link } from 'wouter';

interface ApiErrorDisplayProps {
  title?: string;
  errors: Record<string, ApiError>;
  onRetry?: () => void;
  containerClassName?: string;
}

/**
 * Enhanced API error display component for provider errors
 */
export function ApiErrorDisplay({
  title = 'Insurance Provider Connection Issues',
  errors,
  onRetry,
  containerClassName = '',
}: ApiErrorDisplayProps) {
  const errorCount = Object.keys(errors).length;
  
  // Check if any errors are configuration issues (API keys missing)
  const hasConfigErrors = Object.values(errors).some(
    error => error.statusCode === 401 || error.details?.requiresConfiguration
  );
  
  // Check if any errors are network issues
  const hasNetworkErrors = Object.values(errors).some(
    error => error.statusCode === 408 || error.statusCode >= 500
  );
  
  // Check if any errors are rate limits
  const hasRateLimitErrors = Object.values(errors).some(
    error => error.statusCode === 429
  );
  
  if (errorCount === 0) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={containerClassName}
    >
      <Card className="overflow-hidden border-amber-200 shadow-sm bg-amber-50">
        <CardHeader className="flex flex-row items-center gap-2 pb-2 bg-amber-100/70">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-base text-amber-800">
            {title}
            {errorCount > 0 && <span className="ml-2 text-sm">({errorCount} providers)</span>}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-4 pb-2">
          {hasConfigErrors && (
            <Alert className="mb-3 border-blue-200 bg-blue-50 text-blue-800">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertTitle>API Key Configuration Required</AlertTitle>
              <AlertDescription className="text-sm mt-1">
                Some providers require API keys to be configured. Go to API Settings to add your keys.
              </AlertDescription>
            </Alert>
          )}
          
          {hasNetworkErrors && (
            <Alert className="mb-3 border-red-200 bg-red-50 text-red-800">
              <Wifi className="h-4 w-4 text-red-600" />
              <AlertTitle>Network Connection Issues</AlertTitle>
              <AlertDescription className="text-sm mt-1">
                Connection problems with some insurance providers. Check your internet connection or try again later.
              </AlertDescription>
            </Alert>
          )}
          
          {hasRateLimitErrors && (
            <Alert className="mb-3 border-yellow-200 bg-yellow-50 text-yellow-800">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertTitle>Rate Limit Reached</AlertTitle>
              <AlertDescription className="text-sm mt-1">
                Rate limits reached for some providers. Please wait a moment before trying again.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2 mt-2 max-h-60 overflow-y-auto custom-scrollbar">
            {Object.entries(errors).map(([provider, error]) => (
              <div 
                key={provider} 
                className="text-sm bg-white border border-amber-100 rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <span className="font-medium text-amber-900">{provider}:</span>{' '}
                  <span className="text-amber-800">{error.message}</span>
                </div>
                
                {error.statusCode === 401 && (
                  <Button variant="outline" size="sm" asChild className="h-7 px-2 text-xs">
                    <Link href="/api-settings">
                      <Key className="h-3 w-3 mr-1" />
                      Configure
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        
        {onRetry && (
          <CardFooter className="pt-2 pb-3 flex justify-between bg-amber-50/50">
            <div className="text-xs text-amber-700 italic">
              Some plans may still be available from other providers
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRetry}
              className="bg-white border-amber-200 text-amber-800 hover:bg-amber-100 flex items-center gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry Connections
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}

/**
 * Component to display when all providers failed
 */
export function AllProvidersFailedError({
  onRetry,
  onConfigure
}: {
  onRetry?: () => void;
  onConfigure?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="py-12 px-4 text-center max-w-xl mx-auto"
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <Wifi className="h-10 w-10 text-red-600" />
      </div>
      
      <h3 className="mt-6 text-xl font-medium text-gray-900">
        Could not connect to insurance providers
      </h3>
      
      <p className="mt-3 text-gray-500">
        We're having trouble connecting to our insurance partners. This could be due to missing API keys, network issues, or temporary service disruptions.
      </p>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          variant="default" 
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onConfigure}
          asChild
          className="flex items-center gap-2"
        >
          <Link href="/api-settings">
            <Key className="h-4 w-4" />
            Configure API Keys
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}