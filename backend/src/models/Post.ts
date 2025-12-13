// ============================================
// FILE: backend/src/models/Post.ts
// ============================================
import mongoose, { Document, Schema } from 'mongoose';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface IPost extends Document {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status: PostStatus;
  authorId: mongoose.Types.ObjectId;
  author?: any; // Reference to User model
  seriesId?: mongoose.Types.ObjectId;
  series?: IBoard;
  seriesOrder?: number;
  tags?: string[];
  viewCount: number;
  isActive: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comments?: IComment[];
  incrementViews(): Promise<IPost>;
}

export interface IBoard extends Document {
  title: string;
  description?: string;
  slug: string;
  authorId: mongoose.Types.ObjectId;
  author?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  posts?: IPost[];
}

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  post?: IPost;
  authorId: mongoose.Types.ObjectId;
  author?: any;
  content: string;
  parentCommentId?: mongoose.Types.ObjectId;
  parentComment?: IComment;
  children?: IComment[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Post Schema
// ============================================
const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required']
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  slug: {
    type: String,
    required: [true, 'Post slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: Object.values(PostStatus),
    default: PostStatus.DRAFT
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  seriesId: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    default: null
  },
  seriesOrder: {
    type: Number,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
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
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
PostSchema.index({ slug: 1 });
PostSchema.index({ authorId: 1 });
PostSchema.index({ seriesId: 1, seriesOrder: 1 });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ tags: 1 });

// Virtual for comments
PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId'
});

// Virtual for author
PostSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true
});

// Virtual for series
PostSchema.virtual('series', {
  ref: 'Board',
  localField: 'seriesId',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware
PostSchema.pre('save', function() {
  this.updatedAt = new Date();
  
  // Auto-set publishedAt when status changes to published
  if (this.isModified('status') && this.status === PostStatus.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

// Method to increment view count
PostSchema.methods.incrementViews = async function() {
  this.viewCount += 1;
  return this.save();
};

// ============================================
// Board Schema
// ============================================
const BoardSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Board title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  slug: {
    type: String,
    required: [true, 'Board slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
BoardSchema.index({ slug: 1 });
BoardSchema.index({ authorId: 1 });

// Virtual for posts (sorted by seriesOrder)
BoardSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'seriesId',
  options: { sort: { seriesOrder: 1 } }
});

// Virtual for author
BoardSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true
});

// ============================================
// Comment Schema
// ============================================
const CommentSchema: Schema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post reference is required']
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [2000, 'Comment cannot exceed 2000 characters']
  },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ authorId: 1 });
CommentSchema.index({ parentCommentId: 1 });

// Virtual for nested replies/children
CommentSchema.virtual('children', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentCommentId',
  options: { sort: { createdAt: 1 } }
});

// Virtual for author
CommentSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true
});

// Virtual for post
CommentSchema.virtual('post', {
  ref: 'Post',
  localField: 'postId',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware
CommentSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Export models
export const Post = mongoose.model<IPost>('Post', PostSchema);
export const Board = mongoose.model<IBoard>('Board', BoardSchema);
export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
