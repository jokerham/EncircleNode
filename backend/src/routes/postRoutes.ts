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

export default router;