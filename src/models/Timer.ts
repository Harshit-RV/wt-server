import mongoose, { Schema, Document } from 'mongoose';

export interface TimerDoc extends Document {
  _id: mongoose.Types.ObjectId;
  lastCheck: Date,
}

export interface TimerProps {
  lastCheck: Date,
}

const timerSchema: Schema = new Schema({
  lastCheck: { type: Date, default: Date.now },
});

const Timer = mongoose.model<TimerDoc>('Timer', timerSchema);

export default Timer;