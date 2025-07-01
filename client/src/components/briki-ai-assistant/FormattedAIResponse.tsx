import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FormattedAIResponseProps {
  content: string;
}

export const FormattedAIResponse: React.FC<FormattedAIResponseProps> = ({ content }) => {
  // Detect if this is a comparison response
  const isComparison = content.toLowerCase().includes('comparando') || 
                      content.toLowerCase().includes('comparison') ||
                      content.toLowerCase().includes('versus') ||
                      content.toLowerCase().includes('diferencia');

  // Parse comparison sections
  const parseComparison = (text: string) => {
    // Look for plan names (usually in quotes or after "Plan:" or similar patterns)
    const planPattern = /(?:Plan:|"([^"]+)"|([A-Z][^:]+):)/g;
    const sections = text.split(/\n\n+/);
    
    const comparison = {
      intro: '',
      plans: [] as Array<{
        name: string;
        pros: string[];
        cons: string[];
        price?: string;
        bestFor?: string;
      }>,
      conclusion: ''
    };

    // Extract intro (first paragraph)
    if (sections.length > 0) {
      comparison.intro = sections[0];
    }

    // Extract plan details
    sections.forEach((section, index) => {
      if (index === 0) return; // Skip intro
      
      // Check if this section describes a plan
      const planNameMatch = section.match(/^(?:Plan |)?"?([^"\n:]+)"?:?/);
      if (planNameMatch) {
        const planInfo = {
          name: planNameMatch[1].trim(),
          pros: [] as string[],
          cons: [] as string[],
          price: undefined as string | undefined,
          bestFor: undefined as string | undefined
        };

        // Extract pros (look for ✓, ✅, ventajas, pros, benefits)
        const prosMatch = section.match(/(?:✓|✅|ventajas?|pros?|beneficios?)[:\s]+([^✗✘❌]+)/i);
        if (prosMatch) {
          planInfo.pros = prosMatch[1].split(/[•\-\n]/).filter(p => p.trim()).map(p => p.trim());
        }

        // Extract cons (look for ✗, ✘, ❌, desventajas, cons)
        const consMatch = section.match(/(?:✗|✘|❌|desventajas?|cons?)[:\s]+([^✓✅]+)/i);
        if (consMatch) {
          planInfo.cons = consMatch[1].split(/[•\-\n]/).filter(p => p.trim()).map(p => p.trim());
        }

        // Extract price
        const priceMatch = section.match(/(?:\$|COP)\s*([\d,]+)/);
        if (priceMatch) {
          planInfo.price = priceMatch[0];
        }

        // Extract "best for"
        const bestForMatch = section.match(/(?:ideal para|best for|recomendado para)[:\s]+([^\n.]+)/i);
        if (bestForMatch) {
          planInfo.bestFor = bestForMatch[1].trim();
        }

        comparison.plans.push(planInfo);
      }
    });

    // Extract conclusion (last paragraph if it doesn't describe a plan)
    const lastSection = sections[sections.length - 1];
    if (!lastSection.match(/^(?:Plan |)?"?([^"\n:]+)"?:?/)) {
      comparison.conclusion = lastSection;
    }

    return comparison;
  };

  // Format bullet points
  const formatBulletPoints = (text: string) => {
    const lines = text.split('\n');
    const formattedLines = lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Check for bullet points
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        return (
          <li key={index} className="flex items-start space-x-2 mb-2">
            <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{trimmedLine.substring(1).trim()}</span>
          </li>
        );
      }
      
      // Check for numbered lists
      if (/^\d+\./.test(trimmedLine)) {
        return (
          <li key={index} className="flex items-start space-x-2 mb-2">
            <span className="text-sm font-semibold text-blue-600">{trimmedLine.match(/^\d+/)?.[0]}.</span>
            <span className="text-sm">{trimmedLine.replace(/^\d+\./, '').trim()}</span>
          </li>
        );
      }
      
      // Regular paragraph
      if (trimmedLine) {
        return <p key={index} className="text-sm mb-3">{trimmedLine}</p>;
      }
      
      return null;
    }).filter(Boolean);

    return formattedLines;
  };

  // Render comparison view
  if (isComparison) {
    const comparison = parseComparison(content);
    
    return (
      <div className="space-y-4">
        {comparison.intro && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            {comparison.intro}
          </p>
        )}

        {comparison.plans.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {comparison.plans.map((plan, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-base">{plan.name}</h4>
                    {plan.price && (
                      <Badge variant="secondary" className="font-mono">
                        {plan.price}
                      </Badge>
                    )}
                  </div>

                  {plan.bestFor && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                      Ideal para: {plan.bestFor}
                    </p>
                  )}

                  <Separator className="my-2" />

                  {plan.pros.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Ventajas
                      </h5>
                      <ul className="space-y-1">
                        {plan.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start text-xs">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {plan.cons.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2 flex items-center">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        Limitaciones
                      </h5>
                      <ul className="space-y-1">
                        {plan.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start text-xs">
                            <XCircle className="h-3 w-3 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {comparison.conclusion && (
          <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                {comparison.conclusion}
              </p>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // Regular formatted response
  return (
    <div className="space-y-3">
      {formatBulletPoints(content)}
    </div>
  );
};

export default FormattedAIResponse; 