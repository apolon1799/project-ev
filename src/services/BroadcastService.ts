import type { IBroadcastService } from '../types/interfaces';

export class BroadcastService implements IBroadcastService {
  private channel: BroadcastChannel | null = null;
  private messageCallbacks: ((message: any) => void)[] = [];

  constructor(channelName: string) {
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel(channelName);
      this.channel.onmessage = (event) => {
        this.messageCallbacks.forEach(callback => callback(event.data));
      };
    }
  }

  sendMessage(type: string, payload: any): void {
    if (this.channel) {
      this.channel.postMessage({ type, message: payload });
    }
  }

  onMessage(callback: (message: any) => void): void {
    this.messageCallbacks.push(callback);
  }

  cleanup(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.messageCallbacks = [];
  }

  isConnected(): boolean {
    return this.channel !== null;
  }
}
