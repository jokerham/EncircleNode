import express, { Request, Response } from 'express';
import { User } from '../models/User';

const router = express.Router();

// Sign Up - Register a new user
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, roleId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, email, password, roleId' 
      });
    }

    // Create user using the static signUp method
    const user = await User.signUp({
      name,
      email,
      password,
      roleId
    });

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error: any) {
    console.error('Sign up error:', error);
    
    // Handle specific errors
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ message: error.message });
    }
    
    if (error.message === 'Invalid role') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: 'Error creating user',
      error: error.message 
    });
  }
});

// Sign In - Login user
router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Sign in using the static signIn method
    const user = await User.signIn(email, password);

    res.status(200).json({
      message: 'Login successful',
      user
    });
  } catch (error: any) {
    console.error('Sign in error:', error);
    
    // Handle specific errors
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ message: error.message });
    }
    
    if (error.message === 'Account is deactivated') {
      return res.status(403).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: 'Error signing in',
      error: error.message 
    });
  }
});

// Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .populate({
        path: 'roleId',
        select: 'name description'
      })
      .select('-password');
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'roleId',
        select: 'name description',
        populate: {
          path: 'permissions',
          select: 'resource action scope description'
        }
      })
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { password, ...updateData } = req.body;

    // If password is being updated, it will be hashed by the pre-save middleware
    if (password) {
      updateData.password = password;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate({
        path: 'roleId',
        select: 'name description'
      })
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(400).json({ 
      message: 'Error updating user',
      error: error.message 
    });
  }
});

// Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'User deleted successfully',
      userId: req.params.id
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Get user permissions
router.get('/:id/permissions', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const permissions = await user.getPermissions();

    res.json({
      userId: user._id,
      userName: user.name,
      permissions
    });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({ message: 'Error fetching user permissions' });
  }
});

// Check specific permission
router.post('/:id/check-permission', async (req: Request, res: Response) => {
  try {
    const { resource, action, resourceOwnerId } = req.body;

    if (!resource || !action) {
      return res.status(400).json({ 
        message: 'Please provide resource and action' 
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hasPermission = await user.hasPermission(resource, action, resourceOwnerId);

    res.json({
      userId: user._id,
      resource,
      action,
      resourceOwnerId: resourceOwnerId || null,
      hasPermission
    });
  } catch (error) {
    console.error('Error checking permission:', error);
    res.status(500).json({ message: 'Error checking permission' });
  }
});

// Check if user has a specific role
router.post('/:id/check-role', async (req: Request, res: Response) => {
  try {
    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).json({ 
        message: 'Please provide roleName' 
      });
    }

    const user = await User.findById(req.params.id).populate('roleId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userRole = user.roleId as any;
    const hasRole = userRole && userRole.name.toLowerCase() === roleName.toLowerCase();

    res.json({
      userId: user._id,
      userName: user.name,
      roleName: roleName,
      userCurrentRole: userRole?.name || null,
      hasRole
    });
  } catch (error) {
    console.error('Error checking role:', error);
    res.status(500).json({ message: 'Error checking role' });
  }
});

export default router;