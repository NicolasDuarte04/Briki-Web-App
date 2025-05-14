import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ShieldCheck, Heart, Car, Plane } from 'lucide-react';

import NavigationBar from '@/components/NavigationBar';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import FloatingElement from '@/components/FloatingElement';
import AnimatedLogo from '@/components/AnimatedLogo';
import CountdownTimer from '@/components/CountdownTimer';
import AnimatedCTAButton from '@/components/AnimatedCTAButton';
import AIAssistant from '@/components/AIAssistant';

import '@/styles/design-system.css';

const HomePage = () => {
  // Setting launch date 30 days from now
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }
    }
  };

  // Insurance categories with icons
  const categories = [
    { name: 'Travel', icon: <Plane className="h-6 w-6" />, path: '/travel' },
    { name: 'Auto', icon: <Car className="h-6 w-6" />, path: '/auto' },
    { name: 'Pet', icon: <Heart className="h-6 w-6" />, path: '/pet' },
    { name: 'Health', icon: <ShieldCheck className="h-6 w-6" />, path: '/health' }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <NavigationBar />
      
      {/* Hero Section */}
      <AnimatedBackground variant="default">
        <div className="container mx-auto pt-32 pb-20 px-4 md:px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              className="mb-6"
              variants={itemVariants}
            >
              <FloatingElement amplitude={8} duration={6}>
                <AnimatedLogo size="lg" withText={true} variant="gradient" />
              </FloatingElement>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 text-white"
              variants={itemVariants}
            >
              AI-Powered
              <br />
              Insurance Platform
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Compare and analyze insurance options across multiple categories using our advanced AI technology. Get personalized recommendations based on your unique needs and preferences.
            </motion.p>
            
            <motion.div className="mb-10" variants={itemVariants}>
              <CountdownTimer targetDate={launchDate} />
              <p className="mt-4 text-white/80">Time until launch</p>
            </motion.div>
            
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              variants={itemVariants}
            >
              <AnimatedCTAButton 
                size="lg" 
                variant="primary"
                onClick={() => {/* Navigate to get started */}}
              >
                Get Started
              </AnimatedCTAButton>
              
              <AnimatedCTAButton 
                size="lg" 
                variant="secondary" 
                icon={<ArrowUpRight className="h-5 w-5" />}
              >
                Learn More
              </AnimatedCTAButton>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedBackground>
      
      {/* Insurance Categories Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Smart Insurance Comparison</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our range of insurance categories and find the perfect coverage for your needs with AI-powered recommendations.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={category.path}>
                  <a>
                    <GlassCard 
                      hover="lift" 
                      className="p-6 text-center h-full flex flex-col items-center justify-center"
                    >
                      <div className="mb-4 p-4 rounded-full bg-gradient-to-r from-accent-blue/10 to-accent-purple/10">
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{category.name} Insurance</h3>
                      <p className="text-gray-600 mb-4">Find the best {category.name.toLowerCase()} coverage for your needs</p>
                      <div className="mt-auto flex items-center text-accent-blue font-medium">
                        <span>Compare Plans</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </GlassCard>
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Briki AI Assistant Preview */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-4">Briki AI Assistant</h2>
              <p className="text-lg text-gray-600 mb-6">
                Your intelligent insurance guide that helps you navigate through options, compare plans, and make informed decisions tailored to your specific needs.
              </p>
              
              <div className="mb-8 space-y-4">
                {[
                  'Smart insurance comparison across providers',
                  'Personalized recommendations based on your profile',
                  'Instant answers to insurance coverage questions',
                  'Help with policy selection and claims processes'
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
              
              <AnimatedCTAButton 
                variant="primary"
                onClick={() => {/* Navigate to AI assistant demo */}}
              >
                Try Briki AI
              </AnimatedCTAButton>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FloatingElement amplitude={10} duration={8}>
                <GlassCard variant="elevated" className="p-6 sm:p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple flex items-center justify-center text-white mr-4">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Briki AI Assistant</h3>
                      <p className="text-sm text-gray-600">Your intelligent insurance guide</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <p className="text-gray-800">
                      Hi there! I'm your Briki AI assistant. How can I help you with your insurance needs today?
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    {[
                      "Compare travel insurance for my trip to Japan",
                      "What's the best car insurance for a new driver?",
                      "Help me understand pet insurance coverage options"
                    ].map((question, i) => (
                      <motion.div
                        key={i}
                        className="bg-blue-50 p-3 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {question}
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ask me anything about insurance..."
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent-blue">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </FloatingElement>
              
              {/* Decorative elements */}
              <div className="absolute top-1/4 right-0 transform translate-x-1/2 w-20 h-20 rounded-full bg-green-400/30 filter blur-3xl"></div>
              <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2 w-32 h-32 rounded-full bg-purple-400/20 filter blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Smart Comparison Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold mb-6">Smart Insurance Comparison</h3>
              
              <div className="space-y-6">
                {[
                  { label: 'Coverage', value: 80 },
                  { label: 'Price', value: 70 },
                  { label: 'Benefits', value: 60 },
                  { label: 'Claims Process', value: 50 }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{item.label}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent-blue to-accent-purple"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.1 * i }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <AnimatedCTAButton 
                  variant="primary"
                  onClick={() => {/* Navigate to comparison page */}}
                >
                  View Full Comparison
                </AnimatedCTAButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <AnimatedLogo size="md" withText={true} variant="default" />
              <p className="mt-4 text-gray-600 max-w-xs">
                AI-powered insurance platform helping you make smarter coverage decisions.
              </p>
            </div>
            
            {[
              {
                title: 'Products',
                links: ['Travel Insurance', 'Auto Insurance', 'Pet Insurance', 'Health Insurance']
              },
              {
                title: 'Company',
                links: ['About', 'FAQ', 'Careers', 'Press']
              },
              {
                title: 'Legal',
                links: ['Terms', 'Privacy', 'Cookies', 'Licenses']
              }
            ].map((column, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-gray-600 hover:text-accent-blue transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Briki. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Twitter', 'LinkedIn', 'Instagram', 'Facebook'].map((social, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-accent-blue transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      
      {/* AI Assistant floating button */}
      <AIAssistant />
    </div>
  );
};

export default HomePage;