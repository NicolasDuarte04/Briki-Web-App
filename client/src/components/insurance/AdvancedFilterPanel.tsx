import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface AdvancedFilters {
  priceRange: [number, number];
  coverageRange: [number, number];
  deductibleRange: [number, number];
  providers: string[];
  features: string[];
  tags: string[];
  rating: number;
}

interface AdvancedFilterPanelProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  availableProviders: string[];
  availableFeatures: string[];
  availableTags: string[];
  isOpen: boolean;
  onToggle: () => void;
  activeFilterCount: number;
}

export function AdvancedFilterPanel({
  filters,
  onFiltersChange,
  availableProviders,
  availableFeatures,
  availableTags,
  isOpen,
  onToggle,
  activeFilterCount
}: AdvancedFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    coverage: true,
    providers: true,
    features: false,
    tags: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [0, 1000],
      coverageRange: [0, 100000],
      deductibleRange: [0, 1000],
      providers: [],
      features: [],
      tags: [],
      rating: 0
    });
  };

  const updateFilter = (key: keyof AdvancedFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = (key: 'providers' | 'features' | 'tags', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={onToggle}
        className="mb-4 bg-white border-gray-200 hover:bg-gray-50"
      >
        <Filter className="h-4 w-4 mr-2" />
        Advanced Filters
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs">
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Filter Plans
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggle}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price Range */}
                <Collapsible
                  open={expandedSections.price}
                  onOpenChange={() => toggleSection('price')}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <h3 className="font-medium text-gray-900">Price Range</h3>
                    {expandedSections.price ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">
                    <div className="space-y-3">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                        max={1000}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}+</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Coverage Amount */}
                <Collapsible
                  open={expandedSections.coverage}
                  onOpenChange={() => toggleSection('coverage')}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <h3 className="font-medium text-gray-900">Coverage Amount</h3>
                    {expandedSections.coverage ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">
                    <div className="space-y-3">
                      <Slider
                        value={filters.coverageRange}
                        onValueChange={(value) => updateFilter('coverageRange', value as [number, number])}
                        max={100000}
                        min={0}
                        step={5000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${filters.coverageRange[0].toLocaleString()}</span>
                        <span>${filters.coverageRange[1].toLocaleString()}+</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Deductible Range */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Deductible Range</h3>
                  <Slider
                    value={filters.deductibleRange}
                    onValueChange={(value) => updateFilter('deductibleRange', value as [number, number])}
                    max={1000}
                    min={0}
                    step={25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${filters.deductibleRange[0]}</span>
                    <span>${filters.deductibleRange[1]}+</span>
                  </div>
                </div>

                <Separator />

                {/* Minimum Rating */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Minimum Rating</h3>
                  <Slider
                    value={[filters.rating]}
                    onValueChange={(value) => updateFilter('rating', value[0])}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Any Rating</span>
                    <span>{filters.rating}+ Stars</span>
                  </div>
                </div>

                <Separator />

                {/* Providers */}
                <Collapsible
                  open={expandedSections.providers}
                  onOpenChange={() => toggleSection('providers')}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <h3 className="font-medium text-gray-900">
                      Providers 
                      {filters.providers.length > 0 && (
                        <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs">
                          {filters.providers.length}
                        </Badge>
                      )}
                    </h3>
                    {expandedSections.providers ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableProviders.map((provider) => (
                        <div key={provider} className="flex items-center space-x-2">
                          <Checkbox
                            id={`provider-${provider}`}
                            checked={filters.providers.includes(provider)}
                            onCheckedChange={() => toggleArrayFilter('providers', provider)}
                          />
                          <label
                            htmlFor={`provider-${provider}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {provider}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Features */}
                <Collapsible
                  open={expandedSections.features}
                  onOpenChange={() => toggleSection('features')}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <h3 className="font-medium text-gray-900">
                      Features
                      {filters.features.length > 0 && (
                        <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs">
                          {filters.features.length}
                        </Badge>
                      )}
                    </h3>
                    {expandedSections.features ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableFeatures.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={`feature-${feature}`}
                            checked={filters.features.includes(feature)}
                            onCheckedChange={() => toggleArrayFilter('features', feature)}
                          />
                          <label
                            htmlFor={`feature-${feature}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {feature}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Tags */}
                <Collapsible
                  open={expandedSections.tags}
                  onOpenChange={() => toggleSection('tags')}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <h3 className="font-medium text-gray-900">
                      Tags
                      {filters.tags.length > 0 && (
                        <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs">
                          {filters.tags.length}
                        </Badge>
                      )}
                    </h3>
                    {expandedSections.tags ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <Button
                          key={tag}
                          variant={filters.tags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleArrayFilter('tags', tag)}
                          className="text-xs"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}