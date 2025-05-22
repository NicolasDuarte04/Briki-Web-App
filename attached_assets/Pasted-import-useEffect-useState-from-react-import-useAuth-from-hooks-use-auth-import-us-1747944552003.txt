import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2, User, Bookmark, Shield, Clock, CreditCard } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/footer";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [profileTab, setProfileTab] = useState("overview");
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [isLoading, user, navigate]);
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.name) {
      return user.name[0].toUpperCase();
    }
    
    return user.username[0].toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Profile sidebar */}
              <div className="w-full md:w-1/3 lg:w-1/4">
                <Card>
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserInitials()}`}
                          alt={user.username}
                        />
                        <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-xl">{user.name || user.username}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                    <div className="mt-2">
                      <Badge variant="outline" className="mr-1">Traveler</Badge>
                      <Badge variant="outline" className="bg-primary/10">Member since 2023</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <AnimatedButton 
                      className="w-full mb-4"
                      onClick={() => setProfileTab("settings")}
                    >
                      Edit Profile
                    </AnimatedButton>

                    <div className="space-y-4 mt-4">
                      <div className="flex gap-3 items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                        <User className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">Personal Information</span>
                      </div>
                      <div className="flex gap-3 items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                        <Shield className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">Insurance History</span>
                      </div>
                      <div className="flex gap-3 items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                        <Bookmark className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">Saved Quotes</span>
                      </div>
                      <div className="flex gap-3 items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">Recent Activity</span>
                      </div>
                      <div className="flex gap-3 items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">Payment Methods</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main content area */}
              <div className="w-full md:w-2/3 lg:w-3/4">
                <Tabs 
                  defaultValue="overview" 
                  value={profileTab} 
                  onValueChange={setProfileTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Overview</CardTitle>
                        <CardDescription>View your profile information and travel history</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Your Travel Stats</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-primary/10 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-primary">3</p>
                                <p className="text-sm text-gray-500 mt-1">Trips Taken</p>
                              </div>
                              <div className="bg-primary/10 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-primary">2</p>
                                <p className="text-sm text-gray-500 mt-1">Active Policies</p>
                              </div>
                              <div className="bg-primary/10 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-primary">5</p>
                                <p className="text-sm text-gray-500 mt-1">Countries Visited</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-4">Upcoming Trips</h3>
                            <div className="space-y-4">
                              <div className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">Mexico City Trip</h4>
                                    <p className="text-sm text-gray-500">Dec 15, 2023 - Dec 22, 2023</p>
                                    <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">Insured</Badge>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium">Policy #TRV-2023-0542</p>
                                    <p className="text-xs text-gray-500">AXA Travel Insurance</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">Cartagena Beach Vacation</h4>
                                    <p className="text-sm text-gray-500">Jan 5, 2024 - Jan 15, 2024</p>
                                    <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">Insured</Badge>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium">Policy #TRV-2023-0601</p>
                                    <p className="text-xs text-gray-500">SURA Travel Protection</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between border-b pb-2">
                                <div className="text-sm">
                                  <p className="font-medium">Purchased Travel Insurance</p>
                                  <p className="text-gray-500">Policy #TRV-2023-0601</p>
                                </div>
                                <div className="text-sm text-gray-500">Nov 2, 2023</div>
                              </div>
                              <div className="flex justify-between border-b pb-2">
                                <div className="text-sm">
                                  <p className="font-medium">Viewed Insurance Plans</p>
                                  <p className="text-gray-500">Compared 5 policies</p>
                                </div>
                                <div className="text-sm text-gray-500">Nov 1, 2023</div>
                              </div>
                              <div className="flex justify-between border-b pb-2">
                                <div className="text-sm">
                                  <p className="font-medium">Created New Trip</p>
                                  <p className="text-gray-500">Mexico City, Dec 15-22</p>
                                </div>
                                <div className="text-sm text-gray-500">Oct 28, 2023</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your account preferences and information</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  defaultValue={user.name || ""}
                                  placeholder="Enter your full name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                  defaultValue={user.username}
                                  disabled
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                  type="email"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  defaultValue={user.email || ""}
                                  placeholder="Enter your email"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                  type="tel"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  defaultValue=""
                                  placeholder="Enter your phone number"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Address Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  defaultValue=""
                                  placeholder="Enter your street address"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  defaultValue=""
                                  placeholder="Enter your city"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  defaultValue=""
                                  placeholder="Enter your state/province"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  defaultValue=""
                                  placeholder="Enter your postal code"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  defaultValue=""
                                  placeholder="Enter your country"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                  type="password"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  placeholder="Enter your current password"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <div className="h-0.5 bg-gray-200 my-4"></div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                  type="password"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  placeholder="Enter new password"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                  type="password"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  placeholder="Confirm new password"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Email Notifications</p>
                                  <p className="text-sm text-gray-500">Receive updates and alerts via email</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">SMS Notifications</p>
                                  <p className="text-sm text-gray-500">Receive updates and alerts via SMS</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Marketing Communications</p>
                                  <p className="text-sm text-gray-500">Receive offers and promotions</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-4">
                            <AnimatedButton variant="outline">
                              Cancel
                            </AnimatedButton>
                            <AnimatedButton>
                              Save Changes
                            </AnimatedButton>
                          </div>
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