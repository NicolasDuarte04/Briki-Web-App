import React, { useState } from "react";
import { AuthenticatedLayout, ContentWrapper } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export default function AIAssistantScreen() {
  const [message, setMessage] = useState("");

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col h-full min-h-[calc(100vh-6rem)]">
        {/* Header section */}
        <div className="bg-gradient-to-br from-primary/90 to-secondary/90 text-white py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Briki AI Assistant</h1>
            <p className="text-lg opacity-90">
              Ask anything about insurance. We'll guide you step by step.
            </p>
          </div>
        </div>
        
        {/* Main content */}
        <ContentWrapper variant="white" className="flex-1 pb-24">
          <div className="h-full flex flex-col">
            {/* Messages area (placeholder for now) */}
            <div className="flex-1 mb-4 flex items-center justify-center">
              <div className="text-center p-8 max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Your Personal Insurance Assistant
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by asking about insurance plans, coverage details, or how to make a claim. I'm here to help!
                </p>
                <div className="flex flex-col gap-2 text-left">
                  <div className="bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg cursor-pointer">
                    What insurance plans are best for my trip to Japan?
                  </div>
                  <div className="bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg cursor-pointer">
                    How do I compare different auto insurance options?
                  </div>
                  <div className="bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg cursor-pointer">
                    What should I do if I need to file a health insurance claim?
                  </div>
                </div>
              </div>
            </div>
            
            {/* Input area (fixed at bottom) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <div className="container mx-auto max-w-7xl">
                <div className="flex gap-2">
                  <Textarea
                    className="flex-1 resize-none min-h-[50px] max-h-[150px] p-3"
                    placeholder="Type your question here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button 
                    className="self-end bg-gradient-to-br from-primary to-secondary text-white"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ContentWrapper>
      </div>
    </AuthenticatedLayout>
  );
}