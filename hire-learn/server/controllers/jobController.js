const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const { validationResult } = require('express-validator');

// @desc    Get all jobs with filtering and pagination
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      type,
      remote,
      level,
      location,
      minSalary,
      maxSalary,
      sort = '-createdAt'
    } = req.query;

    // Build query object
    const query = { status: 'active' };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by job type
    if (type) {
      query.type = type;
    }

    // Filter by remote work
    if (remote) {
      query.remote = remote;
    }

    // Filter by level
    if (level) {
      query.level = level;
    }

    // Filter by location
    if (location) {
      query.location = new RegExp(location, 'i');
    }

    // Filter by salary range
    if (minSalary || maxSalary) {
      query.$and = [];
      if (minSalary) {
        query.$and.push({ 'salary.max': { $gte: parseInt(minSalary) } });
      }
      if (maxSalary) {
        query.$and.push({ 'salary.min': { $lte: parseInt(maxSalary) } });
      }
    }

    // Execute query with pagination
    const jobs = await Job.find(query)
      .populate('employer', 'name profile.avatar')
      .populate('company', 'name logo industry size')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name profile.avatar email profile.phone')
      .populate('company', 'name logo industry size website description headquarters');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer/Admin)
exports.createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Check if user is employer or admin
    if (req.user.role !== 'employer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create jobs',
      });
    }

    // Check if company exists and user owns it
    const company = await Company.findById(req.body.company);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    if (!company.isOwner(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create jobs for this company',
      });
    }

    const jobData = {
      ...req.body,
      employer: req.user.id,
    };

    const job = await Job.create(jobData);

    // Update company job count
    company.stats.totalJobs += 1;
    company.stats.activeJobs += 1;
    await company.save();

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer/Admin)
exports.updateJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check ownership or admin role
    if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer/Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check ownership or admin role
    if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    // Update company job count
    const company = await Company.findById(job.company);
    if (company) {
      company.stats.totalJobs -= 1;
      if (job.status === 'active') {
        company.stats.activeJobs -= 1;
      }
      await company.save();
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to job
// @route   POST /api/jobs/:id/apply
// @access  Private (Employee)
exports.applyToJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Check if user is employee
    if (req.user.role !== 'employee') {
      return res.status(403).json({
        success: false,
        message: 'Only employees can apply to jobs',
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job || job.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Job not found or not active',
      });
    }

    // Check if application deadline has passed
    if (job.applicationDeadline && job.applicationDeadline < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed',
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: req.params.id,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }

    // Handle resume file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume',
      });
    }

    const applicationData = {
      job: req.params.id,
      applicant: req.user.id,
      resume: {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
      },
      coverLetter: req.body.coverLetter ? {
        text: req.body.coverLetter,
      } : undefined,
      screeningQuestions: req.body.screeningQuestions || [],
    };

    const application = await Application.create(applicationData);

    // Update job application count
    job.applicationCount += 1;
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employer's jobs
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (Employer/Admin)
exports.getEmployerJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { employer: req.user.id };
    if (status) {
      query.status = status;
    }

    const jobs = await Job.find(query)
      .populate('company', 'name logo')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};