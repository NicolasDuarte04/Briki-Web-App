import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Info, Lightbulb, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { Skeleton } from '@/components/ui/skeleton';

interface TermExplainerProps {
  className?: string;
  presetTerms?: string[];
}

/**
 * A component that uses AI to explain insurance terms
 */
export default function TermExplainer({ className = '', presetTerms = [] }: TermExplainerProps) {
  const [term, setTerm] = useState('');
  const [explanation, setExplanation] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');
  const { explainTerm, isTermExplanationLoading } = useAIAssistant();

  const defaultTerms = presetTerms.length > 0 ? presetTerms : [
    "Deductible",
    "Premium",
    "Claim",
    "Coverage",
    "Policy",
    "Exclusion"
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim() || isTermExplanationLoading) return;
    
    setSearchedTerm(term);
    setExplanation('');
    
    try {
      const result = await explainTerm(term);
      setExplanation(result);
    } catch (error) {
      console.error('Error explaining term:', error);
      setExplanation('Sorry, I had trouble explaining that term. Please try again.');
    }
  };

  const handleTermClick = async (selectedTerm: string) => {
    setTerm(selectedTerm);
    setSearchedTerm(selectedTerm);
    setExplanation('');
    
    try {
      const result = await explainTerm(selectedTerm);
      setExplanation(result);
    } catch (error) {
      console.error('Error explaining term:', error);
      setExplanation('Sorry, I had trouble explaining that term. Please try again.');
    }
  };

  return (
    <Card className={`shadow-glow-sm border-primary/20 backdrop-blur-sm bg-background/90 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Insurance Term Explainer
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter an insurance term..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            disabled={isTermExplanationLoading}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            disabled={!term.trim() || isTermExplanationLoading}
            className={isTermExplanationLoading ? 'animate-pulse' : ''}
          >
            {isTermExplanationLoading ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
              <Search size={16} className="mr-2" />
            )}
            Explain
          </Button>
        </form>
        
        {!searchedTerm && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Lightbulb size={14} className="text-yellow-500" />
              <span>Popular insurance terms</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {defaultTerms.map((defaultTerm, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTermClick(defaultTerm)}
                  className="h-8"
                >
                  {defaultTerm}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {searchedTerm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-3"
          >
            <div className="font-medium text-primary">
              {searchedTerm}
            </div>
            
            {isTermExplanationLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[85%]" />
              </div>
            ) : (
              <div className="text-sm leading-relaxed space-y-2">
                {explanation.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground italic pt-0">
        <div className="flex items-center gap-1.5">
          <Info size={12} />
          Powered by Briki AI
        </div>
      </CardFooter>
    </Card>
  );
}