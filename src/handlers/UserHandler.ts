import type { IUserHandler, IUser } from '../types/interfaces';
import { UserPresenceService } from '../services/UserPresenceService';

export class UserHandler implements IUserHandler {
  private userService: UserPresenceService;

  constructor(userService: UserPresenceService) {
    this.userService = userService;
  }

  canHandle(eventType: string): boolean {
    return ['user-join', 'user-leave', 'user-update', 'typing'].includes(eventType);
  }

  handle(event: any): void {
    if (!event || !event.type || event.message === undefined) {
      return;
    }

    switch (event.type) {
      case 'user-join':
        this.handleUserJoin(event.message);
        break;
      case 'user-leave':
        this.handleUserLeave(event.message);
        break;
      case 'user-update':
        this.handleUserUpdate(event.message);
        break;
      case 'typing':
        this.handleTyping(event.message);
        break;
    }
  }

  private handleUserJoin(user: IUser): void {
    this.userService.joinUser(user);
  }

  private handleUserLeave(userData: { id: string }): void {
    this.userService.leaveUser(userData.id);
  }

  private handleUserUpdate(user: IUser): void {
    this.userService.updateUser(user);
  }

  private handleTyping(typingData: { userId: string; isTyping: boolean }): void {
    const user = this.userService.getUserById(typingData.userId);
    if (user) {
      this.userService.updateUser({ ...user, isTyping: typingData.isTyping });
    }
  }
}
