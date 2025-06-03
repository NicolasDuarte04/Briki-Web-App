import React from "react";
import { motion } from "framer-motion";
import QuoteForm from "@/components/quote/QuoteForm";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Shield, Clock, CheckCircle } from "lucide-react";

export default function GetQuotePage() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading quote form...</p>
        </div>
      </div>
    );
  }

  const benefits = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your information is protected with bank-level security"
    },
    {
      icon: Clock,
      title: "Quick Process",
      description: "Get quotes in minutes, not hours"
    },
    {
      icon: CheckCircle,
      title: "No Obligations",
      description: "Compare quotes with no commitment required"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 sm:py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Get Your Insurance Quote
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Fill out the form below to receive personalized insurance quotes tailored to your specific needs.
            Our AI-powered system will match you with the best options from top providers.
          </p>

          {/* Benefits section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <QuoteForm />
        </motion.div>
      </div>
    </div>
  );
}