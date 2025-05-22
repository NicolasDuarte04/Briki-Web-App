import React, { useState, useRef } from 'react';
import { PublicLayout } from '@/components/layout/public-layout';
import { motion } from 'framer-motion';
import { useNavigation } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import GradientButton from '@/components/gradient-button';
import { Helmet } from 'react-helmet';
import { ArrowRight, Send as SendIcon, Bot, Shield } from 'lucide-react';
import PlanRecommendationCard, { PlanRecommendations } from '@/components/PlanRecommendationCard';
import { ChatMessage } from '@/types/chat';

export default function AskBrikiPage() {
  const { navigate } = useNavigation();

  // Predefined Q&A messages for the static display
  const messages: ChatMessage[] = [
    {
      id: '1',
      sender: 'user',
      content: "I'm freelance and need health insurance that covers emergencies and checkups."
    },
    {
      id: '2',
      sender: 'assistant',
      content: "Great — I found two flexible plans that include ER visits, virtual care, and no long-term contracts. Here are my recommendations:",
      widget: {
        type: 'plans',
        plans: [
          {
            name: "FlexHealth Basic",
            description: "Flexible coverage with no annual commitment",
            price: 195,
            priceUnit: "/mo",
            badge: "Freelancer Friendly",
            category: "health",
            features: [
              { text: "Unlimited virtual visits", color: "blue-500" },
              { text: "Emergency room coverage", color: "cyan-500" },
              { text: "4 preventive checkups/year", color: "indigo-500" },
              { text: "Monthly billing option", color: "purple-500" }
            ]
          },
          {
            name: "FlexHealth Plus",
            description: "Enhanced coverage for active lifestyles",
            price: 275,
            priceUnit: "/mo",
            badge: "Most Popular",
            category: "health",
            features: [
              { text: "Unlimited virtual & in-person visits", color: "blue-500" },
              { text: "Full emergency coverage", color: "cyan-500" },
              { text: "Specialist referrals included", color: "indigo-500" },
              { text: "Prescription discount program", color: "purple-500" }
            ]
          }
        ]
      }
    },
    {
      id: '3',
      sender: 'user',
      content: "We're traveling to Portugal for 2 weeks. What travel insurance should we get?"
    },
    {
      id: '4',
      sender: 'assistant',
      content: "For a 2-week trip to Portugal, I recommend these plans that offer comprehensive coverage for European travel with strong emergency medical benefits and trip protection:",
      widget: {
        type: 'plans',
        plans: [
          {
            name: "TravelGuard Premium",
            description: "Comprehensive coverage for European travel",
            price: 88,
            priceUnit: "/person",
            badge: "Best Overall",
            category: "travel",
            features: [
              { text: "$100,000 emergency medical coverage", color: "indigo-500" },
              { text: "Trip cancellation up to $5,000", color: "purple-500" },
              { text: "Lost baggage compensation", color: "blue-500" },
              { text: "24/7 emergency assistance", color: "cyan-500" }
            ]
          },
          {
            name: "EuroTraveler Plus",
            description: "Specialized European coverage",
            price: 75,
            priceUnit: "/person",
            badge: "EU Optimized",
            category: "travel",
            features: [
              { text: "€75,000 medical coverage", color: "indigo-500" },
              { text: "Schengen visa compliant", color: "purple-500" },
              { text: "Adventure activities covered", color: "blue-500" },
              { text: "COVID-19 coverage included", color: "cyan-500" }
            ]
          },
          {
            name: "WorldTrip Basic",
            description: "Budget-friendly essential coverage",
            price: 58,
            priceUnit: "/person",
            badge: "Economy Pick",
            category: "travel",
            features: [
              { text: "$50,000 emergency medical", color: "indigo-500" },
              { text: "Trip delay protection", color: "purple-500" },
              { text: "Emergency evacuation included", color: "blue-500" },
              { text: "Basic baggage coverage", color: "cyan-500" }
            ]
          }
        ]
      }
    },
    {
      id: '5',
      sender: 'user',
      content: "I got a new Labrador puppy. What pet insurance options do you recommend?"
    },
    {
      id: '6',
      sender: 'assistant',
      content: "Congratulations on your new Labrador puppy! Here are some pet insurance plans that are particularly good for young Labs, with coverage for breed-specific conditions and preventive care:",
      widget: {
        type: 'plans',
        plans: [
          {
            name: "PawProtect Complete",
            description: "Comprehensive coverage for puppies",
            price: 48,
            priceUnit: "/mo",
            badge: "Best for Puppies",
            category: "pet",
            features: [
              { text: "Accidents & illnesses covered", color: "purple-500" },
              { text: "Breed-specific condition coverage", color: "pink-500" },
              { text: "Wellness visits & vaccinations", color: "indigo-500" },
              { text: "Microchipping & dental included", color: "blue-500" }
            ]
          },
          {
            name: "FurGuard Plus",
            description: "Premium care for active breeds",
            price: 65,
            priceUnit: "/mo",
            badge: "Lab Recommended",
            category: "pet",
            features: [
              { text: "Joint & hip dysplasia coverage", color: "purple-500" },
              { text: "Hereditary condition coverage", color: "pink-500" },
              { text: "Prescription food & supplements", color: "indigo-500" },
              { text: "Alternative therapies included", color: "blue-500" }
            ]
          }
        ]
      }
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>Ask Briki – Get Straight Answers to Your Insurance Questions</title>
        <meta name="description" content="Ask Briki anything about insurance and get jargon-free explanations in plain English. No sales talk, just helpful answers to your insurance questions." />
        <meta property="og:title" content="Ask Briki – Get Straight Answers to Your Insurance Questions" />
        <meta property="og:description" content="Ask Briki anything about insurance and get jargon-free explanations in plain English. No sales talk, just helpful answers to your insurance questions." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <main id="main-content">
        {/* Hero Section with Background Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" aria-labelledby="ask-briki-heading">
          {/* Animated dot pattern */}
          <div className="absolute inset-0 -z-10 opacity-5">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          {/* Animated floating elements */}
          <motion.div
            className="absolute h-12 w-12 rounded-full bg-blue-200 opacity-30 -z-10 blur-sm"
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: '15%', left: '15%' }}
          />
          
          <motion.div
            className="absolute h-8 w-8 rounded-full bg-cyan-300 opacity-30 -z-10 blur-sm"
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            style={{ bottom: '25%', right: '20%' }}
          />

          <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 id="ask-briki-heading" className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Talk to an Assistant That <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Actually Knows Insurance</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
                No more generic answers or confusing agent-speak. Briki translates insurance complexity into conversations that make sense.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Chat UI Section */}
        <section className="py-12 md:py-20" aria-labelledby="chat-demo-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="chat-demo-heading" className="sr-only">Chat with Briki AI Assistant</h2>
            
            {/* Chat Container */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Chat Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-500">
                <div className="flex items-center">
                  <Bot className="h-6 w-6 mr-2 text-white" />
                  <h3 className="font-semibold text-white">Briki AI Assistant</h3>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-5 bg-gray-50 dark:bg-gray-900 h-[600px] overflow-y-auto">
                <div className="space-y-8">
                  {messages.map((message, index) => (
                    <motion.div 
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.4 }}
                    >
                      {message.sender === 'user' ? (
                        <div className="flex justify-end mb-4">
                          <div className="bg-blue-600 rounded-2xl py-3 px-4 shadow-sm max-w-xs md:max-w-md">
                            <p className="text-white leading-relaxed">{message.content}</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ml-3 flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm">
                            <MessageCircle className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mr-3 flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm">
                              <span className="text-white font-bold text-xs">B</span>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl py-3 px-4 shadow-sm max-w-xs md:max-w-md border border-gray-100 dark:border-gray-700">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{message.content}</p>
                            </div>
                          </div>
                          
                          {/* Plan recommendation widget */}
                          {message.widget?.type === 'plans' && (
                            <div className="ml-[54px] space-y-4">
                              {message.widget.plans.map((plan, planIndex) => (
                                <PlanRecommendationCard
                                  key={planIndex}
                                  {...plan}
                                  delay={0.3 + (planIndex * 0.2)}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full flex items-center px-4 py-3 shadow-inner">
                  <input 
                    type="text" 
                    className="bg-transparent flex-1 outline-none text-gray-700 dark:text-gray-300 text-sm" 
                    placeholder="Type your insurance question..." 
                    disabled 
                  />
                  <button 
                    className="ml-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-2 rounded-full"
                    disabled
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-center mt-4 text-gray-500 dark:text-gray-400">
                  Sign in to ask your own insurance questions and get personalized recommendations.
                </p>
              </div>
            </motion.div>

            {/* Questions People Ask */}
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              aria-labelledby="popular-questions-heading"
            >
              <h2 id="popular-questions-heading" className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Questions People Actually Ask</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div 
                  className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">"Why is my premium so high when I've never had an accident?"</h3>
                </motion.div>
                <motion.div 
                  className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">"Do I need special insurance for my expensive camera while traveling?"</h3>
                </motion.div>
                <motion.div 
                  className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">"My dog has allergies. Will pet insurance cover his special food?"</h3>
                </motion.div>
                <motion.div 
                  className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">"If I rent a car abroad, is it covered by my regular policy?"</h3>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white" aria-labelledby="cta-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 id="cta-heading" className="text-3xl font-bold mb-6">Got Insurance Questions? Get Straight Answers.</h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto">
                Sign in to unlock personalized advice, policy comparisons, and jargon-free explanations tailored just for you.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-white hover:bg-white/90 text-blue-600 px-8 py-6 rounded-lg text-lg font-medium shadow-lg"
                  onClick={() => navigate("/auth")}
                  aria-label="Sign in to ask Briki questions"
                >
                  Ask Briki a Question
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}