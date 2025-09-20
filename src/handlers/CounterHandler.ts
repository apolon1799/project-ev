import type { ICounterHandler } from '../types/interfaces';
import { CounterService } from '../services/CounterService';

export class CounterHandler implements ICounterHandler {
  private counterService: CounterService;

  constructor(counterService: CounterService) {
    this.counterService = counterService;
  }

  canHandle(eventType: string): boolean {
    return ['counter-update', 'counter-reset'].includes(eventType);
  }

  handle(event: any): void {
    if (!event || !event.type || event.message === undefined) {
      return;
    }

    switch (event.type) {
      case 'counter-update':
        this.handleCounterUpdate(event.message);
        break;
      case 'counter-reset':
        this.handleCounterReset();
        break;
    }
  }

  private handleCounterUpdate(updateData: { 
    value: number; 
    lastUpdatedBy: string; 
    lastUpdatedAt: number; 
  }): void {
    this.counterService.setCounterState(updateData);
  }

  private handleCounterReset(): void {
    this.counterService.resetCounter();
  }
}
