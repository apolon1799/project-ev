import { UserPresenceService } from '../services/UserPresenceService';
import { MessageService } from '../services/MessageService';
import { CounterService } from '../services/CounterService';
import { BroadcastService } from '../services/BroadcastService';
import { MessageHandler } from '../handlers/MessageHandler';
import { UserHandler } from '../handlers/UserHandler';
import { CounterHandler } from '../handlers/CounterHandler';
import type { 
  IUserPresenceService, 
  IMessageService, 
  ICounterService, 
  IBroadcastService,
  IMessageHandler,
  IUserHandler,
  ICounterHandler
} from '../types/interfaces';

export class ServiceFactory {
  static createUserPresenceService(): IUserPresenceService {
    return new UserPresenceService();
  }

  static createMessageService(): IMessageService {
    return new MessageService();
  }

  static createCounterService(): ICounterService {
    return new CounterService();
  }

  static createBroadcastService(channelName: string): IBroadcastService {
    return new BroadcastService(channelName);
  }

  static createMessageHandler(messageService: IMessageService): IMessageHandler {
    return new MessageHandler(messageService as MessageService);
  }

  static createUserHandler(userService: IUserPresenceService): IUserHandler {
    return new UserHandler(userService as UserPresenceService);
  }

  static createCounterHandler(counterService: ICounterService): ICounterHandler {
    return new CounterHandler(counterService as CounterService);
  }
}
