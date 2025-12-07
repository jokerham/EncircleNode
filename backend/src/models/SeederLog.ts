// backend/src/models/SeederLog.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISeederLog extends Document {
  name: string;
  executedAt: Date;
  status: 'success' | 'failed';
  error?: string;
}

const SeederLogSchema = new Schema<ISeederLog>({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  executedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  error: {
    type: String
  }
});

export const SeederLog = mongoose.model<ISeederLog>('SeederLog', SeederLogSchema);
