import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { 
  AssistantWidgetType, 
  NavigateToPageAction, 
  RecommendPlanAction,
  ComparePlansAction,
  ExplainTermAction
} from '@/types/assistant';
import { trackActionInteraction } from '@/lib/assistant-analytics';
import { useToast } from '@/hooks/use-toast';

export function useAssistantActions() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  /**
   * Handle navigation action
   */
  const handleNavigateAction = useCallback((action: NavigateToPageAction) => {
    trackActionInteraction('navigate_to_page', 'accepted');
    
    // Navigate to the specified path
    navigate(action.path);
    
    toast({
      title: 'Navigating',
      description: `Taking you to ${action.label}`,
      duration: 3000,
    });
  }, [navigate, toast]);

  /**
   * Handle plan recommendation action
   */
  const handleRecommendPlanAction = useCallback((action: RecommendPlanAction) => {
    trackActionInteraction('recommend_plan', 'accepted');
    
    // Navigate to the plan details page
    // The structure here depends on your app's routing
    const path = `/insurance/${action.category}/plan/${action.planId}`;
    navigate(path);
    
    toast({
      title: 'Plan Recommendation',
      description: 'Viewing the recommended plan details',
      duration: 3000,
    });
  }, [navigate, toast]);

  /**
   * Handle compare plans action
   */
  const handleComparePlansAction = useCallback((action: ComparePlansAction) => {
    trackActionInteraction('compare_plans', 'accepted');
    
    // Create URL with plan IDs for comparison page
    const planIdsParam = action.planIds.join(',');
    const path = `/insurance/${action.category}/compare?planIds=${planIdsParam}`;
    navigate(path);
    
    toast({
      title: 'Compare Plans',
      description: `Comparing ${action.planIds.length} plans`,
      duration: 3000,
    });
  }, [navigate, toast]);

  /**
   * Handle explanation of an insurance term
   */
  const handleExplainTermAction = useCallback((action: ExplainTermAction) => {
    trackActionInteraction('explain_term', 'clicked');
    
    // Display the explanation in a toast or modal
    toast({
      title: `Term: ${action.term}`,
      description: action.explanation,
      duration: 6000, // Longer duration for reading
    });
  }, [toast]);

  /**
   * Main handler for all assistant actions
   */
  const handleAction = useCallback((action: AssistantWidgetType | null) => {
    if (!action) return;
    
    switch (action.type) {
      case 'navigate_to_page':
        handleNavigateAction(action);
        break;
      case 'recommend_plan':
        handleRecommendPlanAction(action);
        break;
      case 'compare_plans':
        handleComparePlansAction(action);
        break;
      case 'explain_term':
        handleExplainTermAction(action);
        break;
      default:
        // Handle unknown action type
        console.warn('Unknown action type:', action);
        break;
    }
  }, [
    handleNavigateAction,
    handleRecommendPlanAction,
    handleComparePlansAction,
    handleExplainTermAction
  ]);

  return {
    handleAction,
    handleNavigateAction,
    handleRecommendPlanAction,
    handleComparePlansAction,
    handleExplainTermAction,
  };
}