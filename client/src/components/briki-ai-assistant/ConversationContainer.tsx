import React from 'react';
import { Shield, Zap, CheckCircle } from 'lucide-react';
import { GradientCard } from '../ui';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';

interface ConversationContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  input?: React.ReactNode;
  className?: string;
}

export const ConversationContainer: React.FC<ConversationContainerProps> = ({
  children,
  header,
  input,
  className
}) => {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col overflow-hidden bg-white",
        className
      )}
    >
      {/* Minimal Trust Bar */}
      <div className="flex justify-center gap-4 text-xs text-neutral-500 py-2 border-b border-gray-100 opacity-80">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          <span>Encrypted</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          <span>Fast Response</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Verified AI</span>
        </div>
      </div>

      {/* Messages Area with max-width constraint */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Input Area */}
      {input && (
        <div className="border-t border-gray-100 bg-gray-50/50 sticky bottom-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            {input}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationContainer; 