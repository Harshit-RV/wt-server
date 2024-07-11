import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface EarningDoc extends Document {
  apiKey: string,
  walletAddress: string,
  earnings: [ EarningElementDoc ],
}

export interface EarningElementDoc extends Document {
  endpoint: string,
  credits: number,
  timestamp: Date,
}

export interface EarningProps {
  apiKey: string,
  walletAddress: string,
  earnings: [ EarningElementProps ],
}

export interface EarningElementProps {
  endpoint: string,
  credits: number,
}

const earningElementSchema = new Schema({
  endpoint: { type: String, required: true },
  credits: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const earningSchema: Schema = new Schema({
  apiKey: { type: String, required: true, unique: true },
  walletAddress: { type: String, required: true,  unique: true },
  earnings: [ earningElementSchema ],
});

const Earning = mongoose.model<EarningDoc>('Earning', earningSchema);

export default Earning;