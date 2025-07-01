import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { AssistantAction } from '../services/ai-service';
import { useCompareStore } from '../store/compare-store';
import { useQuoteStore } from '../store/quote-store';
import { trackEvent } from '../lib/analytics';
import { EventCategory } from '../constants/analytics';

/**
 * Hook to process assistant actions
 */
export function useAssistantActions() {
  const [, navigate] = useLocation();
  const { addPlanToComparison, clearPlans } = useCompareStore();
  const { setQuote, setCategory } = useQuoteStore();

  /**
   * Process an action from the AI assistant
   * @param action The action to process
   * @returns boolean indicating success or failure
   */
  const processAction = useCallback((action: AssistantAction | null): boolean => {
    if (!action) {
      return false;
    }

    try {
      trackEvent(
        'assistant_action_executed',
        EventCategory.Assistant,
        action.type
      );

      switch (action.type) {
        case 'navigate_to_quote_flow': {
          // Handle navigation to a quote flow
          const { category, preload } = action;
          
          // Set the quote data if provided
          if (preload) {
            setQuote(preload);
          }
          
          // Set the category
          setCategory(category);
          
          // Navigate to the appropriate quote flow
          navigate(`/insurance/${category}/quote`);
          return true;
        }
        
        case 'open_comparison_tool': {
          // Handle opening the comparison tool
          const { category, plans } = action;
          
          // Clear existing plans
          clearPlans();
          
          // If specific plans are provided, add them to comparison
          if (plans && Array.isArray(plans)) {
            plans.forEach(planId => {
              // In a real impl, we'd fetch and add each plan by ID
              // addPlanToComparison(fetchPlanById(planId));
            });
          }
          
          // Navigate to comparison page (with or without category filter)
          if (category) {
            navigate(`/compare?category=${category}`);
          } else {
            navigate('/compare');
          }
          return true;
        }
        
        case 'filter_plan_results': {
          // Handle filtering plan results
          const { category, filters } = action;
          
          // Construct query params from filters
          const queryParams = new URLSearchParams();
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value));
            }
          });
          
          // Navigate to the plans page with filters
          navigate(`/insurance/${category}/plans?${queryParams.toString()}`);
          return true;
        }
        
        case 'navigate_to_page': {
          // Handle navigation to a specific page
          const { path } = action;
          navigate(path);
          return true;
        }
        
        default:
          console.warn(`Unknown action type: ${(action as any).type}`);
          return false;
      }
    } catch (error) {
      console.error("Error processing assistant action:", error);
      trackEvent(
        'assistant_action_error',
        EventCategory.Assistant,
        `action_type_${action.type}`
      );
      return false;
    }
  }, [navigate, addPlanToComparison, clearPlans, setQuote, setCategory]);

  return { processAction };
}