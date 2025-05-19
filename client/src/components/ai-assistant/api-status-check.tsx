import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { checkOpenAIStatus } from '@/services/ai-service';

/**
 * Component that checks the availability of the OpenAI API
 * and displays appropriate status messages
 */
export function APIStatusCheck() {
  const [status, setStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const result = await checkOpenAIStatus();
        
        if (result.available) {
          setStatus('available');
        } else {
          setStatus('unavailable');
          setError(result.message || 'OpenAI API is currently unavailable');
        }
      } catch (err) {
        setStatus('unavailable');
        setError('Failed to check OpenAI API status');
        console.error('API status check error:', err);
      }
    };

    checkApiStatus();
  }, []);

  // Don't show anything when still checking to avoid UI flashing
  if (status === 'checking') {
    return null;
  }

  // Don't show the success message after a brief period
  if (status === 'available') {
    return (
      <div className="fixed bottom-4 right-4 z-40 w-80 transition-opacity" 
           style={{ animation: 'fadeOut 1s ease-in-out 3s forwards' }}>
        <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">Ready to help</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400 text-sm">
            AI Assistant is available and ready to answer your questions.
          </AlertDescription>
        </Alert>
        <style jsx>{`
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; display: none; }
          }
        `}</style>
      </div>
    );
  }

  // Show error message if API is unavailable
  if (status === 'unavailable') {
    return (
      <div className="fixed bottom-4 right-4 z-40 w-80">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>AI Assistant unavailable</AlertTitle>
          <AlertDescription className="text-sm">
            {error}. Our team has been notified and is working to restore service.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
}