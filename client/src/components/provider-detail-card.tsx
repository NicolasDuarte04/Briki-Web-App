import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Database, Check, X, AlertTriangle, Clock, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';
import { ProviderConfig } from '../services/api/insurance-providers';
import { Link } from 'wouter';

interface ProviderDetailCardProps {
  provider: ProviderConfig;
  isConfigured?: boolean;
  metrics?: {
    planCount?: number;
    responseTime?: number | null;
    status?: 'online' | 'offline' | 'error' | 'unknown';
    availability?: number;
  };
  onConfigure?: () => void;
}

/**
 * Detailed provider information card
 */
export default function ProviderDetailCard({
  provider,
  isConfigured = false,
  metrics = {},
  onConfigure
}: ProviderDetailCardProps) {
  const { 
    planCount = 0, 
    responseTime = null, 
    status = 'unknown',
    availability = 0
  } = metrics;
  
  // Status badge colors
  const statusColors: Record<string, string> = {
    online: 'bg-green-100 text-green-800 border-green-200',
    offline: 'bg-gray-100 text-gray-800 border-gray-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    unknown: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };
  
  // Progress colors
  const progressColors: Record<string, string> = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    error: 'bg-red-500',
    unknown: 'bg-yellow-500'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border ${isConfigured ? 'border-primary/20' : 'border-yellow-200/50'} shadow-glow-sm bg-background/80 backdrop-blur-sm overflow-hidden`}>
        <div className={`h-1 w-full ${progressColors[status] || 'bg-yellow-500'}`}></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-1.5">
              {provider.name}
              {provider.supportedCountries && (
                <Badge variant="outline" className="text-xs font-normal h-5">
                  {provider.supportedCountries.length} Countries
                </Badge>
              )}
            </CardTitle>
            
            <Badge 
              variant="outline" 
              className={`${statusColors[status]} px-2 py-0.5 h-6`}
            >
              {status === 'online' ? (
                <Check className="mr-1 h-3 w-3" />
              ) : status === 'error' ? (
                <AlertTriangle className="mr-1 h-3 w-3" />
              ) : status === 'offline' ? (
                <X className="mr-1 h-3 w-3" />
              ) : (
                <Clock className="mr-1 h-3 w-3" />
              )}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pb-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="text-xs text-foreground/70 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                API Type
              </div>
              <div className="font-medium">
                {provider.authType === 'apiKey' ? 'API Key' : 
                 provider.authType === 'bearer' ? 'Bearer Token' : 
                 provider.authType === 'oauth' ? 'OAuth 2.0' : 'None'}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="text-xs text-foreground/70 flex items-center gap-1">
                <Database className="h-3 w-3" />
                Available Plans
              </div>
              <div className="font-medium">
                {planCount || 'No data'}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-end text-xs">
              <span className="text-foreground/70">Availability</span>
              <span className="font-medium">{availability}%</span>
            </div>
            <Progress value={availability} className="h-1.5" />
          </div>
          
          {!isConfigured && (
            <div className="py-2 px-3 text-sm bg-yellow-50 border border-yellow-100 rounded-md text-yellow-800 flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
              <span>API key required for this provider</span>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          {!isConfigured ? (
            <Button 
              variant="default" 
              size="sm" 
              className="w-full" 
              onClick={onConfigure}
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Configure API Key
            </Button>
          ) : (
            <div className="w-full flex justify-between items-center text-sm text-foreground/70">
              <div>
                Response time: {responseTime ? `${responseTime}ms` : 'N/A'}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
              >
                <Link href="/api-settings">
                  Manage
                </Link>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}