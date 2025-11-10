const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const { validationResult } = require('express-validator');

// @desc    Get all courses with filtering and pagination
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      level,
      instructor,
      minPrice,
      maxPrice,
      status = 'published',
      featured,
      sort = '-createdAt'
    } = req.query;

    // Build query object
    const query = { status };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by level
    if (level) {
      query.level = level;
    }

    // Filter by instructor
    if (instructor) {
      query.instructor = instructor;
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query['price.amount'] = {};
      if (minPrice !== undefined) {
        query['price.amount'].$gte = parseInt(minPrice);
      }
      if (maxPrice !== undefined) {
        query['price.amount'].$lte = parseInt(maxPrice);
      }
    }

    // Filter by featured
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Execute query with pagination
    const courses = await Course.find(query)
      .populate('instructor', 'name profile.avatar profile.bio')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name profile.avatar profile.bio experience education')
      .populate('reviews.user', 'name profile.avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
exports.createCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Check if user is instructor or admin
    if (req.user.role !== 'admin' && req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create courses',
      });
    }

    const courseData = {
      ...req.body,
      instructor: req.user.id,
    };

    // Handle thumbnail upload
    if (req.file) {
      courseData.thumbnail = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership or admin role
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
    }

    // Handle thumbnail upload
    if (req.file) {
      req.body.thumbnail = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership or admin role
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course || !course.isPublished()) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not available for enrollment',
      });
    }

    // Check if user is already enrolled
    const existingCertificate = await Certificate.findOne({
      course: req.params.id,
      user: req.user.id,
    });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    // For paid courses, you would integrate with payment gateway here
    if (!course.price.isFree) {
      // Payment integration would go here
      // For now, we'll assume payment is processed
      console.log(`Payment required for course: ${course.price.amount} ${course.price.currency}`);
    }

    // Create enrollment (certificate record)
    const certificate = await Certificate.create({
      course: req.params.id,
      user: req.user.id,
      progress: {
        completed: 0,
        quizScore: 0,
      },
      status: 'active',
    });

    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        certificate,
        course: {
          id: course._id,
          title: course.title,
          instructor: course.instructor,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/courses/my-courses
// @access  Private
exports.getEnrolledCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const certificates = await Certificate.find(query)
      .populate('course', 'title thumbnail category level instructor duration price rating')
      .populate('course.instructor', 'name profile.avatar')
      .sort('-issueDate')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Certificate.countDocuments(query);

    res.status(200).json({
      success: true,
      count: certificates.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to course
// @route   POST /api/courses/:id/reviews
// @access  Private (Enrolled students only)
exports.addReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if user is enrolled
    const certificate = await Certificate.findOne({
      course: req.params.id,
      user: req.user.id,
    });

    if (!certificate) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in the course to add a review',
      });
    }

    // Check if user already reviewed
    const existingReview = course.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course',
      });
    }

    const { rating, comment } = req.body;

    course.reviews.push({
      user: req.user.id,
      rating,
      comment,
    });

    // Update course rating
    course.updateRating();
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: course.reviews[course.reviews.length - 1],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get instructor's courses
// @route   GET /api/courses/instructor/my-courses
// @access  Private (Instructor/Admin)
exports.getInstructorCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { instructor: req.user.id };
    if (status) {
      query.status = status;
    }

    const courses = await Course.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};