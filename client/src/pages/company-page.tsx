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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Hero section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <span className="p-3 bg-blue-100 rounded-full">
                <BriefcaseIcon className="h-8 w-8 text-blue-600" />
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Briki for Insurance Companies
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join our platform to showcase your plans to thousands of potential customers 
              and get powerful insights into customer preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                onClick={() => navigate("/company-login")}
              >
                Partner Login
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
                onClick={() => navigate("/company-register")}
              >
                Register as Partner
              </Button>
            </div>
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