import { useState, useEffect, useMemo } from 'react';
import { insurancePlansApi, type InsurancePlan } from '@/services/insurance-plans-api';
import type { InsuranceAPIFilters } from '@/services/insurance-api';
import { useToast } from '@/hooks/use-toast';
import { AdvancedFilters } from '@/components/insurance/AdvancedFilterPanel';
import { applyAdvancedFilters, getFilterOptions, getDefaultFilters } from '@/utils/filterUtils';

export interface UseInsurancePlansOptions {
  category?: string;
  initialFilters?: InsuranceAPIFilters;
  autoLoad?: boolean;
  pagination?: {
    page: number;
    itemsPerPage: number;
  };
}

export interface FilterRanges {
  priceRange: [number, number];
  coverageRange: [number, number];
  deductibleRange: [number, number];
}

export interface PlanMetadata {
  providers: string[];
  features: string[];
  tags: string[];
  ranges: FilterRanges;
}

export interface UseInsurancePlansReturn {
  plans: InsurancePlan[];
  filteredPlans: InsurancePlan[];
  paginatedPlans: InsurancePlan[];
  loading: boolean;
  error: string | null;
  metadata: PlanMetadata;
  filters: InsuranceAPIFilters;
  searchQuery: string;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  
  // Actions
  setFilters: (filters: InsuranceAPIFilters) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  refreshPlans: () => Promise<void>;
  clearFilters: () => void;
  
  // Utilities
  getTotalCount: () => number;
  getFilteredCount: () => number;
  hasActiveFilters: () => boolean;
}

export function useInsurancePlans(options: UseInsurancePlansOptions = {}): UseInsurancePlansReturn {
  const { category, initialFilters = {}, autoLoad = true, pagination } = options;
  const { toast } = useToast();

  // State
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(pagination?.itemsPerPage || 20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InsuranceAPIFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');

  // Derived metadata from plans
  const metadata = useMemo((): PlanMetadata => {
    if (!plans.length) {
      return {
        providers: [],
        features: [],
        tags: [],
        ranges: {
          priceRange: [0, 1000],
          coverageRange: [0, 100000],
          deductibleRange: [0, 1000]
        }
      };
    }

    // Extract unique providers
    const providers = [...new Set(plans.map(plan => plan.provider))].sort();

    // Extract unique features (flatten and deduplicate)
    const allFeatures = plans.flatMap(plan => plan.features);
    const features = [...new Set(allFeatures)].sort();

    // Extract unique tags
    const allTags = plans.flatMap(plan => plan.tags || []);
    const tags = [...new Set(allTags)].sort();

    // Calculate ranges
    const prices = plans.map(plan => plan.basePrice);
    const coverages = plans.map(plan => plan.coverageAmount);
    const deductibles = plans
      .map(plan => plan.deductible || 0)
      .filter(d => d > 0);

    const ranges: FilterRanges = {
      priceRange: [Math.min(...prices), Math.max(...prices)],
      coverageRange: [Math.min(...coverages), Math.max(...coverages)],
      deductibleRange: deductibles.length 
        ? [Math.min(...deductibles), Math.max(...deductibles)]
        : [0, 1000]
    };

    return { providers, features, tags, ranges };
  }, [plans]);

  // Apply client-side filtering for advanced options not handled by API
  const filteredPlans = useMemo(() => {
    let filtered = [...plans];

    // Search query filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan =>
        plan.name.toLowerCase().includes(query) ||
        plan.provider.toLowerCase().includes(query) ||
        plan.description.toLowerCase().includes(query) ||
        plan.features.some(feature => feature.toLowerCase().includes(query)) ||
        plan.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [plans, searchQuery]);

  // Load plans function
  const loadPlans = async () => {
    setLoading(true);
    setError(null);

    try {
      let result: InsurancePlan[];
      
      if (category) {
        result = await insurancePlansApi.getPlansByCategory(category);
      } else {
        result = await insurancePlansApi.getAllPlans();
      }

      // Ensure result is always an array
      const planArray = Array.isArray(result) ? result : [];
      setPlans(planArray);
      console.log(`[useInsurancePlans] Loaded ${planArray.length} plans successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load insurance plans';
      setError(errorMessage);
      toast({
        title: 'Error loading plans',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh plans
  const refreshPlans = async () => {
    await loadPlans();
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  // Utility functions
  const getTotalCount = () => plans.length;
  const getFilteredCount = () => filteredPlans.length;
  const hasActiveFilters = () => {
    return Object.keys(filters).length > 0 || searchQuery.trim().length > 0;
  };

  // Load plans on mount or when category/filters change
  useEffect(() => {
    if (autoLoad) {
      loadPlans();
    }
  }, [category, autoLoad]); // Only reload when category changes, not filters

  // Reload when API filters change
  useEffect(() => {
    if (autoLoad && Object.keys(filters).length > 0) {
      loadPlans();
    }
  }, [filters]);

  // Pagination calculations
  const totalItems = filteredPlans.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Paginated plans
  const paginatedPlans = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPlans.slice(startIndex, endIndex);
  }, [filteredPlans, currentPage, itemsPerPage]);

  // Pagination handlers with analytics
  const handlePageChange = (page: number) => {
    console.log(`[Analytics] Page change: ${page}`, { category, totalItems });
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    console.log(`[Analytics] Items per page change: ${items}`, { category });
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return {
    plans,
    filteredPlans,
    paginatedPlans,
    loading,
    error,
    metadata,
    filters,
    searchQuery,
    
    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    
    // Actions
    setFilters,
    setSearchQuery,
    setCurrentPage: handlePageChange,
    setItemsPerPage: handleItemsPerPageChange,
    refreshPlans,
    clearFilters,
    
    // Utilities
    getTotalCount,
    getFilteredCount,
    hasActiveFilters
  };
}

// Helper hook for plan statistics
export function useInsuranceStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const result = await insuranceAPI.getStatistics();
      setStats(result);
    } catch (err) {
      console.error('Failed to load insurance statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return { stats, loading, refresh: loadStats };
}