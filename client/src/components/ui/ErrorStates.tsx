import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Wifi, Search, Filter, Shield, Home } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";

interface ErrorStateProps {
  type?: 'network' | 'no-results' | 'filter-empty' | 'api-error' | 'not-found' | 'generic';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showIcon?: boolean;
  className?: string;
}

export function ErrorState({
  type = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  showIcon = true,
  className = ""
}: ErrorStateProps) {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: Wifi,
          title: title || "Connection Error",
          description: description || "Unable to connect to our servers. Please check your internet connection and try again.",
          actionLabel: actionLabel || "Retry Connection",
          iconColor: "text-red-500",
          bgColor: "bg-red-50"
        };
      
      case 'no-results':
        return {
          icon: Search,
          title: title || "No Plans Found",
          description: description || "We couldn't find any insurance plans matching your criteria. Try adjusting your search or filters.",
          actionLabel: actionLabel || "Clear Filters",
          iconColor: "text-gray-400",
          bgColor: "bg-gray-50"
        };
      
      case 'filter-empty':
        return {
          icon: Filter,
          title: title || "No Results with Current Filters",
          description: description || "Your current filter combination didn't return any plans. Try broadening your search criteria.",
          actionLabel: actionLabel || "Reset Filters",
          iconColor: "text-blue-500",
          bgColor: "bg-blue-50"
        };
      
      case 'api-error':
        return {
          icon: AlertTriangle,
          title: title || "Service Temporarily Unavailable",
          description: description || "Our insurance comparison service is temporarily unavailable. Please try again in a few moments.",
          actionLabel: actionLabel || "Try Again",
          iconColor: "text-orange-500",
          bgColor: "bg-orange-50"
        };
      
      case 'not-found':
        return {
          icon: Shield,
          title: title || "Plan Not Found",
          description: description || "The insurance plan you're looking for couldn't be found. It may have been removed or updated.",
          actionLabel: actionLabel || "Browse All Plans",
          iconColor: "text-purple-500",
          bgColor: "bg-purple-50"
        };
      
      default:
        return {
          icon: AlertTriangle,
          title: title || "Something Went Wrong",
          description: description || "An unexpected error occurred. Please try again or contact support if the problem persists.",
          actionLabel: actionLabel || "Try Again",
          iconColor: "text-gray-500",
          bgColor: "bg-gray-50"
        };
    }
  };

  const config = getErrorConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-center min-h-[400px] p-8 ${className}`}
    >
      <Card className="max-w-md w-full">
        <CardContent className="text-center p-8 space-y-6">
          {showIcon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`mx-auto w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center`}
            >
              <IconComponent className={`h-8 w-8 ${config.iconColor}`} />
            </motion.div>
          )}
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              {config.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {config.description}
            </p>
          </div>
          
          {onAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={onAction}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {config.actionLabel}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface EmptyStateProps {
  type?: 'no-plans' | 'no-favorites' | 'no-quotes' | 'no-history' | 'welcome';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  type = 'no-plans',
  title,
  description,
  actionLabel,
  onAction,
  illustration,
  className = ""
}: EmptyStateProps) {
  const getEmptyConfig = () => {
    switch (type) {
      case 'no-plans':
        return {
          title: title || "No Insurance Plans Available",
          description: description || "There are currently no insurance plans available for this category. Check back later or browse other categories.",
          actionLabel: actionLabel || "Browse All Categories",
          illustration: <Shield className="h-16 w-16 text-gray-300" />
        };
      
      case 'no-favorites':
        return {
          title: title || "No Favorite Plans Yet",
          description: description || "You haven't saved any insurance plans as favorites. Start exploring plans and save the ones you like!",
          actionLabel: actionLabel || "Explore Plans",
          illustration: <Shield className="h-16 w-16 text-gray-300" />
        };
      
      case 'no-quotes':
        return {
          title: title || "No Quotes Generated",
          description: description || "You haven't generated any insurance quotes yet. Get started by selecting a plan and creating your first quote.",
          actionLabel: actionLabel || "Get Your First Quote",
          illustration: <Shield className="h-16 w-16 text-gray-300" />
        };
      
      case 'no-history':
        return {
          title: title || "No Activity History",
          description: description || "Your activity history will appear here as you browse plans, generate quotes, and make comparisons.",
          actionLabel: actionLabel || "Start Browsing",
          illustration: <Shield className="h-16 w-16 text-gray-300" />
        };
      
      case 'welcome':
        return {
          title: title || "Welcome to Briki Insurance",
          description: description || "Discover the perfect insurance coverage for your needs. Compare plans, get quotes, and purchase with confidence.",
          actionLabel: actionLabel || "Start Exploring",
          illustration: <Home className="h-16 w-16 text-blue-500" />
        };
      
      default:
        return {
          title: title || "Nothing Here Yet",
          description: description || "This section is empty right now. Check back later or take action to get started.",
          actionLabel: actionLabel || "Get Started",
          illustration: <Shield className="h-16 w-16 text-gray-300" />
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-center min-h-[300px] p-8 ${className}`}
    >
      <div className="text-center max-w-md space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto"
        >
          {illustration || config.illustration}
        </motion.div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {config.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {config.description}
          </p>
        </div>
        
        {onAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={onAction}
              variant="default"
              size="lg"
            >
              {config.actionLabel}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}