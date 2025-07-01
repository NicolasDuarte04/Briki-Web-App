import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function QuoteConfirmationPage() {
  const [quoteReference, setQuoteReference] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get the quote reference from history state
    const state = window.history.state;
    if (state?.quoteReference) {
      setQuoteReference(state.quoteReference);
    } else {
      toast({
        title: "Error",
        description: "Quote reference not found. Please submit a new quote request.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto p-8">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold">Quote Request Confirmed!</h1>
          
          {quoteReference ? (
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Your quote request has been submitted successfully.
              </p>
              
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Quote Reference:</p>
                <p className="text-xl font-mono">{quoteReference}</p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Please save this reference number for future inquiries.
                Our team will review your request and get back to you shortly.
              </p>
            </div>
          ) : (
            <p className="text-lg text-muted-foreground">
              There was a problem retrieving your quote reference.
              Please try submitting your quote again.
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild>
              <Link href="/get-quote">Request Another Quote</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}