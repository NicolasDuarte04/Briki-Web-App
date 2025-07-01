import { useState } from "react";
import { 
  ExternalLink, 
  Edit, 
  Upload, 
  Globe,
  Eye, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Search, 
  Filter
} from "lucide-react";
import CompanyLayout from "../components/layout/company-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";

// Sample data for marketplace page
const marketplaceStatus = {
  status: "approved",
  qualificationScore: 85,
  visibilityStatus: "public",
  profileCompletion: 92,
  lastUpdated: "2 weeks ago",
};

const profileViews = [
  { month: "Jan", views: 120 },
  { month: "Feb", views: 150 },
  { month: "Mar", views: 180 },
  { month: "Apr", views: 210 },
  { month: "May", views: 240 },
  { month: "Jun", views: 310 },
];

const activeInsurancePlans = [
  { 
    id: 1, 
    name: "Standard Travel", 
    type: "Travel", 
    visibility: "public",
    popularity: "high", 
    impressions: 1250,
    clicks: 325,
    ctr: "26%"
  },
  { 
    id: 2, 
    name: "Essential Health", 
    type: "Health", 
    visibility: "public",
    popularity: "medium", 
    impressions: 890,
    clicks: 156,
    ctr: "18%"
  },
  { 
    id: 3, 
    name: "Basic Auto", 
    type: "Auto", 
    visibility: "public",
    popularity: "medium", 
    impressions: 760,
    clicks: 120,
    ctr: "16%"
  },
  { 
    id: 4, 
    name: "Premier Travel", 
    type: "Travel", 
    visibility: "hidden",
    popularity: "n/a", 
    impressions: 0,
    clicks: 0,
    ctr: "n/a"
  },
];

export default function CompanyMarketplacePage() {
  const { toast } = useToast();
  const [marketplaceVisibility, setMarketplaceVisibility] = useState(
    marketplaceStatus.visibilityStatus === "public"
  );
  
  // Handle toggling marketplace visibility
  const handleVisibilityChange = (checked: boolean) => {
    setMarketplaceVisibility(checked);
    
    toast({
      title: `Marketplace profile ${checked ? 'published' : 'hidden'}`,
      description: `Your profile is now ${checked ? 'visible' : 'hidden'} to the public`,
    });
  };
  
  // Handle editing profile
  const handleEditProfile = () => {
    toast({
      title: "Profile editor opened",
      description: "You can now update your marketplace profile details",
    });
  };
  
  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 border-emerald-500/20";
      case "pending":
        return "bg-amber-600/10 text-amber-500 hover:bg-amber-600/20 border-amber-500/20";
      case "rejected":
        return "bg-red-600/10 text-red-500 hover:bg-red-600/20 border-red-500/20";
      default:
        return "bg-gray-600/10 text-gray-400 hover:bg-gray-600/20 border-gray-500/20";
    }
  };
  
  // Get popularity badge color
  const getPopularityBadge = (popularity: string) => {
    switch (popularity) {
      case "high":
        return "bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 border-emerald-500/20";
      case "medium":
        return "bg-amber-600/10 text-amber-500 hover:bg-amber-600/20 border-amber-500/20";
      case "low":
        return "bg-gray-600/10 text-gray-400 hover:bg-gray-600/20 border-gray-500/20";
      default:
        return "bg-[#1E3A59] text-gray-400";
    }
  };

  return (
    <CompanyLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-white">Marketplace</h1>
            <p className="text-gray-400">Manage your public profile and insurance plan visibility</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Label htmlFor="marketplace-visibility" className="text-white">Profile Visibility</Label>
              <Switch 
                id="marketplace-visibility" 
                checked={marketplaceVisibility}
                onCheckedChange={handleVisibilityChange}
              />
            </div>
            <Button 
              className="bg-[#1570EF] hover:bg-[#0E63D6] text-white"
              onClick={handleEditProfile}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
        
        {/* Profile Status Card */}
        <Card className="bg-[#0A2540] border-[#1E3A59]">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-white text-xl">Marketplace Profile</CardTitle>
                <CardDescription className="text-gray-400">
                  Your public presence on the Briki insurance marketplace
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge className={`${getStatusBadge(marketplaceStatus.status)} capitalize`}>
                  {marketplaceStatus.status}
                </Badge>
                <Button
                  variant="outline"
                  className="border-[#1E3A59] text-white hover:bg-[#01101F] hover:border-[#33BFFF]"
                  onClick={() => window.open('https://marketplace.brikiapp.com/preview/company-name', '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Qualification Score */}
              <div className="bg-[#01101F] rounded-lg p-5 border border-[#1E3A59]">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-medium">Qualification Score</h3>
                    <p className="text-gray-400 text-sm mt-1">Based on profile completeness and plan quality</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-[#0A2540] border border-[#1E3A59] flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-[#33BFFF]" />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">{marketplaceStatus.qualificationScore}</span>
                  <span className="text-gray-400 text-sm mb-1">/ 100</span>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-[#0A2540] rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-[#33BFFF] to-[#1570EF] h-2.5 rounded-full" 
                      style={{ width: `${marketplaceStatus.qualificationScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Profile Completion */}
              <div className="bg-[#01101F] rounded-lg p-5 border border-[#1E3A59]">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-medium">Profile Completion</h3>
                    <p className="text-gray-400 text-sm mt-1">Essential information for marketplace visibility</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-[#0A2540] border border-[#1E3A59] flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#33BFFF]" />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">{marketplaceStatus.profileCompletion}%</span>
                </div>
                <div className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Company details</span>
                      <Badge className="bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 border-emerald-500/20">
                        Complete
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Logo & branding</span>
                      <Badge className="bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 border-emerald-500/20">
                        Complete
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Public insurance plans</span>
                      <Badge className="bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 border-emerald-500/20">
                        Complete
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Customer testimonials</span>
                      <Badge className="bg-amber-600/10 text-amber-500 hover:bg-amber-600/20 border-amber-500/20">
                        Missing
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Profile Visibility */}
              <div className="bg-[#01101F] rounded-lg p-5 border border-[#1E3A59]">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-medium">Public Visibility</h3>
                    <p className="text-gray-400 text-sm mt-1">Control how customers see your profile</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-[#0A2540] border border-[#1E3A59] flex items-center justify-center">
                    <Globe className="h-6 w-6 text-[#33BFFF]" />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="profile-visible" className="text-white">Profile visible</Label>
                    <Switch 
                      id="profile-visible" 
                      checked={marketplaceVisibility}
                      onCheckedChange={handleVisibilityChange}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="featured-provider" className="text-white">Featured provider</Label>
                    <Switch 
                      id="featured-provider" 
                      checked={true}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="show-ratings" className="text-white">Show customer ratings</Label>
                    <Switch 
                      id="show-ratings" 
                      checked={true}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="allow-comparisons" className="text-white">Allow plan comparisons</Label>
                    <Switch 
                      id="allow-comparisons" 
                      checked={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#1E3A59] pt-4">
            <div className="flex items-center justify-between w-full">
              <div className="text-gray-400 text-sm">
                Last updated: {marketplaceStatus.lastUpdated}
              </div>
              <Button 
                variant="outline" 
                className="border-[#1E3A59] text-white hover:bg-[#01101F] hover:border-[#33BFFF]"
                onClick={handleEditProfile}
              >
                <Upload className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* Insurance Plans Table */}
        <Card className="bg-[#0A2540] border-[#1E3A59]">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
              <div>
                <CardTitle className="text-white">Insurance Plans</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your plans' visibility in the marketplace
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-[240px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search plans"
                    className="pl-8 bg-[#01101F] border-[#1E3A59] text-white focus-visible:ring-[#33BFFF] w-full"
                  />
                </div>
                <Button variant="outline" size="icon" className="border-[#1E3A59] text-gray-400 hover:text-white hover:bg-[#1E3A59]">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="mt-6">
              <TabsList className="bg-[#01101F] w-full justify-start overflow-auto">
                <TabsTrigger value="all">All Plans</TabsTrigger>
                <TabsTrigger value="public">Public</TabsTrigger>
                <TabsTrigger value="hidden">Hidden</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E3A59]">
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Name</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Visibility</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Popularity</th>
                    <th className="text-center p-4 text-sm font-medium text-gray-400">Impressions</th>
                    <th className="text-center p-4 text-sm font-medium text-gray-400">Clicks</th>
                    <th className="text-center p-4 text-sm font-medium text-gray-400">CTR</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeInsurancePlans.map((plan) => (
                    <tr 
                      key={plan.id} 
                      className="border-b border-[#1E3A59]"
                    >
                      <td className="p-4 text-white text-sm">{plan.name}</td>
                      <td className="p-4 text-white text-sm">{plan.type}</td>
                      <td className="p-4">
                        <Badge
                          className={plan.visibility === "public" 
                            ? "bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 border-emerald-500/20" 
                            : "bg-gray-600/10 text-gray-400 hover:bg-gray-600/20 border-gray-500/20"
                          }
                        >
                          {plan.visibility}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={getPopularityBadge(plan.popularity)}
                        >
                          {plan.popularity}
                        </Badge>
                      </td>
                      <td className="p-4 text-center text-white text-sm">
                        {plan.impressions.toLocaleString()}
                      </td>
                      <td className="p-4 text-center text-white text-sm">
                        {plan.clicks.toLocaleString()}
                      </td>
                      <td className="p-4 text-center text-white text-sm">
                        {plan.ctr}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#01101F]"
                            onClick={() => window.open('https://marketplace.brikiapp.com/preview/plan/1', '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#01101F]"
                            onClick={handleEditProfile}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Marketplace Insights */}
        <Card className="bg-[#0A2540] border-[#1E3A59]">
          <CardHeader>
            <CardTitle className="text-white">Marketplace Insights</CardTitle>
            <CardDescription className="text-gray-400">
              Understand how customers are interacting with your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Visitor Metrics Card */}
              <div className="col-span-2 bg-[#01101F] rounded-lg p-5 border border-[#1E3A59]">
                <h3 className="text-white font-medium mb-4">Profile Views</h3>
                <div className="h-60">
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Chart placeholder for profile view analytics over time
                  </div>
                </div>
              </div>
              
              {/* Marketplace Tips Card */}
              <div className="bg-[#01101F] rounded-lg p-5 border border-[#1E3A59]">
                <div className="flex items-start mb-4">
                  <div className="p-2 bg-[#1570EF]/20 rounded-md mr-3">
                    <Sparkles className="h-5 w-5 text-[#33BFFF]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Enhancement Tips</h3>
                    <p className="text-gray-400 text-sm mt-1">Recommendations to improve visibility</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-[#0A2540] rounded-md border border-[#1E3A59]">
                    <p className="text-white text-sm font-medium mb-1">Add customer testimonials</p>
                    <p className="text-gray-400 text-xs">
                      Profiles with testimonials see 35% higher engagement rates. Add at least 3 customer testimonials.
                    </p>
                  </div>
                  <div className="p-3 bg-[#0A2540] rounded-md border border-[#1E3A59]">
                    <p className="text-white text-sm font-medium mb-1">Highlight unique selling points</p>
                    <p className="text-gray-400 text-xs">
                      Stand out by adding more detailed descriptions about what makes your plans unique.
                    </p>
                  </div>
                  <div className="p-3 bg-[#0A2540] rounded-md border border-[#1E3A59]">
                    <p className="text-white text-sm font-medium mb-1">Update feature comparison</p>
                    <p className="text-gray-400 text-xs">
                      Ensure all your plan features are correctly structured for comparative analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#1E3A59] pt-4">
            <Button 
              variant="link" 
              className="text-[#33BFFF] hover:text-white p-0 h-auto text-sm"
              onClick={() => window.open('https://help.brikiapp.com/marketplace-optimization', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Learn more about marketplace optimization
            </Button>
          </CardFooter>
        </Card>
      </div>
    </CompanyLayout>
  );
}