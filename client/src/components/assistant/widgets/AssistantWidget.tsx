import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { AssistantWidgetType, GlossaryWidgetData, VisualComparisonWidgetData } from '../../../services/ai-service';
import { BookOpen, BarChart2, MessageCircle, ExternalLink } from 'lucide-react';

interface AssistantWidgetProps {
  data: AssistantWidgetType;
}

/**
 * AssistantWidget Component
 * This component acts as a router for different widget types
 * that the AI assistant can display within the chat interface
 */
const AssistantWidget: React.FC<AssistantWidgetProps> = ({ data }) => {
  if (!data) return null;

  switch (data.type) {
    case 'show_glossary':
      return <GlossaryWidget data={data as GlossaryWidgetData} />;
    case 'show_comparison':
      return <VisualComparisonWidget data={data as VisualComparisonWidgetData} />;
    default:
      return null;
  }
};

// Glossary Term Widget
interface GlossaryWidgetProps {
  data: GlossaryWidgetData;
}

const GlossaryWidget: React.FC<GlossaryWidgetProps> = ({ data }) => {
  return (
    <Card className="bg-white border-indigo-100 shadow-sm">
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-600" />
          <CardTitle className="text-sm font-medium text-indigo-700">Insurance Term</CardTitle>
        </div>
        <CardDescription className="text-xs text-indigo-500">
          Definition from Briki's Insurance Glossary
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-3 pb-2">
        <h4 className="text-base font-semibold mb-1 text-gray-800">{data.term}</h4>
        <p className="text-sm text-gray-700">{data.definition}</p>
        {data.example && (
          <div className="mt-2 text-xs text-gray-600 italic">
            <span className="font-medium">Example:</span> {data.example}
          </div>
        )}
      </CardContent>
      {data.learnMoreUrl && (
        <CardFooter className="pt-1 pb-3 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            onClick={() => window.open(data.learnMoreUrl, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Learn more
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

// Visual Comparison Widget
interface VisualComparisonWidgetProps {
  data: VisualComparisonWidgetData;
}

const VisualComparisonWidget: React.FC<VisualComparisonWidgetProps> = ({ data }) => {
  return (
    <Card className="bg-white border-blue-100 shadow-sm">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-blue-600" />
          <CardTitle className="text-sm font-medium text-blue-700">{data.title}</CardTitle>
        </div>
        <CardDescription className="text-xs text-blue-500">
          Visual comparison by Briki
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-3 pb-3">
        <div className="text-sm">
          {data.items.map((item, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="text-xs font-semibold text-gray-500">{item.value}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {data.description && (
          <p className="text-xs text-gray-600 mt-3">{data.description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AssistantWidget;