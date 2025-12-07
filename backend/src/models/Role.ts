// ============================================
// backend/src/models/Role.ts
import mongoose, { Document, Schema } from 'mongoose';

// Role interface
export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: mongoose.Types.ObjectId[];
  isSystemRole: boolean; // Prevent deletion of system roles
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  isSystemRole: { type: Boolean, default: false },
  effectiveFrom: { type: Date, default: Date.now },
  effectiveTo: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Prevent deletion of system roles
RoleSchema.pre('deleteOne', async function() {
  const docToDelete = await this.model.findOne(this.getQuery());
  if (docToDelete && docToDelete.isSystemRole) {
    throw new Error('Cannot delete system role');
  }
});

RoleSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const Role = mongoose.model<IRole>('Role', RoleSchema);
