import { motion } from "framer-motion";
import { ExploreLayout } from "../../components/layout";
import { Link } from "wouter";
import { Heart, Shield, ArrowRight, BadgeCheck, Stethoscope, Syringe, Cat } from "lucide-react";

export default function ExplorePetInsurance() {
  return (
    <ExploreLayout
      title="Pet Insurance | Briki"
      description="Find the best pet insurance plans to protect your furry family members. Get coverage for vet visits, emergency care, surgeries, and more."
      ogImage="/og-pet-insurance.jpg"
      ogUrl="https://briki.com/explore/pet"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#0052aa] via-[#0062cc] to-[#33BFFF]"
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
              Coverage for Your Furry Family
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl mb-8 text-white/90"
            >
              Protect your pets with comprehensive insurance plans that cover veterinary care, emergency treatment, and more for your beloved companions.
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
            <h2 className="text-3xl font-bold mb-4">Why Choose Briki Pet Insurance?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive pet healthcare coverage to keep your furry friends protected and healthy.
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
                Full coverage for accidents, illnesses, surgeries, and routine checkups for your pets.
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
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multi-Pet Discounts</h3>
              <p className="text-gray-600">
                Save on premiums when you insure multiple pets under the same policy, making protection affordable.
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
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wellness Benefits</h3>
              <p className="text-gray-600">
                Preventive care coverage including vaccinations, dental cleanings, and annual checkups.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plans Preview Section */}
      <section id="plans-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Pet Insurance Plans</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our range of pet insurance options designed to keep your furry family members protected.
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
                <h3 className="text-xl font-bold text-primary">Basic Plan</h3>
                <p className="text-sm text-gray-600">Essential coverage for your pet</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$20</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Accident coverage up to $3,000/year</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Illness coverage up to $3,000/year</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>24/7 pet telehealth services</span>
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
                <h3 className="text-xl font-bold text-primary">Premium Plan</h3>
                <p className="text-sm text-gray-600">Comprehensive protection for your pet</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$35</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Accident coverage up to $10,000/year</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Illness coverage up to $10,000/year</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Dental coverage (preventive & therapeutic)</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Prescription medication coverage</span>
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
                <h3 className="text-xl font-bold text-primary">Ultimate Plan</h3>
                <p className="text-sm text-gray-600">Complete care for your beloved companion</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$50</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Unlimited accident & illness coverage</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Wellness care coverage (vaccines, checkups)</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Alternative therapy & behavioral treatment</span>
                  </li>
                  <li className="flex items-start">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Hereditary & congenital condition coverage</span>
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
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting pet insurance with Briki is simple and straightforward.
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
                <Cat className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Pet Details</h3>
              <p className="text-gray-600">Enter your pet's information</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Compare Plans</h3>
              <p className="text-gray-600">Review coverage options</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Select Coverage</h3>
              <p className="text-gray-600">Choose the right plan</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Syringe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Get Care</h3>
              <p className="text-gray-600">Visit any licensed vet for care</p>
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
                <h2 className="text-3xl font-bold mb-4">Give Your Pets the Protection They Deserve</h2>
                <p className="text-lg mb-6 text-white/90">
                  Your pets are family members too. Ensure they receive the best care possible with our comprehensive pet insurance plans designed by pet lovers for pet lovers.
                </p>
                <Link href="/auth">
                  <button className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-white/90 transition-colors flex items-center">
                    Protect Your Pet
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