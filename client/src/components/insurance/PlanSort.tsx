import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, TrendingUp, Star, DollarSign, Shield } from 'lucide-react';

export type SortOption = 
  | 'recommended' 
  | 'price-low' 
  | 'price-high' 
  | 'rating' 
  | 'coverage-high' 
  | 'coverage-low'
  | 'newest'
  | 'popular';

interface PlanSortProps {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  planCount: number;
}

const sortOptions = [
  {
    value: 'recommended' as SortOption,
    label: 'Recommended',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Best match for your needs'
  },
  {
    value: 'price-low' as SortOption,
    label: 'Price: Low to High',
    icon: <DollarSign className="w-4 h-4" />,
    description: 'Most affordable first'
  },
  {
    value: 'price-high' as SortOption,
    label: 'Price: High to Low',
    icon: <DollarSign className="w-4 h-4" />,
    description: 'Premium plans first'
  },
  {
    value: 'rating' as SortOption,
    label: 'Highest Rated',
    icon: <Star className="w-4 h-4" />,
    description: 'Top customer ratings'
  },
  {
    value: 'coverage-high' as SortOption,
    label: 'Coverage: High to Low',
    icon: <Shield className="w-4 h-4" />,
    description: 'Maximum protection first'
  },
  {
    value: 'coverage-low' as SortOption,
    label: 'Coverage: Low to High',
    icon: <Shield className="w-4 h-4" />,
    description: 'Basic coverage first'
  },
  {
    value: 'popular' as SortOption,
    label: 'Most Popular',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Frequently chosen plans'
  }
];

export default function PlanSort({ 
  sortOption, 
  onSortChange, 
  resultsCount
}: PlanSortProps) {
  const currentSort = sortOptions.find(option => option.value === sortOption);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border">
      {/* Results Count */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-white">
          {resultsCount} plans found
        </Badge>
        {currentSort && currentSort.value !== 'recommended' && (
          <span className="text-sm text-gray-600 hidden sm:inline">
            Sorted by {currentSort.label.toLowerCase()}
          </span>
        )}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
        </div>
        
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-48 bg-white">
            <SelectValue>
              <div className="flex items-center gap-2">
                {currentSort?.icon}
                <span>{currentSort?.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Export helper function for sorting logic
export function applySorting<T extends {
  basePrice: number;
  rating: number;
  coverageAmount: number;
  name: string;
  tags?: string[];
}>(plans: T[], sortOption: SortOption): T[] {
  const sorted = [...plans];
  
  switch (sortOption) {
    case 'price-low':
      return sorted.sort((a, b) => a.basePrice - b.basePrice);
    
    case 'price-high':
      return sorted.sort((a, b) => b.basePrice - a.basePrice);
    
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    
    case 'coverage-high':
      return sorted.sort((a, b) => b.coverageAmount - a.coverageAmount);
    
    case 'coverage-low':
      return sorted.sort((a, b) => a.coverageAmount - b.coverageAmount);
    
    case 'popular':
      // Sort by plans with "popular" tag first, then by rating
      return sorted.sort((a, b) => {
        const aPopular = a.tags?.some(tag => tag.toLowerCase().includes('popular')) ? 1 : 0;
        const bPopular = b.tags?.some(tag => tag.toLowerCase().includes('popular')) ? 1 : 0;
        if (aPopular !== bPopular) return bPopular - aPopular;
        return b.rating - a.rating;
      });
    
    case 'recommended':
    default:
      // Complex recommendation algorithm based on multiple factors
      return sorted.sort((a, b) => {
        // Calculate recommendation score
        const scoreA = calculateRecommendationScore(a);
        const scoreB = calculateRecommendationScore(b);
        return scoreB - scoreA;
      });
  }
}

function calculateRecommendationScore<T extends {
  basePrice: number;
  rating: number;
  coverageAmount: number;
  tags?: string[];
}>(plan: T): number {
  let score = 0;
  
  // Rating weight (0-50 points)
  score += plan.rating * 10;
  
  // Value proposition (coverage/price ratio) (0-30 points)
  const valueRatio = plan.coverageAmount / plan.basePrice;
  score += Math.min(valueRatio / 1000, 30);
  
  // Popular/recommended tags bonus (0-20 points)
  if (plan.tags) {
    if (plan.tags.some(tag => tag.toLowerCase().includes('popular'))) score += 15;
    if (plan.tags.some(tag => tag.toLowerCase().includes('recomendado'))) score += 15;
    if (plan.tags.some(tag => tag.toLowerCase().includes('premium'))) score += 10;
  }
  
  return score;
}