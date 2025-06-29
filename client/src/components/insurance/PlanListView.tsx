/**
 * PlanListView Component
 * Modular component for displaying insurance plans with filtering and sorting
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlanCard from '@/components/briki-ai-assistant/PlanCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { InsurancePlan } from '@/types/insurance';
import { compareByPrice, compareByRating, compareByFeatureCount, extractNumericPrice } from '@/utils/plan-comparison';
import { Filter, SortAsc, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PlanListViewProps {
  plans: InsurancePlan[];
  category?: string;
  maxInitialDisplay?: number;
  showFilters?: boolean;
  onPlanSelect?: (planId: string) => void;
  onViewDetails?: (planId: string) => void;
}

export const PlanListView: React.FC<PlanListViewProps> = ({
  plans,
  category,
  maxInitialDisplay = 8,
  showFilters = true,
  onPlanSelect,
  onViewDetails
}) => {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'rating' | 'features'>('relevance');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Get unique providers from plans
  const providers = useMemo(() => {
    return Array.from(new Set(plans.map(plan => plan.provider))).sort();
  }, [plans]);

  // Calculate price bounds
  const priceBounds = useMemo(() => {
    const prices = plans
      .map(p => (p as any).basePrice || extractNumericPrice((p as any).price || ''))
      .filter(p => p > 0);
    
    if (prices.length === 0) return { min: 0, max: 1000000 };
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [plans]);

  // Filter and sort plans
  const filteredAndSortedPlans = useMemo(() => {
    let filtered = [...plans];

    // Apply provider filter
    if (selectedProviders.length > 0) {
      filtered = filtered.filter(plan => selectedProviders.includes(plan.provider));
    }

    // Apply price filter
    filtered = filtered.filter(plan => {
      const price = (plan as any).basePrice || extractNumericPrice((plan as any).price || '');
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort plans
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => compareByPrice(a as any, b as any));
        break;
      case 'rating':
        filtered.sort((a, b) => compareByRating(a as any, b as any));
        break;
      case 'features':
        filtered.sort((a, b) => compareByFeatureCount(a as any, b as any));
        break;
      case 'relevance':
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [plans, selectedProviders, priceRange, sortBy]);

  // Plans to display based on showAll state
  const displayedPlans = showAll 
    ? filteredAndSortedPlans 
    : filteredAndSortedPlans.slice(0, maxInitialDisplay);

  const handleProviderToggle = (provider: string) => {
    setSelectedProviders(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };

  const clearFilters = () => {
    setSelectedProviders([]);
    setPriceRange([priceBounds.min, priceBounds.max]);
    setSortBy('relevance');
  };

  const activeFilterCount = selectedProviders.length + (sortBy !== 'relevance' ? 1 : 0) +
    (priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max ? 1 : 0);

  return (
    <div className="w-full">
      {/* Filter Controls */}
      {showFilters && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevancia</SelectItem>
                  <SelectItem value="price">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="rating">Mejor Calificación</SelectItem>
                  <SelectItem value="features">Más Beneficios</SelectItem>
                </SelectContent>
              </Select>

              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </Button>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Mostrando {displayedPlans.length} de {filteredAndSortedPlans.length} planes
            </div>
          </div>

          {/* Expandable Filters Panel */}
          <AnimatePresence>
            {showFiltersPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Card className="mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Filtros Avanzados</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Provider Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2">Aseguradoras</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {providers.map(provider => (
                          <div key={provider} className="flex items-center space-x-2">
                            <Checkbox
                              id={provider}
                              checked={selectedProviders.includes(provider)}
                              onCheckedChange={() => handleProviderToggle(provider)}
                            />
                            <Label
                              htmlFor={provider}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {provider}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Price Range Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2">
                        Rango de Precio: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                      </Label>
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        min={priceBounds.min}
                        max={priceBounds.max}
                        step={10000}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {displayedPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <PlanCard
                plan={plan as any}
                highlighted={index === 0 && sortBy === 'relevance'}
                onQuote={onPlanSelect}
                onViewDetails={onViewDetails}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More/Less Button */}
      {filteredAndSortedPlans.length > maxInitialDisplay && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Mostrar menos' : `Ver todos los planes (${filteredAndSortedPlans.length})`}
          </Button>
        </div>
      )}

      {/* No Results */}
      {filteredAndSortedPlans.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">
              No se encontraron planes con los filtros seleccionados.
            </p>
            <Button
              variant="link"
              onClick={clearFilters}
              className="mt-2"
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanListView; 