import { BlockEvent } from '../types';

export class EventBuilder {
private event: Partial<BlockEvent> = {};

block(number: number) {
  this.event.block = number;
  return this;
}

withAddress(address: string) {
  this.event.address = address;
  return this;
}

withData(data: any) {
  this.event.data = data;
  return this;
}

build(): BlockEvent {
  if (!this.event.block || !this.event.address || !this.event.data) {
    throw new Error('Incomplete event');
  }
  return this.event as BlockEvent;
}
}