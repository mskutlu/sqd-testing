import { BlockEvent } from '../types';
export const testUtils = {
async repeatTest(times: number, fn: () => Promise<void>) {
  for (let i = 0; i < times; i++) {
    try {
      await fn();
    } catch (e) {
      throw new Error(`Test failed on iteration ${i}: ${e}`);
    }
  }
},

async assertEventSequence(
  events: BlockEvent[],
  expectedSequence: any[]
) {
  const eventData = events.map(e => e.data);
  if (JSON.stringify(eventData) !== JSON.stringify(expectedSequence)) {
    throw new Error('Event sequence mismatch');
  }
}
};