# TypeScript Test Framework

A comprehensive testing framework with mock database and event handling capabilities.

## Features

- Mock database with snapshot and rollback functionality
- Event context for testing event-driven systems
- Builder pattern for creating test events
- Utility functions for async testing
- TypeScript support with strict typing

## Installation

```bash
npm install
```

## Usage

### Basic Test Setup

```typescript
import { TestEnvironment } from './src/core/TestEnvironment';
import { createTestEnvironment, cleanupTestEnvironment } from './src/utils/testUtils';

describe('Your Test Suite', () => {
  let env: TestEnvironment;

  beforeEach(async () => {
    env = await createTestEnvironment();
  });

  afterEach(async () => {
    await cleanupTestEnvironment(env);
  });

  it('your test case', async () => {
    // Your test code here
  });
});
```

### Using the Mock Database

```typescript
const db = env.getDatabase();
await db.set('key', 'value');
const value = await db.get('key');
```

### Using the Event Context

```typescript
const eventContext = env.getEventContext();
eventContext.on('eventType', async (data) => {
  // Handle event
});
await eventContext.emit('eventType', { data: 'value' });
```

### Using the Event Builder

```typescript
const eventData = EventBuilder.create()
  .with('type', 'test')
  .with('payload', { message: 'hello' })
  .build();
```

## Running Tests

```bash
npm test
```
