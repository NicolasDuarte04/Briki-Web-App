import React from "react";
import { motion } from "framer-motion";
import { Shield, ExternalLink } from "lucide-react";
import { MockPlan, MockResponse } from "@/utils/mockAssistantResponses";
import { Link } from "wouter";
import PlanRecommendationCard from "./PlanRecommendationCard";
import { Button } from "@/components/ui/button";

interface MockPlansCardProps {
  response: MockResponse;
}

const MockPlansCard: React.FC<MockPlansCardProps> = ({ response }) => {
  return (
    <motion.div 
      className="flex flex-col space-y-2 mt-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      {response.plans.map((plan, index) => (
        <PlanRecommendationCard 
          key={index} 
          plan={plan} 
          index={index}
          animationDelay={0.2 * index} 
        />
      ))}
      
      <motion.div 
        className="mt-4 text-center"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        <Link href={response.cta.href}>
          <Button 
            variant="outline" 
            className="bg-gradient-to-r from-blue-600 to-cyan-500 border-none text-white hover:text-white hover:opacity-90 px-6 py-5 rounded-full"
          >
            <span>{response.cta.label}</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default MockPlansCard;