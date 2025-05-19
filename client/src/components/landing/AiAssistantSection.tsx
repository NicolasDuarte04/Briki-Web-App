import { motion } from "framer-motion";
import { ArrowRight, Bot, MessageCircle, LightbulbIcon } from "lucide-react";
import { useLocation } from "wouter";
import GradientButton from "@/components/gradient-button";

/**
 * New section highlighting the Briki AI Assistant
 */
export default function AiAssistantSection() {
  const [, navigate] = useLocation();

  const handleTryAssistant = () => {
    navigate('/assistant');
  };

  return (
    <section className="w-full py-12 md:py-20 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden relative">
      {/* Animated dot pattern */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300 mb-4">
              <Bot className="h-4 w-4 mr-1" />
              <span>New Feature</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Meet <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Briki AI Assistant</span>
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Your personal insurance guide — built with real intelligence.
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">Get instant answers to any insurance question</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">Receive tailored plan recommendations based on your needs</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">Navigate complex insurance terms with clear explanations</p>
              </li>
            </ul>
            
            <GradientButton
              onClick={handleTryAssistant}
              className="mt-2"
              gradientFrom="from-blue-600"
              gradientTo="to-cyan-500"
              icon={<ArrowRight className="ml-2 h-5 w-5" />}
            >
              Try the Assistant
            </GradientButton>
          </motion.div>
          
          {/* Assistant preview mockup */}
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                <div className="flex items-center">
                  <Bot className="h-6 w-6 mr-2" />
                  <h3 className="font-semibold">Briki AI Assistant</h3>
                </div>
              </div>
              
              {/* Chat area */}
              <div className="p-5 bg-gray-50 dark:bg-gray-900 h-64">
                {/* Bot message */}
                <div className="flex mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg py-2 px-3 shadow max-w-sm">
                    <p className="text-gray-700 dark:text-gray-300">Hello! I'm your Briki AI Assistant. How can I help with your insurance needs today?</p>
                  </div>
                </div>
                
                {/* User message */}
                <div className="flex justify-end mb-4">
                  <div className="bg-blue-600 rounded-lg py-2 px-3 text-white max-w-sm">
                    <p>I want to insure my 9-year-old dog with arthritis.</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-3 flex-shrink-0">
                    <MessageCircle className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                
                {/* Bot response with feature */}
                <div className="flex mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-lg py-2 px-3 shadow">
                      <p className="text-gray-700 dark:text-gray-300">I can help with that! I found 3 plans that cover pets with pre-existing conditions.</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-gray-700 border border-blue-100 dark:border-gray-600 rounded-lg p-3">
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1">RECOMMENDED PLANS</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">• PetAssure Complete Care</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">• Healthy Paws Senior Plan</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">• Pawsome Coverage Plus</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Input area */}
              <div className="p-3 border-t dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full flex items-center px-4 py-2">
                  <input type="text" className="bg-transparent flex-1 outline-none text-gray-700 dark:text-gray-300 text-sm" placeholder="Type your question..." disabled />
                  <button className="ml-2 text-blue-600 dark:text-blue-400">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 w-32 h-32 bg-blue-200/50 dark:bg-blue-900/20 rounded-full -bottom-6 -right-6 blur-xl"></div>
            <div className="absolute -z-10 w-24 h-24 bg-cyan-200/50 dark:bg-cyan-900/20 rounded-full -top-6 -left-6 blur-xl"></div>
          </motion.div>
        </div>
      </div>
      
      {/* Trust badge banner */}
      <motion.div 
        className="max-w-4xl mx-auto mt-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 py-3 px-6 flex items-center justify-center space-x-2 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <LightbulbIcon className="h-5 w-5 text-yellow-500" />
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Powered by OpenAI technology. Trained by insurance experts.
        </p>
      </motion.div>
    </section>
  );
}