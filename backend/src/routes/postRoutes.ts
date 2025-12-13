// ============================================
// FILE: backend/src/routes/postRoutes.ts
// ============================================
import express, { Request, Response } from 'express';
import { Post, Board, Comment, PostStatus } from '../models/Post';

const router = express.Router();

// ============================================
// POST ROUTES
// ============================================

// Create a new post
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, slug, status, authorId, seriesId, seriesOrder, tags } = req.body;

    // Validate required fields
    if (!title || !content || !slug || !authorId) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: title, content, slug, authorId' 
      });
    }

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(409).json({ message: 'Post with this slug already exists' });
    }

    const post = new Post({
      title,
      content,
      excerpt,
      slug,
      status: status || PostStatus.DRAFT,
      authorId,
      seriesId,
      seriesOrder,
      tags
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'name email')
      .populate('seriesId', 'title slug');

    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error: any) {
    console.error('Error creating post:', error);
    res.status(500).json({ 
      message: 'Error creating post',
      error: error.message 
    });
  }
});

// Get all posts with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, authorId, seriesId, tag, limit = '10', page = '1' } = req.query;
    
    const filter: any = {};
    
    if (status) filter.status = status;
    if (authorId) filter.authorId = authorId;
    if (seriesId) filter.seriesId = seriesId;
    if (tag) filter.tags = tag;

    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;

    const posts = await Post.find(filter)
      .populate('authorId', 'name email')
      .populate('seriesId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      message: 'Error fetching posts',
      error: error.message 
    });
  }
});

// Get published posts only (public endpoint)
router.get('/published', async (req: Request, res: Response) => {
  try {
    const { limit = '10', page = '1', tag, seriesId } = req.query;
    
    const filter: any = { 
      status: PostStatus.PUBLISHED,
      isActive: true 
    };
    
    if (tag) filter.tags = tag;
    if (seriesId) filter.seriesId = seriesId;

    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;

    const posts = await Post.find(filter)
      .populate('authorId', 'name email')
      .populate('seriesId', 'title slug')
      .sort({ publishedAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Error fetching published posts:', error);
    res.status(500).json({ 
      message: 'Error fetching published posts',
      error: error.message 
    });
  }
});

// Get post by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'name email')
      .populate('seriesId', 'title slug description')
      .populate({
        path: 'comments',
        match: { isActive: true, parentCommentId: null },
        populate: [
          { path: 'authorId', select: 'name email' },
          { 
            path: 'children',
            populate: { path: 'authorId', select: 'name email' }
          }
        ]
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error: any) {
    console.error('Error fetching post:', error);
    res.status(500).json({ 
      message: 'Error fetching post',
      error: error.message 
    });
  }
});

// Get post by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('authorId', 'name email')
      .populate('seriesId', 'title slug description')
      .populate({
        path: 'comments',
        match: { isActive: true, parentCommentId: null },
        populate: [
          { path: 'authorId', select: 'name email' },
          { 
            path: 'children',
            populate: { path: 'authorId', select: 'name email' }
          }
        ]
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    await post.incrementViews();

    res.json(post);
  } catch (error: any) {
    console.error('Error fetching post:', error);
    res.status(500).json({ 
      message: 'Error fetching post',
      error: error.message 
    });
  }
});

// Update post
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('authorId', 'name email')
      .populate('seriesId', 'title slug');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error: any) {
    console.error('Error updating post:', error);
    res.status(400).json({ 
      message: 'Error updating post',
      error: error.message 
    });
  }
});

// Delete post
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Also delete all comments associated with this post
    await Comment.deleteMany({ postId: req.params.id });

    res.json({ 
      message: 'Post and associated comments deleted successfully',
      postId: req.params.id
    });
  } catch (error: any) {
    console.error('Error deleting post:', error);
    res.status(500).json({ 
      message: 'Error deleting post',
      error: error.message 
    });
  }
});

// Publish post
router.patch('/:id/publish', async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.status = PostStatus.PUBLISHED;
    if (!post.publishedAt) {
      post.publishedAt = new Date();
    }
    await post.save();

    res.json({
      message: 'Post published successfully',
      post
    });
  } catch (error: any) {
    console.error('Error publishing post:', error);
    res.status(500).json({ 
      message: 'Error publishing post',
      error: error.message 
    });
  }
});

// Archive post
router.patch('/:id/archive', async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: PostStatus.ARCHIVED },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      message: 'Post archived successfully',
      post
    });
  } catch (error: any) {
    console.error('Error archiving post:', error);
    res.status(500).json({ 
      message: 'Error archiving post',
      error: error.message 
    });
  }
});

// ============================================
// BOARD ROUTES
// ============================================

// Create a new board
router.post('/boards', async (req: Request, res: Response) => {
  try {
    const { title, description, slug, authorId } = req.body;

    if (!title || !slug || !authorId) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: title, slug, authorId' 
      });
    }

    const existingBoard = await Board.findOne({ slug });
    if (existingBoard) {
      return res.status(409).json({ message: 'Board with this slug already exists' });
    }

    const board = new Board({ title, description, slug, authorId });
    await board.save();

    const populatedBoard = await Board.findById(board._id)
      .populate('authorId', 'name email');

    res.status(201).json({
      message: 'Board created successfully',
      board: populatedBoard
    });
  } catch (error: any) {
    console.error('Error creating board:', error);
    res.status(500).json({ 
      message: 'Error creating board',
      error: error.message 
    });
  }
});

// Get all boards
router.get('/boards', async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;
    const filter: any = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const boards = await Board.find(filter)
      .populate('authorId', 'name email')
      .populate({
        path: 'posts',
        match: { status: PostStatus.PUBLISHED, isActive: true },
        options: { sort: { seriesOrder: 1 } },
        select: 'title slug excerpt publishedAt viewCount'
      })
      .sort({ createdAt: -1 });

    res.json(boards);
  } catch (error: any) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ 
      message: 'Error fetching boards',
      error: error.message 
    });
  }
});

// Get board by ID with posts
router.get('/boards/:id', async (req: Request, res: Response) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('authorId', 'name email')
      .populate({
        path: 'posts',
        options: { sort: { seriesOrder: 1 } },
        populate: { path: 'authorId', select: 'name email' }
      });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
  } catch (error: any) {
    console.error('Error fetching board:', error);
    res.status(500).json({ 
      message: 'Error fetching board',
      error: error.message 
    });
  }
});

// Get board by slug
router.get('/boards/slug/:slug', async (req: Request, res: Response) => {
  try {
    const board = await Board.findOne({ slug: req.params.slug })
      .populate('authorId', 'name email')
      .populate({
        path: 'posts',
        match: { status: PostStatus.PUBLISHED, isActive: true },
        options: { sort: { seriesOrder: 1 } },
        populate: { path: 'authorId', select: 'name email' }
      });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
  } catch (error: any) {
    console.error('Error fetching board:', error);
    res.status(500).json({ 
      message: 'Error fetching board',
      error: error.message 
    });
  }
});

// Update board
router.put('/boards/:id', async (req: Request, res: Response) => {
  try {
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('authorId', 'name email');

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json({
      message: 'Board updated successfully',
      board
    });
  } catch (error: any) {
    console.error('Error updating board:', error);
    res.status(400).json({ 
      message: 'Error updating board',
      error: error.message 
    });
  }
});

// Delete board
router.delete('/boards/:id', async (req: Request, res: Response) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Remove board reference from posts
    await Post.updateMany(
      { seriesId: req.params.id },
      { $unset: { seriesId: 1, seriesOrder: 1 } }
    );

    res.json({ 
      message: 'Board deleted successfully',
      boardId: req.params.id
    });
  } catch (error: any) {
    console.error('Error deleting board:', error);
    res.status(500).json({ 
      message: 'Error deleting board',
      error: error.message 
    });
  }
});

// ============================================
// COMMENT ROUTES
// ============================================

// Create a new comment
router.post('/comments', async (req: Request, res: Response) => {
  try {
    const { postId, authorId, content, parentCommentId } = req.body;

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
    }

    const comment = new Comment({ postId, authorId, content, parentCommentId });
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

// Get comments for a post
router.get('/comments/post/:postId', async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ 
      postId: req.params.postId,
      parentCommentId: null,
      isActive: true 
    })
      .populate('authorId', 'name email')
      .populate({
        path: 'children',
        match: { isActive: true },
        populate: [
          { path: 'authorId', select: 'name email' },
          { 
            path: 'children',
            match: { isActive: true },
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

// Update comment
router.put('/comments/:id', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true, runValidators: true }
    ).populate('authorId', 'name email');

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
router.delete('/comments/:id', async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

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

export default router;