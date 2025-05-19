import { useLocation } from 'wouter';
import { AIAction, NavigateToQuoteFlowAction, AddPlanToComparisonAction, ShowGlossaryTermAction } from '@/types/assistant';
import { useToast } from '@/components/ui/use-toast';
import { trackEvent, EventCategory } from '@/lib/analytics';

/**
 * Hook to handle actions from the AI Assistant
 */
export function useAssistantActions() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  /**
   * Process an action from the AI
   * @param action The action to process
   * @returns A message about the result of the action, or null if no message should be shown
   */
  const processAction = (action: AIAction | null): string | null => {
    if (!action) return null;

    try {
      switch (action.type) {
        case 'navigate_to_quote_flow':
          return handleNavigateToQuoteFlow(action as NavigateToQuoteFlowAction);
        
        case 'add_plan_to_comparison':
          return handleAddPlanToComparison(action as AddPlanToComparisonAction);
        
        case 'show_glossary_term':
          return handleShowGlossaryTerm(action as ShowGlossaryTermAction);
        
        default:
          console.warn('Unknown action type:', action.type);
          return null;
      }
    } catch (error) {
      console.error('Error processing action:', error);
      toast({
        title: 'Error',
        description: 'There was an error processing this action. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  /**
   * Handle the navigate to quote flow action
   */
  const handleNavigateToQuoteFlow = (action: NavigateToQuoteFlowAction): string => {
    const { category } = action;
    
    // Track the action
    trackEvent('ai_navigate_to_quote_flow', EventCategory.CONVERSION, category);
    
    // Navigate to the quote flow
    setTimeout(() => {
      navigate(`/insurance/${category.toLowerCase()}/quote`);
    }, 1000);
    
    return `I'll redirect you to the ${category} insurance quote flow in a moment.`;
  };

  /**
   * Handle the add plan to comparison action
   */
  const handleAddPlanToComparison = (action: AddPlanToComparisonAction): string => {
    const { planId, category } = action;
    
    // Track the action
    trackEvent('ai_add_plan_to_comparison', EventCategory.ENGAGEMENT, category);
    
    // In a real implementation, we would add the plan to the comparison list in a store
    // For now, we'll just navigate to the comparison page
    setTimeout(() => {
      navigate(`/compare-plans?planId=${planId}&category=${category.toLowerCase()}`);
    }, 1000);
    
    return `I've added this plan to your comparison list. You'll be redirected to view your comparisons.`;
  };

  /**
   * Handle the show glossary term action
   */
  const handleShowGlossaryTerm = (action: ShowGlossaryTermAction): string => {
    const { term, definition } = action;
    
    // Track the action
    trackEvent('ai_show_glossary_term', EventCategory.ENGAGEMENT, term);
    
    // Show the term definition in a toast
    toast({
      title: term,
      description: definition,
      duration: 8000,
    });
    
    return null;
  };

  return { processAction };
}