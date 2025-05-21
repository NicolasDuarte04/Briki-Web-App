import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CompanyLayout } from "@/components/layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanyProfile, CompanyFeatures } from "@shared/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon, Upload, CheckCircle2 } from "lucide-react";

// Company profile form schema
const profileSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

// API key schema
const apiKeySchema = z.object({
  keyName: z.string().min(1, "Key name is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type ApiKeyFormValues = z.infer<typeof apiKeySchema>;

export default function CompanySettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch company profile data
  const { data: companyData, isLoading } = useQuery<CompanyProfile>({
    queryKey: ["/api/company/profile"],
    enabled: !!user?.id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: companyData ? {
      name: companyData.name || "",
      email: companyData.email || user?.email || "",
      phone: companyData.phone || "",
      website: companyData.website || "",
      description: companyData.description || "",
      address: companyData.address || "",
      city: companyData.city || "",
      state: companyData.state || "",
      zipCode: companyData.zipCode || "",
      country: companyData.country || "",
    } : {
      name: "",
      email: user?.email || "",
      phone: "",
      website: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const apiKeyForm = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      keyName: "",
    },
  });

  // Set form values when company data is loaded
  if (companyData && !isDirty) {
    reset({
      name: companyData.name || "",
      email: companyData.email || user?.email || "",
      phone: companyData.phone || "",
      website: companyData.website || "",
      description: companyData.description || "",
      address: companyData.address || "",
      city: companyData.city || "",
      state: companyData.state || "",
      zipCode: companyData.zipCode || "",
      country: companyData.country || "",
    });
  }

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ...data, success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company/profile"] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your company profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate API key mutation
  const generateApiKeyMutation = useMutation({
    mutationFn: async (data: ApiKeyFormValues) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { 
        key: "briki_" + Math.random().toString(36).substring(2, 15),
        name: data.keyName,
        created: new Date().toISOString(),
      };
    },
    onSuccess: (data) => {
      toast({
        title: "API Key Generated",
        description: "Your new API key has been created successfully.",
      });
      apiKeyForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your API key. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle logo file upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload logo mutation
  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { logoUrl: URL.createObjectURL(file) };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/company/profile"] });
      setIsUploading(false);
      toast({
        title: "Logo Uploaded",
        description: "Your company logo has been updated successfully.",
      });
    },
    onError: () => {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your logo. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  // Handle API key generation
  const onGenerateApiKey = (data: ApiKeyFormValues) => {
    generateApiKeyMutation.mutate(data);
  };

  // Handle logo upload
  const handleLogoUpload = () => {
    if (logoFile) {
      uploadLogoMutation.mutate(logoFile);
    }
  };
  
  // Reset form and cancel editing
  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <CompanyLayout
      pageTitle="Company Settings"
      activeNav="settings"
    >
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Company Settings</h1>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-5">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Company Profile
            </TabsTrigger>
            <TabsTrigger 
              value="branding" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Branding
            </TabsTrigger>
            <TabsTrigger 
              value="api" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              API Keys
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Notifications
            </TabsTrigger>
          </TabsList>
            
          {/* Company Profile Tab */}
          <TabsContent value="profile" className="space-y-5 mt-5">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-white">Company Information</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage your company details and contact information
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white" 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Company Name</Label>
                        <Input
                          disabled={!isEditing}
                          className={`bg-slate-700/50 border-slate-600 text-white ${
                            !isEditing ? 'opacity-80' : ''
                          }`}
                          placeholder="Enter company name"
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-400">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-slate-300">Business Email</Label>
                        <Input
                          disabled={!isEditing}
                          className={`bg-slate-700/50 border-slate-600 text-white ${
                            !isEditing ? 'opacity-80' : ''
                          }`}
                          placeholder="Enter email address"
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-400">{errors.email.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-slate-300">Phone Number</Label>
                        <Input
                          disabled={!isEditing}
                          className={`bg-slate-700/50 border-slate-600 text-white ${
                            !isEditing ? 'opacity-80' : ''
                          }`}
                          placeholder="Enter phone number"
                          {...register("phone")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-slate-300">Website</Label>
                        <Input
                          disabled={!isEditing}
                          className={`bg-slate-700/50 border-slate-600 text-white ${
                            !isEditing ? 'opacity-80' : ''
                          }`}
                          placeholder="https://yourcompany.com"
                          {...register("website")}
                        />
                        {errors.website && (
                          <p className="text-sm text-red-400">{errors.website.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-slate-300">Company Description</Label>
                      <Textarea
                        disabled={!isEditing}
                        className={`bg-slate-700/50 border-slate-600 text-white min-h-[120px] ${
                          !isEditing ? 'opacity-80' : ''
                        }`}
                        placeholder="Brief description of your company"
                        {...register("description")}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-400">{errors.description.message}</p>
                      )}
                    </div>
                    
                    <Separator className="bg-slate-700" />
                    
                    <h3 className="text-lg font-medium text-white">Address Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Street Address</Label>
                        <Input
                          disabled={!isEditing}
                          className={`bg-slate-700/50 border-slate-600 text-white ${
                            !isEditing ? 'opacity-80' : ''
                          }`}
                          placeholder="Enter street address"
                          {...register("address")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-slate-300">City</Label>
                        <Input
                          disabled={!isEditing}
                          className={`bg-slate-700/50 border-slate-600 text-white ${
                            !isEditing ? 'opacity-80' : ''
                          }`}
                          placeholder="Enter city"
                          {...register("city")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-slate-300">State/Province</Label>
                        <Input
                          disabled={!isEditing}
                          className={`bg-slate-700/50 border-slate-600 text-white ${
                            !isEditing ? 'opacity-80' : ''
                          }`}
                          placeholder="Enter state or province"
                          {...register("state")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-slate-300">ZIP/Postal Code</Label>
                        <Input
                          disabled={!isEditing}
                          className={`bg-slate-700/50 border-slate-600 text-white ${
                            !isEditing ? 'opacity-80' : ''
                          }`}
                          placeholder="Enter ZIP code"
                          {...register("zipCode")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-slate-300">Country</Label>
                        <Input
                          disabled={!isEditing}
                          className={`bg-slate-700/50 border-slate-600 text-white ${
                            !isEditing ? 'opacity-80' : ''
                          }`}
                          placeholder="Enter country"
                          {...register("country")}
                        />
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="flex justify-end space-x-3 pt-3">
                        <Button 
                          type="button" 
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
            
          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-5 mt-5">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white">Company Branding</CardTitle>
                <CardDescription className="text-slate-400">
                  Customize your company logo and brand elements
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-shrink-0">
                      <Label className="text-slate-300 block mb-3">Company Logo</Label>
                      <Avatar className="w-32 h-32 rounded-md border border-slate-600 bg-slate-700">
                        {previewUrl ? (
                          <AvatarImage src={previewUrl} alt="Preview" />
                        ) : (
                          <AvatarImage src={companyData?.logoUrl} alt="Company logo" />
                        )}
                        <AvatarFallback className="rounded-md text-3xl bg-slate-800 text-blue-500">
                          {companyData?.name?.[0]?.toUpperCase() || "B"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Logo Upload</Label>
                        <div className="flex items-center gap-3">
                          <Input
                            type="file"
                            accept="image/*"
                            className="bg-slate-700/50 border-slate-600 text-white file:text-white file:bg-slate-600 file:border-0 file:rounded file:px-2.5 file:py-1.5 file:mr-3 hover:file:bg-slate-500"
                            onChange={handleLogoChange}
                          />
                          <Button
                            type="button"
                            onClick={handleLogoUpload}
                            disabled={!logoFile || isUploading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {isUploading ? (
                              <>
                                <span className="animate-pulse mr-2">Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-slate-400">
                          Recommended: Square image, at least 500×500px in PNG or JPG format
                        </p>
                      </div>
                      
                      <Alert className="bg-slate-700/50 border-slate-600">
                        <InfoIcon className="h-4 w-4 text-blue-400" />
                        <AlertTitle className="text-white">Logo Usage</AlertTitle>
                        <AlertDescription className="text-slate-300">
                          Your logo will be displayed on your company profile, marketplace listings, and customer-facing pages. 
                          It helps to establish brand recognition.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                  
                  <Separator className="bg-slate-700" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Brand Colors</h3>
                    <p className="text-slate-400">
                      Brand color customization will be available in an upcoming update to Briki Copilot.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
            
          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-5 mt-5">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-white">API Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage API keys for programmatic access to your data
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-6">
                  <Alert className="bg-blue-900/30 border-blue-800">
                    <InfoIcon className="h-4 w-4 text-blue-400" />
                    <AlertTitle className="text-white">Briki Copilot API Access</AlertTitle>
                    <AlertDescription className="text-blue-200">
                      API access allows you to integrate Briki Copilot directly with your existing systems.
                      You can automatically sync insurance plans, get market analysis, and more.
                    </AlertDescription>
                  </Alert>
                  
                  <form onSubmit={apiKeyForm.handleSubmit(onGenerateApiKey)} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-1">
                        <Label className="text-slate-300">Key Name</Label>
                        <Input
                          className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                          placeholder="Production API Key"
                          {...apiKeyForm.register("keyName")}
                        />
                        {apiKeyForm.formState.errors.keyName && (
                          <p className="text-sm text-red-400 mt-1">
                            {apiKeyForm.formState.errors.keyName.message}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 md:self-end">
                        <Button 
                          type="submit"
                          className="w-full md:w-auto mt-5 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={generateApiKeyMutation.isPending}
                        >
                          {generateApiKeyMutation.isPending ? "Generating..." : "Generate API Key"}
                        </Button>
                      </div>
                    </div>
                  </form>
                  
                  <Separator className="bg-slate-700" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Your API Keys</h3>
                    
                    {generateApiKeyMutation.data ? (
                      <div className="p-4 bg-emerald-900/30 border border-emerald-800/50 rounded-md mb-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div className="space-y-2">
                            <p className="font-medium text-white">New API Key Generated</p>
                            <p className="text-emerald-200 text-sm">
                              Store this key somewhere safe. For security reasons, it won't be shown again.
                            </p>
                            <div className="mt-2">
                              <p className="text-xs text-emerald-300 mb-1">API Key Name</p>
                              <div className="flex items-center gap-2">
                                <code className="px-2 py-1 rounded bg-black/40 text-emerald-300 font-mono">
                                  {generateApiKeyMutation.data.name}
                                </code>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-emerald-300 mb-1">API Key</p>
                              <div className="flex items-center gap-2">
                                <code className="px-2 py-1 rounded bg-black/40 text-emerald-300 font-mono truncate max-w-xs">
                                  {generateApiKeyMutation.data.key}
                                </code>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-7 px-2 bg-emerald-800/50 border-emerald-700 text-emerald-200 hover:bg-emerald-800 hover:text-white"
                                  onClick={() => {
                                    navigator.clipboard.writeText(generateApiKeyMutation.data.key);
                                    toast({
                                      title: "Copied to clipboard",
                                      description: "The API key has been copied to your clipboard",
                                    });
                                  }}
                                >
                                  Copy
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert className="bg-slate-700/30 border-slate-600">
                        <AlertTriangleIcon className="h-4 w-4 text-amber-400" />
                        <AlertTitle className="text-white">No keys found</AlertTitle>
                        <AlertDescription className="text-slate-300">
                          You haven't generated any API keys yet. Create a key to get started 
                          with API access.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="mt-4">
                      <p className="text-sm text-slate-400">
                        For implementation details and use cases, please refer to our{" "}
                        <Button
                          variant="link"
                          className="p-0 h-auto text-blue-400 hover:text-blue-300"
                          onClick={() => {}}
                        >
                          API documentation
                        </Button>.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
            
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-5 mt-5">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-slate-400">
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-slate-200">Plan Analysis Reports</Label>
                          <p className="text-sm text-slate-400">
                            Receive reports when your insurance plans are analyzed
                          </p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
                      </div>
                      
                      <Separator className="bg-slate-700/50" />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-slate-200">Market Updates</Label>
                          <p className="text-sm text-slate-400">
                            Get notified about significant changes in the insurance market
                          </p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
                      </div>
                      
                      <Separator className="bg-slate-700/50" />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-slate-200">Competitive Alerts</Label>
                          <p className="text-sm text-slate-400">
                            Be alerted when competitors make significant changes to their plans
                          </p>
                        </div>
                        <Switch className="data-[state=checked]:bg-blue-600" />
                      </div>
                      
                      <Separator className="bg-slate-700/50" />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-slate-200">Product Updates</Label>
                          <p className="text-sm text-slate-400">
                            Receive updates about new features and improvements to Briki Copilot
                          </p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-slate-700" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Dashboard Notifications</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-slate-200">Real-time Analysis Alerts</Label>
                          <p className="text-sm text-slate-400">
                            Show alerts in your dashboard when new analysis is available
                          </p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
                      </div>
                      
                      <Separator className="bg-slate-700/50" />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-slate-200">Task Reminders</Label>
                          <p className="text-sm text-slate-400">
                            Get reminders for incomplete tasks and action items
                          </p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CompanyLayout>
  );
}