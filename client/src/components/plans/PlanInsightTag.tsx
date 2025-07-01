import React from 'react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Award, Check, Star, Zap, AlertCircle, BookOpen } from 'lucide-react';
import { InsightTag } from '../../utils/ai-insights';

interface PlanInsightTagProps {
  tag: InsightTag;
  reason?: string;
  showTooltip?: boolean;
}

export function PlanInsightTag({ tag, reason, showTooltip = true }: PlanInsightTagProps) {
  // Map tags to their visual representation
  const tagConfig: Record<InsightTag, { label: string; icon: React.ReactNode; variant: 'default' | 'outline' | 'secondary' | 'destructive'; className: string }> = {
    'brikis-pick': {
      label: "Briki's Pick",
      icon: <Award className="h-3 w-3 mr-1" />,
      variant: 'default',
      className: 'bg-primary text-primary-foreground hover:bg-primary/80 font-medium'
    },
    'best-value': {
      label: 'Best Value',
      icon: <Zap className="h-3 w-3 mr-1" />,
      variant: 'secondary',
      className: 'bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-500/30'
    },
    'best-coverage': {
      label: 'Best Coverage',
      icon: <Check className="h-3 w-3 mr-1" />,
      variant: 'secondary',
      className: 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 border-blue-500/30'
    },
    'popular-choice': {
      label: 'Popular Choice',
      icon: <Star className="h-3 w-3 mr-1" />,
      variant: 'secondary',
      className: 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 border-yellow-500/30'
    },
    'budget-friendly': {
      label: 'Budget Friendly',
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
      variant: 'secondary',
      className: 'bg-orange-500/20 text-orange-700 hover:bg-orange-500/30 border-orange-500/30'
    },
    'comprehensive': {
      label: 'Comprehensive',
      icon: <BookOpen className="h-3 w-3 mr-1" />,
      variant: 'outline',
      className: 'bg-gray-500/10 text-gray-700 hover:bg-gray-500/20 border-gray-500/30'
    }
  };

  const config = tagConfig[tag];

  const badge = (
    <Badge 
      variant={config.variant}
      className={`flex items-center text-xs py-0 h-5 ${config.className}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );

  // If no reason or tooltip disabled, just return the badge
  if (!reason || !showTooltip) {
    return badge;
  }

  // Otherwise, wrap in tooltip
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{reason}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}