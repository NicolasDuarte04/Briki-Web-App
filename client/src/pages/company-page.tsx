import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/components/language-selector";
import { BriefcaseIcon, LineChart, Shield, Lightbulb, ArrowRight, Building2 } from "lucide-react";
import Navbar from "@/components/navbar-new";
import Footer from "@/components/footer";

export default function CompanyPage() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  // Page transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
      <Navbar />
      
      {/* Futuristic background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_40%)]"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <div className="absolute top-10 left-10 w-1 h-20 bg-indigo-500/20"></div>
          <div className="absolute top-40 left-20 w-1 h-40 bg-indigo-500/20"></div>
          <div className="absolute top-10 left-30 w-1 h-30 bg-indigo-500/20"></div>
          <div className="absolute top-20 right-40 w-1 h-20 bg-indigo-500/20"></div>
          <div className="absolute top-50 right-20 w-1 h-40 bg-indigo-500/20"></div>
          <div className="absolute top-30 right-10 w-1 h-30 bg-indigo-500/20"></div>
        </motion.div>
      </div>
      
      <main className="flex-grow relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Hero section */}
          <motion.div 
            className="text-center mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="flex justify-center mb-8 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="p-4 bg-indigo-900/50 rounded-full border border-indigo-700/50 shadow-lg shadow-indigo-500/20 backdrop-blur-sm relative overflow-hidden">
                <BriefcaseIcon className="h-10 w-10 text-indigo-400" />
                <motion.div 
                  className="absolute inset-0 bg-indigo-600/20 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5],
                  }} 
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 text-transparent bg-clip-text">
              Briki for Insurance Companies
            </h1>
            
            <motion.p 
              className="text-xl text-indigo-100/90 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Join our AI-powered platform to showcase your plans to thousands of potential customers 
              and get powerful insights into customer preferences.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button 
                size="lg" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 shadow-lg shadow-indigo-900/30 border border-indigo-500/30"
                onClick={() => navigate("/company-login-new")}
              >
                Partner Login
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-indigo-500/50 text-indigo-200 hover:bg-indigo-900/50 px-8 backdrop-blur-sm"
                onClick={() => navigate("/company-register-new")}
              >
                Register as Partner
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Features section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-slate-900/60 backdrop-blur-md border border-indigo-900/30 shadow-lg h-full hover:shadow-xl hover:border-indigo-800/50 transition-all relative overflow-hidden group">
                <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-indigo-500/10 blur-2xl rounded-full group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                <CardHeader>
                  <div className="p-3 bg-indigo-900/80 w-fit rounded-xl mb-3 border border-indigo-700/30 shadow-md shadow-indigo-900/20 relative">
                    <LineChart className="h-6 w-6 text-indigo-300" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-400 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white relative">
                    AI-Powered Analytics
                    <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-transparent"></div>
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-indigo-100/80">
                    Access real-time insights on customer behavior, preferences, and risk profiles
                    through our advanced machine learning algorithms.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-slate-900/60 backdrop-blur-md border border-indigo-900/30 shadow-lg h-full hover:shadow-xl hover:border-indigo-800/50 transition-all relative overflow-hidden group">
                <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-indigo-500/10 blur-2xl rounded-full group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                <CardHeader>
                  <div className="p-3 bg-indigo-900/80 w-fit rounded-xl mb-3 border border-indigo-700/30 shadow-md shadow-indigo-900/20 relative">
                    <Shield className="h-6 w-6 text-indigo-300" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-400 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white relative">
                    Intelligent Placement
                    <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-transparent"></div>
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-indigo-100/80">
                    Optimize your plan visibility through our neural-network powered recommendation
                    engine that precisely matches offerings to ideal customer segments.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-slate-900/60 backdrop-blur-md border border-indigo-900/30 shadow-lg h-full hover:shadow-xl hover:border-indigo-800/50 transition-all relative overflow-hidden group">
                <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-indigo-500/10 blur-2xl rounded-full group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                <CardHeader>
                  <div className="p-3 bg-indigo-900/80 w-fit rounded-xl mb-3 border border-indigo-700/30 shadow-md shadow-indigo-900/20 relative">
                    <Lightbulb className="h-6 w-6 text-indigo-300" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-400 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white relative">
                    AI Assistant Integration
                    <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-transparent"></div>
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-indigo-100/80">
                    Our neural network assistant integrates with your plans to deliver personalized
                    recommendations, increasing conversion rates by up to 40%.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          {/* CTA section */}
          <motion.div 
            className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-xl p-10 text-white shadow-2xl border border-indigo-700/30 relative overflow-hidden backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Futuristic background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full"></div>
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full"></div>
              
              <motion.div 
                className="absolute top-10 right-10 w-20 h-1 bg-indigo-500/20 rotate-45"
                animate={{ 
                  opacity: [0.2, 0.4, 0.2],
                  width: ["5rem", "7rem", "5rem"]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-10 left-10 w-20 h-1 bg-indigo-500/20 -rotate-45"
                animate={{ 
                  opacity: [0.2, 0.4, 0.2],
                  width: ["5rem", "7rem", "5rem"]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </div>
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-indigo-200">
                  Become an AI-Powered Insurance Partner
                </h2>
              </motion.div>
              
              <motion.p 
                className="text-lg text-indigo-200/90 mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                Join our network of innovative insurance providers and leverage our advanced AI to
                connect with customers who are the perfect match for your offerings.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <Button 
                  size="lg" 
                  className="bg-indigo-100 text-indigo-900 hover:bg-white group relative overflow-hidden shadow-xl shadow-indigo-900/30 border border-indigo-200/20"
                  onClick={() => navigate("/contact-sales")}
                >
                  <span className="relative z-10">Request Access</span>
                  <span className="relative z-10 ml-2">
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}