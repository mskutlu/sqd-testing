import { TestEnvironment } from '../src/core/TestEnvironment';
import { EventBuilder } from '../src/builders/EventBuilder';

describe('Basic Indexing Tests', () => {
let env: TestEnvironment;

beforeEach(() => {
  env = new TestEnvironment();
});

test('should process basic transfer events', async () => {
  const event1 = new EventBuilder()
    .block(1)
    .withAddress('0x123')
    .withData({ type: 'Transfer', amount: 100 })
    .build();

  const event2 = new EventBuilder()
    .block(2)
    .withAddress('0x123')
    .withData({ type: 'Transfer', amount: 50 })
    .build();

  await env.mockEvent(event1);
  await env.mockEvent(event2);
  await env.runIndexer();

  await env.assertState({
    events: [
      { blockNumber: 1, data: { type: 'Transfer', amount: 100 } },
      { blockNumber: 2, data: { type: 'Transfer', amount: 50 } }
    ]
  });
});
});