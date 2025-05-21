import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import CompanyLayout from "@/components/layout/company-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Archive,
  Edit,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  Globe,
  ChevronRight,
  XCircle,
  CheckCircle2,
  HelpCircle,
  Clock,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Plan types matching our schema
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

export default function CompanyPlans() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for plan management
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Fetch plans data
  const { data: plans, isLoading, refetch } = useQuery<InsurancePlan[]>({
    queryKey: ["/api/company/plans"],
  });

  // Delete plan mutation
  const deletePlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      return apiRequest(`/api/company/plans/${planId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast({
        title: "Plan archived",
        description: "The plan has been successfully archived",
        variant: "default",
      });
      trackEvent('plan_archived', 'company', 'plan_management');
      queryClient.invalidateQueries({ queryKey: ["/api/company/plans"] });
      setShowDeleteAlert(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to archive plan",
        description: error.message || "There was an error archiving the plan",
        variant: "destructive",
      });
    },
  });

  // Toggle marketplace visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ planId, marketplaceEnabled }: { planId: number, marketplaceEnabled: boolean }) => {
      return apiRequest(`/api/company/plans/${planId}/visibility`, {
        method: "PATCH",
        data: { marketplaceEnabled },
      });
    },
    onSuccess: (data) => {
      const action = data.plan.marketplaceEnabled ? 'enabled' : 'disabled';
      toast({
        title: `Marketplace visibility ${action}`,
        description: `The plan is now ${data.plan.marketplaceEnabled ? 'visible' : 'hidden'} in the marketplace`,
        variant: "default",
      });
      trackEvent('marketplace_visibility_changed', 'company', 'plan_management');
      queryClient.invalidateQueries({ queryKey: ["/api/company/plans"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update visibility",
        description: error.message || "There was an error updating plan visibility",
        variant: "destructive",
      });
    },
  });

  // Filter plans based on selected filters
  const filteredPlans = plans?.filter(plan => {
    let match = true;
    if (statusFilter && plan.status !== statusFilter) match = false;
    if (categoryFilter && plan.category !== categoryFilter) match = false;
    return match;
  });

  // Get unique categories for filter
  const categories = [...new Set(plans?.map(plan => plan.category))];

  // Render status badges
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/30">Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-yellow-500/30">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-slate-500/20 text-slate-500 hover:bg-slate-500/30 border-slate-500/30">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <CompanyLayout pageTitle="Plan Management" activeNav="plans">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Insurance Plan Management</h1>
            <p className="text-slate-400">Manage your company's insurance plans and marketplace visibility</p>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-slate-300 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
              onClick={() => refetch()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-slate-300 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
              onClick={() => navigate("/company-dashboard/upload")}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Plans
            </Button>
            <Button 
              size="sm" 
              onClick={() => navigate("/company-dashboard/create-plan")}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Plan
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <span className="text-sm text-slate-300">Filter:</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Status:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-slate-700 bg-slate-800/80">
                      {statusFilter || 'All Statuses'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('archived')}>
                      Archived
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Category:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-slate-700 bg-slate-800/80">
                      {categoryFilter || 'All Categories'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                      All Categories
                    </DropdownMenuItem>
                    {categories?.map(category => (
                      <DropdownMenuItem 
                        key={category} 
                        onClick={() => setCategoryFilter(category)}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans table */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-slate-200">Your Insurance Plans</CardTitle>
            <CardDescription>
              {filteredPlans?.length || 0} plans found
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array(3).fill(null).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-1/4 bg-slate-700/50" />
                    <Skeleton className="h-10 w-full bg-slate-700/30" />
                  </div>
                ))}
              </div>
            ) : filteredPlans?.length === 0 ? (
              <div className="py-12 text-center">
                <XCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-300 mb-2">No plans found</h3>
                <p className="text-slate-400 mb-6">
                  {plans?.length ? 'No plans match your current filters' : 'You haven\'t uploaded any insurance plans yet'}
                </p>
                <Button onClick={() => navigate("/company-dashboard/upload")}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Plans
                </Button>
              </div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700/40 hover:bg-transparent">
                      <TableHead className="text-slate-400">Plan Name</TableHead>
                      <TableHead className="text-slate-400">Category</TableHead>
                      <TableHead className="text-slate-400">Pricing</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Marketplace</TableHead>
                      <TableHead className="text-slate-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans?.map((plan) => (
                      <TableRow 
                        key={plan.id} 
                        className="border-slate-700/40 hover:bg-slate-800/50"
                      >
                        <TableCell className="font-medium text-slate-200">
                          {plan.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                            {plan.category.charAt(0).toUpperCase() + plan.category.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(plan.basePrice)}</TableCell>
                        <TableCell>{renderStatusBadge(plan.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={plan.marketplaceEnabled}
                              disabled={plan.status !== 'active'}
                              onCheckedChange={(checked) => {
                                toggleVisibilityMutation.mutate({
                                  planId: plan.id,
                                  marketplaceEnabled: checked
                                });
                              }}
                            />
                            <span className="text-sm text-slate-400">
                              {plan.marketplaceEnabled ? 'Public' : 'Private'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/company-dashboard/plans/${plan.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/company-dashboard/plans/${plan.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Plan
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-500 focus:text-red-500" 
                                onClick={() => {
                                  setSelectedPlan(plan);
                                  setShowDeleteAlert(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Archive Plan
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Marketplace info card */}
        <Card className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-blue-800/30 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="rounded-full bg-blue-500/20 p-3">
                <Globe className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Marketplace Visibility</h3>
                <p className="text-blue-200 mb-2">
                  Make your active plans visible in the Briki marketplace to reach more customers.
                  Only plans with 'Active' status can be published to the marketplace.
                </p>
                <p className="text-blue-300 text-sm">
                  <HelpCircle className="inline h-4 w-4 mr-1" />
                  Plans in 'Draft' or 'Archived' status cannot be published to the marketplace.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="bg-blue-500/10 hover:bg-blue-500/20 text-white border-blue-400/30"
                onClick={() => navigate("/company-dashboard/marketplace")}
              >
                Marketplace Settings
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Archive Insurance Plan</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive the plan "{selectedPlan?.name}". Archived plans are hidden from users
              and the marketplace, but can be restored later. 
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
              onClick={() => {
                if (selectedPlan) {
                  deletePlanMutation.mutate(selectedPlan.id);
                }
              }}
            >
              {deletePlanMutation.isPending ? 
                <><Clock className="mr-2 h-4 w-4 animate-spin" /> Archiving...</> : 
                <><Archive className="mr-2 h-4 w-4" /> Archive Plan</>
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CompanyLayout>
  );
}