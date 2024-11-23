# Building a Better Matchstick: Framework Analysis for SQD

## TheGraph's Matchstick: Lessons Learned

### What Worked Well
1. **WASM Runtime Integration**
   - Direct integration with Graph Node's WASM runtime
   - Accurate simulation of subgraph execution
   - Source: [Matchstick Architecture](https://github.com/LimeChain/matchstick/blob/main/docs/architecture.md)

2. **Test Fixtures**
   - Predefined test data sets
   - Easy setup of complex contract states
   - Example: [Test Fixtures Documentation](https://thegraph.com/docs/en/developing/unit-testing-framework/#test-fixtures)

3. **Contract Mocking**
   - Comprehensive contract state simulation
   - Function call interception
   - Source: [Contract Mocking Guide](https://thegraph.com/docs/en/developing/unit-testing-framework/#contract-calls)

### Pain Points and Limitations
1. **Complex Setup Process**
   ```typescript
   // Matchstick requires verbose setup
   import { newMockEvent } from "matchstick-as/assembly/index"
   import { ethereum } from "@graphprotocol/graph-ts"
   
   let newEvent = newMockEvent()
   newEvent.parameters = new Array()
   // ... many more lines of boilerplate
   ```

2. **Performance Issues**
   - Slow test execution for large test suites
   - Memory leaks in long-running tests
   - Resource: [Known Issues](https://github.com/LimeChain/matchstick/issues)

3. **Limited State Management**
   - No built-in snapshot/rollback
   - Difficult to test complex state transitions
   - Manual state cleanup required

4. **Debugging Challenges**
   - Limited error messages
   - No step-by-step debugging
   - Difficult to trace state changes

## Improvements from Other Frameworks

### Ponder's Innovations
1. **Simplified Test Setup**
   ```typescript
   // Ponder's approach
   import { createTest } from "@ponder/test";
   
   const { test } = createTest({
     contracts: {
       token: "./abis/Token.json",
     },
   });
   
   test("transfer event", async ({ token, assert }) => {
     await token.transfer("0x123", 100);
     assert.eventEmitted("Transfer");
   });
   ```
   Source: [Ponder Testing Guide](https://ponder.sh/docs/testing)

2. **Real-time State Updates**
   - Immediate state reflection
   - Built-in state diffing
   - Performance optimizations

3. **Type Safety**
   - Full TypeScript integration
   - Compile-time contract type checking
   - Auto-generated types from ABIs

### Envio's Contributions
1. **DSL for Testing**
   ```typescript
   // Envio's declarative approach
   defineTest({
     given: {
       block: 1000000,
       contract: "Token",
       state: {
         balances: { "0x123": 1000 }
       }
     },
     when: {
       event: "Transfer",
       args: ["0x123", "0x456", 100]
     },
     then: {
       state: {
         balances: {
           "0x123": 900,
           "0x456": 100
         }
       }
     }
   });
   ```
   Source: [Envio Testing DSL](https://docs.envio.dev/docs/testing)

2. **Declarative State Management**
   - State transitions as data
   - Easy to understand test cases
   - Automatic state validation

## Proposed Improvements for SQD

### 1. Enhanced Test Environment
```typescript
// Proposed SQD testing API
import { createTestEnv } from "@sqd/testing";

const env = await createTestEnv({
  // Automatic ABI loading and type generation
  contracts: ["./abis/*.json"],
  // Built-in state management
  state: {
    startBlock: 1000000,
    // Optional fixture loading
    fixtures: "./fixtures"
  }
});

test("transfer handling", async () => {
  // Fluent API for event creation
  await env.mockEvent()
    .contract("Token")
    .method("transfer")
    .args(["0x123", 100])
    .emit();

  // Rich assertions
  await env.assert({
    state: {
      balances: {
        "0x123": 900
      }
    },
    events: [{
      name: "Transfer",
      args: ["0x123", "0x456", 100]
    }]
  });
});
```

### 2. Advanced State Management
```typescript
// State snapshots with metadata
const snapshot = await env.snapshot({
  description: "Before transfer",
  includeContracts: ["Token"],
  includeStorage: true
});

try {
  // Test complex scenarios
  await env.mockMultipleEvents([
    // Batch event creation
    { contract: "Token", method: "approve", args: [...] },
    { contract: "Token", method: "transfer", args: [...] }
  ]);
} finally {
  // Automatic rollback
  await snapshot.restore();
}
```

### 3. Debugging Tools
```typescript
// Debug mode with detailed logging
const env = await createTestEnv({
  debug: {
    // Trace all state changes
    traceState: true,
    // Log all contract calls
    traceContracts: true,
    // Custom formatters
    formatters: {
      Transfer: (event) => `Transfer: ${event.args[0]} -> ${event.args[1]}`
    }
  }
});

// Time travel with state validation
await env.timeTravel({
  blocks: 100,
  validateState: true,
  onStateChange: (diff) => console.log("State changed:", diff)
});
```

### 4. Performance Optimizations
1. **Parallel Test Execution**
   ```typescript
   // Isolated test environments
   describe.parallel("Token tests", () => {
     test.each([
       ["transfer", 100],
       ["approve", 200]
     ])("%s with amount %d", async (method, amount) => {
       const env = await createTestEnv();
       // Each test runs in isolation
     });
   });
   ```

2. **Smart State Management**
   - Incremental state updates
   - Lazy state loading
   - Efficient storage of large states

## Implementation Strategy

### Phase 1: Core Framework
1. **Test Environment**
   - Basic event mocking
   - State management
   - Contract simulation

2. **Type System**
   - ABI parsing
   - Type generation
   - Runtime type checking

### Phase 2: Advanced Features
1. **State Management**
   - Snapshots
   - Time travel
   - State diffing

2. **Debugging Tools**
   - State tracing
   - Event logging
   - Error reporting

### Phase 3: Performance
1. **Optimization**
   - Parallel execution
   - Memory management
   - Cache strategies

2. **Tooling**
   - VS Code integration
   - Test generators
   - Documentation

## References

### Framework Documentation
- [Matchstick Deep Dive](https://thegraph.com/docs/en/developing/unit-testing-framework/)
- [Ponder Testing Guide](https://ponder.sh/docs/testing)
- [Envio Documentation](https://docs.envio.dev)

### Related Resources
- [AssemblyScript Testing](https://www.assemblyscript.org/testing.html)
- [Ethereum Testing Best Practices](https://ethereum.org/en/developers/docs/smart-contracts/testing/)
- [WASM Testing Strategies](https://webassembly.org/docs/testing/)
