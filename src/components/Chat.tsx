import React, { useState, useRef, useEffect } from 'react';
import type { Message, User } from '../hooks/useCollaborativeSession';
import { Send, Trash2, Clock, MessageSquare, Settings } from 'lucide-react';

interface ChatProps {
  messages: Message[];
  users: User[];
  currentUserId: string;
  onSendMessage: (content: string, expiresInMinutes?: number) => void;
  onDeleteMessage: (messageId: string) => void;
  onMarkTyping: (isTyping: boolean) => void;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  users,
  currentUserId,
  onSendMessage,
  onDeleteMessage,
  onMarkTyping
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [expirationMinutes, setExpirationMinutes] = useState<number | ''>('');
  const [showExpirationOptions, setShowExpirationOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const expiresIn = expirationMinutes ? Number(expirationMinutes) : undefined;
    onSendMessage(messageInput, expiresIn);
    setMessageInput('');
    setExpirationMinutes('');
    setShowExpirationOptions(false);
    
    onMarkTyping(false);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    const hasContent = e.target.value.trim().length > 0;
    onMarkTyping(hasContent);
    
    if (hasContent) {
      typingTimeoutRef.current = setTimeout(() => {
        onMarkTyping(false);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleInputBlur = () => {
    onMarkTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isMessageExpired = (message: Message) => {
    return message.expiresAt && message.expiresAt <= Date.now();
  };

  const getTimeUntilExpiry = (message: Message) => {
    if (!message.expiresAt) return null;
    
    const now = Date.now();
    const timeLeft = message.expiresAt - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const typingUsers = users.filter(user => {
    return user.isTyping && 
           user.id !== currentUserId && 
           user.name && 
           user.name.trim() !== '';
  });

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex flex-col h-full">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Real-time Chat</h3>
        </div>
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-green-400 text-sm animate-fade-in">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span>
              {typingUsers.map(user => user.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => {
          const isExpired = isMessageExpired(message);
          const timeLeft = getTimeUntilExpiry(message);
          const isOwnMessage = message.userId === currentUserId;

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group animate-fade-in`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl relative ${
                  isOwnMessage
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                } ${isExpired ? 'opacity-50' : ''} group-hover:scale-105 transition-all duration-200`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: message.color }}
                  />
                  <span className="text-sm font-semibold">
                    {message.userName}
                    {isOwnMessage && ' (You)'}
                  </span>
                  <span className="text-xs opacity-75">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
                
                {message.expiresAt && (
                  <div className="flex items-center gap-2 mt-3 text-xs opacity-75">
                    <Clock className="w-3 h-3" />
                    {isExpired ? (
                      <span className="text-red-300">Expired</span>
                    ) : (
                      <span>Expires in {timeLeft}</span>
                    )}
                  </div>
                )}
                
                {isOwnMessage && !isExpired && (
                  <button
                    onClick={() => onDeleteMessage(message.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    title="Delete message"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-white/50" />
            </div>
            <div className="text-white/60 text-lg">No messages yet</div>
            <div className="text-white/40 text-sm mt-1">Start the conversation!</div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-white/20">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowExpirationOptions(!showExpirationOptions)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
            {showExpirationOptions ? 'Hide' : 'Add'} expiration
          </button>
        </div>
        
        {showExpirationOptions && (
          <div className="mb-4 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl animate-fade-in">
            <label className="text-sm text-purple-200 block mb-2 font-semibold">
              Message expires in (minutes):
            </label>
            <input
              type="number"
              value={expirationMinutes}
              onChange={(e) => setExpirationMinutes(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g., 5"
              min="1"
              max="60"
              className="w-full px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="text-xs text-purple-300 mt-2">
              Leave empty for permanent message
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <textarea
            ref={textareaRef}
            value={messageInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onBlur={handleInputBlur}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none backdrop-blur-sm"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;