import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/components/ui/use-toast';
import { AssistantActionType } from '@/services/ai-service';

/**
 * Custom hook to handle assistant actions
 * This hook provides a function to process and dispatch actions based on assistant responses
 */
export function useAssistantActions() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  /**
   * Process assistant action and perform the appropriate navigation or UI update
   * @param action The action object from the assistant response
   * @returns boolean indicating if the action was successfully processed
   */
  const processAction = useCallback((action: AssistantActionType | null): boolean => {
    if (!action) return false;

    try {
      console.log('Processing assistant action:', action.type);
      
      // Show toast to inform user about the action
      if (action.message) {
        toast({
          title: 'Briki Assistant',
          description: action.message,
          duration: 3000,
        });
      }

      switch (action.type) {
        case 'navigate_to_quote_flow': {
          // Build the URL with any preload parameters
          let url = `/insurance/${action.category}`;
          
          // Add preload data as URL parameters if available
          if (action.preload && Object.keys(action.preload).length > 0) {
            const params = new URLSearchParams();
            Object.entries(action.preload).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                value.forEach(v => params.append(`${key}[]`, v.toString()));
              } else {
                params.append(key, value.toString());
              }
            });
            url += `?${params.toString()}`;
          }
          
          // Show transition confirmation and navigate
          setTimeout(() => {
            navigate(url);
          }, 500); // Small delay for better UX
          
          return true;
        }
        
        case 'open_comparison_tool': {
          // Navigate to comparison tool with selected plans if available
          let url = `/compare-plans?category=${action.category}`;
          
          if (action.planIds && action.planIds.length > 0) {
            url += `&plans=${action.planIds.join(',')}`;
          }
          
          setTimeout(() => {
            navigate(url);
          }, 500);
          
          return true;
        }
        
        case 'filter_plan_results': {
          // Navigate to the appropriate category with filter parameters
          const url = `/insurance/${action.category}?${new URLSearchParams(
            // Convert filters object to record of strings
            Object.entries(action.filters).reduce((acc, [key, value]) => {
              acc[key] = value.toString();
              return acc;
            }, {} as Record<string, string>)
          ).toString()}`;
          
          setTimeout(() => {
            navigate(url);
          }, 500);
          
          return true;
        }
        
        case 'show_glossary_term': {
          // This will be handled in the UI components directly
          // The assistant component will render a GlossaryCard
          return true;
        }
        
        case 'redirect_to_account_settings': {
          // Navigate to account settings with optional section
          let url = '/settings';
          
          if (action.section) {
            url += `?section=${action.section}`;
          }
          
          setTimeout(() => {
            navigate(url);
          }, 500);
          
          return true;
        }
        
        default:
          console.warn('Unsupported action type:', action.type);
          return false;
      }
    } catch (error) {
      console.error('Error processing assistant action:', error);
      
      // Show error toast
      toast({
        title: 'Action Failed',
        description: 'I couldn\'t complete that action, but I can still help with your questions.',
        variant: 'destructive',
        duration: 3000,
      });
      
      return false;
    }
  }, [navigate, toast]);

  return { processAction };
}