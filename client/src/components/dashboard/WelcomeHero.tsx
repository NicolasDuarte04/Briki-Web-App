import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

interface WelcomeHeroProps {
  userName: string;
  policies?: number;
  savedAmount?: number;
  className?: string;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  userName,
  policies = 0,
  savedAmount = 0,
  className
}) => {
  const firstName = userName.split(' ')[0];
  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003f5c] via-[#0077B6] to-[#00A8A6]",
      className
    )}>
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-[#00C7C4]/10 rounded-full blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative z-10 p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Bot className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  {timeOfDay()}, {firstName}!
                </h1>
                <p className="text-white/80 text-lg">Welcome back to your insurance hub</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              {policies > 0 ? (
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-[#00C7C4]" />
                    <span className="text-white/90">
                      <span className="font-semibold text-white">{policies}</span> Active {policies === 1 ? 'Policy' : 'Policies'}
                    </span>
                  </div>
                  {savedAmount > 0 && (
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-[#00C7C4]" />
                      <span className="text-white/90">
                        <span className="font-semibold text-white">${savedAmount}</span> Saved this year
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-white/90 text-lg">
                  Ready to find your perfect insurance coverage? Let's get started!
                </p>
              )}
            </motion.div>
          </div>

          {/* Right content - AI suggestion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C7C4] to-[#0077B6] flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">AI Insight</h3>
                <p className="text-white/80 text-sm">
                  {policies > 0 
                    ? "Your coverage looks good! Consider reviewing your auto policy for potential savings."
                    : "I can help you find the perfect insurance plan. Start by telling me what you need to protect."
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHero; 