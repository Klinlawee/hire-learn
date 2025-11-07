const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
    maxlength: [100, 'Job title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  salary: {
    min: {
      type: Number,
      min: [0, 'Salary cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Salary cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true
    },
    period: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'yearly'
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  location: {
    type: String,
    required: [true, 'Please provide a job location'],
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  remote: {
    type: String,
    enum: ['remote', 'on-site', 'hybrid'],
    default: 'on-site'
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    default: 'full-time'
  },
  level: {
    type: String,
    enum: ['intern', 'entry', 'mid', 'senior', 'lead', 'executive'],
    default: 'mid'
  },
  skills: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    maxlength: [200, 'Requirement cannot be more than 200 characters']
  }],
  benefits: [{
    type: String,
    maxlength: [200, 'Benefit cannot be more than 200 characters']
  }],
  category: {
    type: String,
    required: [true, 'Please provide a job category'],
    enum: [
      'technology', 'design', 'marketing', 'sales', 'finance', 
      'hr', 'operations', 'healthcare', 'education', 'other'
    ]
  },
  applicationDeadline: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > new Date();
      },
      message: 'Application deadline must be in the future'
    }
  },
  applicationProcess: {
    applyUrl: String,
    applyEmail: String,
    instructions: String
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'draft'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  urgent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted salary display
jobSchema.virtual('salary.display').get(function() {
  if (!this.salary.min && !this.salary.max) return 'Negotiable';
  
  const formatSalary = (amount) => {
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
    return `$${amount}`;
  };

  if (this.salary.min && this.salary.max) {
    return `${formatSalary(this.salary.min)} - ${formatSalary(this.salary.max)}/${this.salary.period}`;
  }
  
  return this.salary.min 
    ? `From ${formatSalary(this.salary.min)}/${this.salary.period}`
    : `Up to ${formatSalary(this.salary.max)}/${this.salary.period}`;
});

// Virtual for isExpired
jobSchema.virtual('isExpired').get(function() {
  return this.applicationDeadline && this.applicationDeadline < new Date();
});

// Indexes for better query performance
jobSchema.index({ employer: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ remote: 1 });
jobSchema.index({ 'salary.min': 1, 'salary.max': 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

// Middleware to update application count
jobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job'
});

// Static method to get active jobs
jobSchema.statics.getActiveJobs = function() {
  return this.find({ 
    status: 'active',
    $or: [
      { applicationDeadline: { $exists: false } },
      { applicationDeadline: { $gt: new Date() } }
    ]
  });
};

// Instance method to check if job is active
jobSchema.methods.isActive = function() {
  return this.status === 'active' && 
    (!this.applicationDeadline || this.applicationDeadline > new Date());
};

module.exports = mongoose.model('Job', jobSchema);