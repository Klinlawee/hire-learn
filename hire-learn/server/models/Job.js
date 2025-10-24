import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Please provide job description'],
    maxlength: 2000
  },
  requirements: {
    type: String,
    required: [true, 'Please provide job requirements'],
    maxlength: 1000
  },
  responsibilities: {
    type: String,
    required: [true, 'Please provide job responsibilities'],
    maxlength: 1000
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please provide job category'],
    enum: [
      'Engineering', 'Design', 'Marketing', 'Sales', 'Finance',
      'Human Resources', 'Operations', 'Customer Service', 'Other'
    ]
  },
  jobType: {
    type: String,
    required: [true, 'Please provide job type'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
  },
  location: {
    type: String,
    required: [true, 'Please provide job location']
  },
  salary: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Executive'],
    required: true
  },
  skills: [String],
  applicationDeadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'draft'],
    default: 'active'
  },
  applications: [{
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
      default: 'pending'
    },
    coverLetter: String,
    resume: {
      url: String,
      fileName: String
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  isRemote: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Index for search functionality
jobSchema.index({
  title: 'text',
  description: 'text',
  requirements: 'text',
  skills: 'text'
})

export default mongoose.model('Job', jobSchema)