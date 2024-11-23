# Testing Framework API Documentation

## Core Classes

### TestEnvironment

The main class for setting up and managing test environments.

```typescript
class TestEnvironment {
  // Create a new test environment
  static async create(config?: {
    contracts?: string[];
    startBlock?: number;
    networkConfig?: NetworkConfig;
  }): Promise<TestEnvironment>;

  // Mock an event
  async mockEvent(event: Event): Promise<void>;

  // Create a state snapshot
  async createSnapshot(): Promise<string>;

  // Revert to a previous snapshot
  async revertToSnapshot(snapshotId: string): Promise<void>;

  // Get current state
  async getState(): Promise<State>;

  // Set state (useful for rollbacks)
  async setState(state: State): Promise<void>;

  // Assert state matches expected
  async assertState(expected: StateAssertions): Promise<void>;

  // Mock contract state and behavior
  async mockContract(config: ContractConfig): Promise<MockContract>;

  // Simulate network conditions
  async setNetworkConditions(config: NetworkConfig): Promise<void>;

  // Time travel functionality
  async timeTravel(config: TimeTravelConfig): Promise<void>;
}
```

### EventBuilder

Builder pattern for creating test events.

```typescript
class EventBuilder {
  // Set block number
  block(number: number): this;

  // Set contract address
  withAddress(address: string): this;

  // Set contract function
  withFunction(name: string): this;

  // Set function parameters
  withParams(params: any[]): this;

  // Set event data
  withData(data: any): this;

  // Build the event
  build(): Event;
}
```

### MockContract

Interface for mocked contracts.

```typescript
interface MockContract {
  // Get contract address
  address: string;

  // Mock function return value
  mockFunction(
    name: string,
    params: any[],
    returnValue: any
  ): Promise<void>;

  // Mock contract state
  setState(state: any): Promise<void>;

  // Get current state
  getState(): Promise<any>;
}
```

## Types

### Event
```typescript
interface Event {
  blockNumber: number;
  address: string;
  function?: string;
  params?: any[];
  data?: any;
}
```

### State
```typescript
interface State {
  blockNumber: number;
  contracts: {
    [address: string]: {
      state: any;
      functions: {
        [name: string]: {
          params: any[];
          returnValue: any;
        }
      }
    }
  };
  events: Event[];
}
```

### NetworkConfig
```typescript
interface NetworkConfig {
  blockTime?: number;
  gasPrice?: string;
  chainId?: number;
}
```

### TimeTravelConfig
```typescript
interface TimeTravelConfig {
  blocks?: number;
  seconds?: number;
}
```

## Usage Examples

### Basic Test Setup
```typescript
import { TestEnvironment, EventBuilder } from '@sqd/testing';

describe('Transfer Tests', () => {
  let env: TestEnvironment;

  beforeEach(async () => {
    env = await TestEnvironment.create({
      contracts: ['Token'],
      startBlock: 1000000
    });
  });

  test('should process transfer event', async () => {
    const event = new EventBuilder()
      .block(1000001)
      .withAddress('0x123')
      .withFunction('transfer')
      .withParams(['0x456', '1000'])
      .build();

    await env.mockEvent(event);
    
    await env.assertState({
      events: [{
        blockNumber: 1000001,
        address: '0x123',
        function: 'transfer',
        params: ['0x456', '1000']
      }]
    });
  });
});
```

### Contract State Testing
```typescript
test('should handle contract state changes', async () => {
  const contract = await env.mockContract({
    address: '0x123',
    abi: ERC20_ABI,
    state: {
      balances: {
        '0x456': '1000'
      }
    }
  });

  await contract.mockFunction(
    'balanceOf',
    ['0x456'],
    '1000'
  );

  // Test contract interactions
});
```

### Time Travel Testing
```typescript
test('should handle time-based events', async () => {
  // Setup initial state
  
  // Travel forward 100 blocks
  await env.timeTravel({ blocks: 100 });
  
  // Assert new state
});
```

### Network Condition Testing
```typescript
test('should handle network conditions', async () => {
  await env.setNetworkConditions({
    blockTime: 12,
    gasPrice: '20gwei'
  });

  // Test with specific network conditions
});
```

## Error Handling

The framework throws specific error types for different scenarios:

```typescript
// Invalid state error
throw new TestEnvironmentError('Invalid state transition');

// Contract mock error
throw new MockContractError('Function not mocked');

// Network simulation error
throw new NetworkError('Invalid network configuration');
```

## Best Practices

1. Always clean up resources in `afterEach`:
```typescript
afterEach(async () => {
  await env.cleanup();
});
```

2. Use snapshots for complex state management:
```typescript
const snapshot = await env.createSnapshot();
try {
  // Run tests
} finally {
  await env.revertToSnapshot(snapshot);
}
```

3. Group related tests:
```typescript
describe('Token Events', () => {
  describe('Transfers', () => {
    // Transfer-specific tests
  });

  describe('Approvals', () => {
    // Approval-specific tests
  });
});
```

