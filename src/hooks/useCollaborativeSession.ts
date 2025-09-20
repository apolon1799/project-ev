import { useState, useEffect, useCallback, useRef } from 'react';
import { useBroadcastChannel } from 'react-broadcast-sync';

export interface User {
  id: string;
  name: string;
  lastActivity: number;
  isTyping: boolean;
  color: string;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  expiresAt?: number;
  color: string;
}

export interface CounterState {
  value: number;
  lastUpdatedBy: string;
  lastUpdatedAt: number;
}

export interface CollaborativeState {
  users: Record<string, User>;
  messages: Message[];
  counter: CounterState;
}

const USER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const generateRandomName = () => {
  const adjectives = ['Creative', 'Smart', 'Bright', 'Swift', 'Bold', 'Kind', 'Wise', 'Cool', 'Epic', 'Super'];
  const nouns = ['User', 'Coder', 'Builder', 'Maker', 'Thinker', 'Dreamer', 'Explorer', 'Creator', 'Artist', 'Genius'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${Math.floor(Math.random() * 1000)}`;
};

export const useCollaborativeSession = () => {
  const [currentUser] = useState<User>(() => ({
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: generateRandomName(),
    lastActivity: Date.now(),
    isTyping: false,
    color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
  }));

  const [state, setState] = useState<CollaborativeState>({
    users: {},
    messages: [],
    counter: { value: 0, lastUpdatedBy: '', lastUpdatedAt: 0 }
  });

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { messages, postMessage, clearReceivedMessages, error } = useBroadcastChannel('collaborative-dashboard');
  
  const sendMessage = useCallback((content: string, expiresInMinutes?: number) => {
    if (!content.trim() || !postMessage) return;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      content: content.trim(),
      timestamp: Date.now(),
      color: currentUser.color,
      ...(expiresInMinutes && { expiresAt: Date.now() + (expiresInMinutes * 60 * 1000) })
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
    
    postMessage('message', message);
  }, [currentUser, postMessage]);

  const deleteMessage = useCallback((messageId: string) => {
    if (!postMessage) return;
    
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(m => m.id !== messageId)
    }));
    
    postMessage('delete-message', messageId);
  }, [postMessage]);

  const updateCounter = useCallback((delta: number) => {
    if (!postMessage) return;
    
    setState(prev => {
      const newValue = prev.counter.value + delta;
      const timestamp = Date.now();
      
      postMessage('counter-update', {
        value: newValue,
        lastUpdatedBy: currentUser.name,
        lastUpdatedAt: timestamp,
        userId: currentUser.id
      });
      
      return {
        ...prev,
        counter: {
          value: newValue,
          lastUpdatedBy: currentUser.name,
          lastUpdatedAt: timestamp
        }
      };
    });
  }, [currentUser, postMessage]);

  const markTyping = useCallback((isTyping: boolean) => {
    if (!postMessage) return;
    
    postMessage('typing', { 
      userId: currentUser.id, 
      userName: currentUser.name, 
      isTyping 
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        postMessage('typing', { 
          userId: currentUser.id, 
          userName: currentUser.name, 
          isTyping: false 
        });
      }, 3000);
    }
  }, [currentUser, postMessage]);

  const updateActivity = useCallback(() => {
    if (!postMessage) return;
    
    const updatedUser = { ...currentUser, lastActivity: Date.now() };
    postMessage('user-update', updatedUser);
  }, [currentUser, postMessage]);

  useEffect(() => {
    if (messages.length === 0) return;
    
    messages.forEach((msg: any) => {
      if (!msg || !msg.type || msg.message === undefined) {
        return;
      }
      
      switch (msg.type) {
        case 'user-join':
          setState(prev => ({
            ...prev,
            users: {
              ...prev.users,
              [msg.message.id]: msg.message
            }
          }));
          break;
          
        case 'user-leave':
          setState(prev => {
            const { [msg.message.id]: removed, ...remainingUsers } = prev.users;
            return {
              ...prev,
              users: remainingUsers
            };
          });
          break;
          
        case 'user-update':
          setState(prev => ({
            ...prev,
            users: {
              ...prev.users,
              [msg.message.id]: msg.message
            }
          }));
          break;
          
         case 'message':
           setState(prev => {
             const exists = prev.messages.some(m => m.id === msg.message.id);
             if (exists) {
               return prev;
             }
             
             return {
               ...prev,
               messages: [...prev.messages, msg.message]
             };
           });
           break;
          
        case 'delete-message':
          setState(prev => ({
            ...prev,
            messages: prev.messages.filter(m => m.id !== msg.message)
          }));
          break;
          
        case 'counter-update':
          setState(prev => {
            if (msg.message.lastUpdatedAt >= prev.counter.lastUpdatedAt) {
              return {
                ...prev,
                counter: {
                  value: msg.message.value,
                  lastUpdatedBy: msg.message.lastUpdatedBy,
                  lastUpdatedAt: msg.message.lastUpdatedAt
                }
              };
            }
            return prev;
          });
          break;
          
        case 'typing':
          setState(prev => {
            const existingUser = prev.users[msg.message.userId];
            if (!existingUser && msg.message.userId !== currentUser.id) {
              return prev;
            }
            
            return {
              ...prev,
              users: {
                ...prev.users,
                [msg.message.userId]: {
                  ...existingUser,
                  isTyping: msg.message.isTyping
                }
              }
            };
          });
          break;
      }
    });
    
    clearReceivedMessages();
  }, [messages, clearReceivedMessages, currentUser.id]);

  useEffect(() => {
    if (!postMessage) return;
    
    setState(prev => ({
      ...prev,
      users: {
        ...prev.users,
        [currentUser.id]: currentUser
      }
    }));
    
    postMessage('user-join', currentUser);

    heartbeatIntervalRef.current = setInterval(() => {
      updateActivity();
    }, 30000);

    const cleanup = () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };

    const handleBeforeUnload = () => {
      postMessage('user-leave', { id: currentUser.id });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentUser, updateActivity, postMessage]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    users: Object.values(state.users),
    messages: state.messages,
    counter: state.counter,
    currentUser,
    
    // Actions
    sendMessage,
    deleteMessage,
    updateCounter,
    markTyping,
    updateActivity,
    
    isConnected: !!postMessage && !error
  };
};