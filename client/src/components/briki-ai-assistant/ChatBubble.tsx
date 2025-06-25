import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bot, User, Loader2 } from 'lucide-react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
  timestamp?: Date;
  children?: React.ReactNode;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  content,
  isLoading,
  timestamp,
  children
}) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.3
      }}
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 500,
          damping: 25,
          delay: 0.1
        }}
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser 
            ? "bg-gradient-to-br from-[#00C7C4] to-[#0077B6] shadow-md" 
            : "bg-gray-100"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-gray-600" />
        )}
      </motion.div>

      {/* Message Bubble */}
      <div className={cn(
        "flex flex-col gap-1 max-w-[80%]",
        isUser && "items-end"
      )}>
        {/* Message Content */}
        {isUser ? (
          <motion.div
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            className="bg-gradient-to-r from-[#00C7C4] to-[#0077B6] text-white rounded-2xl rounded-tr-sm px-4 py-2 shadow-md"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Sending...</span>
              </div>
            ) : (
              <p className="text-sm leading-normal whitespace-pre-wrap">{content}</p>
            )}
          </motion.div>
        ) : (
          <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-2">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-[#0077B6] rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-[#0077B6] rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-[#0077B6] rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-500">Briki is thinking...</span>
              </div>
            ) : (
              <div>
                <p className="text-sm leading-normal text-gray-700 whitespace-pre-wrap">
                  {content}
                </p>
                {/* Additional content like plan cards */}
                {children && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    {children}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        {timestamp && !isLoading && (
          <span className={cn(
            "text-xs text-gray-400 mt-1",
            isUser ? "text-right" : "text-left"
          )}>
            {timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble; 