import React from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CalendarClock, ArrowRight } from "lucide-react";

export default function QuoteConfirmationPage() {
  // Get quote reference from location state
  const [, params] = useLocation();
  const { state }: { state?: { quoteReference: string } } = (window as any).history.state || {};
  const quoteReference = state?.quoteReference || "Unknown";

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Quote Submitted Successfully!</CardTitle>
          <CardDescription className="text-lg mt-2">
            Thank you for submitting your insurance quote request
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-medium text-lg mb-2">Quote Reference</h3>
            <p className="text-xl font-bold">{quoteReference}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please save this reference number for your records
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">What happens next?</h3>
            
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-2 rounded-full">
                <CalendarClock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Quote Review</h4>
                <p className="text-muted-foreground">
                  Our insurance specialists will review your application and prepare personalized
                  quotes based on your requirements.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-2 rounded-full">
                <CalendarClock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Contact</h4>
                <p className="text-muted-foreground">
                  A representative will contact you within 24-48 hours to discuss your quote 
                  and answer any questions you may have.
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard">
              <span>Go to Dashboard</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}