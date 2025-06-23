import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Calendar, DollarSign, ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Policy {
  id: string;
  type: 'auto' | 'health' | 'pet' | 'travel';
  name: string;
  provider: string;
  status: 'active' | 'pending' | 'expired';
  premium: string;
  nextPayment?: string;
  coverage?: string;
}

interface PolicyCardProps {
  policy: Policy;
  onClick?: () => void;
  className?: string;
}

const policyIcons: Record<Policy['type'], LucideIcon> = {
  auto: Shield,
  health: Shield,
  pet: Shield,
  travel: Shield
};

const policyColors: Record<Policy['type'], { bg: string; icon: string; badge: string }> = {
  auto: {
    bg: 'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20',
    icon: 'from-blue-500 to-indigo-600',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  },
  health: {
    bg: 'from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-800/20',
    icon: 'from-emerald-500 to-green-600',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
  },
  pet: {
    bg: 'from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20',
    icon: 'from-purple-500 to-pink-600',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
  },
  travel: {
    bg: 'from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-800/20',
    icon: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  }
};

const statusStyles = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
};

export const PolicyCard: React.FC<PolicyCardProps> = ({
  policy,
  onClick,
  className
}) => {
  const Icon = policyIcons[policy.type];
  const colors = policyColors[policy.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700",
        "bg-gradient-to-br",
        colors.bg,
        "cursor-pointer group",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Left side - Icon and Info */}
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className={cn(
                "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                colors.icon
              )}
            >
              <Icon className="h-6 w-6 text-white" />
            </motion.div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {policy.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {policy.provider}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                  statusStyles[policy.status]
                )}>
                  {policy.status}
                </span>
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                  colors.badge
                )}>
                  {policy.type}
                </span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
          >
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </motion.div>
        </div>

        {/* Bottom info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Premium</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {policy.premium}
              </p>
            </div>
          </div>
          
          {policy.nextPayment && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Next payment</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {policy.nextPayment}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 pointer-events-none"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

// PolicyGrid component for displaying multiple policies
interface PolicyGridProps {
  policies: Policy[];
  className?: string;
}

export const PolicyGrid: React.FC<PolicyGridProps> = ({ policies, className }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your Policies
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage and review your active coverage
          </p>
        </div>
        <a
          href="/policies"
          className="text-sm font-medium text-[#0077B6] hover:text-[#00C7C4] transition-colors"
        >
          View all →
        </a>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {policies.map((policy) => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            onClick={() => window.location.href = `/policies/${policy.id}`}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default PolicyCard; 