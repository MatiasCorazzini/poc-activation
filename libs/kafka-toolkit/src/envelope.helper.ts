import { v4 as uuidv4 } from 'uuid';
import { EventEnvelope } from '@poc/contracts';

export function createEnvelope<T>(params: {
  eventType: string;
  correlationId: string;
  customerId: string;
  source: string;
  payload: T;
  version?: number;
}): EventEnvelope<T> {
  return {
    eventId: uuidv4(),
    eventType: params.eventType,
    version: params.version ?? 1,
    occurredAt: new Date().toISOString(),
    correlationId: params.correlationId,
    customerId: params.customerId,
    source: params.source,
    payload: params.payload,
  };
}
