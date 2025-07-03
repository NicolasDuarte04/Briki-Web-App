interface CreateSubscriptionSessionParams {
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
}

interface SubscriptionSessionResponse {
  sessionId: string;
  url: string;
}

export class StripeService {
  private static baseUrl = '/api/stripe';

  static async createSubscriptionSession(params: CreateSubscriptionSessionParams): Promise<SubscriptionSessionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/create-subscription-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          customerEmail: params.customerEmail,
          successUrl: params.successUrl || `${window.location.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: params.cancelUrl || `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subscription session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription session:', error);
      throw error;
    }
  }

  static async getSubscriptionStatus(customerId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/subscription-status/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get subscription status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  }

  static redirectToCheckout(url: string) {
    if (url) {
      window.location.href = url;
    } else {
      throw new Error('No checkout URL provided');
    }
  }
} 