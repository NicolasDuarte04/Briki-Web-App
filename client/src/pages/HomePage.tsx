import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import NavigationBar from '@/components/NavigationBar';
import AnimatedBackground from '@/components/AnimatedBackground';
import AnimatedCTAButton from '@/components/AnimatedCTAButton';
import GlassCard from '@/components/GlassCard';
import { MdAutoAwesome, MdHealthAndSafety, MdPets, MdCardTravel } from 'react-icons/md';
import { LuArrowRight } from 'react-icons/lu';
import { IoShieldCheckmark } from 'react-icons/io5';
import '@/styles/design-system.css';

// Insurance categories for the cards
const insuranceCategories = [
  {
    id: 'travel',
    name: 'Travel Insurance',
    icon: <MdCardTravel size={24} />,
    description: 'Protect your journey with comprehensive coverage',
    link: '/travel',
    gradient: 'from-blue-500 to-cyan-400'
  },
  {
    id: 'auto',
    name: 'Auto Insurance',
    icon: <MdAutoAwesome size={24} />,
    description: 'Coverage that moves with you and your vehicle',
    link: '/auto',
    gradient: 'from-violet-500 to-purple-400'
  },
  {
    id: 'pet',
    name: 'Pet Insurance',
    icon: <MdPets size={24} />,
    description: 'Keep your furry friends protected and healthy',
    link: '/pet',
    gradient: 'from-amber-500 to-orange-400'
  },
  {
    id: 'health',
    name: 'Health Insurance',
    icon: <MdHealthAndSafety size={24} />,
    description: 'Quality health coverage for you and your family',
    link: '/health',
    gradient: 'from-emerald-500 to-teal-400'
  }
];

// Benefits list for the feature section
const benefits = [
  {
    title: 'AI-Powered Recommendations',
    description: 'Our intelligent system analyzes your needs to suggest the perfect coverage'
  },
  {
    title: 'Compare Multiple Providers',
    description: 'See side-by-side comparisons of top insurance companies'
  },
  {
    title: 'Instant Digital Coverage',
    description: 'Get protected immediately with our digital insurance certificates'
  },
  {
    title: 'Multilingual Support',
    description: 'Access support in your preferred language through our chatbot'
  }
];

const HomePage = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-gray-800 overflow-hidden relative">
      {/* Animated background with light gradients */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <NavigationBar />
      
      {/* Hero Section */}
      <header className="relative pt-24 pb-20 px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center md:text-left md:max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 leading-tight">
              The Intelligent Insurance Marketplace
            </h1>
            <p className="mt-6 text-xl text-gray-600 md:max-w-xl">
              Find and compare the best insurance options across multiple categories with our AI-powered platform. Save time and money with personalized recommendations.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <AnimatedCTAButton 
                onClick={() => {}} 
                size="lg" 
                withSparkle={true}
                icon={<LuArrowRight />}
              >
                Get Started
              </AnimatedCTAButton>
              <Link href="/learn-more">
                <a className="inline-flex items-center justify-center h-12 px-6 font-medium text-gray-600 transition-colors bg-white/70 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-primary">
                  Learn More
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </header>
      
      {/* Categories Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-24 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Insurance <span className="text-primary">Categories</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {insuranceCategories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Link href={category.link}>
                    <a className="block h-full">
                      <GlassCard 
                        className="p-6 h-full"
                        variant="elevated" 
                        hover="glow"
                      >
                        <div className="flex flex-col h-full">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white mb-4 bg-gradient-to-r ${category.gradient}`}>
                            {category.icon}
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                          <p className="text-gray-600 mb-4 flex-grow">{category.description}</p>
                          <div className="flex items-center text-primary font-medium">
                            Explore
                            <LuArrowRight className="ml-2" />
                          </div>
                        </div>
                      </GlassCard>
                    </a>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-24 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                Why Choose <span className="text-primary">Briki</span>
              </h2>
              <p className="text-gray-600 mb-8">
                Briki uses cutting-edge AI technology to find the best insurance options for your specific needs across multiple categories. Our platform makes comparing and purchasing insurance simpler than ever.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <IoShieldCheckmark className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <GlassCard 
                className="p-6 overflow-hidden"
                variant="elevated"
              >
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg" />
                  <img 
                    src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                    alt="AI-powered insurance comparison" 
                    className="object-cover w-full h-full rounded-lg mix-blend-overlay"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-xl font-semibold text-white">AI-Powered Analysis</h3>
                    <p className="text-white/90 text-sm">Find the perfect coverage with our intelligent recommendation engine</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 xl:px-24 relative">
        <div className="max-w-5xl mx-auto text-center">
          <GlassCard 
            className="p-10 md:p-12"
            variant="elevated"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Discover Your <span className="text-primary">Perfect Insurance</span>?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have found the ideal coverage through Briki's intelligent marketplace. Start your journey to better protection today.
              </p>
              <AnimatedCTAButton 
                onClick={() => {}} 
                size="lg"
                icon={<LuArrowRight />}
              >
                {isAuthenticated ? 'Explore Plans' : 'Create Free Account'}
              </AnimatedCTAButton>
            </motion.div>
          </GlassCard>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 lg:px-16 xl:px-24 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Briki</h3>
              <p className="text-gray-600 text-sm">
                The intelligent insurance marketplace powered by AI technology.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Insurance</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/travel"><a className="text-gray-600 hover:text-primary">Travel Insurance</a></Link></li>
                <li><Link href="/auto"><a className="text-gray-600 hover:text-primary">Auto Insurance</a></Link></li>
                <li><Link href="/pet"><a className="text-gray-600 hover:text-primary">Pet Insurance</a></Link></li>
                <li><Link href="/health"><a className="text-gray-600 hover:text-primary">Health Insurance</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about"><a className="text-gray-600 hover:text-primary">About Us</a></Link></li>
                <li><Link href="/partners"><a className="text-gray-600 hover:text-primary">Partners</a></Link></li>
                <li><Link href="/careers"><a className="text-gray-600 hover:text-primary">Careers</a></Link></li>
                <li><Link href="/for-companies"><a className="text-gray-600 hover:text-primary">For Insurance Companies</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms"><a className="text-gray-600 hover:text-primary">Terms of Service</a></Link></li>
                <li><Link href="/privacy"><a className="text-gray-600 hover:text-primary">Privacy Policy</a></Link></li>
                <li><Link href="/cookies"><a className="text-gray-600 hover:text-primary">Cookie Policy</a></Link></li>
                <li><Link href="/licensing"><a className="text-gray-600 hover:text-primary">Licensing</a></Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm text-center">
              © {new Date().getFullYear()} Briki Insurance Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;