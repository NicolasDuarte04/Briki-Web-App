import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { trackEvent } from '../../lib/analytics';
import { EventCategory } from '../../constants/analytics';

interface InsuranceTerm {
  term: string;
  definition: string;
  example?: string;
}

interface TermExplainerProps {
  initialTerm?: string;
  onClose?: () => void;
}

// Common insurance terms database
const INSURANCE_TERMS: InsuranceTerm[] = [
  {
    term: "Premium",
    definition: "The amount you pay to the insurance company for your policy, typically on a monthly, quarterly, or annual basis.",
    example: "If your monthly premium is $50, you'll pay $600 per year for coverage."
  },
  {
    term: "Deductible",
    definition: "The amount you must pay out-of-pocket before your insurance coverage begins to pay.",
    example: "With a $500 deductible, you'll pay the first $500 of covered services before insurance pays."
  },
  {
    term: "Copayment",
    definition: "A fixed amount you pay for a covered service, usually when you receive the service.",
    example: "A $20 copay for doctor visits means you pay $20 each time you see your doctor."
  },
  {
    term: "Coverage Limit",
    definition: "The maximum amount your insurance will pay for covered services.",
    example: "A $1 million coverage limit means your insurer won't pay more than that amount during your policy period."
  },
  {
    term: "Claim",
    definition: "A formal request to your insurance company asking for payment based on the terms of your policy.",
    example: "After a car accident, you file a claim with your insurance company to pay for repairs."
  },
  {
    term: "Exclusion",
    definition: "Specific conditions, treatments, or situations that your insurance policy does not cover.",
    example: "Many health insurance policies exclude cosmetic procedures from coverage."
  },
  {
    term: "Waiting Period",
    definition: "The time you must wait after purchasing a policy before coverage begins for certain benefits.",
    example: "Many dental plans have a 6-month waiting period for major procedures."
  },
  {
    term: "Underwriting",
    definition: "The process insurers use to evaluate risk and determine premium rates for applicants.",
    example: "During underwriting, a life insurer reviews your health history to set your premium."
  }
];

/**
 * Component that explains insurance terminology to users in an accessible way
 * Provides definitions, examples, and context for insurance terms
 */
export const TermExplainer: React.FC<TermExplainerProps> = ({ 
  initialTerm,
  onClose 
}) => {
  const [searchTerm, setSearchTerm] = useState(initialTerm || "");
  
  // Filter terms based on search input
  const filteredTerms = searchTerm 
    ? INSURANCE_TERMS.filter(item => 
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : INSURANCE_TERMS;

  // Track term interactions
  const handleTermClick = (term: string) => {
    trackEvent('term_explainer_view', EventCategory.ENGAGEMENT, term);
  };

  return (
    <Card className="w-full bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Insurance Terms Explained</CardTitle>
        <CardDescription>
          Common insurance terminology simplified
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for a term..."
            className="w-full p-2 border rounded-md bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {filteredTerms.map((item, index) => (
            <AccordionItem key={index} value={item.term}>
              <AccordionTrigger 
                onClick={() => handleTermClick(item.term)}
                className="text-primary font-medium hover:text-primary/80"
              >
                {item.term}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm mb-2">{item.definition}</p>
                {item.example && (
                  <p className="text-xs text-muted-foreground italic">
                    Example: {item.example}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {filteredTerms.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No matching terms found. Try a different search.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={onClose}>
          Close
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TermExplainer;