import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Search, Key, Check, Shield, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { INSURANCE_PROVIDERS, ProviderConfig } from '../services/api/insurance-providers';
import { 
  setProviderApiKey, 
  getProviderApiKey, 
  checkRequiredApiKeys 
} from '../services/api/api-keys';

interface ApiKeyFormProps {
  provider: ProviderConfig;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Form for entering a provider's API key
 */
function ApiKeyForm({ provider, onSave, onCancel }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [remember, setRemember] = useState(true);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter a valid API key',
        variant: 'destructive',
      });
      return;
    }
    
    // Store the API key (60 minutes = 1 hour)
    setProviderApiKey(provider.name, apiKey, remember ? 60 : undefined);
    
    toast({
      title: 'API Key Saved',
      description: `${provider.name} API key has been ${remember ? 'saved' : 'temporarily stored'}`,
    });
    
    onSave();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key for {provider.name}</Label>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={`Enter ${provider.name} API Key`}
          className="font-mono"
          required
        />
        <p className="text-sm text-gray-500">
          {provider.authType === 'apiKey' ? 
            'This key will be used in API request headers.' : 
            provider.authType === 'bearer' ? 
              'This token will be used with Bearer authentication.' : 
              'This token will be used for OAuth authentication.'}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="remember" 
          checked={remember} 
          onCheckedChange={(checked) => setRemember(checked === true)}
        />
        <label 
          htmlFor="remember" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Remember for this session (1 hour)
        </label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save API Key</Button>
      </div>
    </form>
  );
}

interface ProviderApiSetupProps {
  onComplete?: () => void;
}

/**
 * Component for managing insurance provider API keys
 */
export default function ProviderApiSetup({ onComplete }: ProviderApiSetupProps) {
  const [selectedProvider, setSelectedProvider] = useState<ProviderConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiStatus, setApiStatus] = useState<{ready: boolean; missingProviders: string[]}>({
    ready: false,
    missingProviders: [],
  });
  const { toast } = useToast();
  
  // Check API key status on mount and after changes
  useEffect(() => {
    const checkApiStatus = () => {
      const status = checkRequiredApiKeys();
      setApiStatus(status);
      
      // Log current API configuration status
      console.log(`API Configuration Status:`, {
        ready: status.ready,
        missingProviders: status.missingProviders.length,
        configuredProviders: INSURANCE_PROVIDERS.length - status.missingProviders.length
      });
    };
    
    checkApiStatus();
    
    // Set up interval to periodically check status (keys can expire)
    const intervalId = setInterval(checkApiStatus, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [selectedProvider]);
  
  // Filter providers based on search term
  const filteredProviders = INSURANCE_PROVIDERS.filter(provider => 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get configured and missing providers
  const configuredProviders = INSURANCE_PROVIDERS.filter(
    provider => !apiStatus.missingProviders.includes(provider.name)
  );
  const missingProviders = INSURANCE_PROVIDERS.filter(
    provider => apiStatus.missingProviders.includes(provider.name)
  );
  
  const handleCloseForm = () => {
    setSelectedProvider(null);
  };
  
  const handleSaveForm = () => {
    setSelectedProvider(null);
    
    // Check if all required providers are configured
    const status = checkRequiredApiKeys();
    setApiStatus(status);
    
    if (status.ready && onComplete) {
      onComplete();
    }
  };
  
  return (
    <div className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-bold">Insurance Provider API Configuration</CardTitle>
        <CardDescription>
          Configure API keys for real-time data from insurance providers
        </CardDescription>
      </CardHeader>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search providers..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* API status summary */}
      <div className={`p-4 rounded-lg border ${apiStatus.ready ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center gap-2">
          {apiStatus.ready ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          )}
          <p className={`font-medium ${apiStatus.ready ? 'text-green-700' : 'text-amber-700'}`}>
            {apiStatus.ready 
              ? 'All insurance providers configured' 
              : `${apiStatus.missingProviders.length} providers need API keys`}
          </p>
        </div>
        {!apiStatus.ready && (
          <p className="mt-1 text-sm text-amber-700">
            Configure the missing providers to enable real-time insurance quotes
          </p>
        )}
      </div>
      
      {/* Configured providers section */}
      {configuredProviders.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-gray-700 flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            Configured Providers ({configuredProviders.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {configuredProviders.map(provider => (
              <div 
                key={provider.name}
                className="px-3 py-2 bg-green-50 border border-green-100 rounded-lg flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">{provider.name}</span>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update API Key for {provider.name}</DialogTitle>
                      <DialogDescription>
                        Enter a new API key to update the current configuration
                      </DialogDescription>
                    </DialogHeader>
                    <ApiKeyForm 
                      provider={provider} 
                      onSave={handleSaveForm} 
                      onCancel={handleCloseForm} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Missing providers section */}
      {missingProviders.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-gray-700 flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-600" />
            Missing API Keys ({missingProviders.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {missingProviders.map(provider => (
              <div 
                key={provider.name}
                className="px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg flex justify-between items-center"
              >
                <span className="font-medium text-sm">{provider.name}</span>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Configure {provider.name}</DialogTitle>
                      <DialogDescription>
                        Add API credentials to enable real-time quotes from {provider.name}
                      </DialogDescription>
                    </DialogHeader>
                    <ApiKeyForm 
                      provider={provider} 
                      onSave={handleSaveForm} 
                      onCancel={handleCloseForm} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Continue button */}
      {apiStatus.ready && onComplete && (
        <div className="flex justify-end mt-6">
          <Button onClick={onComplete}>
            Continue with Real-Time Quotes
          </Button>
        </div>
      )}
      
      {/* Provider selection dialog */}
      <Dialog open={!!selectedProvider} onOpenChange={(open) => !open && setSelectedProvider(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProvider?.name} API Configuration
            </DialogTitle>
            <DialogDescription>
              Enter your API credentials to enable real-time quotes
            </DialogDescription>
          </DialogHeader>
          
          {selectedProvider && (
            <ApiKeyForm 
              provider={selectedProvider} 
              onSave={handleSaveForm} 
              onCancel={handleCloseForm} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}