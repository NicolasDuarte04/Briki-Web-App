import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Mic, X } from 'lucide-react';
import '@/styles/design-system.css';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm your Briki AI assistant. How can I help you with your insurance needs today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response (would be replaced with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm looking into that for you. As your AI assistant, I can help compare insurance options tailored to your needs.",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="ai-assistant-container">
      {/* Floating Button */}
      <motion.button
        className="ai-assistant-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="AI Assistant"
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-assistant-card"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="ai-assistant-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} />
                <span>Briki AI Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close AI Assistant"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="ai-assistant-body">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-accent-blue text-white'
                        : 'bg-neutral-200 text-text-primary'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-white/70'
                          : 'text-text-tertiary'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="ai-assistant-input">
              <input
                type="text"
                placeholder="Type your question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                className="input-ai"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ''}
                className="button-icon"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
              <button
                className="button-icon"
                aria-label="Voice input"
              >
                <Mic size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant;