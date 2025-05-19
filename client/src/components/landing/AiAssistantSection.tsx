import { motion } from "framer-motion";
import { ArrowRight, Bot, MessageCircle, LightbulbIcon, Sparkles, Shield, Zap } from "lucide-react";
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
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 overflow-hidden relative">
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
      
      <div className="container px-4 md:px-6 mx-auto">
        {/* Section heading with animated highlight */}
        <div className="text-center mb-16">
          <motion.div 
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 dark:from-blue-900/40 dark:to-cyan-900/40 dark:text-blue-300 mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            <span>Introducing</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Briki AI Assistant</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your personal insurance guide — built with real intelligence
          </motion.p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text content */}
          <motion.div 
            className="flex-1 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Feature cards */}
            <div className="grid gap-6">
              <motion.div 
                className="flex p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm backdrop-blur-sm"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mr-4 rounded-full w-12 h-12 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Instant Expert Answers</h3>
                  <p className="text-gray-600 dark:text-gray-400">Get clear, immediate responses to any insurance question, explained in simple terms.</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm backdrop-blur-sm"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mr-4 rounded-full w-12 h-12 bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Personalized Recommendations</h3>
                  <p className="text-gray-600 dark:text-gray-400">Receive tailored insurance plans that match your specific needs and budget.</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm backdrop-blur-sm"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mr-4 rounded-full w-12 h-12 bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Easy Policy Navigation</h3>
                  <p className="text-gray-600 dark:text-gray-400">Understand complex terms and coverage options with visual comparisons and plain language.</p>
                </div>
              </motion.div>
            </div>
            
            {/* CTA button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <GradientButton
                onClick={handleTryAssistant}
                className="mt-2 text-base py-6 px-8 font-medium shadow-lg"
                gradientFrom="from-blue-600"
                gradientTo="to-cyan-500"
                icon={<ArrowRight className="ml-2 h-5 w-5" />}
              >
                Try the AI Assistant
              </GradientButton>
            </motion.div>
          </motion.div>
          
          {/* Assistant preview mockup */}
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-500">
                <div className="flex items-center">
                  <Bot className="h-6 w-6 mr-2 text-white" />
                  <h3 className="font-semibold text-white">Briki AI Assistant</h3>
                </div>
              </div>
              
              {/* Chat area */}
              <div className="p-5 bg-gray-50 dark:bg-gray-900 h-[340px] overflow-y-auto">
                {/* Bot message */}
                <div className="flex mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl py-3 px-4 shadow-sm max-w-xs border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Hello! I'm your Briki AI Assistant. How can I help with your insurance needs today?</p>
                  </div>
                </div>
                
                {/* User message */}
                <div className="flex justify-end mb-6">
                  <div className="bg-blue-600 rounded-2xl py-3 px-4 shadow-sm max-w-xs">
                    <p className="text-white leading-relaxed">I just bought a car. What's the best insurance that actually covers accidents — not just the basics?</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ml-3 flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm">
                    <MessageCircle className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                
                {/* Typing indicator */}
                <motion.div 
                  className="flex mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl py-3 px-4 shadow-sm max-w-xs border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Based on your profile, I'd recommend full-coverage plans with roadside assistance and low deductibles. Here's one with great reviews.</p>
                  </div>
                </motion.div>
                
                {/* Recommendation card */}
                <motion.div 
                  className="ml-[54px] mb-4 overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 1, duration: 0.3 }}
                >
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300">RECOMMENDED PLAN</h4>
                      </div>
                      <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 px-2 py-1 rounded-full font-medium">Top Rated</span>
                    </div>
                    
                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">Total Protection Plus</h3>
                        <div className="text-green-600 dark:text-green-400 font-bold">$89<span className="text-xs font-normal text-gray-500 dark:text-gray-400">/mo</span></div>
                      </div>
                      
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        Best for new vehicles with comprehensive protection
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center text-sm">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2 flex-shrink-0"></div>
                          <span className="text-gray-700 dark:text-gray-300">Collision coverage</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2 flex-shrink-0"></div>
                          <span className="text-gray-700 dark:text-gray-300">Comprehensive protection</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2 flex-shrink-0"></div>
                          <span className="text-gray-700 dark:text-gray-300">Roadside assistance</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2 flex-shrink-0"></div>
                          <span className="text-gray-700 dark:text-gray-300">Low deductible ($250)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Input area */}
              <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full flex items-center px-4 py-3 shadow-inner">
                  <input type="text" className="bg-transparent flex-1 outline-none text-gray-700 dark:text-gray-300 text-sm" placeholder="Type your insurance question..." disabled />
                  <button className="ml-2 bg-blue-600 text-white p-2 rounded-full">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 w-64 h-64 bg-blue-300/20 dark:bg-blue-700/10 rounded-full -bottom-12 -right-12 blur-3xl"></div>
            <div className="absolute -z-10 w-40 h-40 bg-cyan-300/20 dark:bg-cyan-700/10 rounded-full -top-10 -left-10 blur-2xl"></div>
          </motion.div>
        </div>
      </div>
      
      {/* Trust badge banner */}
      <motion.div 
        className="max-w-4xl mx-auto mt-16 bg-white/70 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 py-4 px-6 backdrop-blur-sm shadow-sm flex items-center justify-center space-x-3 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          Powered by advanced AI technology and trained by insurance experts
        </p>
      </motion.div>
    </section>
  );
}