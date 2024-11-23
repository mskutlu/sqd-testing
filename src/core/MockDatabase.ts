export class MockDatabase {
  private state: Map<string, any[]> = new Map();

  async save(collection: string, data: any) {
    if (!this.state.has(collection)) {
      this.state.set(collection, []);
    }
    this.state.get(collection)!.push(data);
  }

  async getState() {
    const state: Record<string, any> = {};
    for (const [key, value] of this.state.entries()) {
      state[key] = value;
    }
    return state;
  }

  async setState(newState: Record<string, any>) {
    this.state.clear();
    for (const [key, value] of Object.entries(newState)) {
      if (Array.isArray(value)) {
        this.state.set(key, [...value]); // Create a new array with the values
      }
    }
  }

  async clear() {
    this.state.clear();
  }
}