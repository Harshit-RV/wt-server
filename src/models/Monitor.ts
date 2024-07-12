import mongoose, { Schema, Document } from 'mongoose';

export interface MonitorProps {
  userId: string,
  monitorUrl: string
}

export interface MonitorDoc extends Document {
  userId: string,
  monitorUrl: string,
  interval: number,
  lastChecked: Date,
  createdAt: Date,
  updatedAt: Date,
}

const monitorSchema: Schema = new Schema({
  userId: { type: String, required: true },
  monitorUrl: { type: String, required: true },
  interval: { type: Number, required: true, default: 120},
  lastChecked: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Monitor = mongoose.model<MonitorDoc>('Monitors', monitorSchema);

export default Monitor;