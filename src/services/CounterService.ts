import type { ICounterState, ICounterService } from '../types/interfaces';

export class CounterService implements ICounterService {
  private counterState: ICounterState = {
    value: 0,
    lastUpdatedBy: '',
    lastUpdatedAt: 0
  };

  updateCounter(delta: number, _userId: string, userName: string): ICounterState {
    const timestamp = Date.now();
    this.counterState = {
      value: this.counterState.value + delta,
      lastUpdatedBy: userName,
      lastUpdatedAt: timestamp
    };
    return { ...this.counterState };
  }

  resetCounter(): ICounterState {
    const timestamp = Date.now();
    this.counterState = {
      value: 0,
      lastUpdatedBy: this.counterState.lastUpdatedBy,
      lastUpdatedAt: timestamp
    };
    return { ...this.counterState };
  }

  getCounterState(): ICounterState {
    return { ...this.counterState };
  }

  setCounterState(state: ICounterState): void {
    this.counterState = { ...state };
  }
}
