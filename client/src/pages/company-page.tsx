import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/components/language-selector";
import { BriefcaseIcon, LineChart, Shield, Lightbulb, ArrowRight, Building2 } from "lucide-react";
import Navbar from "@/components/navbar";
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
                onClick={() => navigate("/company-login")}
              >
                Partner Login
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-indigo-500/50 text-indigo-200 hover:bg-indigo-900/50 px-8 backdrop-blur-sm"
                onClick={() => navigate("/company-register")}
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
            <motion.div variants={itemVariants}>
              <Card className="bg-white/80 backdrop-blur-sm shadow-md border-blue-100 h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-2 bg-blue-100 w-fit rounded-lg mb-2">
                    <LineChart className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Real-time Analytics</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Get insights on customer behavior, preferences, and trends to optimize your plans
                    and pricing strategies.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="bg-white/80 backdrop-blur-sm shadow-md border-blue-100 h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-2 bg-blue-100 w-fit rounded-lg mb-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Premium Placement</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Showcase your insurance plans in prime positions throughout the platform
                    to increase visibility and conversions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="bg-white/80 backdrop-blur-sm shadow-md border-blue-100 h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-2 bg-blue-100 w-fit rounded-lg mb-2">
                    <Lightbulb className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">AI Assistant Integration</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our AI assistant can highlight your plans when they're a good match for
                    customer needs, increasing conversion rates.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          {/* CTA section */}
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-8 text-white shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to grow your business with Briki?</h2>
              <p className="text-lg text-blue-100 mb-6">
                Join our network of trusted insurance providers and connect with thousands of potential customers.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate("/contact-sales")}
              >
                <span>Contact Sales</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}