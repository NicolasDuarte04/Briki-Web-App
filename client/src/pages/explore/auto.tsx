import { motion } from "framer-motion";
import { ExploreLayout } from "@/components/layout";
import { Link } from "wouter";
import { Car, Shield, Clock, ArrowRight, BadgeCheck, Wrench, PhoneCall } from "lucide-react";

export default function ExploreAutoInsurance() {
  return (
    <ExploreLayout
      title="Auto Insurance | Briki"
      description="Find and compare the best auto insurance plans in Colombia and Mexico. Protect your vehicle with comprehensive coverage for accidents, theft, and liability."
      ogImage="/og-auto-insurance.jpg"
      ogUrl="https://briki.com/explore/auto"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#003087] via-[#0052aa] to-[#0074FF]"
          aria-hidden="true"
        />
        <div className="relative pt-20 pb-24 md:pt-32 md:pb-32 container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Protect Your Vehicle with Confidence
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl mb-8 text-white/90"
            >
              Find the perfect auto insurance plan that offers comprehensive coverage, competitive rates, and peace of mind on the road.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a 
                href="#plans-section" 
                className="px-6 py-3 bg-white text-primary font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                View Plans
              </a>
              <Link 
                href="/auth" 
                className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all"
              >
                Create Account
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Briki Auto Insurance?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide tailored auto insurance solutions with exceptional coverage and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl border shadow-sm"
            >
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Comprehensive Coverage</h3>
              <p className="text-gray-600">
                Full protection against accidents, theft, natural disasters, and third-party liability.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl border shadow-sm"
            >
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Claim Processing</h3>
              <p className="text-gray-600">
                Fast and efficient claims handling with minimal paperwork and rapid approvals.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl border shadow-sm"
            >
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Roadside Assistance</h3>
              <p className="text-gray-600">
                Around-the-clock assistance for breakdowns, towing, battery jump-starts, and more.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plans Preview Section */}
      <section id="plans-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Auto Insurance Plans</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully designed auto insurance plans to find the perfect coverage for your vehicle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
            >
              <div className="bg-blue-50 p-4 border-b">
                <h3 className="text-xl font-bold text-primary">Basic Coverage</h3>
                <p className="text-sm text-gray-600">Essential protection for your vehicle</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$45</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Third-party liability coverage</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Basic roadside assistance</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Limited personal injury protection</span>
                  </li>
                </ul>
                <Link href="/auth">
                  <button className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Get Quote
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-primary shadow-md overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="bg-primary/10 p-4 border-b border-primary/20">
                <h3 className="text-xl font-bold text-primary">Premium Coverage</h3>
                <p className="text-sm text-gray-600">Comprehensive protection and benefits</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$75</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Full collision & comprehensive coverage</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>24/7 premium roadside assistance</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Enhanced personal injury protection</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Rental car reimbursement</span>
                  </li>
                </ul>
                <Link href="/auth">
                  <button className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Get Quote
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
            >
              <div className="bg-blue-50 p-4 border-b">
                <h3 className="text-xl font-bold text-primary">Elite Coverage</h3>
                <p className="text-sm text-gray-600">Maximum protection for luxury vehicles</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$120</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Premium collision & comprehensive coverage</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>VIP roadside concierge services</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>New car replacement coverage</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Vanishing deductible option</span>
                  </li>
                </ul>
                <Link href="/auth">
                  <button className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Get Quote
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Our Auto Insurance Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting auto insurance with Briki is straightforward and hassle-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Vehicle Details</h3>
              <p className="text-gray-600">Enter your vehicle information</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Compare Plans</h3>
              <p className="text-gray-600">Review personalized insurance options</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Choose Coverage</h3>
              <p className="text-gray-600">Select the plan that fits your needs</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneCall className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Enjoy continuous customer service</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-white rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-4">Drive with Peace of Mind</h2>
                <p className="text-lg mb-6 text-white/90">
                  Get comprehensive auto insurance coverage today and protect yourself against unexpected expenses. Our simplified process makes it easy to find the right plan for your needs.
                </p>
                <Link href="/auth">
                  <button className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-white/90 transition-colors flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
              </div>
              <div className="hidden md:block bg-gradient-to-tr from-primary to-blue-400">
                {/* This side is intentionally left as a gradient background */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ExploreLayout>
  );
}