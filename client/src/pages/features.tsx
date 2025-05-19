import React from 'react';
import { PublicLayout } from '@/components/layout/public-layout';
import { motion } from 'framer-motion';
import { useNavigation } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import GradientButton from '@/components/gradient-button';
import { 
  Sparkles, 
  LineChart, 
  Clock, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';

export default function FeaturesPage() {
  const { navigate } = useNavigation();

  // Animation variants for fade-in sections
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <PublicLayout>
      {/* Hero Section with Ambient Background */}
      <section className="relative overflow-hidden">
        {/* Ambient Background Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto py-20 md:py-28 px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Insurance Made <span className="text-primary">Understandable</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Briki simplifies insurance with AI-powered comparisons, clear visual explanations, and personalized recommendations.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <GradientButton
                onClick={() => navigate("/auth")}
                className="px-8 py-3 rounded-lg shadow-lg"
              >
                Try Briki Free
              </GradientButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Why thousands of users trust Briki for their insurance needs
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={container}
          >
            {/* Feature Card 1 */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow"
              variants={fadeIn}
            >
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered Plan Comparison</h3>
              <p className="text-gray-600">
                Our intelligent algorithms analyze thousands of insurance plans to find the perfect match for your unique needs.
              </p>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow"
              variants={fadeIn}
            >
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <LineChart className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Simple, Visual Explanations</h3>
              <p className="text-gray-600">
                Complex insurance terms made simple with visual explanations that help you understand exactly what you're getting.
              </p>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow"
              variants={fadeIn}
            >
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Fast Checkout in Seconds</h3>
              <p className="text-gray-600">
                Secure, streamlined checkout process gets you covered in seconds, not hours. No paperwork or phone calls needed.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Get insured in three simple steps
            </p>
          </motion.div>

          <motion.div 
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={container}
          >
            {/* Timeline line */}
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-200 transform -translate-x-1/2 hidden md:block" />

            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3">
              {/* Step 1 */}
              <motion.div 
                className="relative md:px-8"
                variants={fadeIn}
              >
                <div className="bg-white p-6 rounded-xl shadow-md relative z-10">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">Tell Us About Your Needs</h3>
                  <p className="text-gray-600 text-center">
                    Answer a few simple questions about what you're looking to insure.
                  </p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                className="relative md:px-8"
                variants={fadeIn}
              >
                <div className="bg-white p-6 rounded-xl shadow-md relative z-10">
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-indigo-600 font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">Compare Options</h3>
                  <p className="text-gray-600 text-center">
                    Our AI finds and compares the best plans for your specific situation.
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                className="relative md:px-8"
                variants={fadeIn}
              >
                <div className="bg-white p-6 rounded-xl shadow-md relative z-10">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">Get Covered</h3>
                  <p className="text-gray-600 text-center">
                    Purchase with a few clicks and get instant coverage confirmation.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900">Trusted By</h2>
            <p className="mt-4 text-lg text-gray-600">
              Thousands of users rely on Briki every day
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={container}
          >
            {/* These would normally be real logos, using placeholders here */}
            {[1, 2, 3, 4].map((index) => (
              <motion.div 
                key={index}
                className="flex justify-center"
                variants={fadeIn}
              >
                <div className="h-12 bg-gray-300/30 rounded-md flex items-center justify-center px-8 w-full">
                  <span className="text-gray-500 font-medium">Company {index}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonials */}
          <motion.div 
            className="mt-16 grid md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={container}
          >
            {/* Testimonial 1 */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h4 className="font-semibold">John D.</h4>
                  <p className="text-sm text-gray-600">Travel Insurance Customer</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Briki made finding travel insurance so easy. I compared options and got coverage in under 5 minutes!"
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h4 className="font-semibold">Sarah M.</h4>
                  <p className="text-sm text-gray-600">Pet Insurance Customer</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I was able to find affordable coverage for my dog with pre-existing conditions thanks to Briki's comparison tools."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
        </div>

        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your perfect insurance match?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Join thousands of satisfied customers who've simplified their insurance journey with Briki.
          </p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="bg-white text-blue-600 hover:bg-white/90 py-6 px-8 text-lg font-medium rounded-lg shadow-lg"
              onClick={() => navigate("/auth")}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </PublicLayout>
  );
}