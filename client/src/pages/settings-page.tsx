import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2, User, Bell, CreditCard, Shield, Globe, Lock } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Footer from "@/components/footer";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const containerAnimationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const settingsSections = [
    { id: "account", label: "Account", icon: <User className="h-5 w-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-5 w-5" /> },
    { id: "payment", label: "Payment Methods", icon: <CreditCard className="h-5 w-5" /> },
    { id: "insurance", label: "Insurance", icon: <Shield className="h-5 w-5" /> },
    { id: "region", label: "Region & Language", icon: <Globe className="h-5 w-5" /> },
    { id: "security", label: "Security", icon: <Lock className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto max-w-6xl">
          <motion.div {...containerAnimationProps}>
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Sidebar */}
              <div className="md:col-span-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-1">
                      {settingsSections.map((section) => (
                        <motion.div
                          key={section.id}
                          whileHover={{ 
                            backgroundColor: "rgba(0,0,0,0.05)", 
                            x: 3 
                          }}
                          className="flex items-center gap-3 p-2 rounded-md cursor-pointer"
                        >
                          <div className="text-gray-500">{section.icon}</div>
                          <span>{section.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main content */}
              <div className="md:col-span-9">
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 md:grid-cols-6">
                    {settingsSections.map((section) => (
                      <TabsTrigger key={section.id} value={section.id}>
                        <span className="hidden md:inline">{section.label}</span>
                        <span className="md:hidden">{section.icon}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {/* Account Settings */}
                  <TabsContent value="account">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Update your account information</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="Enter your full name" defaultValue={user.name || ""} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" defaultValue={user.username} disabled className="bg-gray-50" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="Enter your email" defaultValue={user.email || ""} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="Enter your phone number" />
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
                          <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                              {user.name ? user.name[0].toUpperCase() : user.username[0].toUpperCase()}
                            </div>
                            <div>
                              <AnimatedButton variant="outline" size="sm" className="mb-2">
                                Upload New
                              </AnimatedButton>
                              <p className="text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Delete Account</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <AnimatedButton variant="destructive">
                            Delete Account
                          </AnimatedButton>
                        </div>
                        
                        <div className="flex justify-end space-x-4 pt-4 border-t">
                          <AnimatedButton variant="outline">
                            Cancel
                          </AnimatedButton>
                          <AnimatedButton>
                            Save Changes
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Notifications Settings */}
                  <TabsContent value="notifications">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>Control how you receive notifications</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Trip Reminders</Label>
                                <p className="text-sm text-gray-500">Get notified about upcoming trips</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Policy Updates</Label>
                                <p className="text-sm text-gray-500">Receive notifications about your insurance policies</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Marketing & Promotions</Label>
                                <p className="text-sm text-gray-500">Receive special offers and discounts</p>
                              </div>
                              <Switch />
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">SMS Notifications</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Trip Alerts</Label>
                                <p className="text-sm text-gray-500">Get SMS notifications for important trip updates</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Travel Warnings</Label>
                                <p className="text-sm text-gray-500">Receive alerts about travel advisories</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>App Notifications</Label>
                                <p className="text-sm text-gray-500">Enable or disable all in-app notifications</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4 pt-4 border-t">
                          <AnimatedButton variant="outline">
                            Cancel
                          </AnimatedButton>
                          <AnimatedButton>
                            Save Changes
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Payment Methods Settings */}
                  <TabsContent value="payment">
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Manage your payment information</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Saved Payment Methods</h3>
                          <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                              <div className="flex justify-between">
                                <div className="flex gap-3">
                                  <CreditCard className="h-6 w-6 text-blue-600" />
                                  <div>
                                    <p className="font-medium">Visa ending in 4242</p>
                                    <p className="text-sm text-gray-500">Expires 12/24</p>
                                  </div>
                                </div>
                                <div className="space-x-2">
                                  <AnimatedButton variant="outline" size="sm">Edit</AnimatedButton>
                                  <AnimatedButton variant="destructive" size="sm">Remove</AnimatedButton>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <AnimatedButton className="mt-4">
                            Add Payment Method
                          </AnimatedButton>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Billing Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="address">Street Address</Label>
                              <Input id="address" placeholder="Enter your street address" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input id="city" placeholder="Enter your city" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">State/Province</Label>
                              <Input id="state" placeholder="Enter your state or province" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="zip">ZIP/Postal Code</Label>
                              <Input id="zip" placeholder="Enter your ZIP code" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="country">Country</Label>
                              <Input id="country" placeholder="Enter your country" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4 pt-4 border-t">
                          <AnimatedButton variant="outline">
                            Cancel
                          </AnimatedButton>
                          <AnimatedButton>
                            Save Changes
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Insurance Settings */}
                  <TabsContent value="insurance">
                    <Card>
                      <CardHeader>
                        <CardTitle>Insurance Preferences</CardTitle>
                        <CardDescription>Manage your insurance settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Default Travel Insurance Preferences</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Medical Coverage Priority</Label>
                                <p className="text-sm text-gray-500">Prioritize medical coverage in quotes</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Trip Cancellation Coverage</Label>
                                <p className="text-sm text-gray-500">Include trip cancellation in quotes</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Adventure Activities</Label>
                                <p className="text-sm text-gray-500">Include coverage for adventure activities</p>
                              </div>
                              <Switch />
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Medical Information</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Pre-existing Conditions</Label>
                                <p className="text-sm text-gray-500">I have pre-existing medical conditions</p>
                              </div>
                              <Switch />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="age">Age</Label>
                              <Input id="age" type="number" placeholder="Enter your age" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Preferred Providers</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>AXA</Label>
                                <p className="text-sm text-gray-500">Include in search results</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>IATI</Label>
                                <p className="text-sm text-gray-500">Include in search results</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Assist Card</Label>
                                <p className="text-sm text-gray-500">Include in search results</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Starr</Label>
                                <p className="text-sm text-gray-500">Include in search results</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>SURA</Label>
                                <p className="text-sm text-gray-500">Include in search results</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4 pt-4 border-t">
                          <AnimatedButton variant="outline">
                            Cancel
                          </AnimatedButton>
                          <AnimatedButton>
                            Save Changes
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Region Settings */}
                  <TabsContent value="region">
                    <Card>
                      <CardHeader>
                        <CardTitle>Region & Language</CardTitle>
                        <CardDescription>Configure your regional preferences</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Language Preferences</h3>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="language">Display Language</Label>
                              <select id="language" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="pt">Português</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Regional Settings</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="timezone">Timezone</Label>
                              <select id="timezone" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="utc-5">Eastern Time (UTC-5)</option>
                                <option value="utc-6">Central Time (UTC-6)</option>
                                <option value="utc-7">Mountain Time (UTC-7)</option>
                                <option value="utc-8">Pacific Time (UTC-8)</option>
                                <option value="utc-3">São Paulo (UTC-3)</option>
                                <option value="utc-5">Bogotá (UTC-5)</option>
                                <option value="utc-6">Mexico City (UTC-6)</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="currency">Currency</Label>
                              <select id="currency" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="usd">USD ($)</option>
                                <option value="eur">EUR (€)</option>
                                <option value="cop">COP ($)</option>
                                <option value="mxn">MXN ($)</option>
                                <option value="brl">BRL (R$)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Date & Time Format</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="dateFormat">Date Format</Label>
                              <select id="dateFormat" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="mdy">MM/DD/YYYY</option>
                                <option value="dmy">DD/MM/YYYY</option>
                                <option value="ymd">YYYY-MM-DD</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="timeFormat">Time Format</Label>
                              <select id="timeFormat" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="12h">12-hour (AM/PM)</option>
                                <option value="24h">24-hour</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4 pt-4 border-t">
                          <AnimatedButton variant="outline">
                            Cancel
                          </AnimatedButton>
                          <AnimatedButton>
                            Save Changes
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Security Settings */}
                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>Manage your account security</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Change Password</h3>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input id="currentPassword" type="password" placeholder="Enter your current password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input id="newPassword" type="password" placeholder="Enter your new password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input id="confirmPassword" type="password" placeholder="Confirm your new password" />
                            </div>
                          </div>
                          <div className="mt-4">
                            <AnimatedButton>
                              Update Password
                            </AnimatedButton>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                          <div className="flex items-center justify-between mb-4">
                            <div className="space-y-0.5">
                              <Label>Enable Two-Factor Authentication</Label>
                              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                            Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Session Management</h3>
                          <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium">Current Session</p>
                                  <p className="text-sm text-gray-500">Chrome on Windows • IP: 192.168.1.1</p>
                                  <p className="text-xs text-gray-400 mt-1">Active now</p>
                                </div>
                                <div className="space-y-2">
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Current</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <AnimatedButton variant="destructive">
                              Sign Out of All Devices
                            </AnimatedButton>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Activity Tracking</Label>
                                <p className="text-sm text-gray-500">Allow Briki to track your app usage for better recommendations</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Data Sharing</Label>
                                <p className="text-sm text-gray-500">Share anonymous usage data to help improve the app</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4 pt-4 border-t">
                          <AnimatedButton variant="outline">
                            Cancel
                          </AnimatedButton>
                          <AnimatedButton>
                            Save Changes
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}