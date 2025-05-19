import React from 'react';
import { 
  AssistantWidgetType, 
  GlossaryWidgetData, 
  VisualComparisonWidgetData, 
  PlanRecommendationWidgetData 
} from '../../../services/ai-service';
import GlossaryCard from './GlossaryCard';
import VisualExplainerCard from './VisualExplainerCard';

interface AssistantWidgetProps {
  data: AssistantWidgetType;
}

/**
 * AssistantWidget Component
 * This component acts as a router for different widget types
 * that the AI assistant can display within the chat interface
 */
const AssistantWidget: React.FC<AssistantWidgetProps> = ({ data }) => {
  // Safety check for data
  if (!data || !data.type) {
    return null;
  }

  // Render the appropriate widget based on the type
  const widgetType = data?.type || '';
  
  if (widgetType === 'show_glossary') {
    const glossaryData = data as GlossaryWidgetData;
    return (
      <GlossaryCard
        term={glossaryData.term}
        definition={glossaryData.definition}
        icon={glossaryData.icon}
        source={glossaryData.source}
        sourceUrl={glossaryData.sourceUrl}
      />
    );
  }
  
  if (widgetType === 'show_comparison') {
    const comparisonData = data as VisualComparisonWidgetData;
    return (
      <VisualExplainerCard
        title={comparisonData.title}
        leftTitle={comparisonData.leftTitle}
        rightTitle={comparisonData.rightTitle}
        items={comparisonData.items}
        leftColor={comparisonData.leftColor}
        rightColor={comparisonData.rightColor}
      />
    );
  }
    
  if (widgetType === 'show_plan_recommendations') {
    const planData = data as PlanRecommendationWidgetData;
    return (
      <div className="p-4 border border-blue-100 rounded-lg bg-blue-50 shadow-sm">
        <h3 className="text-base font-medium text-blue-800 mb-2">
          Insurance Plan Recommendations: {planData.category}
        </h3>
        {planData.message && (
          <p className="text-sm text-blue-700 mb-2">{planData.message}</p>
        )}
        <div className="text-xs text-blue-600">
          {planData.filters && Object.keys(planData.filters).length > 0 && (
            <div className="mt-2">
              <p className="font-medium">Applied Filters:</p>
              <ul className="list-disc list-inside mt-1">
                {Object.entries(planData.filters).map(([key, value]) => (
                  <li key={key} className="ml-2">{key}: {Array.isArray(value) ? value.join(', ') : value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Default case - unknown widget type
  console.warn('Unknown widget type:', widgetType);
  return null;
};

export default AssistantWidget;