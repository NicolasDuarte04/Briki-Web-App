import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Bot, Sparkles, Send, Check, Shield, Heart, Users } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useEffect, useState, useRef } from "react";

/**
 * New section highlighting the Briki AI Assistant
 */
export default function AiAssistantSection() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Array<{id: number, type: 'user' | 'bot' | 'card', text?: string, card?: any}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Parallax effect for depth
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const handleTryAssistant = () => navigate('/ask-briki-ai');
  const handleLearnMore = () => navigate('/features');

  // Auto-scroll chat to bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate realistic chat conversation with card recommendations
  useEffect(() => {
    const conversation = [
      { delay: 1000, type: 'user' as const, text: "I need health insurance for my family of 4" },
      { delay: 2200, typing: true },
      { delay: 3500, type: 'bot' as const, text: "I'd be happy to help you find the perfect family health plan! To give you the best recommendations, could you tell me your approximate budget?" },
      { delay: 4800, type: 'user' as const, text: "Around $400-500 per month" },
      { delay: 5800, typing: true },
      { delay: 7200, type: 'bot' as const, text: "Great! Based on your budget, I found 3 excellent family plans. Here are my top recommendations:" },
      { delay: 8000, type: 'card' as const, card: {
        name: "FlexHealth Basic",
        provider: "Suramericana",
        price: "$420",
        period: "/month",
        badge: "Best Value",
        summary: "Comprehensive coverage for families with predictable healthcare needs",
        features: [
          "Zero deductible for preventive care",
          "24/7 telemedicine included",
          "$500 individual deductible"
        ]
      }},
      { delay: 8500, type: 'card' as const, card: {
        name: "Family Shield Plus",
        provider: "Sura",
        price: "$485",
        period: "/month",
        badge: "Most Popular",
        summary: "Enhanced protection with prescription benefits and dental coverage",
        features: [
          "Full prescription coverage",
          "Dental & vision included",
          "5,000+ doctors network"
        ]
      }},
    ];

    const timers: NodeJS.Timeout[] = [];

    conversation.forEach((item) => {
      if ('typing' in item) {
        timers.push(setTimeout(() => setIsTyping(true), item.delay));
      } else {
        timers.push(setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: item.type,
            text: item.text,
            card: item.card
          }]);
        }, item.delay));
      }
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "Instant Expert Answers",
      description: "Get clear responses in seconds",
    },
    {
      icon: Sparkles,
      title: "Personalized Plans",
      description: "Tailored to your needs & budget",
    },
    {
      icon: Sparkles,
      title: "Easy Navigation",
      description: "Complex terms made simple",
    },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-white">
      {/* Layer 1: Base neutral background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
      
      {/* Layer 2: Decorative gradient overlay */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        style={{ y: y1 }}
      >
        {/* Glass-like gradient ribbon */}
        <div className="absolute top-0 left-0 right-0 h-[120%] overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-cyan-500/40 via-transparent to-blue-500/30 blur-3xl" />
          <div className="absolute top-1/3 -right-1/4 w-[80%] h-[80%] bg-gradient-to-bl from-blue-600/35 via-transparent to-cyan-500/25 blur-2xl" />
          {/* Additional accent */}
          <div className="absolute top-1/2 left-1/3 w-[60%] h-[60%] bg-gradient-radial from-blue-500/20 to-transparent blur-3xl animate-pulse" />
        </div>
        
        {/* Mesh pattern for texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </motion.div>

      {/* Layer 3: Content - Asymmetric layout */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-32 lg:py-36">
          
          {/* Left side: Text content */}
          <motion.div 
            className="max-w-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge positioned above title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-6"
            >
              <Badge variant="gradient" className="inline-flex px-4 py-2 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                New: AI-Powered Insurance
              </Badge>
            </motion.div>

            {/* Title with Briki branding */}
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 font-bold">briki</span> — Find your perfect
              <span className="block relative overflow-hidden">
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 bg-[length:200%_auto] animate-gradient">
                  insurance match
                </span>
                {/* Shimmer effect overlay */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shimmer" />
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-xl text-gray-600 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Briki's AI assistant helps you navigate insurance options, compare plans, 
              and make confident decisions — all in one conversation.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                onClick={handleTryAssistant}
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg transition-all duration-200 font-medium"
              >
                Start with AI Assistant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleLearnMore}
                className="h-12 px-6 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Learn more
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-12 flex items-center gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Free to use</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side: Floating assistant preview */}
          <motion.div 
            className="relative lg:pl-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            style={{ y: y2 }}
          >
            {/* Glass morphism container */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 blur-2xl opacity-70 group-hover:opacity-90 transition-opacity" />
              
              {/* Assistant card */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Briki Assistant</h3>
                        <p className="text-xs text-white/80">Always here to help</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-white/40" />
                      <div className="w-2 h-2 rounded-full bg-white/40" />
                      <div className="w-2 h-2 rounded-full bg-white/40" />
                    </div>
                  </div>
                </div>
                
                {/* Chat content - scrollable with cards */}
                <div 
                  ref={chatContainerRef}
                  className="h-[420px] overflow-y-auto bg-gray-50/50 scroll-smooth chat-scrollbar relative"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {/* Scroll indicator */}
                  {messages.length > 3 && (
                    <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-gray-400 text-xs opacity-60"
                      >
                        ↓
                      </motion.div>
                    </div>
                  )}

                  <div className="p-4 space-y-3">
                    <AnimatePresence mode="popLayout">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          layout
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                          }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.type === 'card' ? (
                            <motion.div 
                              className="w-full max-w-sm"
                              whileHover={{ scale: 1.02, y: -2 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                                <div className="p-4">
                                  {/* Card Header */}
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-900">{message.card.name}</h4>
                                        {message.card.badge && (
                                          <Badge variant="gradient" className="px-2 py-0.5 text-xs">
                                            {message.card.badge}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500">{message.card.provider}</p>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{message.card.price}</div>
                                      <div className="text-xs text-gray-500">{message.card.period}</div>
                                    </div>
                                  </div>

                                  {/* Summary */}
                                  <p className="text-sm text-gray-600 mb-3">{message.card.summary}</p>

                                  {/* Features */}
                                  <div className="space-y-2">
                                    {message.card.features.map((feature: string, idx: number) => (
                                      <div key={idx} className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-xs text-gray-700">{feature}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Action Button */}
                                  <Button 
                                    size="sm" 
                                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-md transition-all duration-200"
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </Card>
                            </motion.div>
                          ) : (
                            <motion.div 
                              className={`max-w-[80%] ${
                                message.type === 'user' 
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl rounded-br-sm' 
                                  : 'bg-white rounded-2xl rounded-bl-sm shadow-sm'
                              } py-3 px-4`}
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-700'}`}>
                                {message.text}
                              </p>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Typing indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex justify-start"
                        >
                          <div className="bg-white rounded-2xl py-3 px-4 shadow-sm">
                            <div className="flex gap-1.5">
                              {[0, 0.2, 0.4].map((delay, i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 bg-gray-400 rounded-full"
                                  animate={{ 
                                    y: [0, -8, 0],
                                    opacity: [0.4, 1, 0.4]
                                  }}
                                  transition={{ 
                                    repeat: Infinity, 
                                    duration: 1.4,
                                    delay,
                                    ease: "easeInOut"
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Input area */}
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <input 
                      type="text" 
                      className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all" 
                      placeholder="Ask about insurance plans..." 
                      disabled 
                    />
                    <Button 
                      size="sm" 
                      className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-md transition-all duration-200 p-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}