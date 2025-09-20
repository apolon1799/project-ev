import type { IMessage, IMessageService } from '../types/interfaces';

export class MessageService implements IMessageService {
  private messages: IMessage[] = [];

  sendMessage(
    content: string, 
    userId: string, 
    userName: string, 
    userColor: string, 
    expiresInMinutes?: number
  ): IMessage {
    const message: IMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      content: content.trim(),
      timestamp: Date.now(),
      color: userColor,
      ...(expiresInMinutes && { expiresAt: Date.now() + (expiresInMinutes * 60 * 1000) })
    };

    this.messages.push(message);
    return message;
  }

  deleteMessage(messageId: string): void {
    this.messages = this.messages.filter(m => m.id !== messageId);
  }

  getMessages(): IMessage[] {
    return [...this.messages];
  }

  cleanupExpiredMessages(): void {
    const now = Date.now();
    this.messages = this.messages.filter(msg => 
      !msg.expiresAt || msg.expiresAt > now
    );
  }

  addMessage(message: IMessage): void {
    const exists = this.messages.some(m => m.id === message.id);
    if (!exists) {
      this.messages.push(message);
    }
  }

  removeMessage(messageId: string): void {
    this.messages = this.messages.filter(m => m.id !== messageId);
  }
}
