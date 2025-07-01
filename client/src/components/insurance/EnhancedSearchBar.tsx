import React, { useState, useEffect, useMemo } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { InsurancePlan } from "../../types/insurance";

interface SearchSuggestion {
  type: 'provider' | 'feature' | 'tag' | 'category';
  value: string;
  count: number;
}

interface EnhancedSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  plans: InsurancePlan[];
  placeholder?: string;
  showSuggestions?: boolean;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  activeFilters?: string[];
  onFilterRemove?: (filter: string) => void;
}

export function EnhancedSearchBar({
  searchQuery,
  onSearchChange,
  plans,
  placeholder = "Search plans by provider, features, or coverage type...",
  showSuggestions = true,
  onSuggestionSelect,
  activeFilters = [],
  onFilterRemove
}: EnhancedSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Generate search suggestions based on available data
  const suggestions = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];

    const query = debouncedQuery.toLowerCase();
    const allSuggestions: SearchSuggestion[] = [];

    // Provider suggestions
    const providers = [...new Set(plans.map(p => p.provider).filter(Boolean))];
    providers.forEach(provider => {
      if (provider.toLowerCase().includes(query)) {
        const count = plans.filter(p => p.provider === provider).length;
        allSuggestions.push({ type: 'provider', value: provider, count });
      }
    });

    // Feature suggestions
    const features = [...new Set(plans.flatMap(p => p.features || []))];
    features.forEach(feature => {
      if (feature.toLowerCase().includes(query)) {
        const count = plans.filter(p => p.features?.includes(feature)).length;
        allSuggestions.push({ type: 'feature', value: feature, count });
      }
    });

    // Tag suggestions
    const tags = [...new Set(plans.flatMap(p => p.tags || []))];
    tags.forEach(tag => {
      if (tag.toLowerCase().includes(query)) {
        const count = plans.filter(p => p.tags?.includes(tag)).length;
        allSuggestions.push({ type: 'tag', value: tag, count });
      }
    });

    return allSuggestions.slice(0, 6); // Limit to 6 suggestions
  }, [debouncedQuery, plans]);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSearchChange(suggestion.value);
    onSuggestionSelect?.(suggestion);
    setIsFocused(false);
  };

  const clearSearch = () => {
    onSearchChange("");
    setIsFocused(false);
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'provider':
        return '🏢';
      case 'feature':
        return '⭐';
      case 'tag':
        return '🏷️';
      case 'category':
        return '📁';
      default:
        return '🔍';
    }
  };

  const getSuggestionLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'provider':
        return 'Provider';
      case 'feature':
        return 'Feature';
      case 'tag':
        return 'Tag';
      case 'category':
        return 'Category';
      default:
        return 'Search';
    }
  };

  return (
    <div className="relative w-full">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-3 flex flex-wrap gap-2"
        >
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              <Filter className="h-3 w-3" />
              {filter}
              {onFilterRemove && (
                <button
                  onClick={() => onFilterRemove(filter)}
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </motion.div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="pl-10 pr-10 py-3 text-base border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && isFocused && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2"
            >
              <Card className="border border-gray-200 shadow-lg">
                <CardContent className="p-0">
                  <div className="max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={`${suggestion.type}-${suggestion.value}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {suggestion.value}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getSuggestionLabel(suggestion.type)}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.count} plans
                        </Badge>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Results Counter */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-gray-600"
        >
          Found {plans.length} plans matching "{searchQuery}"
        </motion.div>
      )}
    </div>
  );
}