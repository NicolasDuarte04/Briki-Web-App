import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/use-auth';
import { fetchConversationHistory, fetchConversation } from '../services/openai-service';
import { ConversationPreviewCard } from '../components/briki-ai-assistant/ConversationPreviewCard';
import { ScrollArea } from '../components/ui/scroll-area';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Loader2, History, MessageCircle, ArrowLeft, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { ChatBubble } from '../components/briki-ai-assistant/ChatBubble';

interface Conversation {
  id: number;
  input: string;
  output?: string;
  category?: string;
  timestamp: string;
}

interface ConversationDetail {
  conversation: Conversation;
  contextSnapshots: any[];
}

export default function ConversationHistoryPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<ConversationDetail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const loadConversations = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await fetchConversationHistory(page, 20);
      setConversations(data.conversations);
      setPagination(data.pagination);
    } catch (error: any) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadConversationDetail = async (conversationId: number) => {
    try {
      const data = await fetchConversation(conversationId);
      setSelectedConversation(data);
      setDialogOpen(true);
    } catch (error: any) {
      console.error('Error loading conversation detail:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation details. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  const handlePageChange = (newPage: number) => {
    loadConversations(newPage);
  };

  const handleRefresh = () => {
    loadConversations(pagination.page);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign in Required
            </h2>
            <p className="text-gray-600 mb-4">
              You need to be signed in to view your conversation history.
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00C7C4] to-[#0077B6] flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Conversation History
                </h1>
                <p className="text-gray-600">
                  View your past conversations with Briki AI
                </p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-sm">
                    Total: {pagination.totalCount} conversations
                  </Badge>
                  {pagination.totalPages > 1 && (
                    <Badge variant="outline" className="text-sm">
                      Page {pagination.page} of {pagination.totalPages}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Welcome back, {user?.username || 'User'}!
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#0077B6]" />
              <span className="ml-3 text-gray-600">Loading conversations...</span>
            </div>
          ) : conversations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No conversations yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start chatting with Briki AI to see your conversation history here.
                </p>
                <Button onClick={() => window.location.href = '/ask-briki-ai'}>
                  Start New Conversation
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ConversationPreviewCard
                    id={conversation.id}
                    input={conversation.input}
                    output={conversation.output}
                    category={conversation.category}
                    timestamp={conversation.timestamp}
                    onClick={loadConversationDetail}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {pagination.totalPages > 1 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-2"
          >
            <Button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2 mx-4">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    variant={pageNum === pagination.page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              variant="outline"
              size="sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Conversation Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Conversation Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedConversation && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                {/* User Message */}
                <ChatBubble
                  role="user"
                  content={selectedConversation.conversation.input}
                  timestamp={new Date(selectedConversation.conversation.timestamp)}
                />
                
                {/* Assistant Response */}
                {selectedConversation.conversation.output && (
                  <ChatBubble
                    role="assistant"
                    content={selectedConversation.conversation.output}
                    timestamp={new Date(selectedConversation.conversation.timestamp)}
                  />
                )}

                {/* Context Information */}
                {selectedConversation.contextSnapshots.length > 0 && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-sm">Context Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs text-gray-600 overflow-auto">
                        {JSON.stringify(selectedConversation.contextSnapshots[0]?.memoryJson, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 