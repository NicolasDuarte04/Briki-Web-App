import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Send, 
  X,
  Zap,
  Clock,
  Shield
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface FeedbackData {
  type: 'rating' | 'suggestion' | 'bug' | 'feature';
  rating?: number;
  comment: string;
  page: string;
  userAgent: string;
  timestamp: Date;
  sessionId?: string;
}

interface FeedbackWidgetProps {
  page?: string;
  context?: string;
  trigger?: 'floating' | 'inline' | 'modal';
  onFeedbackSubmitted?: (feedback: FeedbackData) => void;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  page = window.location.pathname,
  context = '',
  trigger = 'floating',
  onFeedbackSubmitted
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'initial' | 'rating' | 'comment' | 'success'>('initial');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [feedbackType, setFeedbackType] = useState<'rating' | 'suggestion' | 'bug' | 'feature'>('rating');
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedbackData: FeedbackData) => {
      const response = await apiRequest('POST', '/api/feedback', feedbackData);
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      return response.json();
    },
    onSuccess: () => {
      setStep('success');
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! It helps us improve.",
      });
      // Auto-close after success
      setTimeout(() => {
        setIsOpen(false);
        resetForm();
      }, 2000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setStep('initial');
    setRating(0);
    setComment('');
    setFeedbackType('rating');
    setHoveredStar(0);
  };

  const handleSubmit = () => {
    const feedbackData: FeedbackData = {
      type: feedbackType,
      rating: feedbackType === 'rating' ? rating : undefined,
      comment: comment.trim(),
      page,
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      sessionId: sessionStorage.getItem('sessionId') || undefined
    };

    if (feedbackType === 'rating' && rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim() && feedbackType !== 'rating') {
      toast({
        title: "Comment Required",
        description: "Please provide a comment for your feedback.",
        variant: "destructive",
      });
      return;
    }

    submitFeedbackMutation.mutate(feedbackData);
    onFeedbackSubmitted?.(feedbackData);
  };

  const feedbackTypes = [
    { id: 'rating', label: 'Rate Experience', icon: Star, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'suggestion', label: 'Suggestion', icon: Zap, color: 'bg-blue-100 text-blue-700' },
    { id: 'bug', label: 'Report Bug', icon: Shield, color: 'bg-red-100 text-red-700' },
    { id: 'feature', label: 'Request Feature', icon: Clock, color: 'bg-green-100 text-green-700' }
  ];

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isActive = starNumber <= (hoveredStar || rating);
      
      return (
        <button
          key={starNumber}
          onClick={() => setRating(starNumber)}
          onMouseEnter={() => setHoveredStar(starNumber)}
          onMouseLeave={() => setHoveredStar(0)}
          className={`p-1 transition-colors ${isActive ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
        >
          <Star className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
        </button>
      );
    });
  };

  const renderInitialStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">How can we help?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your feedback helps us improve the Briki experience
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {feedbackTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => {
                setFeedbackType(type.id as any);
                setStep(type.id === 'rating' ? 'rating' : 'comment');
              }}
              className={`p-3 rounded-lg border-2 border-transparent hover:border-blue-200 transition-all ${type.color}`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderRatingStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">Rate Your Experience</h3>
        <p className="text-sm text-gray-600 mb-4">
          How would you rate your experience with Briki?
        </p>
      </div>
      
      <div className="flex justify-center space-x-1 mb-4">
        {renderStars()}
      </div>
      
      {rating > 0 && (
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
          </Badge>
        </div>
      )}
      
      <Textarea
        placeholder="Tell us more about your experience (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[80px]"
      />
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setStep('initial')}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || submitFeedbackMutation.isPending}
          className="flex-1"
        >
          {submitFeedbackMutation.isPending ? 'Submitting...' : 'Submit'}
          <Send className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderCommentStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">
          {feedbackType === 'suggestion' ? 'Share Your Suggestion' :
           feedbackType === 'bug' ? 'Report a Bug' : 'Request a Feature'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Please provide details about your {feedbackType}
        </p>
      </div>
      
      <Textarea
        placeholder={
          feedbackType === 'suggestion' ? 'What could we improve?' :
          feedbackType === 'bug' ? 'Describe the issue you encountered...' :
          'What feature would you like to see?'
        }
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setStep('initial')}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!comment.trim() || submitFeedbackMutation.isPending}
          className="flex-1"
        >
          {submitFeedbackMutation.isPending ? 'Submitting...' : 'Submit'}
          <Send className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <ThumbsUp className="w-6 h-6 text-green-600" />
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Thank You!</h3>
        <p className="text-sm text-gray-600">
          Your feedback has been submitted successfully.
        </p>
      </div>
    </div>
  );

  if (trigger === 'floating') {
    return (
      <>
        {/* Floating Action Button */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <Button
                onClick={() => setIsOpen(true)}
                size="lg"
                className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700"
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Modal */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card className="shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg">Feedback</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {step === 'initial' && renderInitialStep()}
                    {step === 'rating' && renderRatingStep()}
                    {step === 'comment' && renderCommentStep()}
                    {step === 'success' && renderSuccessStep()}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Inline version
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {step === 'initial' && renderInitialStep()}
        {step === 'rating' && renderRatingStep()}
        {step === 'comment' && renderCommentStep()}
        {step === 'success' && renderSuccessStep()}
      </CardContent>
    </Card>
  );
};

export default FeedbackWidget;