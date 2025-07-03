import React, { useState } from 'react';
import { PublicLayout } from '../components/layout/public-layout';
import { motion } from 'framer-motion';
import { useNavigation } from '../lib/navigation';
import { Button } from '../components/ui/button';
import { Helmet } from 'react-helmet';
import { StripeService } from '../services/stripe-service';
import { 
  ArrowRight, 
  Check, 
  Award, 
  CreditCard, 
  Lock,
  Loader2
} from 'lucide-react';

export default function PricingPage() {
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handlePremiumSubscription = async () => {
    try {
      setIsLoading(true);
      const session = await StripeService.createSubscriptionSession({
        customerEmail: undefined, // Will be collected during checkout
      });
      StripeService.redirectToCheckout(session.url);
    } catch (error) {
      console.error('Failed to create subscription session:', error);
      // Fallback to auth page if Stripe fails
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Feature lists for pricing tiers
  const freeFeatures = [
    "AI-powered insurance comparison",
    "Basic coverage explanations",
    "Access to all insurance categories",
    "Save up to 3 quotes"
  ];

  const premiumFeatures = [
    "Everything in Free",
    "Unlimited saved quotes and plans",
    "Priority customer support",
    "24/7 AI assistance for claims",
    "Policy renewal reminders",
    "Custom coverage suggestions"
  ];

  return (
    <PublicLayout>
      <Helmet>
        <title>Briki Pricing – Simple, Transparent Insurance Pricing</title>
        <meta name="description" content="Briki offers free insurance comparison with transparent pricing. No hidden fees, no surprises. See how our commission-based model works for you." />
        <meta property="og:title" content="Briki Pricing – Simple, Transparent Insurance Pricing" />
        <meta property="og:description" content="Briki offers free insurance comparison with transparent pricing. No hidden fees, no surprises. See how our commission-based model works for you." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <main id="main-content">
        {/* Hero Section with Background Gradient */}
        <section className="relative overflow-hidden" aria-labelledby="pricing-heading">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white">
            <motion.div 
              className="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-full blur-3xl"
              animate={{
                x: [0, 20, 0],
                y: [0, -20, 0],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto py-20 md:py-28 px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 id="pricing-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Simple Pricing, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Maximum Value</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                Briki is free to use—we get paid by insurance providers, not by you.
              </p>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
                When you purchase a policy through Briki, we receive a commission from the insurer. This means our service costs you nothing extra.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-12 md:py-20" aria-labelledby="pricing-tiers-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="pricing-tiers-heading" className="sr-only">Pricing Plans</h2>
            <motion.div 
              className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={container}
            >
              {/* Free Tier */}
              <motion.div 
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-gray-900">$0</span>
                    <span className="text-xl text-gray-600 ml-2">/forever</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Everything you need to compare and purchase the right insurance plans.
                  </p>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/auth")}
                    aria-label="Sign up for free personal plan"
                  >
                    Get Started Free
                  </Button>
                </div>
                <div className="bg-gray-50 p-8 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">What's included:</h4>
                  <ul className="space-y-3">
                    {freeFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Premium Tier */}
              <motion.div 
                className="bg-white border border-blue-200 rounded-xl shadow-md overflow-hidden relative"
                variants={fadeIn}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
                  RECOMMENDED
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">$4.99</span>
                    <span className="text-xl text-gray-600 ml-2">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Enhanced features to help you manage all your insurance policies in one place.
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-600/25 text-white"
                    onClick={handlePremiumSubscription}
                    disabled={isLoading}
                    aria-label="Try premium plan free for 14 days"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Try Free for 14 Days'
                    )}
                  </Button>
                </div>
                <div className="bg-gradient-to-r from-blue-600/5 to-cyan-500/5 p-8 border-t border-blue-100">
                  <h4 className="font-medium text-gray-900 mb-4">Everything in Personal, plus:</h4>
                  <ul className="space-y-3">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How We Make Money Section */}
        <section className="py-16 md:py-24 bg-gray-50" aria-labelledby="business-model-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 id="business-model-heading" className="text-3xl font-bold text-gray-900">How Briki Makes Money</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                We're 100% transparent about our business model
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={container}
            >
              {/* Money Source 1 */}
              <motion.div 
                className="bg-white rounded-xl shadow-md p-8 text-center"
                variants={fadeIn}
              >
                <div className="h-12 w-12 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <CreditCard className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Insurance Commissions</h3>
                <p className="text-gray-600">
                  When you purchase a policy through Briki, we earn a commission from the insurance provider at no extra cost to you.
                </p>
              </motion.div>

              {/* Money Source 2 */}
              <motion.div 
                className="bg-white rounded-xl shadow-md p-8 text-center"
                variants={fadeIn}
              >
                <div className="h-12 w-12 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Award className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Premium Subscriptions</h3>
                <p className="text-gray-600">
                  Our Premium plan gives you additional features and support for a small monthly fee.
                </p>
              </motion.div>

              {/* Money Source 3 */}
              <motion.div 
                className="bg-white rounded-xl shadow-md p-8 text-center"
                variants={fadeIn}
              >
                <div className="h-12 w-12 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Lock className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Our Promise to You</h3>
                <p className="text-gray-600">
                  We never sell your personal data, and our recommendations are always independent and unbiased.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24" aria-labelledby="faq-heading">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 id="faq-heading" className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="mt-4 text-lg text-gray-600">
                Common questions about our pricing and business model
              </p>
            </motion.div>

            <motion.div 
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={container}
            >
              {/* FAQ Item 1 */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                variants={fadeIn}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is Briki really free to use?</h3>
                <p className="text-gray-600">
                  Yes! The core Briki service is completely free. We make money when you purchase a policy through our platform, as we receive a commission from the insurance provider. This commission doesn't affect your premium price.
                </p>
              </motion.div>

              {/* FAQ Item 2 */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                variants={fadeIn}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do I pay more for insurance through Briki?</h3>
                <p className="text-gray-600">
                  No. The prices you see on Briki are the same as if you went directly to the insurer. Insurance commissions are already built into the industry pricing model, so using Briki doesn't cost you anything extra.
                </p>
              </motion.div>

              {/* FAQ Item 3 */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                variants={fadeIn}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What's included in the Premium plan?</h3>
                <p className="text-gray-600">
                  Premium subscribers get unlimited saved quotes and plans, priority customer support, 24/7 AI assistance for claims, policy renewal reminders, and custom coverage suggestions based on your personal data.
                </p>
              </motion.div>

              {/* FAQ Item 4 */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                variants={fadeIn}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel my Premium subscription?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel anytime. Your Premium benefits will continue until the end of your billing period. After that, your account will automatically switch to the free Personal plan without losing any of your saved information.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden" aria-labelledby="cta-heading">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-90"></div>
          <div className="absolute inset-0 opacity-30">
            <motion.div 
              className="absolute top-0 right-0 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"
              animate={{
                x: [0, -30, 0],
                y: [0, 40, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <motion.div 
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-6">Find Better Insurance at No Extra Cost</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto">
              Join thousands who've saved money and found better coverage with Briki's free comparison tool.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="bg-white text-blue-600 hover:bg-white/90 py-6 px-8 text-lg font-medium rounded-lg shadow-lg"
                onClick={() => navigate("/auth")}
                aria-label="Get your free insurance quote"
              >
                Get My Free Quote
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </PublicLayout>
  );
}