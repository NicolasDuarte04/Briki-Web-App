import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileSearch, 
  Save, 
  MessageSquare, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'search' | 'save' | 'message' | 'purchase' | 'success' | 'warning' | 'pending';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

interface ActivityTimelineProps {
  activities?: ActivityItem[];
  className?: string;
  maxItems?: number;
}

const activityIcons: Record<ActivityItem['type'], LucideIcon> = {
  search: FileSearch,
  save: Save,
  message: MessageSquare,
  purchase: CreditCard,
  success: CheckCircle,
  warning: AlertCircle,
  pending: Clock
};

const activityColors: Record<ActivityItem['type'], string> = {
  search: 'bg-blue-500',
  save: 'bg-green-500',
  message: 'bg-purple-500',
  purchase: 'bg-emerald-500',
  success: 'bg-green-600',
  warning: 'bg-amber-500',
  pending: 'bg-gray-500'
};

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'message',
    title: 'AI Assistant Recommendation',
    description: 'Briki suggested a new travel insurance plan with better coverage',
    timestamp: '2 hours ago',
    link: '/recommendations/travel-2024'
  },
  {
    id: '2',
    type: 'save',
    title: 'Saved Health Insurance Plan',
    description: 'You saved "Premium Health Plus" to your favorites',
    timestamp: '5 hours ago',
    link: '/saved-plans'
  },
  {
    id: '3',
    type: 'search',
    title: 'Compared Auto Insurance',
    description: 'Viewed comparison of 3 auto insurance providers',
    timestamp: '1 day ago',
    link: '/compare/auto'
  },
  {
    id: '4',
    type: 'success',
    title: 'Profile Updated',
    description: 'Successfully updated your insurance preferences',
    timestamp: '2 days ago'
  }
];

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities = defaultActivities,
  className,
  maxItems = 5
}) => {
  const displayActivities = activities.slice(0, maxItems);

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your latest insurance journey updates
          </p>
        </div>
        <a
          href="/activity"
          className="text-sm font-medium text-[#0077B6] hover:text-[#00C7C4] transition-colors"
        >
          View all →
        </a>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Timeline line */}
        <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-gray-300 via-gray-200 to-transparent dark:from-gray-700 dark:via-gray-800" />

        <div className="space-y-4">
          {displayActivities.map((activity, index) => {
            const Icon = activityIcons[activity.type];
            const iconColor = activityColors[activity.type];

            return (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="relative"
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: index * 0.1 + 0.2,
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    className="relative z-10 flex-shrink-0"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center shadow-lg",
                      iconColor
                    )}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    {/* Pulse effect for recent items */}
                    {index === 0 && (
                      <motion.div
                        className={cn(
                          "absolute inset-0 rounded-full",
                          iconColor
                        )}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className={cn(
                      "relative p-4 rounded-2xl transition-all duration-300",
                      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                      "hover:border-[#00C7C4]/30 hover:shadow-md",
                      activity.link && "cursor-pointer"
                    )}>
                      {activity.link ? (
                        <a href={activity.link} className="block">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {activity.description}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {activity.timestamp}
                          </span>
                        </a>
                      ) : (
                        <>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {activity.description}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {activity.timestamp}
                          </span>
                        </>
                      )}

                      {/* Hover arrow for linked items */}
                      {activity.link && (
                        <motion.div
                          className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg
                            className="w-4 h-4 text-[#00C7C4]"
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
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fade out effect at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 pointer-events-none" />
      </motion.div>
    </div>
  );
};

export default ActivityTimeline; 