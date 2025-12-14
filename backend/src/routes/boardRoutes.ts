// ============================================
// FILE: backend/src/routes/boardRoutes.ts
// ============================================
import express, { Request, Response } from 'express';
import { Board, Post, PostStatus } from '../models/Post';

const router = express.Router();

// ============================================
// BOARD ROUTES
// ============================================

// Create a new board
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, slug, authorId } = req.body;

    // Validate required fields
    if (!title || !slug || !authorId) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: title, slug, authorId' 
      });
    }

    // Check if slug already exists
    const existingBoard = await Board.findOne({ slug });
    if (existingBoard) {
      return res.status(409).json({ message: 'Board with this slug already exists' });
    }

    const board = new Board({ 
      title, 
      description, 
      slug, 
      authorId 
    });

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
router.get('/', async (req: Request, res: Response) => {
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

// Get board by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
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

// Get board by ID with posts
router.get('/:id', async (req: Request, res: Response) => {
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

// Update board
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, description, slug, isActive } = req.body;

    // If slug is being updated, check if it already exists
    if (slug) {
      const existingBoard = await Board.findOne({ 
        slug, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingBoard) {
        return res.status(409).json({ 
          message: 'Board with this slug already exists' 
        });
      }
    }

    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { title, description, slug, isActive },
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
router.delete('/:id', async (req: Request, res: Response) => {
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

// Toggle board active status
router.patch('/:id/toggle-active', async (req: Request, res: Response) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    board.isActive = !board.isActive;
    await board.save();

    const populatedBoard = await Board.findById(board._id)
      .populate('authorId', 'name email');

    res.json({
      message: `Board ${board.isActive ? 'activated' : 'deactivated'} successfully`,
      board: populatedBoard
    });
  } catch (error: any) {
    console.error('Error toggling board status:', error);
    res.status(500).json({ 
      message: 'Error toggling board status',
      error: error.message 
    });
  }
});

export default router;