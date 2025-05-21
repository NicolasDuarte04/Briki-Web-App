import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CompanyLayout from "@/components/layout/company-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowLeft,
  Save,
  Upload,
  Clock,
  Globe,
  ChevronRight,
  HelpCircle,
  Info,
  Tag,
  DollarSign,
  Shield,
  ListChecks,
  ShieldCheck,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { planFieldLabels, INSURANCE_CATEGORIES } from "@/lib/constants";

// Plan interface matching our schema
interface InsurancePlan {
  id: number;
  companyId: number;
  planId: string;
  name: string;
  category: string;
  basePrice: number;
  coverageAmount: number;
  provider?: string;
  description?: string;
  features?: string[];
  rating?: string;
  badge?: string;
  categoryFields: Record<string, any>;
  status: 'draft' | 'active' | 'archived';
  visibility: 'private' | 'public';
  marketplaceEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Schema for plan update
const planUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  basePrice: z.coerce.number().min(0, "Price must be a positive number"),
  coverageAmount: z.coerce.number().min(0, "Coverage amount must be a positive number"),
  provider: z.string().optional(),
  features: z.array(z.string()).optional(),
  status: z.enum(['draft', 'active', 'archived']),
  marketplaceEnabled: z.boolean().default(false),
  categoryFields: z.record(z.any())
});

type PlanUpdateFormValues = z.infer<typeof planUpdateSchema>;

export default function CompanyPlanEdit() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const planId = params.id ? parseInt(params.id, 10) : null;
  const [newFeature, setNewFeature] = useState("");

  // Form
  const form = useForm<PlanUpdateFormValues>({
    resolver: zodResolver(planUpdateSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      coverageAmount: 0,
      provider: "",
      features: [],
      status: 'draft',
      marketplaceEnabled: false,
      categoryFields: {}
    }
  });

  // Fetch plan data
  const { data: plan, isLoading } = useQuery<InsurancePlan>({
    queryKey: [`/api/company/plans/${planId}`],
    enabled: !!planId,
  });

  // Populate form when plan data is loaded
  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        description: plan.description || "",
        basePrice: plan.basePrice,
        coverageAmount: plan.coverageAmount,
        provider: plan.provider || "",
        features: plan.features || [],
        status: plan.status,
        marketplaceEnabled: plan.marketplaceEnabled,
        categoryFields: plan.categoryFields || {}
      });
    }
  }, [plan, form]);

  // Update plan mutation
  const updatePlanMutation = useMutation({
    mutationFn: async (data: PlanUpdateFormValues) => {
      return apiRequest(`/api/company/plans/${planId}`, {
        method: "PUT",
        data
      });
    },
    onSuccess: () => {
      toast({
        title: "Plan updated",
        description: "Your insurance plan has been successfully updated",
        variant: "default",
      });
      trackEvent('plan_updated', 'company', 'plan_management');
      queryClient.invalidateQueries({ queryKey: [`/api/company/plans/${planId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/company/plans"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update plan",
        description: error.message || "There was an error updating the plan",
        variant: "destructive",
      });
    },
  });

  // Toggle marketplace visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: async (marketplaceEnabled: boolean) => {
      return apiRequest(`/api/company/plans/${planId}/visibility`, {
        method: "PATCH",
        data: { marketplaceEnabled },
      });
    },
    onSuccess: (response: any) => {
      const action = response.plan?.marketplaceEnabled ? 'enabled' : 'disabled';
      toast({
        title: `Marketplace visibility ${action}`,
        description: `The plan is now ${response.plan?.marketplaceEnabled ? 'visible' : 'hidden'} in the marketplace`,
        variant: "default",
      });
      trackEvent('marketplace_visibility_changed', 'company', 'plan_management');
      form.setValue('marketplaceEnabled', response.plan?.marketplaceEnabled);
      queryClient.invalidateQueries({ queryKey: [`/api/company/plans/${planId}`] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update visibility",
        description: error.message || "There was an error updating plan visibility",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: PlanUpdateFormValues) => {
    updatePlanMutation.mutate(data);
  };

  // Add new feature
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = form.getValues('features') || [];
      form.setValue('features', [...currentFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };

  // Remove feature
  const handleRemoveFeature = (index: number) => {
    const currentFeatures = form.getValues('features') || [];
    form.setValue(
      'features',
      currentFeatures.filter((_, i) => i !== index)
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get field label based on category
  const getFieldLabel = (field: string, category: string) => {
    if (category && planFieldLabels[category] && planFieldLabels[category][field]) {
      return planFieldLabels[category][field];
    }
    return field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <CompanyLayout pageTitle="Edit Plan" activeNav="plans">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2 text-slate-400 hover:text-white -ml-3"
              onClick={() => navigate("/company-dashboard/plans")}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Plans
            </Button>
            <h1 className="text-2xl font-bold text-white mb-1">
              {isLoading ? <Skeleton className="h-8 w-48 bg-slate-700" /> : `Edit Plan: ${plan?.name}`}
            </h1>
            <p className="text-slate-400">
              Update your insurance plan details and marketplace settings
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="text-slate-300 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
              onClick={() => navigate(`/company-dashboard/plans/${planId}`)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              form="plan-form"
              disabled={updatePlanMutation.isPending}
            >
              {updatePlanMutation.isPending ? 
                <><Clock className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 
                <><Save className="mr-2 h-4 w-4" />Save Changes</>
              }
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-6">
            {Array(3).fill(null).map((_, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-1/3 bg-slate-700" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full bg-slate-700/30" />
                    <Skeleton className="h-10 w-full bg-slate-700/30" />
                    <Skeleton className="h-10 w-full bg-slate-700/30" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form id="plan-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Details */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-slate-200 flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-blue-400" />
                    Basic Plan Details
                  </CardTitle>
                  <CardDescription>
                    Core information about your insurance plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Plan Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter plan name" 
                            className="bg-slate-900/50 border-slate-700"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="basePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Base Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                              <Input 
                                type="number"
                                min="0"
                                placeholder="0" 
                                className="bg-slate-900/50 border-slate-700 pl-10"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="coverageAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Coverage Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                              <Input 
                                type="number"
                                min="0"
                                placeholder="0" 
                                className="bg-slate-900/50 border-slate-700 pl-10"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Provider</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Insurance provider name" 
                            className="bg-slate-900/50 border-slate-700"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter plan description" 
                            className="bg-slate-900/50 border-slate-700 min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {/* Category Specific Fields */}
              {plan?.category && (
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-slate-200 flex items-center">
                      <ShieldCheck className="mr-2 h-5 w-5 text-blue-400" />
                      {plan.category.charAt(0).toUpperCase() + plan.category.slice(1)} Insurance Details
                    </CardTitle>
                    <CardDescription>
                      Specific details for this type of insurance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Render category-specific fields dynamically */}
                    {plan.categoryFields && Object.entries(plan.categoryFields).map(([field, value]) => {
                      // Skip rendering arrays and objects as direct inputs
                      if (typeof value === 'object') return null;
                      
                      // Render boolean fields as switches
                      if (typeof value === 'boolean') {
                        return (
                          <FormField
                            key={field}
                            control={form.control}
                            name={`categoryFields.${field}`}
                            render={({ field: formField }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-slate-200">
                                    {getFieldLabel(field, plan.category)}
                                  </FormLabel>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={formField.value}
                                    onCheckedChange={formField.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        );
                      }
                      
                      // Render number fields
                      if (typeof value === 'number') {
                        return (
                          <FormField
                            key={field}
                            control={form.control}
                            name={`categoryFields.${field}`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormLabel className="text-slate-200">
                                  {getFieldLabel(field, plan.category)}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="bg-slate-900/50 border-slate-700"
                                    {...formField}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        );
                      }
                      
                      // Default to text field
                      return (
                        <FormField
                          key={field}
                          control={form.control}
                          name={`categoryFields.${field}`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">
                                {getFieldLabel(field, plan.category)}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-slate-900/50 border-slate-700"
                                  {...formField}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      );
                    })}
                  </CardContent>
                </Card>
              )}
              
              {/* Features */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-slate-200 flex items-center">
                    <ListChecks className="mr-2 h-5 w-5 text-blue-400" />
                    Plan Features
                  </CardTitle>
                  <CardDescription>
                    Key benefits and features of this insurance plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a new feature"
                      className="bg-slate-900/50 border-slate-700 flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddFeature}
                      variant="outline"
                      className="border-slate-700"
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {form.watch('features')?.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-900/30 border border-slate-700/50 rounded-md">
                        <span className="text-slate-300">{feature}</span>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                    {(!form.watch('features') || form.watch('features').length === 0) && (
                      <div className="text-center py-4 text-slate-500">
                        No features added yet. Add some key benefits of your plan.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Status & Visibility */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-slate-200 flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-blue-400" />
                    Status & Visibility
                  </CardTitle>
                  <CardDescription>
                    Control the status and marketplace visibility of your plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Plan Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-slate-900/50 border-slate-700">
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-700">
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-400">
                          <Info className="inline h-3 w-3 mr-1" />
                          Only active plans can be published to the marketplace
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="marketplaceEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-slate-200">
                            Marketplace Visibility
                          </FormLabel>
                          <FormDescription className="text-slate-400">
                            Allow this plan to appear in the public marketplace
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              toggleVisibilityMutation.mutate(checked);
                            }}
                            disabled={form.watch('status') !== 'active' || toggleVisibilityMutation.isPending}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('status') !== 'active' && (
                    <div className="flex p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-md">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-300">
                        This plan cannot be published to the marketplace because it is not active. 
                        Change status to "Active" to enable marketplace publishing.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </form>
          </Form>
        )}
      </div>
    </CompanyLayout>
  );
}