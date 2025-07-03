import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLocation } from 'wouter';
import { PublicLayout } from '../components/layout/public-layout';

export default function CheckoutSuccess() {
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // You can use the session_id to retrieve the session from your backend
    // and update your database accordingly
    if (sessionId) {
      console.log('Checkout session completed:', sessionId);
    }
  }, [sessionId]);

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful!
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Thank you for your purchase. Your insurance coverage is now active.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Go to Dashboard
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
            
            {sessionId && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                Session ID: {sessionId.substring(0, 20)}...
              </p>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
} 