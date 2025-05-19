import { useNavigate } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { trackAssistantAction } from '@/lib/assistant-analytics';
import { 
  AssistantAction, 
  AssistantActionType,
  NavigateToQuoteFlowAction,
  AddPlanToComparisonAction,
  ShowGlossaryTermAction
} from '@/types/assistant';
import { useComparisonStore } from '@/stores/comparison-store';
import { useGlossaryStore } from '@/stores/glossary-store';
import { InsuranceCategory } from '@/types/insurance';

/**
 * Hook to handle actions from the AI Assistant
 */
export function useAssistantActions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addPlanToComparison } = useComparisonStore();
  const { showTerm } = useGlossaryStore();

  /**
   * Process an action from the AI
   * @param action The action to process
   * @returns A message about the result of the action, or null if no message should be shown
   */
  const processAction = (action: AssistantAction): string => {
    // Track the action in analytics
    trackAssistantAction(action.type, action.category || 'general');

    // Process the action based on type
    switch (action.type) {
      case AssistantActionType.NAVIGATE_TO_QUOTE_FLOW:
        return handleNavigateToQuoteFlow(action as NavigateToQuoteFlowAction);
      
      case AssistantActionType.ADD_PLAN_TO_COMPARISON:
        return handleAddPlanToComparison(action as AddPlanToComparisonAction);
      
      case AssistantActionType.SHOW_GLOSSARY_TERM:
        return handleShowGlossaryTerm(action as ShowGlossaryTermAction);
      
      default:
        toast({
          title: 'Action Not Supported',
          description: 'Sorry, this action is not supported yet.',
          variant: 'destructive'
        });
        return 'I tried to perform an action, but it\'s not supported yet. Let me know if there\'s something else I can help with.';
    }
  };

  /**
   * Handle the navigate to quote flow action
   */
  const handleNavigateToQuoteFlow = (action: NavigateToQuoteFlowAction): string => {
    const { category, prefillData } = action;
    
    // Store prefill data in sessionStorage if provided
    if (prefillData) {
      sessionStorage.setItem(`quote_prefill_${category}`, JSON.stringify(prefillData));
    }
    
    // Navigate to the appropriate quote page based on category
    switch (category) {
      case InsuranceCategory.TRAVEL:
        navigate('/insurance/travel/quote');
        return 'I\'ve opened the travel insurance quote form for you.';
      
      case InsuranceCategory.AUTO:
        navigate('/insurance/auto/quote');
        return 'I\'ve opened the auto insurance quote form for you.';
      
      case InsuranceCategory.PET:
        navigate('/insurance/pet/quote');
        return 'I\'ve opened the pet insurance quote form for you.';
      
      case InsuranceCategory.HEALTH:
        navigate('/insurance/health/quote');
        return 'I\'ve opened the health insurance quote form for you.';
      
      default:
        toast({
          title: 'Category Not Supported',
          description: `The ${category} category is not supported for quotes yet.`,
          variant: 'destructive'
        });
        return `I tried to open a quote form for ${category} insurance, but this category isn't supported yet.`;
    }
  };

  /**
   * Handle the add plan to comparison action
   */
  const handleAddPlanToComparison = (action: AddPlanToComparisonAction): string => {
    const { planId, category } = action;
    
    try {
      // Add the plan to comparison
      addPlanToComparison(planId, category);
      
      toast({
        title: 'Plan Added',
        description: 'The plan has been added to your comparison list.',
        variant: 'default'
      });
      
      return 'I\'ve added that plan to your comparison list. You can view all compared plans on the comparison page.';
    } catch (error) {
      toast({
        title: 'Error Adding Plan',
        description: 'There was an error adding the plan to comparison.',
        variant: 'destructive'
      });
      
      return 'I tried to add that plan to your comparison list, but there was an error. Please try adding it manually.';
    }
  };

  /**
   * Handle the show glossary term action
   */
  const handleShowGlossaryTerm = (action: ShowGlossaryTermAction): string => {
    const { term } = action;
    
    try {
      // Show the term in the glossary
      showTerm(term);
      
      return 'I\'ve opened the glossary to that term for you.';
    } catch (error) {
      return 'I tried to show you that term in our glossary, but there was an error. You can find our insurance glossary in the help section.';
    }
  };

  return { processAction };
}