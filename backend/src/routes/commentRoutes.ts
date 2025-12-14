// ============================================
// FILE: backend/src/routes/commentRoutes.ts
// ============================================
import express, { Request, Response } from 'express';
import { Comment, Post } from '../models/Post';

const router = express.Router();

// ============================================
// COMMENT ROUTES
// ============================================

// Create a new comment
router.post('/', async (req: Request, res: Response) => {
  try {
    const { postId, authorId, content, parentCommentId } = req.body;

    // Validate required fields
    if (!postId || !authorId || !content) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: postId, authorId, content' 
      });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // If replying to a comment, verify parent exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
      
      // Ensure parent comment belongs to the same post
      if (parentComment.postId.toString() !== postId) {
        return res.status(400).json({ 
          message: 'Parent comment does not belong to this post' 
        });
      }
    }

    const comment = new Comment({ 
      postId, 
      authorId, 
      content, 
      parentCommentId 
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('authorId', 'name email')
      .populate('postId', 'title slug');

    res.status(201).json({
      message: 'Comment created successfully',
      comment: populatedComment
    });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    res.status(500).json({ 
      message: 'Error creating comment',
      error: error.message 
    });
  }
});

// Get all comments (with optional filters)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { postId, authorId, isActive, limit = '50', page = '1' } = req.query;
    
    const filter: any = {};
    
    if (postId) filter.postId = postId;
    if (authorId) filter.authorId = authorId;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;

    const comments = await Comment.find(filter)
      .populate('authorId', 'name email')
      .populate('postId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Comment.countDocuments(filter);

    res.json({
      comments,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ 
      message: 'Error fetching comments',
      error: error.message 
    });
  }
});

// Get comments for a specific post (with nested replies)
router.get('/post/:postId', async (req: Request, res: Response) => {
  try {
    const { includeInactive } = req.query;
    
    const matchCondition: any = { 
      postId: req.params.postId,
      parentCommentId: null
    };

    // Only show active comments unless specifically requested
    if (includeInactive !== 'true') {
      matchCondition.isActive = true;
    }

    const comments = await Comment.find(matchCondition)
      .populate('authorId', 'name email')
      .populate({
        path: 'children',
        match: includeInactive === 'true' ? {} : { isActive: true },
        populate: [
          { path: 'authorId', select: 'name email' },
          { 
            path: 'children',
            match: includeInactive === 'true' ? {} : { isActive: true },
            populate: { path: 'authorId', select: 'name email' }
          }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ 
      message: 'Error fetching comments',
      error: error.message 
    });
  }
});

// Get comments by a specific author
router.get('/author/:authorId', async (req: Request, res: Response) => {
  try {
    const { limit = '20', page = '1' } = req.query;
    
    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;

    const comments = await Comment.find({ 
      authorId: req.params.authorId,
      isActive: true 
    })
      .populate('postId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Comment.countDocuments({ 
      authorId: req.params.authorId,
      isActive: true 
    });

    res.json({
      comments,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Error fetching author comments:', error);
    res.status(500).json({ 
      message: 'Error fetching author comments',
      error: error.message 
    });
  }
});

// Get single comment by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('authorId', 'name email')
      .populate('postId', 'title slug')
      .populate('parentCommentId')
      .populate({
        path: 'children',
        match: { isActive: true },
        populate: { path: 'authorId', select: 'name email' }
      });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json(comment);
  } catch (error: any) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ 
      message: 'Error fetching comment',
      error: error.message 
    });
  }
});

// Update comment
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ 
        message: 'Content is required' 
      });
    }

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true, runValidators: true }
    )
      .populate('authorId', 'name email')
      .populate('postId', 'title slug');

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error: any) {
    console.error('Error updating comment:', error);
    res.status(400).json({ 
      message: 'Error updating comment',
      error: error.message 
    });
  }
});

// Delete comment (soft delete)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Optionally soft delete all child comments as well
    await Comment.updateMany(
      { parentCommentId: req.params.id },
      { isActive: false }
    );

    res.json({ 
      message: 'Comment deleted successfully',
      commentId: req.params.id
    });
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ 
      message: 'Error deleting comment',
      error: error.message 
    });
  }
});

// Permanently delete comment (hard delete)
router.delete('/:id/permanent', async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Also delete all child comments
    await Comment.deleteMany({ parentCommentId: req.params.id });

    res.json({ 
      message: 'Comment permanently deleted',
      commentId: req.params.id
    });
  } catch (error: any) {
    console.error('Error permanently deleting comment:', error);
    res.status(500).json({ 
      message: 'Error permanently deleting comment',
      error: error.message 
    });
  }
});

// Restore soft-deleted comment
router.patch('/:id/restore', async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    )
      .populate('authorId', 'name email')
      .populate('postId', 'title slug');

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({
      message: 'Comment restored successfully',
      comment
    });
  } catch (error: any) {
    console.error('Error restoring comment:', error);
    res.status(500).json({ 
      message: 'Error restoring comment',
      error: error.message 
    });
  }
});

// Get comment count for a post
router.get('/post/:postId/count', async (req: Request, res: Response) => {
  try {
    const count = await Comment.countDocuments({ 
      postId: req.params.postId,
      isActive: true 
    });

    res.json({ 
      postId: req.params.postId,
      commentCount: count 
    });
  } catch (error: any) {
    console.error('Error counting comments:', error);
    res.status(500).json({ 
      message: 'Error counting comments',
      error: error.message 
    });
  }
});

export default router;