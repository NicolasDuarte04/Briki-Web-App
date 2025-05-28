import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Filter, Star, DollarSign, Shield, Users } from 'lucide-react';

export interface FilterOptions {
  priceRange: [number, number];
  providers: string[];
  coverageAmount: [number, number];
  features: string[];
  rating: number;
  deductible: [number, number];
  tags: string[];
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableProviders: string[];
  availableFeatures: string[];
  availableTags: string[];
  priceRange: [number, number];
  coverageRange: [number, number];
  deductibleRange: [number, number];
  category: string;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableProviders,
  availableFeatures,
  availableTags,
  priceRange,
  coverageRange,
  deductibleRange,
  category
}: FilterSidebarProps) {
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      priceRange,
      providers: [],
      coverageAmount: coverageRange,
      features: [],
      rating: 0,
      deductible: deductibleRange,
      tags: []
    };
    setTempFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleArrayFilter = (key: 'providers' | 'features' | 'tags', value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (tempFilters.providers.length > 0) count++;
    if (tempFilters.features.length > 0) count++;
    if (tempFilters.tags.length > 0) count++;
    if (tempFilters.rating > 0) count++;
    if (tempFilters.priceRange[0] !== priceRange[0] || tempFilters.priceRange[1] !== priceRange[1]) count++;
    if (tempFilters.coverageAmount[0] !== coverageRange[0] || tempFilters.coverageAmount[1] !== coverageRange[1]) count++;
    if (tempFilters.deductible[0] !== deductibleRange[0] || tempFilters.deductible[1] !== deductibleRange[1]) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white h-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Filter Plans</h2>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Filters Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Price Range */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={tempFilters.priceRange}
                      onValueChange={(value) => updateFilter('priceRange', value)}
                      min={priceRange[0]}
                      max={priceRange[1]}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${tempFilters.priceRange[0]}</span>
                      <span>${tempFilters.priceRange[1]}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coverage Amount */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Coverage Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={tempFilters.coverageAmount}
                      onValueChange={(value) => updateFilter('coverageAmount', value)}
                      min={coverageRange[0]}
                      max={coverageRange[1]}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${tempFilters.coverageAmount[0].toLocaleString()}</span>
                      <span>${tempFilters.coverageAmount[1].toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Minimum Rating */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Minimum Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={tempFilters.rating.toString()} 
                    onValueChange={(value) => updateFilter('rating', parseFloat(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any rating</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="3.5">3.5+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="4.5">4.5+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Providers */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Insurance Providers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {availableProviders.map((provider) => (
                      <div key={provider} className="flex items-center space-x-2">
                        <Checkbox
                          id={provider}
                          checked={tempFilters.providers.includes(provider)}
                          onCheckedChange={() => toggleArrayFilter('providers', provider)}
                        />
                        <Label htmlFor={provider} className="text-sm font-normal cursor-pointer">
                          {provider}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {availableFeatures.slice(0, 8).map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={tempFilters.features.includes(feature)}
                          onCheckedChange={() => toggleArrayFilter('features', feature)}
                        />
                        <Label htmlFor={feature} className="text-sm font-normal cursor-pointer">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Plan Tags */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Plan Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={tempFilters.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayFilter('tags', tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="border-t p-6 space-y-3">
            <Button 
              onClick={handleApplyFilters}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Apply Filters ({getActiveFiltersCount()})
            </Button>
            <Button 
              onClick={handleResetFilters}
              variant="outline" 
              className="w-full"
            >
              Reset All
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}