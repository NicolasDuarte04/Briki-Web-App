import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { MessageCircle, Clock, Tag } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface ConversationPreviewCardProps {
  id: number;
  input: string;
  output?: string;
  category?: string;
  timestamp: string;
  onClick: (id: number) => void;
}

export const ConversationPreviewCard: React.FC<ConversationPreviewCardProps> = ({
  id,
  input,
  output,
  category,
  timestamp,
  onClick
}) => {
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case 'travel': return 'bg-blue-100 text-blue-700';
      case 'auto': return 'bg-green-100 text-green-700';
      case 'health': return 'bg-red-100 text-red-700';
      case 'pet': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 border-l-[#0077B6]"
        onClick={() => onClick(id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#00C7C4] to-[#0077B6] flex items-center justify-center mt-1">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header with timestamp and category */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(timestamp)}
                  </span>
                </div>
                {category && (
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                    getCategoryColor(category)
                  )}>
                    <Tag className="w-3 h-3" />
                    {category}
                  </div>
                )}
              </div>

              {/* User question */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-900 leading-relaxed">
                  {truncateText(input)}
                </p>
              </div>

              {/* Assistant response preview */}
              {output && (
                <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2 border-l-2 border-gray-200">
                  <span className="font-medium text-gray-800">Briki: </span>
                  {truncateText(output, 80)}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConversationPreviewCard; 