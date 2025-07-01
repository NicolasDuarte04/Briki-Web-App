import React from 'react';
import { useColorContext } from '../contexts/color-context';
import { InsuranceCategory, categoryPalettes } from '../lib/color-harmonizer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'framer-motion';

export function ColorPaletteSelector() {
  const { 
    currentCategory, 
    setCategory, 
    accessibilityMode, 
    setAccessibilityMode, 
    getCategoryColor 
  } = useColorContext();

  const handleCategoryChange = (value: string) => {
    setCategory(value as InsuranceCategory);
  };

  const handleAccessibilityChange = (value: string) => {
    setAccessibilityMode(value as 'default' | 'high-contrast' | 'color-blind');
  };

  return (
    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Appearance Settings</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category-select">Color Theme</Label>
          <Select 
            value={currentCategory} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category-select" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="travel">Travel Insurance</SelectItem>
              <SelectItem value="auto">Auto Insurance</SelectItem>
              <SelectItem value="pet">Pet Insurance</SelectItem>
              <SelectItem value="health">Health Insurance</SelectItem>
              <SelectItem value="home">Home Insurance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Accessibility Mode</Label>
          <Tabs 
            value={accessibilityMode} 
            onValueChange={handleAccessibilityChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="high-contrast">High Contrast</TabsTrigger>
              <TabsTrigger value="color-blind">Color Blind</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="grid grid-cols-5 gap-2">
            {(Object.keys(categoryPalettes) as InsuranceCategory[]).map(category => (
              <motion.div
                key={category}
                className={`h-14 rounded-md cursor-pointer p-1 ${currentCategory === category ? 'ring-2 ring-blue-500' : ''}`}
                style={{ backgroundColor: getCategoryColor(category) }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setCategory(category)}
              >
                <div className="h-full w-full rounded flex items-center justify-center bg-white/20">
                  <span className="text-xs text-white font-medium">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorPaletteSelector;