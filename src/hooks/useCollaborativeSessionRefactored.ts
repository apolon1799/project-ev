import { useState, useEffect, useCallback, useRef } from 'react';
import { useBroadcastChannel } from 'react-broadcast-sync';
import { ServiceFactory } from '../factories/ServiceFactory';
import type { 
  IUser, 
  ICollaborativeState
} from '../types/interfaces';

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

export const useCollaborativeSessionRefactored = () => {
  const [services] = useState(() => ({
    userService: ServiceFactory.createUserPresenceService(),
    messageService: ServiceFactory.createMessageService(),
    counterService: ServiceFactory.createCounterService(),
  }));

  const [handlers] = useState(() => ({
    messageHandler: ServiceFactory.createMessageHandler(services.messageService),
    userHandler: ServiceFactory.createUserHandler(services.userService),
    counterHandler: ServiceFactory.createCounterHandler(services.counterService),
  }));

  const [currentUser] = useState<IUser>(() => ({
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: generateRandomName(),
    lastActivity: Date.now(),
    isTyping: false,
    color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
  }));

  const [state, setState] = useState<ICollaborativeState>({
    users: {},
    messages: [],
    counter: { value: 0, lastUpdatedBy: '', lastUpdatedAt: 0 }
  });

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInitializedRef = useRef(false);

  const { messages, postMessage, clearReceivedMessages, error } = useBroadcastChannel('collaborative-dashboard');

  const sendMessage = useCallback((content: string, expiresInMinutes?: number) => {
    if (!content.trim() || !postMessage) return;

    const message = services.messageService.sendMessage(
      content, 
      currentUser.id, 
      currentUser.name, 
      currentUser.color, 
      expiresInMinutes
    );

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
    
    postMessage('message', message);
  }, [currentUser, postMessage, services.messageService]);

  const deleteMessage = useCallback((messageId: string) => {
    if (!postMessage) return;
    
    services.messageService.deleteMessage(messageId);
    
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(m => m.id !== messageId)
    }));
    
    postMessage('delete-message', messageId);
  }, [postMessage, services.messageService]);

  const updateCounter = useCallback((delta: number) => {
    if (!postMessage) return;
    
    const newState = services.counterService.updateCounter(delta, currentUser.id, currentUser.name);
    
    setState(prev => ({
      ...prev,
      counter: newState
    }));
    
    postMessage('counter-update', {
      value: newState.value,
      lastUpdatedBy: newState.lastUpdatedBy,
      lastUpdatedAt: newState.lastUpdatedAt,
      userId: currentUser.id
    });
  }, [currentUser, postMessage, services.counterService]);

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
    services.userService.updateUserActivity(currentUser.id, Date.now());
    postMessage('user-update', updatedUser);
  }, [currentUser, postMessage, services.userService]);

  useEffect(() => {
    if (messages.length === 0) return;
    
    messages.forEach((msg: any) => {
      if (!msg || !msg.type || msg.message === undefined) return;
      
      // Use handlers based on message type
      if (handlers.messageHandler.canHandle(msg.type)) {
        handlers.messageHandler.handle(msg);
      } else if (handlers.userHandler.canHandle(msg.type)) {
        handlers.userHandler.handle(msg);
      } else if (handlers.counterHandler.canHandle(msg.type)) {
        handlers.counterHandler.handle(msg);
      }
    });
    
    clearReceivedMessages();
  }, [messages, clearReceivedMessages, handlers]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      users: services.userService.getActiveUsers().reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {} as Record<string, IUser>),
      messages: services.messageService.getMessages(),
      counter: services.counterService.getCounterState()
    }));
  }, [services]);

  useEffect(() => {
    if (!postMessage || isInitializedRef.current) return;
    
    isInitializedRef.current = true;
    
    services.userService.joinUser(currentUser);
    
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

    const handleBeforeUnload = () => {
      postMessage('user-leave', { id: currentUser.id });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentUser, updateActivity, postMessage, services.userService]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      services.messageService.cleanupExpiredMessages();
      services.userService.cleanupInactiveUsers();
    }, 60000);

    return () => clearInterval(cleanupInterval);
  }, [services]);

  return {
    users: Object.values(state.users),
    messages: state.messages,
    counter: state.counter,
    currentUser,
    
    sendMessage,
    deleteMessage,
    updateCounter,
    markTyping,
    updateActivity,
    
    isConnected: !!postMessage && !error
  };
};
