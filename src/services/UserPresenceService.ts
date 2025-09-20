import type { IUser, IUserPresenceService } from '../types/interfaces';

export class UserPresenceService implements IUserPresenceService {
  private users: Record<string, IUser> = {};

  joinUser(user: IUser): void {
    this.users[user.id] = { ...user, lastActivity: Date.now() };
  }

  leaveUser(userId: string): void {
    delete this.users[userId];
  }

  updateUserActivity(userId: string, activity: number): void {
    if (this.users[userId]) {
      this.users[userId].lastActivity = activity;
    }
  }

  getActiveUsers(): IUser[] {
    return Object.values(this.users);
  }

  getUserById(userId: string): IUser | undefined {
    return this.users[userId];
  }

  updateUser(user: IUser): void {
    if (this.users[user.id]) {
      this.users[user.id] = { ...this.users[user.id], ...user };
    }
  }

  cleanupInactiveUsers(timeoutMs: number = 300000): void {
    const now = Date.now();
    Object.keys(this.users).forEach(userId => {
      if (now - this.users[userId].lastActivity > timeoutMs) {
        delete this.users[userId];
      }
    });
  }
}
