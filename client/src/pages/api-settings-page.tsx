import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronLeft, Database, Key, BarChart, ServerCog, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProviderApiSetup from '@/components/provider-api-setup';
import ProviderStatusDashboard from '@/components/provider-status-dashboard';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { FuturisticBackground } from '@/components/ui/futuristic-background';
import { useInvalidatePlansCache } from '@/services/caching/insurance-cache';
import { useToast } from '@/hooks/use-toast';

export default function ApiSettingsPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('connections');
  const invalidateCacheMutation = useInvalidatePlansCache();
  const { toast } = useToast();
  
  // Create a local function to safely call the mutation
  const invalidateCache = () => {
    invalidateCacheMutation.mutate({});
  };
  
  const handleRefreshData = () => {
    // Invalidate all plans cache
    invalidateCache();
    
    toast({
      title: 'Cache Refreshed',
      description: 'Insurance data cache has been cleared. Fresh data will be loaded on your next search.',
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <FuturisticBackground particleCount={40} interactive={false} />
      </div>
      
      <div className="flex-grow relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center mb-6">
            <Link href="/" className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-primary/20 shadow-glow-sm flex items-center justify-center text-foreground hover:text-primary transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="ml-4">
              <h1 className="text-2xl font-bold section-header">API Settings & Data Management</h1>
              <p className="text-sm text-foreground/70 mt-1">
                Configure provider connections and manage real-time data
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-1 space-y-4"
            >
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm">
                <CardHeader className="pb-3">
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Manage API connections and data
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-1">
                  <Button 
                    variant={activeTab === 'connections' ? 'secondary' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setActiveTab('connections')}
                  >
                    <Key className="mr-2 h-4 w-4" />
                    API Connections
                  </Button>
                  <Button 
                    variant={activeTab === 'status' ? 'secondary' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setActiveTab('status')}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    Provider Status
                  </Button>
                  <Button 
                    variant={activeTab === 'cache' ? 'secondary' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setActiveTab('cache')}
                  >
                    <Database className="mr-2 h-4 w-4" />
                    Cache Management
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm">Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start gap-2"
                    onClick={handleRefreshData}
                    disabled={isPending}
                  >
                    <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                    Refresh Data Cache
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start gap-2"
                    onClick={() => navigate('/insurance-plans')}
                  >
                    <ServerCog className="h-4 w-4" />
                    View Insurance Plans
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-3"
            >
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full rounded-t-lg bg-background/60 backdrop-blur-sm border-b border-primary/10 p-0">
                    <TabsTrigger
                      value="connections"
                      className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none py-4"
                    >
                      API Connections
                    </TabsTrigger>
                    <TabsTrigger
                      value="status"
                      className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none py-4"
                    >
                      Provider Status
                    </TabsTrigger>
                    <TabsTrigger
                      value="cache"
                      className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none py-4"
                    >
                      Cache Management
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="connections" className="p-6">
                    <ProviderApiSetup />
                  </TabsContent>
                  
                  <TabsContent value="status" className="p-6">
                    <ProviderStatusDashboard refreshInterval={20000} />
                  </TabsContent>
                  
                  <TabsContent value="cache" className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Data Caching Configuration</h3>
                        <p className="text-sm text-foreground/70 mb-4">
                          Manage how insurance data is cached and refreshed across the application.
                        </p>
                        
                        <div className="grid gap-4 mt-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Cache Settings</CardTitle>
                              <CardDescription>
                                Configure how long data is cached
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4">
                                <div className="flex justify-between items-center py-2 border-b">
                                  <div>
                                    <p className="font-medium">Stale Time</p>
                                    <p className="text-sm text-foreground/70">How long data remains fresh</p>
                                  </div>
                                  <p className="font-mono">5 minutes</p>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                  <div>
                                    <p className="font-medium">Cache Time</p>
                                    <p className="text-sm text-foreground/70">How long data stays in memory</p>
                                  </div>
                                  <p className="font-mono">1 hour</p>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                  <div>
                                    <p className="font-medium">Retry Count</p>
                                    <p className="text-sm text-foreground/70">Number of retries on failure</p>
                                  </div>
                                  <p className="font-mono">3 attempts</p>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <div>
                                    <p className="font-medium">Auto Prefetch</p>
                                    <p className="text-sm text-foreground/70">Preload data on navigation</p>
                                  </div>
                                  <p className="font-mono">Enabled</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Cache Maintenance</CardTitle>
                              <CardDescription>
                                Refresh and manage cached data
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <Button 
                                  className="w-full gap-2" 
                                  onClick={handleRefreshData}
                                  disabled={isPending}
                                >
                                  <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                                  Clear Cache & Refresh Data
                                </Button>
                                <p className="text-xs text-foreground/70 italic">
                                  This will clear all cached insurance data. Fresh data will be fetched on the next search.
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}