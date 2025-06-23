import React from 'react';
import { motion } from 'framer-motion';
import { Plus, GitCompare, MessageSquareText, FileText } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

interface QuickActionsProps {
  className?: string;
}

const defaultActions: QuickAction[] = [
  {
    id: 'new-quote',
    label: 'Start New Quote',
    description: 'Get personalized coverage',
    icon: Plus,
    href: '/insurance/travel',
    variant: 'primary'
  },
  {
    id: 'compare',
    label: 'Compare Plans',
    description: 'Find the best deal',
    icon: GitCompare,
    href: '/compare',
    variant: 'secondary'
  },
  {
    id: 'ai-assistant',
    label: 'Ask AI Assistant',
    description: 'Get instant help',
    icon: MessageSquareText,
    href: '/ask-briki-ai',
    variant: 'secondary'
  },
  {
    id: 'documents',
    label: 'My Documents',
    description: 'View policies & claims',
    icon: FileText,
    href: '/documents',
    variant: 'outline'
  }
];

export const QuickActions: React.FC<QuickActionsProps> = ({ className }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          What would you like to do today?
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {defaultActions.map((action) => (
          <motion.div
            key={action.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <a
              href={action.href}
              className="group block h-full"
            >
              <div className={cn(
                "relative h-full rounded-2xl p-6 transition-all duration-300",
                "border border-gray-200 dark:border-gray-700",
                "hover:border-[#00C7C4]/50 hover:shadow-lg",
                action.variant === 'primary' && "bg-gradient-to-br from-[#00C7C4]/5 to-[#0077B6]/5",
                action.variant === 'secondary' && "bg-gray-50 dark:bg-gray-800/50",
                action.variant === 'outline' && "bg-white dark:bg-gray-900"
              )}>
                {/* Hover gradient effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00C7C4]/0 to-[#0077B6]/0 group-hover:from-[#00C7C4]/5 group-hover:to-[#0077B6]/5 transition-all duration-300" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                      action.variant === 'primary' && "bg-gradient-to-br from-[#00C7C4] to-[#0077B6]",
                      action.variant === 'secondary' && "bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-600 dark:to-gray-500",
                      action.variant === 'outline' && "bg-gray-100 dark:bg-gray-800"
                    )}
                  >
                    <action.icon className={cn(
                      "h-7 w-7",
                      action.variant === 'outline' ? "text-gray-700 dark:text-gray-300" : "text-white"
                    )} />
                  </motion.div>
                  
                  <h3 className={cn(
                    "font-semibold mb-1",
                    action.variant === 'primary' ? "text-[#0077B6]" : "text-gray-900 dark:text-white"
                  )}>
                    {action.label}
                  </h3>
                  
                  {action.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  )}
                </div>

                {/* Animated arrow on hover */}
                <motion.div
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="w-5 h-5 text-[#00C7C4]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.div>
              </div>
            </a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default QuickActions; 