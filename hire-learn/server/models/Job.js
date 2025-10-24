import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot be more than 2000 characters']
  },
  resume: {
    url: String,
    fileName: String
  },
  notes: {
    byEmployer: String,
    byApplicant: String
  },
  interviewDate: Date,
  salaryExpectation: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  }
})

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true,
    maxlength: [100, 'Job title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide job description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  requirements: {
    type: String,
    required: [true, 'Please provide job requirements'],
    maxlength: [2000, 'Requirements cannot be more than 2000 characters']
  },
  responsibilities: {
    type: String,
    required: [true, 'Please provide job responsibilities'],
    maxlength: [2000, 'Responsibilities cannot be more than 2000 characters']
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
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Executive'],
    required: true
  },
  skills: [String],
  applicationDeadline: {
    type: Date,
    validate: {
      validator: function(date) {
        return date > new Date()
      },
      message: 'Application deadline must be in the future'
    }
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'draft'],
    default: 'draft'
  },
  applications: [applicationSchema],
  views: {
    type: Number,
    default: 0
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  metadata: {
    applicationCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    saveCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
})

// Index for search functionality
jobSchema.index({
  title: 'text',
  description: 'text',
  requirements: 'text',
  responsibilities: 'text',
  skills: 'text'
})

// Compound indexes for common queries
jobSchema.index({ status: 1, isFeatured: -1, createdAt: -1 })
jobSchema.index({ companyId: 1, status: 1 })
jobSchema.index({ category: 1, jobType: 1, location: 1 })

// Pre-save middleware to update application count
jobSchema.pre('save', function(next) {
  this.metadata.applicationCount = this.applications.length
  next()
})

// Method to add application
jobSchema.methods.addApplication = function(applicationData) {
  this.applications.push(applicationData)
  return this.save()
}

// Method to update application status
jobSchema.methods.updateApplicationStatus = function(applicationId, status, notes = '') {
  const application = this.applications.id(applicationId)
  if (application) {
    application.status = status
    if (notes) {
      application.notes.byEmployer = notes
    }
    if (status === 'accepted') {
      application.interviewDate = new Date()
    }
  }
  return this.save()
}

// Static method to get active jobs
jobSchema.statics.getActiveJobs = function() {
  return this.find({ status: 'active', applicationDeadline: { $gt: new Date() } })
}

// Static method for job search
jobSchema.statics.searchJobs = function(query, filters = {}) {
  const searchQuery = {
    status: 'active',
    applicationDeadline: { $gt: new Date() }
  }

  if (query) {
    searchQuery.$text = { $search: query }
  }

  // Apply filters
  if (filters.category) searchQuery.category = filters.category
  if (filters.jobType) searchQuery.jobType = filters.jobType
  if (filters.location) searchQuery.location = new RegExp(filters.location, 'i')
  if (filters.experienceLevel) searchQuery.experienceLevel = filters.experienceLevel
  if (filters.isRemote !== undefined) searchQuery.isRemote = filters.isRemote
  if (filters.skills && filters.skills.length > 0) {
    searchQuery.skills = { $in: filters.skills }
  }

  return this.find(searchQuery)
    .populate('companyId', 'name logo industry location')
    .populate('employerId', 'name email')
}

export default mongoose.model('Job', jobSchema)