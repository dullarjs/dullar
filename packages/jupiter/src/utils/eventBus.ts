class Bus {
  private eventHub = new Map();
  on(eventName: string, callback: Function): void {
    const events = [];
    if (!this.eventHub.has(eventName)) {
      events.push(callback);
    } else {
      events.push(...this.eventHub.get(eventName));
      events.push(callback);
    }
    this.eventHub.set(eventName, events);
  }
  off(eventName: string, callback?: Function): void {
    if (!this.eventHub.has(eventName)) {
      return;
    }
    if (!callback) {
      this.eventHub.delete(eventName);
    } else {
      const events = this.eventHub.get(eventName);
      if (events) {
        events.splice(events.indexOf(callback), 1);
      }
    }
  }
  emit(eventName: string, ...args: any): void {
    if (this.eventHub.has(eventName)) {
      const events = this.eventHub.get(eventName);
      events.forEach((fn: Function, key: number) => {
        fn(...args);
      });
    }
  }
}
export const EventBus = new Bus();