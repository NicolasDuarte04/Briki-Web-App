import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

// Import components
import GlassCard from "@/components/glass-card";
import GradientButton from "@/components/gradient-button";

// Icons
import { 
  BarChart3, PieChart, Zap, Layers, Shield, 
  ChevronRight, Settings, Database, 
  AreaChart, LucideIcon, Globe, BriefcaseBusiness, 
  Users, Search, Bell, LogOut
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/**
 * Briki Pilot Portal - specialized B2B interface with dark futuristic design
 * Using navy color system for a cohesive high-end partner experience
 */
export default function BrikiPilotPortal() {
  const [, navigate] = useLocation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Dashboard widgets/modules
  const dashboardModules = [
    {
      id: 1,
      title: "Analytics Dashboard",
      description: "View performance metrics and customer insights",
      icon: BarChart3,
      gradient: "from-[#003087] to-[#0074FF]",
      path: "/company-dashboard",
      available: true
    },
    {
      id: 2,
      title: "Real-time API Monitor",
      description: "Track integration status and API health",
      icon: Zap,
      gradient: "from-[#0055CC] to-[#0074FF]",
      path: "/api-monitor",
      available: true
    },
    {
      id: 3,
      title: "Plan Performance",
      description: "Analyze product conversion rates and customer feedback",
      icon: PieChart,
      gradient: "from-[#004AAD] to-[#0074FF]",
      path: "/plan-performance",
      available: true
    },
    {
      id: 4,
      title: "Consumer Preview",
      description: "See how your plans appear to customers",
      icon: Users,
      gradient: "from-[#005CB8] to-[#33BFFF]",
      path: "/company-preview",
      available: true
    },
    {
      id: 5,
      title: "Integration Hub",
      description: "Manage connections with other insurance platforms",
      icon: Database,
      gradient: "from-[#004095] to-[#0074FF]",
      path: "/integration-hub",
      available: false
    },
    {
      id: 6,
      title: "AI Risk Assessment",
      description: "Advanced risk modeling and forecasting tools",
      icon: Shield,
      gradient: "from-[#002C7A] to-[#0074FF]",
      path: "/ai-risk-assessment",
      available: false
    }
  ];

  const userInfo = {
    companyName: "InsureTech Global",
    role: "Administrator",
    avatarUrl: null, // We could add a company logo here
  };

  // Component for the top NavBar
  const NavBar = () => (
    <header className="w-full bg-[#001A40]/90 backdrop-blur-lg border-b border-[#002C7A] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-[#003087] to-[#0074FF] rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(51,191,255,0.3)]">
                  <BriefcaseBusiness className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-white via-[#33BFFF] to-white bg-clip-text text-transparent">
                  Briki Pilot
                </span>
              </div>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Dashboard</a>
                <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Analytics</a>
                <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Integrations</a>
                <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Support</a>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-400 hover:text-white transition-colors duration-200">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-1 rounded-full text-gray-400 hover:text-white transition-colors duration-200 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#33BFFF] ring-1 ring-[#001A40]"></span>
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  <Avatar className="h-8 w-8 border border-[#0074FF]/30 bg-[#002C7A]">
                    <AvatarFallback className="text-xs font-medium text-white">
                      {userInfo.companyName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm font-medium text-gray-300 hidden sm:block">
                    {userInfo.companyName}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#001A40] border border-[#002C7A] text-white">
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-[#002C7A] text-gray-300 hover:text-white focus:bg-[#002C7A] focus:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );

  // Component for the feature card
  const FeatureCard = ({ 
    title, 
    description, 
    icon: Icon, 
    gradient, 
    id, 
    available,
    onClick 
  }: { 
    title: string; 
    description: string; 
    icon: LucideIcon; 
    gradient: string; 
    id: number;
    available: boolean;
    onClick: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: id * 0.1 }}
      className="col-span-1"
      onMouseEnter={() => setHoveredCard(id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div 
        className={`
          relative rounded-xl overflow-hidden cursor-pointer border border-[#002C7A]
          hover:shadow-lg hover:shadow-[#33BFFF]/10 transition-all duration-300
          ${!available ? 'opacity-70' : ''}
          ${hoveredCard === id ? 'bg-[#002050]/60' : 'bg-[#001A40]/60'}
        `}
        onClick={onClick}
      >
        {/* Gradient overlay on hover */}
        <div 
          className={`
            absolute inset-0 opacity-0 transition-opacity duration-300
            ${hoveredCard === id ? 'opacity-10' : ''}
            bg-gradient-to-r ${gradient}
          `}
        />
        
        <div className="p-6">
          <div className="flex items-start justify-between">
            {/* Icon with gradient background */}
            <div className={`
              flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
              bg-gradient-to-r ${gradient} shadow-[0_0_10px_rgba(51,191,255,0.2)]
            `}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            
            {/* Arrow indicator that animates on hover */}
            <div 
              className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                bg-[#002C7A]/60 text-gray-400 transition-all duration-300
                ${hoveredCard === id ? 'transform translate-x-1 bg-[#003087]/80 text-[#33BFFF]' : ''}
              `}
            >
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
          
          <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-gray-400 text-sm">{description}</p>
          
          {!available && (
            <div className="mt-4 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#001A40] text-gray-400 border border-[#002C7A]">
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001A40] via-[#00142E] to-black text-white">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero section with app stats */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-[#33BFFF] to-white bg-clip-text text-transparent">
              Welcome to Briki Pilot
            </h1>
            <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
              Your AI-powered insurance management portal for optimizing plan performance and customer engagement
            </p>
          </motion.div>
          
          {/* Key metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { label: "API Requests", value: "1.2M", icon: Zap, change: "+12.5%" },
              { label: "Conversions", value: "24.8%", icon: AreaChart, change: "+2.3%" },
              { label: "Active Plans", value: "14", icon: Layers, change: "0" },
              { label: "Global Reach", value: "8 Countries", icon: Globe, change: "+2" },
            ].map((stat, i) => (
              <div 
                key={i}
                className="relative overflow-hidden bg-[#001A40]/60 rounded-xl border border-[#002C7A] p-6 backdrop-blur-sm hover:shadow-[0_4px_12px_rgba(51,191,255,0.1)] transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                    <div className={`mt-1 text-xs font-medium ${
                      stat.change.startsWith('+') ? 'text-[#60CDFF]' : 
                      stat.change.startsWith('-') ? 'text-red-400' : 'text-gray-500'
                    }`}>
                      {stat.change !== "0" ? stat.change : "No change"}
                    </div>
                  </div>
                  <div className="p-2 bg-[#002C7A]/70 rounded-lg">
                    <stat.icon className="h-5 w-5 text-[#33BFFF]" />
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0074FF]/30 to-transparent"></div>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Main dashboard modules/widgets */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-2xl font-bold text-white">Management Tools</h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-sm text-[#33BFFF] hover:text-white hover:bg-[#002C7A]/50 transition-colors"
            >
              <Settings className="h-4 w-4 mr-1" />
              Customize
            </Button>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardModules.map(module => (
              <FeatureCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                gradient={module.gradient}
                available={module.available}
                onClick={() => {
                  if (module.available) {
                    navigate(module.path);
                  } else {
                    console.log("Feature coming soon:", module.title);
                  }
                }}
              />
            ))}
          </div>
        </div>
        
        {/* AI assistant section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <div className="relative overflow-hidden rounded-xl border border-[#002C7A] bg-gradient-to-br from-[#001E47]/70 via-[#001A40]/90 to-black/95 shadow-[0_0_30px_rgba(0,61,135,0.2)]">
            {/* Futuristic overlay design elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -right-40 -top-40 w-96 h-96 bg-[#0074FF]/10 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 -bottom-40 w-96 h-96 bg-[#33BFFF]/5 rounded-full blur-3xl"></div>
              
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(to right, #002C7A 1px, transparent 1px), 
                                    linear-gradient(to bottom, #002C7A 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* Animated highlight */}
              <div className="absolute inset-y-0 -right-40 w-1/2 bg-gradient-to-l from-[#33BFFF]/5 to-transparent transform-gpu animate-pulse-slow"></div>
            </div>
            
            <div className="relative p-8 md:p-10 lg:p-12 flex flex-col md:flex-row items-center">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  AI Business Intelligence
                </h3>
                <p className="text-gray-400 mb-6 max-w-xl leading-relaxed">
                  Leverage our advanced AI platform to analyze customer behaviors, predict market trends, and optimize your product offerings based on real-time data.
                </p>
                <div className="flex flex-wrap gap-3">
                  <GradientButton
                    size="sm"
                    variant="outline"
                    className="border-[#002C7A] text-white hover:border-[#0074FF] hover:shadow-[0_0_15px_rgba(51,191,255,0.15)]"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Access AI Tools
                  </GradientButton>
                  <button className="text-[#33BFFF] text-sm font-medium hover:text-white transition-colors flex items-center">
                    Learn more
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
              
              <div className="mt-8 md:mt-0 md:ml-8 flex-shrink-0">
                <div className="w-60 h-60 rounded-xl bg-gradient-to-br from-[#002C7A]/30 via-[#00265F]/20 to-[#003087]/30 border border-[#0074FF]/30 backdrop-blur flex items-center justify-center relative overflow-hidden shadow-[0_0_25px_rgba(0,116,255,0.15)]">
                  {/* AI visualization elements */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(to right, #0074FF 1px, transparent 1px), 
                                        linear-gradient(to bottom, #0074FF 1px, transparent 1px)`,
                      backgroundSize: '10px 10px'
                    }}></div>
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#003087] to-[#0074FF] flex items-center justify-center shadow-[0_0_20px_rgba(51,191,255,0.3)]">
                      <span className="text-white text-2xl font-bold">AI</span>
                    </div>
                    <p className="mt-4 text-sm text-[#33BFFF]">Predictive Analytics</p>
                    <p className="text-xs text-gray-400 mt-1">Powered by Briki Intelligence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#001A40]/90 backdrop-blur-lg border-t border-[#002C7A] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-[#003087] to-[#0074FF] rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(51,191,255,0.15)]">
                  <BriefcaseBusiness className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-white via-[#33BFFF] to-white bg-clip-text text-transparent">
                  Briki Pilot
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                The ultimate AI-powered insurance management platform
              </p>
            </div>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <a className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</a>
              <a className="text-sm text-gray-400 hover:text-white transition-colors">API</a>
              <a className="text-sm text-gray-400 hover:text-white transition-colors">Support</a>
              <a className="text-sm text-gray-400 hover:text-white transition-colors">Terms</a>
              <a className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#002C7A] flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>© 2023 Briki Insurance Inc. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a className="hover:text-white transition-colors">Twitter</a>
              <a className="hover:text-white transition-colors">LinkedIn</a>
              <a className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}