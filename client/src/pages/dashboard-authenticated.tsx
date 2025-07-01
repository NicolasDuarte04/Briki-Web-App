import React from 'react';
import { useAuth } from "../hooks/use-auth";
import { useLocation } from "wouter";
import { 
  Shield, 
  TrendingUp, 
  FileCheck, 
  AlertCircle,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { SectionContainer } from "../components/ui/section-container";
import { GradientButton } from "../components/ui/gradient-button";
import { 
  WelcomeHero,
  DashboardStatCard,
  QuickActions,
  ActivityTimeline,
  PolicyGrid
} from "../components/dashboard";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export default function DashboardAuthenticated() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.username) return user.username;
    return user?.email?.split('@')[0] || 'User';
  };

  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: "Active Policies",
      value: "3",
      subtitle: "All up to date",
      icon: Shield,
      trend: { value: 0, label: "vs last month" },
      variant: "primary" as const
    },
    {
      title: "Total Saved",
      value: "$1,847",
      subtitle: "This year",
      icon: TrendingUp,
      trend: { value: 23, label: "vs last year" },
      variant: "success" as const
    },
    {
      title: "Coverage Score",
      value: "92%",
      subtitle: "Excellent protection",
      icon: FileCheck,
      trend: { value: 5, label: "improvement" },
      variant: "success" as const
    },
    {
      title: "Actions Needed",
      value: "1",
      subtitle: "Review required",
      icon: AlertCircle,
      variant: "warning" as const
    }
  ];

  const mockPolicies = [
    {
      id: "1",
      type: "auto" as const,
      name: "Comprehensive Auto",
      provider: "SecureShield Insurance",
      status: "active" as const,
      premium: "$127/mo",
      nextPayment: "Mar 15"
    },
    {
      id: "2",
      type: "health" as const,
      name: "Premium Health Plus",
      provider: "HealthGuard Co.",
      status: "active" as const,
      premium: "$340/mo",
      nextPayment: "Mar 1"
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <SectionContainer variant="default" className="pt-8 pb-12 lg:pt-12 lg:pb-16">
        <motion.div {...fadeInUp}>
          <WelcomeHero 
            userName={getUserName()}
            policies={3}
            savedAmount={1847}
          />
        </motion.div>
      </SectionContainer>

      {/* Stats Grid */}
      <SectionContainer variant="light" className="py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <DashboardStatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>
      </SectionContainer>

      {/* Quick Actions */}
      <SectionContainer variant="default" className="py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <QuickActions />
        </motion.div>
      </SectionContainer>

      {/* Main Content Grid */}
      <SectionContainer variant="light" className="py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <ActivityTimeline />
          </motion.div>

          {/* Right Column - AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            {/* AI Recommendation Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003f5c] to-[#0077B6] p-6 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">AI Insights</h3>
              </div>
                <p className="text-white/90 mb-4">
                  Based on your profile, you could save up to $320/year by bundling your auto and health policies.
                </p>
                <GradientButton
                  variant="secondary"
                  size="base"
                  onClick={() => navigate('/ask-briki-ai')}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  Explore Savings
                </GradientButton>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Why Trust Briki?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm font-semibold">✓</span>
          </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">50K+ Happy Users</span>
        </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm font-semibold">✓</span>
      </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">98% Satisfaction Rate</span>
        </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm font-semibold">✓</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI-Powered Savings</span>
        </div>
              </div>
              </div>
          </motion.div>
        </div>
      </SectionContainer>

      {/* Policies Section */}
      <SectionContainer variant="default" className="py-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <PolicyGrid policies={mockPolicies} />
        </motion.div>
      </SectionContainer>

      {/* CTA Section */}
      <SectionContainer variant="gradient" decoration="dots" className="py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Need Help with Your Insurance?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Our AI assistant is available 24/7 to answer your questions and help you find the perfect coverage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton
              variant="secondary"
              size="lg"
              onClick={() => navigate('/ask-briki-ai')}
              className="bg-white text-[#0077B6] hover:bg-gray-100"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat with AI Assistant
            </GradientButton>
            <GradientButton
              variant="outline"
              size="lg"
              onClick={() => navigate('/insurance/travel')}
              className="border-white text-white hover:bg-white/10"
            >
              Get New Quote
            </GradientButton>
          </div>
        </motion.div>
      </SectionContainer>
    </div>
  );
}