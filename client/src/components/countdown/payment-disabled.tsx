import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { BanknoteIcon, AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function PaymentDisabled() {
  const [, navigate] = useLocation();
  
  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="border-yellow-500/30 shadow-glow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.2, 1] }}
                transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4"
              >
                <BanknoteIcon className="h-6 w-6 text-yellow-500" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-2">Payments Disabled</h2>
              <div className="flex items-center justify-center gap-2 mb-4 bg-yellow-500/10 py-2 px-3 rounded-md">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <p className="text-sm text-yellow-500 font-medium">Beta Version</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Payment processing is currently disabled during the beta testing phase. All payment features will be activated upon the official launch of Briki.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-background/50 border border-border/40 rounded-md p-4"
            >
              <p className="text-sm font-medium mb-2">What you can do now:</p>
              <ul className="text-sm text-muted-foreground text-left space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-primary">1</span>
                  </div>
                  <span>Explore insurance plans and their details</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-primary">2</span>
                  </div>
                  <span>Test all app features and navigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-primary">3</span>
                  </div>
                  <span>Provide feedback for improvements</span>
                </li>
              </ul>
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-center pt-2">
            <Button 
              onClick={() => navigate("/")}
              className="w-full gap-2"
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}