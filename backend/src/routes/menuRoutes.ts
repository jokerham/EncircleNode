import express, { Request, Response } from 'express';
import { Menu, MenuType } from '../models/Menu';

const router = express.Router();

// Get all menus
router.get('/', async (req: Request, res: Response) => {
  try {
    const menus = await Menu.find()
      .populate('parentId', 'title url')
      .sort({ order: 1 });
    
    res.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ message: 'Error fetching menus' });
  }
});

// Get menu tree structure (hierarchical)
router.get('/tree', async (req: Request, res: Response) => {
  try {
    // Get only active menus if specified
    const isActiveOnly = req.query.activeOnly === 'true';
    const filter = isActiveOnly ? { isActive: true } : {};

    // Get all top-level menus (without parent)
    const topLevelMenus = await Menu.find({ 
      ...filter,
      parentId: null 
    })
      .populate({
        path: 'children',
        match: filter,
        options: { sort: { order: 1 } },
        populate: {
          path: 'children',
          match: filter,
          options: { sort: { order: 1 } }
        }
      })
      .sort({ order: 1 });
    
    res.json(topLevelMenus);
  } catch (error) {
    console.error('Error fetching menu tree:', error);
    res.status(500).json({ message: 'Error fetching menu tree' });
  }
});

// Get menu by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate('parentId', 'title url')
      .populate({
        path: 'children',
        options: { sort: { order: 1 } }
      });

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Error fetching menu' });
  }
});

// Get children of a specific menu
router.get('/:id/children', async (req: Request, res: Response) => {
  try {
    const parentMenu = await Menu.findById(req.params.id);

    if (!parentMenu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const children = await Menu.find({ parentId: req.params.id })
      .sort({ order: 1 });

    res.json({
      parentMenu: {
        id: parentMenu._id,
        title: parentMenu.title
      },
      children
    });
  } catch (error) {
    console.error('Error fetching menu children:', error);
    res.status(500).json({ message: 'Error fetching menu children' });
  }
});

// Create menu
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, type, url, icon, order, isActive, parentId } = req.body;

    // Validate required fields
    if (!title || !url) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: title, url' 
      });
    }

    // Validate menu type
    if (type && !Object.values(MenuType).includes(type)) {
      return res.status(400).json({ 
        message: 'Invalid menu type. Must be "internal" or "external"' 
      });
    }

    // If parentId is provided, verify it exists
    if (parentId) {
      const parentMenu = await Menu.findById(parentId);
      if (!parentMenu) {
        return res.status(400).json({ 
          message: 'Parent menu not found' 
        });
      }
    }

    const menu = await Menu.create({
      title,
      type: type || MenuType.INTERNAL,
      url,
      icon,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      parentId: parentId || null
    });

    const populatedMenu = await Menu.findById(menu._id)
      .populate('parentId', 'title url');

    res.status(201).json({
      message: 'Menu created successfully',
      menu: populatedMenu
    });
  } catch (error: any) {
    console.error('Error creating menu:', error);
    res.status(400).json({ 
      message: 'Error creating menu',
      error: error.message 
    });
  }
});

// Update menu
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, type, url, icon, order, isActive, parentId } = req.body;

    // Validate menu type if provided
    if (type && !Object.values(MenuType).includes(type)) {
      return res.status(400).json({ 
        message: 'Invalid menu type. Must be "internal" or "external"' 
      });
    }

    // If parentId is provided, verify it exists and isn't the menu itself
    if (parentId) {
      if (parentId === req.params.id) {
        return res.status(400).json({ 
          message: 'Menu cannot be its own parent' 
        });
      }
      
      const parentMenu = await Menu.findById(parentId);
      if (!parentMenu) {
        return res.status(400).json({ 
          message: 'Parent menu not found' 
        });
      }
    }

    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(type && { type }),
        ...(url && { url }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
        ...(parentId !== undefined && { parentId: parentId || null })
      },
      { new: true, runValidators: true }
    )
      .populate('parentId', 'title url');

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json({
      message: 'Menu updated successfully',
      menu
    });
  } catch (error: any) {
    console.error('Error updating menu:', error);
    res.status(400).json({ 
      message: 'Error updating menu',
      error: error.message 
    });
  }
});

// Delete menu
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    // Check if menu has children
    const childrenCount = await Menu.countDocuments({ parentId: req.params.id });
    
    if (childrenCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete menu with children. Please delete or reassign children first.',
        childrenCount 
      });
    }

    const menu = await Menu.findByIdAndDelete(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json({ 
      message: 'Menu deleted successfully',
      menuId: req.params.id
    });
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ message: 'Error deleting menu' });
  }
});

// Reorder menus
router.put('/:id/reorder', async (req: Request, res: Response) => {
  try {
    const { newOrder } = req.body;

    if (newOrder === undefined || newOrder === null) {
      return res.status(400).json({ 
        message: 'Please provide newOrder' 
      });
    }

    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { order: newOrder },
      { new: true, runValidators: true }
    )
      .populate('parentId', 'title url');

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json({
      message: 'Menu order updated successfully',
      menu
    });
  } catch (error: any) {
    console.error('Error reordering menu:', error);
    res.status(400).json({ 
      message: 'Error reordering menu',
      error: error.message 
    });
  }
});

// Toggle menu active status
router.patch('/:id/toggle-active', async (req: Request, res: Response) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    menu.isActive = !menu.isActive;
    await menu.save();

    res.json({
      message: `Menu ${menu.isActive ? 'activated' : 'deactivated'} successfully`,
      menu
    });
  } catch (error) {
    console.error('Error toggling menu status:', error);
    res.status(500).json({ message: 'Error toggling menu status' });
  }
});

export default router;