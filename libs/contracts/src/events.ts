export enum KafkaTopics {
  ACTIVATION_REQUESTED = 'activation.requested',
  BILLING_EVENTS = 'billing.events',
  PROVISIONING_EVENTS = 'provisioning.events',
  ACTIVATION_EVENTS = 'activation.events',
}

export enum EventTypes {
  ACTIVATION_REQUESTED = 'ActivationRequested',
  BILLING_ACCOUNT_CREATED = 'BillingAccountCreated',
  BILLING_FAILED = 'BillingFailed',
  BILLING_ACCOUNT_CANCELLED = 'BillingAccountCancelled',
  PROVISIONING_COMPLETED = 'ProvisioningCompleted',
  PROVISIONING_FAILED = 'ProvisioningFailed',
  ACTIVATION_COMPLETED = 'ActivationCompleted',
  ACTIVATION_FAILED = 'ActivationFailed',
}

export type FailureSimulation = 'none' | 'billing' | 'provisioning';

export interface EventEnvelope<T = any> {
  eventId: string;
  eventType: string;
  version: number;
  occurredAt: string;
  correlationId: string; // activationId
  customerId: string;
  source: string;
  payload: T;
}

export interface ActivationRequestedPayload {
  planId: string;
  channel: string;
  simulateFailure: FailureSimulation;
}

export interface BillingAccountCreatedPayload {
  accountId: string;
  initialBalance: number;
}

export interface BillingFailedPayload {
  reason: string;
  errorCode: string;
}

export interface BillingAccountCancelledPayload {
  accountId?: string;
  reason: string;
}

export interface ProvisioningCompletedPayload {
  serviceInstanceId: string;
  accessCredentials?: {
    username: string;
    profile: string;
  };
}

export interface ProvisioningFailedPayload {
  reason: string;
  errorCode: string;
}

export interface ActivationCompletedPayload {
  planId: string;
  activatedAt: string;
}

export interface ActivationFailedPayload {
  planId: string;
  failedStep: 'billing' | 'provisioning';
  reason: string;
}
