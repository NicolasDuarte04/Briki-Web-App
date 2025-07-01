import React from "react";
import QuoteForm from "../components/quote/QuoteForm";
import { useAuth } from "../hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function GetQuotePage() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Get Insurance Quote</h1>
      <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
        Fill out the form below to receive personalized insurance quotes tailored to your specific needs.
        Our experts will review your information and provide you with competitive options.
      </p>
      <QuoteForm />
    </div>
  );
}