import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  ServerCrash, 
  Server,
  Activity,
  InfoIcon
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProviderStatus } from '@/services/caching/insurance-cache';
import { INSURANCE_PROVIDERS } from '@/services/api/insurance-providers';
import { ProviderStatusSkeleton } from '@/components/ui/insurance-plan-skeleton';

interface ProviderStatusCardProps {
  provider: string;
  status: 'online' | 'error' | 'offline' | 'unknown';
  latency?: number | null;
  errorDetails?: any;
  lastChecked: Date;
}

/**
 * Card displaying status for a single provider
 */
function ProviderStatusCard({
  provider,
  status,
  latency,
  errorDetails,
  lastChecked
}: ProviderStatusCardProps) {
  // Color mapping based on status
  const statusColors = {
    online: {
      bg: 'bg-emerald-500',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
      label: 'Online'
    },
    error: {
      bg: 'bg-red-500',
      border: 'border-red-300',
      text: 'text-red-700',
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
      label: 'Error'
    },
    offline: {
      bg: 'bg-gray-500',
      border: 'border-gray-300',
      text: 'text-gray-700',
      icon: <ServerCrash className="h-4 w-4 text-gray-600" />,
      label: 'Offline'
    },
    unknown: {
      bg: 'bg-yellow-500',
      border: 'border-yellow-300',
      text: 'text-yellow-700',
      icon: <HelpCircle className="h-4 w-4 text-yellow-600" />,
      label: 'Unknown'
    }
  };
  
  const statusColor = statusColors[status];
  const timeAgo = getTimeAgo(lastChecked);
  
  // Format latency for display
  const formattedLatency = latency ? `${latency}ms` : 'N/A';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden flex border-primary/20 shadow-glow-sm bg-background/80 backdrop-blur-sm">
        <div className={`w-2 ${statusColor.bg}`} />
        <div className="p-4 flex-1">
          <div className="flex justify-between items-center">
            <div className="font-semibold">{provider}</div>
            <Badge variant="outline" className={`${statusColor.text} ${statusColor.border} flex items-center gap-1`}>
              {statusColor.icon}
              <span>{statusColor.label}</span>
            </Badge>
          </div>
          
          <div className="mt-3 text-sm text-foreground/70 space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>Latency:</span>
              </div>
              <span className="font-mono">{formattedLatency}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Checked:</span>
              </div>
              <span>{timeAgo}</span>
            </div>
          </div>
          
          {errorDetails && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-2 text-xs text-red-600 flex items-center gap-1 cursor-help">
                  <AlertCircle className="h-3 w-3" />
                  <span className="truncate max-w-[14rem]">
                    {errorDetails.message || 'Error connecting to provider'}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="bottom">
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="font-semibold">Error:</span> {errorDetails.message}
                  </div>
                  {errorDetails.statusCode && (
                    <div>
                      <span className="font-semibold">Status:</span> {errorDetails.statusCode}
                    </div>
                  )}
                  {errorDetails.retryable !== undefined && (
                    <div>
                      <span className="font-semibold">Retryable:</span> {errorDetails.retryable ? 'Yes' : 'No'}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

interface ProviderStatusDashboardProps {
  refreshInterval?: number;
}

/**
 * Dashboard showing the status of all insurance providers
 */
export default function ProviderStatusDashboard({ 
  refreshInterval = 30000 
}: ProviderStatusDashboardProps) {
  const { data: statusData, isLoading, refetch, isRefetching } = useProviderStatus();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Set up automatic refresh interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
      setLastRefresh(new Date());
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refetch, refreshInterval]);
  
  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
    setLastRefresh(new Date());
  };
  
  // Summary statistics
  const getStatusSummary = () => {
    if (!statusData) return { online: 0, error: 0, offline: 0, unknown: INSURANCE_PROVIDERS.length };
    
    return Object.values(statusData).reduce((summary: Record<string, number>, providerStatus: any) => {
      const status = providerStatus?.status || 'unknown';
      summary[status] = (summary[status] || 0) + 1;
      return summary;
    }, { online: 0, error: 0, offline: 0, unknown: 0 });
  };
  
  const statusSummary = getStatusSummary();
  
  // Get providers sorted by status (online first, then error, etc.)
  const getSortedProviders = () => {
    if (!statusData) return [];
    
    const priorityOrder = { online: 0, error: 1, offline: 2, unknown: 3 };
    
    return INSURANCE_PROVIDERS.map(provider => {
      const status = statusData[provider.name]?.status || 'unknown';
      
      return {
        name: provider.name,
        status,
        priority: priorityOrder[status as keyof typeof priorityOrder],
        details: statusData[provider.name] || {
          latency: null,
          lastChecked: new Date(),
          errorDetails: null
        }
      };
    }).sort((a, b) => a.priority - b.priority);
  };
  
  const sortedProviders = getSortedProviders();
  
  if (isLoading) {
    return <ProviderStatusSkeleton />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Provider API Status</h3>
          <p className="text-sm text-foreground/70">
            Real-time status of all insurance provider connections
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefetching}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3 flex items-center gap-2 bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl font-semibold">{statusSummary.online}</div>
            <div className="text-xs text-foreground/70">Online</div>
          </div>
        </Card>
        
        <Card className="p-3 flex items-center gap-2 bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm">
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <div className="text-xl font-semibold">{statusSummary.error}</div>
            <div className="text-xs text-foreground/70">Errors</div>
          </div>
        </Card>
        
        <Card className="p-3 flex items-center gap-2 bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Server className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <div className="text-xl font-semibold">{statusSummary.offline}</div>
            <div className="text-xs text-foreground/70">Offline</div>
          </div>
        </Card>
        
        <Card className="p-3 flex items-center gap-2 bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm">
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <HelpCircle className="h-4 w-4 text-yellow-600" />
          </div>
          <div>
            <div className="text-xl font-semibold">{statusSummary.unknown}</div>
            <div className="text-xs text-foreground/70">Unknown</div>
          </div>
        </Card>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/70 flex items-center gap-1">
          <InfoIcon className="h-3 w-3" />
          <span>Last auto-refresh: {getTimeAgo(lastRefresh)}</span>
        </div>
        
        <div className="text-sm">
          <span className="text-foreground/70">Total providers:</span>{' '}
          <span className="font-semibold">{INSURANCE_PROVIDERS.length}</span>
        </div>
      </div>
      
      {/* Provider status grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedProviders.map(provider => (
          <ProviderStatusCard
            key={provider.name}
            provider={provider.name}
            status={provider.status as any}
            latency={provider.details.latency}
            errorDetails={provider.details.errorDetails}
            lastChecked={provider.details.lastChecked}
          />
        ))}
      </div>
    </div>
  );
}