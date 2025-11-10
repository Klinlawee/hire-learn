const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Verify JWT token and protect routes
// @access  Private
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header, cookie, or query string
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Get token from cookie
      token = req.cookies.token;
    } else if (req.query && req.query.token) {
      // Get token from query string
      token = req.query.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. No token provided.',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized. User not found.',
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated. Please contact support.',
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.',
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.',
        });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route.',
    });
  }
};

// @desc    Role-based authorization middleware
// @access  Private
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route. Required roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

// @desc    Check if user is the owner of the resource or admin
// @access  Private
exports.ownerOrAdmin = (resourceModel, idParam = 'id') => {
  return async (req, res, next) => {
    try {
      // Admin can access any resource
      if (req.user.role === 'admin') {
        return next();
      }

      // Get the resource
      const resource = await resourceModel.findById(req.params[idParam]);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
      }

      // Check ownership based on common field names
      let isOwner = false;

      if (resource.user && resource.user.toString() === req.user.id) {
        isOwner = true;
      } else if (resource.employer && resource.employer.toString() === req.user.id) {
        isOwner = true;
      } else if (resource.instructor && resource.instructor.toString() === req.user.id) {
        isOwner = true;
      } else if (resource.applicant && resource.applicant.toString() === req.user.id) {
        isOwner = true;
      } else if (resource.owners && Array.isArray(resource.owners)) {
        // For company ownership
        isOwner = resource.owners.some(owner => 
          owner.user.toString() === req.user.id
        );
      }

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this resource. You are not the owner.',
        });
      }

      next();
    } catch (error) {
      console.error('OwnerOrAdmin middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error in authorization',
      });
    }
  };
};

// @desc    Optional authentication middleware
// @access  Public/Private
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (jwtError) {
        // Token is invalid, but we don't throw error for optional auth
        console.log('Optional auth - invalid token:', jwtError.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// @desc    Check if user can update their own profile or is admin
// @access  Private
exports.canUpdateUser = async (req, res, next) => {
  try {
    // Admin can update any user
    if (req.user.role === 'admin') {
      return next();
    }

    // Users can only update their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user profile',
      });
    }

    next();
  } catch (error) {
    console.error('CanUpdateUser middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authorization',
    });
  }
};

// @desc    Check if user can apply to jobs (must be employee)
// @access  Private
exports.canApplyToJobs = (req, res, next) => {
  if (req.user.role !== 'employee') {
    return res.status(403).json({
      success: false,
      message: 'Only employees can apply to jobs',
    });
  }
  next();
};

// @desc    Check if user can create jobs (must be employer or admin)
// @access  Private
exports.canCreateJobs = (req, res, next) => {
  if (req.user.role !== 'employer' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only employers and admins can create jobs',
    });
  }
  next();
};

// @desc    Check if user can create courses (must be employer/instructor or admin)
// @access  Private
exports.canCreateCourses = (req, res, next) => {
  if (req.user.role !== 'employer' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only instructors and admins can create courses',
    });
  }
  next();
};

// @desc    Get current user for context (attaches user to req without blocking)
// @access  Public/Private
exports.getCurrentUser = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Don't block the request if there's an error with user context
    console.log('GetCurrentUser middleware - proceeding without user context');
    next();
  }
};