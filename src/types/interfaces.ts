export interface IUser {
  id: string;
  name: string;
  lastActivity: number;
  isTyping: boolean;
  color: string;
}

export interface IMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  expiresAt?: number;
  color: string;
}

export interface ICounterState {
  value: number;
  lastUpdatedBy: string;
  lastUpdatedAt: number;
}

export interface ICollaborativeState {
  users: Record<string, IUser>;
  messages: IMessage[];
  counter: ICounterState;
}

export interface IUserPresenceService {
  joinUser(user: IUser): void;
  leaveUser(userId: string): void;
  updateUserActivity(userId: string, activity: number): void;
  getActiveUsers(): IUser[];
  cleanupInactiveUsers(timeoutMs?: number): void;
}

export interface IMessageService {
  sendMessage(content: string, userId: string, userName: string, userColor: string, expiresInMinutes?: number): IMessage;
  deleteMessage(messageId: string): void;
  getMessages(): IMessage[];
  cleanupExpiredMessages(): void;
}

export interface ICounterService {
  updateCounter(delta: number, userId: string, userName: string): ICounterState;
  resetCounter(): ICounterState;
  getCounterState(): ICounterState;
}

export interface IBroadcastService {
  sendMessage(type: string, payload: any): void;
  onMessage(callback: (message: any) => void): void;
  cleanup(): void;
}

export interface IEventHandler {
  handle(event: any): void;
}

export interface IMessageHandler extends IEventHandler {
  canHandle(messageType: string): boolean;
}

export interface IUserHandler extends IEventHandler {
  canHandle(eventType: string): boolean;
}

export interface ICounterHandler extends IEventHandler {
  canHandle(eventType: string): boolean;
}
