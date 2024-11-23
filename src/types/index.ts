export interface BlockEvent {
block: number;
address: string;
data: any;
}

export interface TestState {
readonly snapshot: () => Promise<any>;
readonly restore: (snapshot: any) => Promise<void>;
readonly reset: () => Promise<void>;
}