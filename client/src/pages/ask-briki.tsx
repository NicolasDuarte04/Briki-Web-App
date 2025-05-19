import React from 'react';
import { PublicLayout } from '@/components/layout/public-layout';
import { motion } from 'framer-motion';
import { useNavigation } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import GradientButton from '@/components/gradient-button';
import { Helmet } from 'react-helmet';
import { ArrowRight, Send as SendIcon } from 'lucide-react';

// Message type definition
interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
}

export default function AskBrikiPage() {
  const { navigate } = useNavigation();

  // Predefined Q&A messages for the static display
  const messages: ChatMessage[] = [
    {
      id: '1',
      sender: 'user',
      content: "What is travel insurance?"
    },
    {
      id: '2',
      sender: 'assistant',
      content: "Travel insurance helps cover unexpected events on your trip, such as medical emergencies, trip cancellations, lost luggage, or travel delays. It provides financial protection and peace of mind while you're away from home. Most policies offer emergency medical coverage, trip cancellation/interruption protection, and baggage loss/delay coverage."
    },
    {
      id: '3',
      sender: 'user',
      content: "Can I insure my dog with pre-existing conditions?"
    },
    {
      id: '4',
      sender: 'assistant',
      content: "Yes, you can insure dogs with pre-existing conditions, but coverage varies by provider. Some insurers may exclude specific pre-existing conditions from coverage, while others might cover them after a waiting period. Briki can help you compare different pet insurance options that include pre-existing condition coverage."
    },
    {
      id: '5',
      sender: 'user',
      content: "How much does auto insurance typically cost?"
    },
    {
      id: '6',
      sender: 'assistant',
      content: "Auto insurance costs vary widely based on several factors. The national average is approximately $1,500-1,800 annually for full coverage, but your rate depends on your driving history, age, location, vehicle type, and credit score. Young drivers and those in urban areas typically pay more."
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
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white" aria-labelledby="ask-briki-heading">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-70 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-70 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 id="ask-briki-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Talk to an Assistant That <span className="text-primary">Actually Knows Insurance</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                No more generic answers or confusing agent-speak. Briki translates insurance complexity into conversations that make sense.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Chat UI Section */}
        <section className="py-10 md:py-16" aria-labelledby="chat-demo-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="chat-demo-heading" className="sr-only">Chat with Briki AI Assistant</h2>
            {/* Chat Container */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Chat Header */}
              <div className="border-b border-gray-100 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center" aria-hidden="true">
                    <span className="text-white font-semibold">B</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">Briki Assistant</h3>
                    <p className="text-sm text-gray-500">Always online</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <motion.div 
                className="p-4 h-[500px] overflow-y-auto bg-gray-50" 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                aria-live="polite"
              >
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div 
                      key={message.id}
                      variants={itemVariants}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] md:max-w-[70%] p-3 rounded-lg ${
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white shadow-sm border border-gray-100 rounded-tl-none'
                        }`}
                        aria-label={message.sender === 'user' ? 'Your message' : 'Briki assistant response'}
                      >
                        <p className={message.sender === 'user' ? 'text-white' : 'text-gray-700'}>
                          {message.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Disabled Chat Input */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex items-center" role="form" aria-label="Chat input form (preview only)">
                  <div className="flex-grow bg-gray-100 rounded-lg p-3 text-gray-400">
                    Ask a question about insurance...
                  </div>
                  <button 
                    className="ml-3 bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-500 cursor-not-allowed"
                    disabled
                    aria-label="Send message (preview only)"
                  >
                    <SendIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <p className="text-sm text-center mt-4 text-gray-500">
                  This is a preview. Log in to ask your own questions.
                </p>
              </div>
            </motion.div>

            {/* Examples Section */}
            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              aria-labelledby="popular-questions-heading"
            >
              <h2 id="popular-questions-heading" className="text-2xl font-bold text-gray-900 mb-6">Questions People Actually Ask</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div 
                  className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium text-gray-900">"Why is my premium so high when I've never had an accident?"</h3>
                </motion.div>
                <motion.div 
                  className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium text-gray-900">"Do I need special insurance for my expensive camera while traveling?"</h3>
                </motion.div>
                <motion.div 
                  className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium text-gray-900">"My dog has allergies. Will pet insurance cover his special food?"</h3>
                </motion.div>
                <motion.div 
                  className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium text-gray-900">"If I rent a car abroad, is it covered by my regular policy?"</h3>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white" aria-labelledby="cta-heading">
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
                  className="bg-white text-blue-600 hover:bg-white/90 px-8 py-3 rounded-lg text-lg font-medium"
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