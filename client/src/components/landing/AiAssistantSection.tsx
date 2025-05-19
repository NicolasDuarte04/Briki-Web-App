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
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-blue-500/90 to-indigo-500/90 text-white">
                <div className="flex items-center">
                  {/* Custom avatar */}
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mr-2.5 backdrop-blur-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 10.5 5.5 11.5 6.5 12.5L4 20L11.5 17.5C11.6648 17.5005 11.8296 17.5005 11.9944 17.5L12 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 12.5L14.5 15.5L18 20L20 12.5L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold">Briki AI Assistant</h3>
                </div>
              </div>
              
              {/* Chat area */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900 h-72 space-y-5">
                {/* Bot message */}
                <motion.div 
                  className="flex"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-blue-400">
                      <path d="M12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 10.5 5.5 11.5 6.5 12.5L4 20L11.5 17.5C11.6648 17.5005 11.8296 17.5005 11.9944 17.5L12 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 12.5L14.5 15.5L18 20L20 12.5L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg py-3 px-4 shadow-sm border border-gray-100 dark:border-gray-700 max-w-sm">
                    <p className="text-gray-800 dark:text-gray-200">Hello! I'm your Briki AI Assistant. How can I help with your insurance needs today?</p>
                  </div>
                </motion.div>
                
                {/* User message */}
                <motion.div 
                  className="flex justify-end"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded-lg py-3 px-4 max-w-sm border border-blue-200/50 dark:border-blue-800/30">
                    <p>I'm flying to Spain for 3 weeks. What's the best travel insurance in case I need medical care abroad?</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ml-3 flex-shrink-0 border border-gray-300/50 dark:border-gray-600/50 shadow-sm">
                    <MessageCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </motion.div>
                
                {/* Typing indicator */}
                <motion.div 
                  className="flex"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-blue-400">
                      <path d="M12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 10.5 5.5 11.5 6.5 12.5L4 20L11.5 17.5C11.6648 17.5005 11.8296 17.5005 11.9944 17.5L12 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 12.5L14.5 15.5L18 20L20 12.5L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex space-x-1 items-center px-4 py-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Briki is typing</span>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-500/60 dark:bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-1.5 h-1.5 bg-blue-500/60 dark:bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-1.5 h-1.5 bg-blue-500/60 dark:bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Bot response with recommendation */}
                <motion.div 
                  className="flex"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.2 }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-blue-400">
                      <path d="M12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 10.5 5.5 11.5 6.5 12.5L4 20L11.5 17.5C11.6648 17.5005 11.8296 17.5005 11.9944 17.5L12 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 12.5L14.5 15.5L18 20L20 12.5L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="space-y-3 max-w-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-lg py-3 px-4 shadow-sm border border-gray-100 dark:border-gray-700">
                      <p className="text-gray-800 dark:text-gray-200">I've found a few plans that include emergency medical coverage and trip cancellation protection. Here's a good one to start with:</p>
                    </div>
                    <div className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-blue-400 mr-2">
                          <path d="M9 12L11 14L15 10M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">RECOMMENDED PLAN</p>
                      </div>
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-md p-2.5 border border-blue-50 dark:border-blue-900/30">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">GlobalSecure Travel Protection</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">• Emergency medical coverage up to $500,000</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">• Coverage in all EU countries</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Input area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-800/80 rounded-full flex items-center px-4 py-2.5 border border-gray-200 dark:border-gray-700">
                  <input type="text" className="bg-transparent flex-1 outline-none text-gray-700 dark:text-gray-300 text-sm" placeholder="Type your question..." disabled />
                  <button className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 w-32 h-32 bg-blue-200/50 dark:bg-blue-900/20 rounded-full -bottom-6 -right-6 blur-xl"></div>
            <div className="absolute -z-10 w-24 h-24 bg-indigo-200/50 dark:bg-indigo-900/20 rounded-full -top-6 -left-6 blur-xl"></div>
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