import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { sendMessage, extractActionFromMessage } from "@/services/ai-service";
import { 
  Message, 
  UserMemory, 
  AssistantWidgetType,
  RecommendPlanAction,
  NavigateToPageAction,
  ComparePlansAction,
  ExplainTermAction
} from "@/types/assistant";
import { trackAssistantOpened, trackAssistantClosed, trackAssistantActionClicked } from "@/lib/assistant-analytics";
import { useAssistantActions } from "@/hooks/use-assistant-actions";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  userMemory: UserMemory;
}

export function ChatInterface({ isOpen, onClose, userMemory }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { handleAction } = useAssistantActions();

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Track that the assistant was opened
      trackAssistantOpened();
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: uuidv4(),
        sender: "assistant",
        content: "Hello! I'm your Briki AI assistant. How can I help you with insurance today?",
        timestamp: new Date().toISOString()
      };
      
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up when closing
  useEffect(() => {
    if (!isOpen) {
      // Track that the assistant was closed
      trackAssistantClosed();
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      sender: "user",
      content: inputValue,
      timestamp: new Date().toISOString()
    };
    
    // Add loading message
    const loadingMessage: Message = {
      id: uuidv4(),
      sender: "assistant",
      content: "Thinking...",
      timestamp: new Date().toISOString(),
      isLoading: true
    };
    
    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await sendMessage(inputValue, userMemory);
      
      // Process message and extract action if available
      let widgetData: AssistantWidgetType | null = null;
      
      if (response.action) {
        widgetData = response.action;
      } else {
        // Try to extract action from the message as a fallback
        widgetData = extractActionFromMessage(response.message);
      }
      
      // Create assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        sender: "assistant",
        content: response.message,
        timestamp: new Date().toISOString(),
        widgetData
      };
      
      // Replace loading message with actual response
      setMessages((prev) => 
        prev.map((msg) => (msg.isLoading ? assistantMessage : msg))
      );
    } catch (error) {
      console.error("Error sending message to AI assistant:", error);
      
      // Create error message
      const errorMessage: Message = {
        id: uuidv4(),
        sender: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date().toISOString(),
        error: true
      };
      
      // Replace loading message with error message
      setMessages((prev) => 
        prev.map((msg) => (msg.isLoading ? errorMessage : msg))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle action button clicks
  const handleActionClick = (action: AssistantWidgetType) => {
    // Track the action click
    trackAssistantActionClicked(action.type, JSON.stringify(action).substring(0, 100));
    
    // Process the action
    handleAction(action);
    
    // Close assistant after action (optional)
    // onClose();
  };

  // Render message bubbles
  const renderMessageBubble = (message: Message) => {
    const isUser = message.sender === "user";
    
    return (
      <div 
        key={message.id}
        className={cn(
          "flex w-full mb-4",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        <div 
          className={cn(
            "max-w-[80%] rounded-lg px-4 py-2",
            isUser 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
              : "bg-gray-100 dark:bg-gray-800",
            message.isLoading && "animate-pulse",
            message.error && "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
          )}
        >
          {message.isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
            </div>
          ) : (
            <div>
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {/* Render action widget if available */}
              {message.widgetData && renderActionWidget(message.widgetData)}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render action widget based on type
  const renderActionWidget = (action: AssistantWidgetType) => {
    switch (action.type) {
      case "recommend_plan":
        return renderRecommendPlanWidget(action);
      case "navigate_to_page":
        return renderNavigateWidget(action);
      case "compare_plans":
        return renderComparePlansWidget(action);
      case "explain_term":
        return renderExplainTermWidget(action);
      default:
        return null;
    }
  };

  // Widget renderers for different action types
  const renderRecommendPlanWidget = (action: RecommendPlanAction) => (
    <div className="mt-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-3">
      <h4 className="font-semibold text-sm mb-2">Recommended Plan</h4>
      <p className="text-xs mb-2">Category: {action.category}</p>
      <p className="text-xs mb-3">Plan ID: {action.planId}</p>
      <Button 
        size="sm" 
        className="w-full text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        onClick={() => handleActionClick(action)}
      >
        View Plan Details
      </Button>
    </div>
  );

  const renderNavigateWidget = (action: NavigateToPageAction) => (
    <div className="mt-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-3">
      <h4 className="font-semibold text-sm mb-2">Suggested Navigation</h4>
      <p className="text-xs mb-3">Would you like to go to {action.label}?</p>
      <Button 
        size="sm" 
        className="w-full text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        onClick={() => handleActionClick(action)}
      >
        Go to {action.label}
      </Button>
    </div>
  );

  const renderComparePlansWidget = (action: ComparePlansAction) => (
    <div className="mt-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-3">
      <h4 className="font-semibold text-sm mb-2">Compare Plans</h4>
      <p className="text-xs mb-2">Category: {action.category}</p>
      <p className="text-xs mb-3">Compare {action.planIds.length} plans</p>
      <Button 
        size="sm" 
        className="w-full text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        onClick={() => handleActionClick(action)}
      >
        Compare Plans
      </Button>
    </div>
  );

  const renderExplainTermWidget = (action: ExplainTermAction) => (
    <div className="mt-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-3">
      <h4 className="font-semibold text-sm mb-2">Insurance Term: {action.term}</h4>
      <p className="text-xs mb-2">{action.explanation}</p>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 md:right-8 z-50 w-[95%] sm:w-[450px] max-h-[600px] flex flex-col shadow-2xl rounded-lg">
      <Card className="flex flex-col h-[500px] border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Briki AI Assistant</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map(renderMessageBubble)}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  </div>
  );
}