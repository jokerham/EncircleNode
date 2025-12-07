// ============================================
// FILE: backend/src/models/Menu.ts
// ============================================
import mongoose, { Document, Schema } from 'mongoose';

export enum MenuType {
  INTERNAL = 'internal',
  EXTERNAL = 'external'
}

export interface IMenu extends Document {
  title: string;
  type: MenuType;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
  parentId?: mongoose.Types.ObjectId;
  parent?: IMenu;
  children?: IMenu[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Menu title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: Object.values(MenuType),
    required: [true, 'Menu type is required'],
    default: MenuType.INTERNAL
  },
  url: {
    type: String,
    required: [true, 'Menu URL is required'],
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Menu',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

MenuSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Index for faster queries
MenuSchema.index({ parentId: 1, order: 1 });
MenuSchema.index({ isActive: 1 });

// Virtual for children
MenuSchema.virtual('children', {
  ref: 'Menu',
  localField: '_id',
  foreignField: 'parentId'
});

// Ensure virtuals are included when converting to JSON
MenuSchema.set('toJSON', { virtuals: true });
MenuSchema.set('toObject', { virtuals: true });

export const Menu = mongoose.model<IMenu>('Menu', MenuSchema);
