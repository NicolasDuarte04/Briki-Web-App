import { Router } from 'express';
import Stripe from 'stripe';

const router = Router();

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-04-30.basil' as any,
    })
  : null;

if (!stripe) {
  console.warn('Warning: Missing STRIPE_SECRET_KEY environment variable');
}

// Create subscription checkout session for Briki Premium
router.post('/create-subscription-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { customerEmail, successUrl, cancelUrl } = req.body;

    // Create or retrieve customer
    let customer;
    if (customerEmail) {
      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });
      
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
          metadata: {
            source: 'briki_premium_subscription',
          },
        });
      }
    }

    // Create subscription checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer?.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Briki Premium',
              description: 'Enhanced insurance comparison and management features',
              metadata: {
                product_type: 'subscription',
                trial_days: '14',
              },
            },
            unit_amount: 499, // $4.99 in cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          subscription_type: 'briki_premium',
          trial_days: '14',
        },
      },
      success_url: successUrl || `${process.env.FRONTEND_URL || 'http://localhost:5050'}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:5050'}/pricing`,
      metadata: {
        subscription_type: 'briki_premium',
        customer_email: customerEmail,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error: any) {
    console.error('Stripe subscription session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook handler for subscription events
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !endpointSecret) {
    return res.status(400).json({ error: 'Webhook not configured' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      const subscriptionCreated = event.data.object;
      console.log('Subscription created:', subscriptionCreated.id);
      // Handle subscription creation (e.g., update user status in database)
      break;
    
    case 'customer.subscription.updated':
      const subscriptionUpdated = event.data.object;
      console.log('Subscription updated:', subscriptionUpdated.id);
      // Handle subscription updates
      break;
    
    case 'customer.subscription.deleted':
      const subscriptionDeleted = event.data.object;
      console.log('Subscription deleted:', subscriptionDeleted.id);
      // Handle subscription cancellation
      break;
    
    case 'invoice.payment_succeeded':
      const invoiceSucceeded = event.data.object;
      console.log('Payment succeeded:', invoiceSucceeded.id);
      // Handle successful payment
      break;
    
    case 'invoice.payment_failed':
      const invoiceFailed = event.data.object;
      console.log('Payment failed:', invoiceFailed.id);
      // Handle failed payment
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Get subscription status for a customer
router.get('/subscription-status/:customerId', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { customerId } = req.params;

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return res.json({ 
        hasSubscription: false,
        subscription: null 
      });
    }

    const subscription = subscriptions.data[0];
    
    res.json({
      hasSubscription: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
      }
    });
  } catch (error: any) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 