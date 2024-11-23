import { BlockEvent } from '../types';
import { MockDatabase } from './MockDatabase';

export class EventContext {
constructor(public event: BlockEvent, public db: MockDatabase) {}
}