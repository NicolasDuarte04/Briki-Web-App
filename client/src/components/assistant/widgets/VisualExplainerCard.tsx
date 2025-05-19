import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowLeftRight } from 'lucide-react';

interface ComparisonItem {
  leftValue: string | boolean;
  rightValue: string | boolean;
  label: string;
}

interface VisualExplainerCardProps {
  title: string;
  leftTitle: string;
  rightTitle: string;
  items: ComparisonItem[];
  leftColor?: string;
  rightColor?: string;
}

/**
 * VisualExplainerCard displays a side-by-side comparison of insurance plans or features
 * Used by the AI Assistant to provide visual explanations inline
 */
export const VisualExplainerCard: React.FC<VisualExplainerCardProps> = ({
  title,
  leftTitle,
  rightTitle,
  items,
  leftColor = 'blue',
  rightColor = 'green'
}) => {
  // Helper function to get color classes based on color name
  const getColorClass = (color: string, element: 'bg' | 'text' | 'border') => {
    const colorMap: Record<string, Record<string, string>> = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200'
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200'
      },
      red: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-200'
      },
      gray: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-200'
      }
    };
    
    return colorMap[color]?.[element] || colorMap.blue[element];
  };
  
  // Helper to render check/X for boolean values
  const renderValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? 
        <Check className="h-5 w-5 text-green-500" /> : 
        <X className="h-5 w-5 text-red-500" />;
    }
    return <span>{value}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="my-4 w-full max-w-md rounded-lg border border-gray-100 bg-white p-4 shadow-md"
    >
      <div className="flex items-center gap-2 mb-3">
        <ArrowLeftRight className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      
      {/* Header row */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="col-span-1"></div>
        <div className={`col-span-1 rounded-md ${getColorClass(leftColor, 'bg')} p-2 text-center font-medium ${getColorClass(leftColor, 'text')}`}>
          {leftTitle}
        </div>
        <div className={`col-span-1 rounded-md ${getColorClass(rightColor, 'bg')} p-2 text-center font-medium ${getColorClass(rightColor, 'text')}`}>
          {rightTitle}
        </div>
      </div>
      
      {/* Comparison rows */}
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`grid grid-cols-3 gap-2 py-2 ${index < items.length - 1 ? 'border-b border-gray-100' : ''}`}
        >
          <div className="col-span-1 flex items-center text-sm text-gray-600">
            {item.label}
          </div>
          <div className={`col-span-1 flex justify-center items-center ${getColorClass(leftColor, 'text')}`}>
            {renderValue(item.leftValue)}
          </div>
          <div className={`col-span-1 flex justify-center items-center ${getColorClass(rightColor, 'text')}`}>
            {renderValue(item.rightValue)}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default VisualExplainerCard;