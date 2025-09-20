import type { IMessageHandler, IMessage } from '../types/interfaces';
import { MessageService } from '../services/MessageService';

export class MessageHandler implements IMessageHandler {
  private messageService: MessageService;

  constructor(messageService: MessageService) {
    this.messageService = messageService;
  }

  canHandle(messageType: string): boolean {
    return ['message', 'delete-message'].includes(messageType);
  }

  handle(event: any): void {
    if (!event || !event.type || event.message === undefined) {
      return;
    }

    switch (event.type) {
      case 'message':
        this.handleNewMessage(event.message);
        break;
      case 'delete-message':
        this.handleDeleteMessage(event.message);
        break;
    }
  }

  private handleNewMessage(message: IMessage): void {
    this.messageService.addMessage(message);
  }

  private handleDeleteMessage(messageId: string): void {
    this.messageService.removeMessage(messageId);
  }
}
