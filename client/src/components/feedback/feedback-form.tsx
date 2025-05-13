import React, { useState } from 'react';
import { X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Form schema with validation
const feedbackSchema = z.object({
  rating: z.enum(['1', '2', '3', '4', '5'], {
    required_error: 'Please select an experience rating',
  }),
  uiRating: z.enum(['1', '2', '3', '4', '5'], {
    required_error: 'Please rate the user interface',
  }),
  navigationRating: z.enum(['1', '2', '3', '4', '5'], {
    required_error: 'Please rate the navigation experience',
  }),
  improvement: z.string().min(3, 'Please share at least 3 characters').max(500, 'Maximum 500 characters'),
  featureRequest: z.string().min(3, 'Please share at least 3 characters').max(500, 'Maximum 500 characters'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const defaultValues: Partial<FeedbackFormValues> = {
  rating: '3',
  uiRating: '3',
  navigationRating: '3',
  improvement: '',
  featureRequest: '',
  email: '',
};

interface FeedbackFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackForm({ open, onOpenChange }: FeedbackFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues,
  });

  async function onSubmit(data: FeedbackFormValues) {
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call to store feedback
      // For demo purposes, we'll just log to console and show success
      console.log('Feedback submitted:', data);
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Feedback Submitted!",
        description: "Thank you for helping us improve Briki.",
        variant: "default",
      });
      
      // Reset form
      form.reset(defaultValues);
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-page dark:bg-gradient-page border border-primary/20 dark:border-primary/20 glow-primary sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Share Your Thoughts</DialogTitle>
          <DialogDescription>
            Help us improve Briki by sharing your feedback. This is a pre-launch demo and your input matters!
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Overall Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="font-medium">Overall Experience</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-2"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="flex flex-col items-center">
                          <RadioGroupItem
                            value={num.toString()}
                            id={`rating-${num}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`rating-${num}`}
                            className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                              field.value === num.toString()
                                ? 'bg-gradient-primary text-white scale-110 shadow-md'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                          >
                            {num}
                          </Label>
                          <span className="text-xs mt-1">
                            {num === 1 ? 'Poor' : num === 5 ? 'Great' : ''}
                          </span>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* UI Rating */}
            <FormField
              control={form.control}
              name="uiRating"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="font-medium">User Interface</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-2"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="flex flex-col items-center">
                          <RadioGroupItem
                            value={num.toString()}
                            id={`ui-${num}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`ui-${num}`}
                            className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                              field.value === num.toString()
                                ? 'bg-gradient-secondary text-white scale-110 shadow-md'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                          >
                            {num}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Navigation Rating */}
            <FormField
              control={form.control}
              name="navigationRating"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="font-medium">Navigation Experience</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-2"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="flex flex-col items-center">
                          <RadioGroupItem
                            value={num.toString()}
                            id={`nav-${num}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`nav-${num}`}
                            className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                              field.value === num.toString()
                                ? 'bg-gradient-accent text-white scale-110 shadow-md'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                          >
                            {num}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Improvement Field */}
            <FormField
              control={form.control}
              name="improvement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">What could we improve?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your thoughts on what we could do better" 
                      className="bg-background/90 focus:bg-background" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Feature Request */}
            <FormField
              control={form.control}
              name="featureRequest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">What feature would you like to see?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about features that would enhance your experience" 
                      className="bg-background/90 focus:bg-background" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Email Field (Optional) */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Email (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email for updates" 
                      type="email" 
                      className="bg-background/90 focus:bg-background" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="mt-4 sm:mt-0"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-primary hover:opacity-90 transition-opacity" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Floating Feedback Button Component
export function FloatingFeedbackButton() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full h-14 w-14 p-0 shadow-lg bg-gradient-primary hover:opacity-90 transition-opacity"
        aria-label="Open feedback form"
      >
        <span className="sr-only">Feedback</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="lucide lucide-message-square-heart"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <path d="M14.5 9.5 12 12l-2.5-2.5"/>
          <path d="M14.5 7a2.5 2.5 0 0 0-5 0c0 .5.13.97.37 1.37L12 11l2.13-2.63c.24-.4.37-.87.37-1.37z"/>
        </svg>
      </Button>
      <FeedbackForm open={open} onOpenChange={setOpen} />
    </>
  );
}