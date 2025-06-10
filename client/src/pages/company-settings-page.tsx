import { useState } from "react";
import {
  Save,
  Lock,
  User,
  Bell,
  Key,
  Mail,
  Shield,
  HelpCircle,
  Globe,
  Moon,
  Sun,
  Languages,
  Clock
} from "lucide-react";
import CompanyLayout from "@/components/layout/company-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function CompanySettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("America/New_York");

  // Save settings handler
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
  };

  // Get company name or fallback to username
  const getCompanyName = () => {
    if (!user) return "Company";
    
    if (user.companyProfile?.name) {
      return user.companyProfile.name;
    }
    
    return user.username;
  };

  // Get user email
  const getUserEmail = () => {
    if (!user) return "email@example.com";
    return user.email;
  };

  return (
    <CompanyLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and company settings</p>
        </div>
        
        {/* Settings Tabs */}
        <Card className="bg-[#0A2540] border-[#1E3A59]">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-64 border-r border-[#1E3A59] flex-shrink-0">
              <div className="p-6">
                <div className="space-y-1">
                  <h3 className="text-white font-medium">Settings</h3>
                  <p className="text-gray-400 text-sm">Manage your preferences</p>
                </div>
              </div>
              <div className="border-t border-[#1E3A59]">
                <div className="py-2">
                  <button
                    className={`w-full text-left px-6 py-3 transition-colors flex items-center ${activeTab === "account" ? "bg-[#01101F] text-white" : "text-gray-400 hover:text-white hover:bg-[#01101F]"}`}
                    onClick={() => setActiveTab("account")}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Account
                  </button>
                  <button
                    className={`w-full text-left px-6 py-3 transition-colors flex items-center ${activeTab === "security" ? "bg-[#01101F] text-white" : "text-gray-400 hover:text-white hover:bg-[#01101F]"}`}
                    onClick={() => setActiveTab("security")}
                  >
                    <Lock className="h-4 w-4 mr-3" />
                    Security
                  </button>
                  <button
                    className={`w-full text-left px-6 py-3 transition-colors flex items-center ${activeTab === "notifications" ? "bg-[#01101F] text-white" : "text-gray-400 hover:text-white hover:bg-[#01101F]"}`}
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                  </button>
                  <button
                    className={`w-full text-left px-6 py-3 transition-colors flex items-center ${activeTab === "appearance" ? "bg-[#01101F] text-white" : "text-gray-400 hover:text-white hover:bg-[#01101F]"}`}
                    onClick={() => setActiveTab("appearance")}
                  >
                    <Moon className="h-4 w-4 mr-3" />
                    Appearance
                  </button>
                  <button
                    className={`w-full text-left px-6 py-3 transition-colors flex items-center ${activeTab === "apiKeys" ? "bg-[#01101F] text-white" : "text-gray-400 hover:text-white hover:bg-[#01101F]"}`}
                    onClick={() => setActiveTab("apiKeys")}
                  >
                    <Key className="h-4 w-4 mr-3" />
                    API Keys
                  </button>
                  <button
                    className={`w-full text-left px-6 py-3 transition-colors flex items-center ${activeTab === "help" ? "bg-[#01101F] text-white" : "text-gray-400 hover:text-white hover:bg-[#01101F]"}`}
                    onClick={() => setActiveTab("help")}
                  >
                    <HelpCircle className="h-4 w-4 mr-3" />
                    Help & Support
                  </button>
                </div>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 p-6">
              {/* Account Settings */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Account Settings</h2>
                    <p className="text-gray-400">Manage your company profile and account preferences</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name" className="text-white">Company Name</Label>
                      <Input
                        id="company-name"
                        value={getCompanyName()}
                        className="bg-[#01101F] border-[#1E3A59] text-white focus-visible:ring-[#33BFFF]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={getUserEmail()}
                        className="bg-[#01101F] border-[#1E3A59] text-white focus-visible:ring-[#33BFFF]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language" className="text-white">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger id="language" className="bg-[#01101F] border-[#1E3A59] text-white focus:ring-[#33BFFF]">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0A2540] border-[#1E3A59] text-white">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-white">Timezone</Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger id="timezone" className="bg-[#01101F] border-[#1E3A59] text-white focus:ring-[#33BFFF]">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0A2540] border-[#1E3A59] text-white">
                            <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                            <SelectItem value="Europe/London">London</SelectItem>
                            <SelectItem value="Europe/Paris">Paris</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-[#1E3A59] pt-6">
                    <Button 
                      className="bg-[#1570EF] hover:bg-[#0E63D6] text-white"
                      onClick={handleSaveSettings}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Security Settings</h2>
                    <p className="text-gray-400">Manage your account security and authentication methods</p>
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="bg-[#01101F] border-[#1E3A59]">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
                            <CardDescription className="text-gray-400">
                              Add an extra layer of security to your account
                            </CardDescription>
                          </div>
                          <Switch 
                            checked={twoFactorEnabled}
                            onCheckedChange={setTwoFactorEnabled}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 text-sm">
                          When enabled, you'll be required to provide a code from your authenticator app 
                          in addition to your password when signing in.
                        </p>
                      </CardContent>
                      {!twoFactorEnabled && (
                        <CardFooter className="border-t border-[#1E3A59] pt-4">
                          <Button
                            variant="outline"
                            className="border-[#1E3A59] text-white hover:bg-[#0A2540] hover:border-[#33BFFF]"
                            onClick={() => setTwoFactorEnabled(true)}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Enable 2FA
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                    
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-white">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-[#01101F] border-[#1E3A59] text-white focus-visible:ring-[#33BFFF]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-white">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-[#01101F] border-[#1E3A59] text-white focus-visible:ring-[#33BFFF]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-white">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-[#01101F] border-[#1E3A59] text-white focus-visible:ring-[#33BFFF]"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t border-[#1E3A59] pt-6">
                    <Button 
                      className="bg-[#1570EF] hover:bg-[#0E63D6] text-white"
                      onClick={handleSaveSettings}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Notification Settings</h2>
                    <p className="text-gray-400">Manage how and when you receive notifications</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">All email notifications</p>
                            <p className="text-gray-400 text-xs">Enable or disable all email notifications</p>
                          </div>
                          <Switch 
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">Plan performance updates</p>
                            <p className="text-gray-400 text-xs">Weekly summary of your plan performance</p>
                          </div>
                          <Switch checked={emailNotifications} disabled={!emailNotifications} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">Market insights</p>
                            <p className="text-gray-400 text-xs">Competitive analysis and market movement alerts</p>
                          </div>
                          <Switch checked={emailNotifications} disabled={!emailNotifications} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">Security alerts</p>
                            <p className="text-gray-400 text-xs">Critical account security notifications</p>
                          </div>
                          <Switch checked={true} disabled={!emailNotifications} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[#1E3A59] space-y-4">
                      <h3 className="text-lg font-medium text-white">Browser Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">All browser notifications</p>
                            <p className="text-gray-400 text-xs">Enable or disable all browser notifications</p>
                          </div>
                          <Switch 
                            checked={browserNotifications}
                            onCheckedChange={setBrowserNotifications}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">Real-time marketplace activity</p>
                            <p className="text-gray-400 text-xs">Notifications for significant views or clicks</p>
                          </div>
                          <Switch checked={browserNotifications} disabled={!browserNotifications} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">Competitive alerts</p>
                            <p className="text-gray-400 text-xs">When your competitiveness changes significantly</p>
                          </div>
                          <Switch checked={browserNotifications} disabled={!browserNotifications} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-[#1E3A59] pt-6">
                    <Button 
                      className="bg-[#1570EF] hover:bg-[#0E63D6] text-white"
                      onClick={handleSaveSettings}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Appearance Settings</h2>
                    <p className="text-gray-400">Customize how the Briki Copilot interface looks</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Theme</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full border ${darkMode ? 'border-[#33BFFF] bg-[#01101F]' : 'border-[#1E3A59] bg-[#F9FAFB]'} mr-3 flex items-center justify-center`}>
                            {darkMode ? (
                              <Moon className="h-5 w-5 text-[#33BFFF]" />
                            ) : (
                              <Sun className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
                            <p className="text-gray-400 text-xs">{darkMode ? 'Easier on the eyes at night' : 'Better visibility in bright light'}</p>
                          </div>
                        </div>
                        <Switch 
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-[#1E3A59]">
                      <h3 className="text-lg font-medium text-white">Language & Region</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language-select" className="text-white">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger id="language-select" className="bg-[#01101F] border-[#1E3A59] text-white focus:ring-[#33BFFF]">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0A2540] border-[#1E3A59] text-white">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone-select" className="text-white">Timezone</Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger id="timezone-select" className="bg-[#01101F] border-[#1E3A59] text-white focus:ring-[#33BFFF]">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0A2540] border-[#1E3A59] text-white">
                            <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                            <SelectItem value="Europe/London">London</SelectItem>
                            <SelectItem value="Europe/Paris">Paris</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-[#1E3A59] pt-6">
                    <Button 
                      className="bg-[#1570EF] hover:bg-[#0E63D6] text-white"
                      onClick={handleSaveSettings}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              )}
              
              {/* API Keys Settings */}
              {activeTab === "apiKeys" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">API Keys</h2>
                    <p className="text-gray-400">Manage API access for integrations with your systems</p>
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="bg-[#01101F] border-[#1E3A59]">
                      <CardHeader>
                        <CardTitle className="text-white">API Authentication</CardTitle>
                        <CardDescription className="text-gray-400">
                          Create and manage API keys for secure programmatic access
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="api-key" className="text-white">Current API Key</Label>
                            <div className="flex">
                              <Input
                                id="api-key"
                                value="••••••••••••••••••••••••••••••"
                                readOnly
                                className="bg-[#0A2540] border-[#1E3A59] text-white focus-visible:ring-[#33BFFF] rounded-r-none"
                              />
                              <Button
                                className="rounded-l-none bg-[#1570EF] hover:bg-[#0E63D6] text-white"
                              >
                                Show
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-gray-400 text-sm">
                            Your API key grants full access to your account. Keep it secure and never share it publicly.
                          </p>
                          
                          <div className="flex flex-wrap gap-3">
                            <Button
                              variant="outline"
                              className="border-[#1E3A59] text-white hover:bg-[#0A2540] hover:border-[#33BFFF]"
                            >
                              Generate New Key
                            </Button>
                            <Button
                              variant="outline"
                              className="border-[#1E3A59] text-white hover:bg-[#0A2540] hover:border-[#33BFFF]"
                            >
                              Revoke All Keys
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#01101F] border-[#1E3A59]">
                      <CardHeader>
                        <CardTitle className="text-white">API Documentation</CardTitle>
                        <CardDescription className="text-gray-400">
                          Learn how to integrate with the Briki Copilot platform
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400">
                          Our comprehensive API documentation covers everything you need to integrate 
                          Briki Copilot with your existing systems, from authentication to data models.
                        </p>
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            className="border-[#1E3A59] text-white hover:bg-[#0A2540] hover:border-[#33BFFF]"
                            onClick={() => window.open('https://api.brikiapp.com/docs', '_blank')}
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            View Documentation
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {/* Help & Support */}
              {activeTab === "help" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Help & Support</h2>
                    <p className="text-gray-400">Resources and assistance for your Briki Copilot account</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-[#01101F] border-[#1E3A59]">
                      <CardHeader>
                        <CardTitle className="text-white">Documentation</CardTitle>
                        <CardDescription className="text-gray-400">
                          Comprehensive guides and tutorials
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-gray-400 text-sm">
                          Explore our knowledge base for detailed information about all Briki Copilot features and capabilities.
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-[#1E3A59] text-white hover:bg-[#0A2540] hover:border-[#33BFFF]"
                          onClick={() => window.open('https://docs.brikiapp.com', '_blank')}
                        >
                          View Documentation
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#01101F] border-[#1E3A59]">
                      <CardHeader>
                        <CardTitle className="text-white">Contact Support</CardTitle>
                        <CardDescription className="text-gray-400">
                          Get help from our customer success team
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-gray-400 text-sm">
                          Our support team is available Monday-Friday, 9am-6pm ET to assist with your questions.
                        </p>
                        <Button
                          className="w-full bg-[#1570EF] hover:bg-[#0E63D6] text-white"
                          onClick={() => window.open('mailto:support@brikiapp.com', '_blank')}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email Support
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#01101F] border-[#1E3A59]">
                      <CardHeader>
                        <CardTitle className="text-white">Schedule Training</CardTitle>
                        <CardDescription className="text-gray-400">
                          Book a session with our product specialists
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-gray-400 text-sm">
                          Get personalized training for your team to maximize the value of your Briki Copilot subscription.
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-[#1E3A59] text-white hover:bg-[#0A2540] hover:border-[#33BFFF]"
                          onClick={() => window.open('https://calendly.com/briki-training', '_blank')}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Schedule Session
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#01101F] border-[#1E3A59]">
                      <CardHeader>
                        <CardTitle className="text-white">FAQ</CardTitle>
                        <CardDescription className="text-gray-400">
                          Quickly find answers to common questions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-gray-400 text-sm">
                          Browse our frequently asked questions for immediate answers to the most common inquiries.
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-[#1E3A59] text-white hover:bg-[#0A2540] hover:border-[#33BFFF]"
                          onClick={() => window.open('https://brikiapp.com/faq', '_blank')}
                        >
                          <HelpCircle className="h-4 w-4 mr-2" />
                          View FAQ
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </CompanyLayout>
  );
}