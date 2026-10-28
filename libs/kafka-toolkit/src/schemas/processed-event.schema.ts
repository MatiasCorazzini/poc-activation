import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProcessedEventDocument = ProcessedEvent & Document;

@Schema({ collection: 'processed_events', timestamps: true })
export class ProcessedEvent {
  @Prop({ required: true, unique: true, index: true })
  eventId: string;

  @Prop({ required: true })
  consumerGroup: string;

  @Prop({ required: true })
  eventType: string;

  @Prop({ required: true })
  correlationId: string;

  // TTL index to automatically purge old records after 7 days (604800 seconds)
  @Prop({ default: Date.now, expires: 604800 })
  createdAt?: Date;
}

export const ProcessedEventSchema = SchemaFactory.createForClass(ProcessedEvent);
