import { TestEnvironment } from '../src/core/TestEnvironment';
import { EventBuilder } from '../src/builders/EventBuilder';

describe('Rollback Tests', () => {
  let env: TestEnvironment;

  beforeEach(() => {
    env = new TestEnvironment();
  });

  test('should handle state rollback', async () => {
    // Initial state with first event
    const event1 = new EventBuilder()
      .block(1)
      .withAddress('0x123')
      .withData({ type: 'Transfer', amount: 100 })
      .build();

    await env.mockEvent(event1);
    await env.runIndexer();

    // Save initial state
    const initialState = await env.getState();

    // Add second event
    const event2 = new EventBuilder()
      .block(2)
      .withAddress('0x123')
      .withData({ type: 'Transfer', amount: 50 })
      .build();

    await env.mockEvent(event2);
    await env.runIndexer();

    // Verify current state has both events
    await env.assertState({
      events: [
        { blockNumber: 1, data: { type: 'Transfer', amount: 100 } },
        { blockNumber: 2, data: { type: 'Transfer', amount: 50 } }
      ]
    });

    // Rollback to initial state
    await env.setState(initialState);

    // Verify state is back to initial
    await env.assertState({
      events: [
        { blockNumber: 1, data: { type: 'Transfer', amount: 100 } }
      ]
    });
  });
});