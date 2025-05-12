import React from 'react';
import { Bot, SparklesIcon, BookOpen, Lightbulb, Trophy, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { ChatInterface, TermExplainer, PlanRecommender } from '@/components/ai-assistant';
import { AIAssistantButton } from '@/components/layout';

/**
 * Demo page showing all AI assistant features
 */
export default function AIAssistantDemo() {
  return (
    <div className="container py-10 space-y-10 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="inline-block p-4 rounded-full bg-primary/10 mb-2">
          <Bot size={40} className="text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Briki AI Assistant</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your intelligent companion for navigating the world of insurance
        </p>
      </motion.div>

      <Separator />
      
      <Tabs defaultValue="chat" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="space-x-2">
            <Bot size={16} />
            <span>Chat Assistant</span>
          </TabsTrigger>
          <TabsTrigger value="recommender" className="space-x-2">
            <Trophy size={16} />
            <span>Plan Recommender</span>
          </TabsTrigger>
          <TabsTrigger value="terms" className="space-x-2">
            <BookOpen size={16} />
            <span>Term Explainer</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive AI Chat</CardTitle>
              <CardDescription>
                Chat with our AI assistant to get answers to your insurance questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] border rounded-lg overflow-hidden bg-background/50">
                <ChatInterface placement="inline" showClose={false} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Powered by Briki AI using advanced AI models
              </div>
              <AIAssistantButton displayVariant="text" label="Open Floating Chat" />
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommender" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Plan Recommender</CardTitle>
              <CardDescription>
                Get personalized insurance recommendations based on your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanRecommender />
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lightbulb size={14} className="text-yellow-500" />
                <span>Our AI analyzes criteria to find the best options for you</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="terms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Term Explainer</CardTitle>
              <CardDescription>
                Understand insurance terminology with simple, clear explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TermExplainer 
                presetTerms={[
                  "Premium", 
                  "Deductible", 
                  "Coinsurance", 
                  "Copay", 
                  "Exclusion", 
                  "Claim"
                ]} 
              />
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen size={14} />
                <span>Learn about any insurance term with AI-powered explanations</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot size={18} className="text-primary" />
              Chat Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Get instant answers to your insurance questions with our 
              conversational AI assistant available 24/7.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon size={18} className="text-primary" />
              Smart Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Our AI analyzes your specific needs to recommend the most suitable 
              insurance plans across multiple categories.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              Insurance Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Understand complex insurance terminology with simple, 
              straightforward explanations tailored to your questions.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground mb-4">
          Try our AI assistant now by clicking the button below
        </p>
        <AIAssistantButton 
          variant="text" 
          label="Launch AI Assistant" 
          className="mx-auto"
          size="lg"
        />
      </div>
    </div>
  );
}