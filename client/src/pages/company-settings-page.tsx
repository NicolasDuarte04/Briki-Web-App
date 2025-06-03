import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Bell, 
  Shield, 
  CreditCard,
  Settings,
  Save,
  Upload
} from 'lucide-react';

interface CompanyProfile {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  description: string;
  logo?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
}

interface APISettings {
  apiKey: string;
  webhookUrl: string;
  rateLimit: number;
}

const CompanySettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<CompanyProfile>({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: ''
  });
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    weeklyReports: true
  });

  const [apiSettings, setApiSettings] = useState<APISettings>({
    apiKey: '',
    webhookUrl: '',
    rateLimit: 1000
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCompanySettings();
  }, []);

  const loadCompanySettings = async () => {
    try {
      const savedProfile = localStorage.getItem('companyProfile');
      const savedNotifications = localStorage.getItem('notificationSettings');
      const savedApiSettings = localStorage.getItem('apiSettings');

      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
      if (savedApiSettings) setApiSettings(JSON.parse(savedApiSettings));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('companyProfile', JSON.stringify(profile));
      toast({
        title: "Profile Updated",
        description: "Your company profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(notifications));
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiSettings = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('apiSettings', JSON.stringify(apiSettings));
      toast({
        title: "API Settings Updated",
        description: "Your API configuration has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update API settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              Company Settings
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Manage your company profile, notifications, and API settings
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Profile</span>
                <span className="sm:hidden">Info</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>API</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Billing</span>
                <span className="sm:hidden">Bill</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Company Profile</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Update your company information and branding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm sm:text-base">Company Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        placeholder="Enter company name"
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm sm:text-base">Contact Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        placeholder="contact@company.com"
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm sm:text-base">Website</Label>
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                        placeholder="https://company.com"
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm sm:text-base">Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      placeholder="123 Business St, City, State 12345"
                      className="text-sm sm:text-base"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm sm:text-base">Company Description</Label>
                    <Textarea
                      id="description"
                      value={profile.description}
                      onChange={(e) => setProfile({...profile, description: e.target.value})}
                      placeholder="Describe your company and services..."
                      className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Company Logo</Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm" className="text-sm">
                        <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isLoading}
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Notification Preferences</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Configure how you want to receive updates and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 flex-1 mr-4">
                        <Label className="text-sm sm:text-base">Email Notifications</Label>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Receive important updates via email
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, emailNotifications: checked})
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 flex-1 mr-4">
                        <Label className="text-sm sm:text-base">SMS Notifications</Label>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Get urgent alerts via text
                        </p>
                      </div>
                      <Switch
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, smsNotifications: checked})
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 flex-1 mr-4">
                        <Label className="text-sm sm:text-base">Marketing Emails</Label>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Product updates and promotions
                        </p>
                      </div>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, marketingEmails: checked})
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 flex-1 mr-4">
                        <Label className="text-sm sm:text-base">Weekly Reports</Label>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Weekly analytics summaries
                        </p>
                      </div>
                      <Switch
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, weeklyReports: checked})
                        }
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleSaveNotifications} 
                    disabled={isLoading}
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">API Configuration</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Manage your API keys and integration settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey" className="text-sm sm:text-base">API Key</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          id="apiKey"
                          type="password"
                          value={apiSettings.apiKey}
                          onChange={(e) => setApiSettings({...apiSettings, apiKey: e.target.value})}
                          placeholder="Enter your API key"
                          className="flex-1 text-sm sm:text-base"
                        />
                        <Button variant="outline" size="sm" className="text-sm">
                          Generate
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl" className="text-sm sm:text-base">Webhook URL</Label>
                      <Input
                        id="webhookUrl"
                        value={apiSettings.webhookUrl}
                        onChange={(e) => setApiSettings({...apiSettings, webhookUrl: e.target.value})}
                        placeholder="https://your-site.com/webhook"
                        className="text-sm sm:text-base"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rateLimit" className="text-sm sm:text-base">Rate Limit (requests/hour)</Label>
                      <Input
                        id="rateLimit"
                        type="number"
                        value={apiSettings.rateLimit}
                        onChange={(e) => setApiSettings({...apiSettings, rateLimit: parseInt(e.target.value)})}
                        placeholder="1000"
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">API Documentation</h4>
                    <p className="text-blue-800 text-xs sm:text-sm mb-3">
                      Access our comprehensive API documentation to integrate with your systems.
                    </p>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 text-xs sm:text-sm">
                      View Documentation
                    </Button>
                  </div>

                  <Button 
                    onClick={handleSaveApiSettings} 
                    disabled={isLoading}
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Save API Settings
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Billing & Subscription</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Manage your subscription and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg gap-3">
                    <div>
                      <h4 className="font-medium text-green-900 text-sm sm:text-base">Current Plan: Professional</h4>
                      <p className="text-green-800 text-xs sm:text-sm">Next billing date: January 15, 2024</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs sm:text-sm">
                      Active
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 border rounded-lg">
                      <h4 className="font-medium text-sm sm:text-base">Monthly Usage</h4>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">847</p>
                      <p className="text-xs sm:text-sm text-gray-600">API calls</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 border rounded-lg">
                      <h4 className="font-medium text-sm sm:text-base">Plan Limit</h4>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">5,000</p>
                      <p className="text-xs sm:text-sm text-gray-600">API calls</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 border rounded-lg">
                      <h4 className="font-medium text-sm sm:text-base">Next Bill</h4>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">$99</p>
                      <p className="text-xs sm:text-sm text-gray-600">USD</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button variant="outline" className="text-sm sm:text-base">
                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Update Payment Method
                    </Button>
                    <Button variant="outline" className="text-sm sm:text-base">
                      Download Invoices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanySettingsPage;