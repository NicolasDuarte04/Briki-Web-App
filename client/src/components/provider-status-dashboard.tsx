import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Database,
  Server,
  Activity,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useInvalidatePlansCache } from '@/services/caching/insurance-cache';
import { INSURANCE_PROVIDERS } from '@/services/api/insurance-providers';
import { checkRequiredApiKeys } from '@/services/api/api-keys';
import { useToast } from '@/hooks/use-toast';

// Provider connection status type
interface ProviderStatus {
  name: string;
  status: 'connected' | 'error' | 'pending' | 'disabled';
  responseTime?: number; // ms
  lastUpdated?: Date;
  errorMessage?: string;
}

// Mock function to check provider connection (would be real in production)
const checkProviderConnection = async (
  providerName: string
): Promise<ProviderStatus> => {
  // This would make an actual API call to check connection in production
  // For demo, we'll simulate random statuses
  const statuses: ProviderStatus['status'][] = ['connected', 'error', 'pending'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const responseTime = Math.floor(Math.random() * 500) + 100; // 100-600ms
  
  return {
    name: providerName,
    status: randomStatus,
    responseTime,
    lastUpdated: new Date(),
    errorMessage: randomStatus === 'error' ? 'API rate limit exceeded' : undefined
  };
};

interface ProviderStatusDashboardProps {
  refreshInterval?: number; // ms, default 30s
  compact?: boolean;
}

export default function ProviderStatusDashboard({ 
  refreshInterval = 30000,
  compact = false
}: ProviderStatusDashboardProps) {
  const [providerStatuses, setProviderStatuses] = useState<ProviderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const invalidateCacheMutation = useInvalidatePlansCache();
  const { toast } = useToast();
  
  // Create a local function to safely call the mutation
  const invalidateCache = () => {
    invalidateCacheMutation.mutate({});
  };
  
  // Determine which providers are configured with API keys
  const { missingProviders } = checkRequiredApiKeys();
  
  // Refresh all provider connections
  const refreshConnections = async () => {
    setLoading(true);
    
    try {
      const statuses = await Promise.all(
        INSURANCE_PROVIDERS.map(async (provider) => {
          // If provider has no API key, mark as disabled
          if (missingProviders.includes(provider.name)) {
            return {
              name: provider.name,
              status: 'disabled' as const,
              lastUpdated: new Date()
            };
          }
          
          // Check actual connection
          return await checkProviderConnection(provider.name);
        })
      );
      
      setProviderStatuses(statuses);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to check provider connections:', error);
      toast({
        title: 'Connection Check Failed',
        description: 'Unable to verify provider connections',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    refreshConnections();
    // Invalidate all plans cache
    invalidateCache();
    
    toast({
      title: 'Refreshing Provider Connections',
      description: 'Checking connection status for all providers...',
    });
  };
  
  // Initialize and set up auto-refresh
  useEffect(() => {
    refreshConnections();
    
    // Set up auto-refresh
    const intervalId = setInterval(() => {
      refreshConnections();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval, missingProviders.length]);
  
  // Calculate summary metrics
  const connectedCount = providerStatuses.filter(p => p.status === 'connected').length;
  const errorCount = providerStatuses.filter(p => p.status === 'error').length;
  const pendingCount = providerStatuses.filter(p => p.status === 'pending').length;
  const disabledCount = providerStatuses.filter(p => p.status === 'disabled').length;
  
  const connectionRate = providerStatuses.length 
    ? Math.round((connectedCount / (providerStatuses.length - disabledCount)) * 100) 
    : 0;
  
  const avgResponseTime = providerStatuses
    .filter(p => p.status === 'connected' && p.responseTime)
    .reduce((sum, p) => sum + (p.responseTime || 0), 0) / connectedCount || 0;
  
  // If compact mode, show minimal view
  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Provider Connections</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw 
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} 
              />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Connection Rate:</span>
              <span className={`text-sm font-bold ${
                connectionRate >= 90 ? 'text-green-600' : 
                connectionRate >= 70 ? 'text-amber-600' : 
                'text-red-600'
              }`}>{connectionRate}%</span>
            </div>
            <div className="flex gap-1.5">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {connectedCount}
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {errorCount}
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                {pendingCount}
              </Badge>
            </div>
          </div>
          
          <Progress 
            value={connectionRate} 
            className={`h-2 ${
              connectionRate >= 90 ? 'bg-green-100' : 
              connectionRate >= 70 ? 'bg-amber-100' : 
              'bg-red-100'
            }`}
          />
          
          <p className="text-xs text-gray-500 mt-2">
            Last refreshed: {lastRefresh.toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Full dashboard view
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Insurance Provider Status</CardTitle>
            <CardDescription>
              Real-time connection status to insurance data providers
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh All'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Status summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-green-700">Connected</span>
                  <span className="text-2xl font-bold text-green-800">{connectedCount}</span>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-red-700">Errors</span>
                  <span className="text-2xl font-bold text-red-800">{errorCount}</span>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-amber-700">Pending</span>
                  <span className="text-2xl font-bold text-amber-800">{pendingCount}</span>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">Disabled</span>
                  <span className="text-2xl font-bold text-gray-800">{disabledCount}</span>
                </div>
                <Cloud className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Performance metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span className="font-medium">Connection Rate</span>
                </div>
                <span className={`text-xl font-bold ${
                  connectionRate >= 90 ? 'text-green-600' : 
                  connectionRate >= 70 ? 'text-amber-600' : 
                  'text-red-600'
                }`}>{connectionRate}%</span>
              </div>
              <Progress 
                value={connectionRate} 
                className="mt-2 h-2" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-medium">Avg Response Time</span>
                </div>
                <span className="text-xl font-bold">
                  {avgResponseTime.toFixed(0)} ms
                </span>
              </div>
              <Progress 
                value={100 - Math.min(100, avgResponseTime / 10)} 
                className="mt-2 h-2" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <span className="font-medium">Data Providers</span>
                </div>
                <span className="text-xl font-bold">
                  {INSURANCE_PROVIDERS.length}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">
                  Last Updated: {lastRefresh.toLocaleTimeString()}
                </span>
                <span className="text-gray-600">
                  Auto-refresh: {refreshInterval / 1000}s
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Provider details */}
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-2 p-3 bg-gray-100 font-medium text-sm">
            <div className="col-span-4">Provider</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Response Time</div>
            <div className="col-span-4">Last Updated</div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {providerStatuses.map((provider, index) => (
              <motion.div 
                key={provider.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={`grid grid-cols-12 gap-2 p-3 text-sm border-b ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="col-span-4 font-medium">{provider.name}</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={`
                    ${provider.status === 'connected' ? 'bg-green-50 text-green-700 border-green-200' : 
                      provider.status === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 
                      provider.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'}
                  `}>
                    {provider.status === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {provider.status === 'error' && <XCircle className="h-3 w-3 mr-1" />}
                    {provider.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {provider.status === 'disabled' && <Cloud className="h-3 w-3 mr-1" />}
                    {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                  </Badge>
                </div>
                <div className="col-span-2">
                  {provider.responseTime ? `${provider.responseTime} ms` : '-'}
                </div>
                <div className="col-span-4 text-gray-600">
                  {provider.lastUpdated ? provider.lastUpdated.toLocaleTimeString() : '-'}
                  {provider.errorMessage && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 ml-1 inline-block" />
                        </TooltipTrigger>
                        <TooltipContent>{provider.errorMessage}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        <Server className="h-3.5 w-3.5 mr-1" />
        Data is refreshed automatically every {refreshInterval / 1000} seconds
      </CardFooter>
    </Card>
  );
}