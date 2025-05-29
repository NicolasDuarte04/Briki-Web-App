import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock,
  Star,
  Search,
  ListChecks,
  TrendingUp,
  Shield,
  PieChart,
  Users,
  LightbulbIcon,
  LineChart
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/language-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GradientButton from "@/components/gradient-button";
import { trackEvent } from "@/lib/analytics";

export default function DashboardEnhanced() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Set isLoaded to true after a short delay to trigger animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Track page view
  useEffect(() => {
    trackEvent("view_dashboard", "navigation", "home");
  }, []);
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    }
  };
  
  const slideInLeft = {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    }
  };
  
  // Get user's first name for personalized greeting
  const firstName = user ? (user.firstName || (user.name ? user.name.split(' ')[0] : null) || "there") : "there";
  
  // Stats for dashboard widgets
  const statsWidgets = [
    {
      id: "quotes",
      title: "Total Quotes",
      value: "12",
      change: "+3",
      trend: "up",
      icon: <LineChart className="w-5 h-5 text-emerald-500" />,
      color: "emerald"
    },
    {
      id: "comparisons",
      title: "Plan Comparisons",
      value: "8",
      change: "+2",
      trend: "up",
      icon: <PieChart className="w-5 h-5 text-blue-500" />,
      color: "blue"
    },
    {
      id: "savings",
      title: "Est. Savings",
      value: "$230",
      change: "+$45",
      trend: "up",
      icon: <TrendingUp className="w-5 h-5 text-indigo-500" />,
      color: "indigo"
    }
  ];
  
  // Action cards
  const actionCards = [
    {
      id: "compare",
      title: "Compare Insurance Plans",
      description: "View and compare plans across different providers",
      icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
      path: "/compare-plans",
      color: "blue",
      gradient: "from-blue-500/20 to-blue-600/20"
    },
    {
      id: "quote",
      title: "Get a Quote",
      description: "Answer a few questions to get personalized quotes",
      icon: <Search className="w-6 h-6 text-indigo-500" />,
      path: "/get-quote",
      color: "indigo",
      gradient: "from-indigo-500/20 to-indigo-600/20"
    },
    {
      id: "track",
      title: "Track My Quotes",
      description: "View and manage your requested quotes",
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      path: "/quote-history",
      color: "purple",
      gradient: "from-purple-500/20 to-purple-600/20"
    },
    {
      id: "saved",
      title: "Saved Plans",
      description: "Access your bookmarked and saved plans",
      icon: <Star className="w-6 h-6 text-amber-500" />,
      path: "/saved-plans",
      color: "amber",
      gradient: "from-amber-500/20 to-amber-600/20"
    }
  ];
  
  // Insurance categories
  const categories = [
    {
      id: "travel",
      title: t("travelInsurance"),
      path: "/insurance/travel",
      color: "bg-blue-500"
    },
    {
      id: "auto",
      title: t("autoInsurance"),
      path: "/insurance/auto",
      color: "bg-emerald-500"
    },
    {
      id: "pet",
      title: t("petInsurance"),
      path: "/insurance/pet",
      color: "bg-amber-500"
    },
    {
      id: "health",
      title: t("healthInsurance"),
      path: "/insurance/health",
      color: "bg-rose-500"
    }
  ];
  
  // Insurance tips
  const insuranceTips = [
    "Consider policies with higher deductibles for lower premiums if you rarely file claims.",
    "Bundle multiple insurance types (auto, home, etc.) for potential discounts.",
    "Review your coverage annually to ensure it still meets your changing needs.",
    "Keep detailed records of valuable items for faster claims processing."
  ];
  
  // Get a random tip
  const getTipOfTheDay = () => {
    const randomIndex = Math.floor(Math.random() * insuranceTips.length);
    return insuranceTips[randomIndex];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero welcome section with animated gradient */}
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-0 right-0 w-full h-[400px] bg-gradient-to-br from-indigo-500/5 to-blue-500/10 rounded-b-[50%] -mt-[200px] blur-3xl"
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.4, 0.5, 0.4],
            }}
            transition={{ 
              duration: 10,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          <motion.div 
            className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-tr from-purple-500/5 to-blue-400/10 rounded-b-[40%] -mt-[150px] blur-3xl"
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{ 
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 1
            }}
          />
        </div>

        {/* Welcome header */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <motion.div
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            variants={item}
            className="text-center sm:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              <span className="text-gray-900 dark:text-white">Welcome back, </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                {firstName}
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Your personalized insurance dashboard is ready. Here's what's new today.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Stats widgets */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {statsWidgets.map((stat) => (
            <motion.div key={stat.id} variants={item} whileHover={{ y: -5 }}>
              <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-${stat.color}-500`}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-200">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="flex items-center">
                      <Badge variant="outline" className={`text-${stat.color}-600 dark:text-${stat.color}-400 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 border-${stat.color}-100 dark:border-${stat.color}-800`}>
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Primary CTA section */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
          variants={item}
          className="mb-10"
        >
          <Card className="border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg overflow-hidden">
            <div className="relative">
              {/* Decorative background elements */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute left-0 bottom-0 w-48 h-48 bg-gradient-to-tr from-indigo-500/5 to-purple-500/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    <span>AI-Powered</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Compare Insurance Plans Instantly</h2>
                  
                  <p className="text-gray-600 dark:text-gray-300">
                    Our AI analyzes thousands of plans to find your perfect match based on your unique needs and preferences.
                  </p>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="pt-2"
                  >
                    <GradientButton 
                      onClick={() => navigate('/compare-plans')}
                      gradientFrom="from-indigo-600" 
                      gradientTo="to-blue-600"
                      className="px-6 py-3 text-base shadow-md shadow-blue-500/10"
                      icon={<BarChart3 className="w-5 h-5 mr-2" />}
                    >
                      Start Comparing Now
                    </GradientButton>
                  </motion.div>
                </div>
                
                <div className="flex justify-center md:justify-end relative">
                  <motion.div 
                    animate={{ 
                      y: [0, -8, 0],
                    }}
                    transition={{ 
                      duration: 5, 
                      ease: "easeInOut", 
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                    className="relative z-10"
                  >
                    <svg className="w-full max-w-xs" viewBox="0 0 283 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1.5" y="1.5" width="280" height="127" rx="10.5" fill="white" stroke="#E5E7EB"/>
                      <rect x="12" y="18" width="120" height="8" rx="2" fill="#EFF6FF"/>
                      <rect x="12" y="38" width="180" height="8" rx="2" fill="#EFF6FF"/>
                      <rect x="12" y="58" width="150" height="8" rx="2" fill="#EFF6FF"/>
                      <rect x="12" y="78" width="200" height="8" rx="2" fill="#EFF6FF"/>
                      <rect x="12" y="98" width="160" height="8" rx="2" fill="#EFF6FF"/>
                      <circle cx="250" cy="30" r="12" fill="#DBEAFE"/>
                      <circle cx="250" cy="30" r="6" fill="#3B82F6"/>
                      <circle cx="250" cy="65" r="12" fill="#FCE7F3"/>
                      <circle cx="250" cy="65" r="6" fill="#EC4899"/>
                      <circle cx="250" cy="100" r="12" fill="#ECFDF5"/>
                      <circle cx="250" cy="100" r="6" fill="#10B981"/>
                    </svg>
                    
                    <div className="absolute top-5 right-12 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-indigo-500" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick access cards */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              initial="hidden"
              animate={isLoaded ? "show" : "hidden"}
              variants={slideInLeft}
              className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              Quick Actions
            </motion.h2>
          </div>
          
          <motion.div
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            variants={container}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {actionCards.map((card) => (
              <motion.div 
                key={card.id} 
                variants={item} 
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
              >
                <Card className="h-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden" onClick={() => navigate(card.path)}>
                  <div className={`absolute top-0 right-0 w-28 h-28 rounded-bl-full bg-gradient-to-br ${card.gradient} -mr-10 -mt-10 opacity-60`}></div>
                  <CardHeader className="relative z-10 pb-2">
                    <div className={`p-3 rounded-xl bg-${card.color}-100 dark:bg-${card.color}-900/30 w-fit mb-2`}>
                      {card.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 pb-4">
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="relative z-10 pt-0">
                    <Button 
                      variant="ghost" 
                      className={`text-${card.color}-600 dark:text-${card.color}-400 hover:text-${card.color}-700 dark:hover:text-${card.color}-300 hover:bg-${card.color}-50 dark:hover:bg-${card.color}-900/20 p-0 group`}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Two-column layout for Featured Recommendation and Tip of the Day */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Featured recommendation */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            variants={item}
            className="lg:col-span-2"
          >
            <Card className="h-full overflow-hidden border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                <div className="absolute left-0 bottom-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl rounded-full -ml-12 -mb-12"></div>
                
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-xl font-semibold">Featured Recommendation</CardTitle>
                  </div>
                  <CardDescription>
                    Based on your profile and preferences
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Premium Travel Protection</h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-4 w-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <ListChecks className="h-2 w-2 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Comprehensive medical coverage up to $1,000,000</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-4 w-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <ListChecks className="h-2 w-2 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Trip cancellation and interruption protection</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-4 w-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <ListChecks className="h-2 w-2 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">24/7 emergency assistance with multilingual support</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end space-y-3">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">$89<span className="text-sm font-normal text-gray-500">/trip</span></div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <GradientButton 
                          onClick={() => navigate('/insurance/travel')}
                          gradientFrom="from-blue-600" 
                          gradientTo="to-indigo-600"
                          className="w-full md:w-auto"
                        >
                          View Details
                        </GradientButton>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
          
          {/* Tip of the day */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            variants={item}
          >
            <Card className="h-full border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-900 dark:to-amber-950/20 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <LightbulbIcon className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-xl font-semibold">Briki Tip of the Day</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20"
                  >
                    <p className="text-gray-700 dark:text-gray-300 italic">"{getTipOfTheDay()}"</p>
                  </motion.div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 p-0 group"
                    onClick={() => navigate('/learn-more')}
                  >
                    <span>More Insurance Tips</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Insurance Categories */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
          variants={item}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Insurance Categories</h2>
            <Button variant="ghost" className="text-blue-600 dark:text-blue-400 group" onClick={() => navigate('/categories')}>
              <span>View All</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden"
              >
                <Button
                  variant="outline"
                  className="w-full h-auto flex flex-col items-center justify-center py-6 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 hover:shadow-md transition-all duration-300 rounded-xl relative z-10"
                  onClick={() => navigate(category.path)}
                >
                  <div className={`absolute top-0 left-0 w-2 h-full ${category.color} opacity-80`}></div>
                  <span className="text-base font-medium relative z-10">{category.title}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      
      {/* Footer section that matches landing page style */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold tracking-tighter bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Briki</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your AI-powered insurance companion</p>
            </div>
            
            <div className="flex space-x-6">
              <Button variant="ghost" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => navigate('/terms')}>
                Terms
              </Button>
              <Button variant="ghost" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => navigate('/learn-more')}>
                About
              </Button>
              <Button variant="ghost" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => navigate('/contact')}>
                Contact
              </Button>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left">
            <p className="text-xs text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} Briki. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}