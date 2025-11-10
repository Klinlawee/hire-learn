const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sort = '-createdAt'
    } = req.query;

    // Build query object
    const query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Execute query with pagination
    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('companies', 'name logo industry');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Users can only view their own profile unless admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this user',
      });
    }

    res.status(200).json({
      success: true,
      data: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Users can only update their own profile unless admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user',
      });
    }

    const allowedUpdates = [
      'name', 'profile', 'skills', 'education', 'experience', 
      'socialLinks', 'preferences', 'isActive'
    ];
    
    // Admins can update role and verification status
    if (req.user.role === 'admin') {
      allowedUpdates.push('role', 'isVerified');
    }

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Handle file upload for avatar
    if (req.file) {
      updates['profile.avatar'] = req.file.path;
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { 
        new: true,
        runValidators: true 
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin/Owner)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Users can only delete their own account unless admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this user',
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id && req.user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admins cannot delete their own account',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private
exports.getUserStats = async (req, res, next) => {
  try {
    // Users can only view their own stats unless admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these statistics',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // You would typically aggregate data from various models here
    // For now, returning basic user stats
    const stats = {
      profileCompletion: calculateProfileCompletion(user),
      lastLogin: user.lastLogin,
      memberSince: user.createdAt,
      // Add more stats as needed
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (user) => {
  let completion = 0;
  const totalFields = 8; // Adjust based on important fields

  if (user.name) completion += 1;
  if (user.profile?.avatar) completion += 1;
  if (user.profile?.bio) completion += 1;
  if (user.profile?.location) completion += 1;
  if (user.skills?.length > 0) completion += 1;
  if (user.education?.length > 0) completion += 1;
  if (user.experience?.length > 0) completion += 1;
  if (user.resume?.url) completion += 1;

  return Math.round((completion / totalFields) * 100);
};

// @desc    Deactivate user account
// @route   PUT /api/users/:id/deactivate
// @access  Private (Admin/Owner)
exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Users can only deactivate their own account unless admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to deactivate this user',
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User account deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reactivate user account
// @route   PUT /api/users/:id/reactivate
// @access  Private (Admin)
exports.reactivateUser = async (req, res, next) => {
  try {
    // Only admins can reactivate accounts
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reactivate users',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User account reactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};