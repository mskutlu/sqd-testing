import { MockDatabase } from './MockDatabase';
import { BlockEvent } from '../types';
import { EventContext } from './EventContext';

export class TestEnvironment {
protected db: MockDatabase;
protected events: BlockEvent[] = [];

constructor() {
  this.db = new MockDatabase();
}

async mockEvent(event: BlockEvent) {
  this.events.push(event);
  return this;
}

async runIndexer() {
  await this.db.clear(); // Clear the database before processing events
  for (const event of this.events) {
    await this.processEvent(event);
  }
}

private async processEvent(event: BlockEvent) {
  const ctx = new EventContext(event, this.db);
  await this.db.save('events', {
    blockNumber: event.block,
    data: event.data
  });
}

async assertState(expectedState: any) {
  const currentState = await this.db.getState();
  if (JSON.stringify(currentState) !== JSON.stringify(expectedState)) {
    throw new Error(`State mismatch: 
      Expected: ${JSON.stringify(expectedState)}
      Got: ${JSON.stringify(currentState)}`);
  }
}

async getState() {
  return await this.db.getState();
}

async setState(state: any) {
  this.events = []; // Clear the events array
  await this.db.setState(state);
}

async reset() {
  this.events = [];
  await this.db.clear();
}
}