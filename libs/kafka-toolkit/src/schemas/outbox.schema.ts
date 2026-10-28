import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OutboxMessageDocument = OutboxMessage & Document;

@Schema({ collection: 'outbox', timestamps: true })
export class OutboxMessage {
  @Prop({ required: true, unique: true, index: true })
  eventId: string;

  @Prop({ required: true, index: true })
  topic: string;

  @Prop({ required: true })
  key: string;

  @Prop({ type: Object, required: true })
  payload: any;

  @Prop({ required: true, default: 'PENDING', index: true })
  status: 'PENDING' | 'SENT' | 'FAILED';

  @Prop({ default: 0 })
  retryCount: number;

  @Prop()
  error?: string;
}

export const OutboxMessageSchema = SchemaFactory.createForClass(OutboxMessage);
