import { stat } from 'fs';
import mongoose, { Schema, Document } from 'mongoose';

export interface MonitorProps {
  userId: string,
  monitorUrl: string,
  alertCondition: AlertCondition,
}

export interface MonitorDoc extends Document {
  userId: string,
  monitorUrl: string,
  interval: number,
  lastChecked: Date,
  createdAt: Date,
  updatedAt: Date,
  alertCondition: AlertCondition,
  status: Boolean,
  contacts: ContactDoc[],
}

export interface ContactProps {
  priorityOrder: number,
  email: string,
}

export interface ContactDoc extends Document {
  priorityOrder: number,
  email: string,
  createdAt: Date,
  updatedAt: Date,
}

export type AlertCondition = 'IS500' | 'ISUNAVAILABLE' | 'IS404' | 'IS501' | 'ISNOT200';

const contactSchema: Schema = new Schema({
  priorityOrder: { type: Number, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const monitorSchema: Schema = new Schema({
  userId: { type: String, required: true },
  status: { type: Boolean, required: true, default: true },
  monitorUrl: { type: String, required: true },
  interval: { type: Number, required: true, default: 180},
  lastChecked: { type: Date, default: Date.now },
  alertCondition: { type: String, enum: ['IS500', 'ISUNAVAILABLE', 'IS404', 'IS501', 'ISNOT200'], default: 'IS500' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  contacts: [ contactSchema ],
});

const Monitor = mongoose.model<MonitorDoc>('Monitors', monitorSchema);

export default Monitor;