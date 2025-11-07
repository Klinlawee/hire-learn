const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    url: {
      type: String,
      required: [true, 'Please provide a resume']
    },
    publicId: String,
    originalName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  coverLetter: {
    text: {
      type: String,
      maxlength: [2000, 'Cover letter cannot be more than 2000 characters']
    },
    fileUrl: String,
    publicId: String
  },
  status: {
    type: String,
    enum: [
      'applied', 
      'under-review', 
      'shortlisted', 
      'interview', 
      'rejected', 
      'offered', 
      'accepted', 
      'withdrawn'
    ],
    default: 'applied'
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  screeningQuestions: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  }],
  notes: {
    candidate: [{
      note: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    employer: [{
      note: String,
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      isPrivate: {
        type: Boolean,
        default: false
      }
    }]
  },
  interview: {
    scheduledAt: Date,
    duration: Number, // in minutes
    type: {
      type: String,
      enum: ['phone', 'video', 'in-person'],
      default: 'video'
    },
    location: String,
    joinUrl: String,
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String,
      strengths: [String],
      improvements: [String]
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled'
    }
  },
  offer: {
    salary: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      },
      period: {
        type: String,
        enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'yearly'
      }
    },
    benefits: [String],
    startDate: Date,
    deadline: Date,
    details: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'expired'],
      default: 'pending'
    }
  },
  source: {
    type: String,
    enum: ['website', 'linkedin', 'indeed', 'referral', 'other'],
    default: 'website'
  },
  referral: {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    relationship: String,
    bonusEligible: {
      type: Boolean,
      default: false
    }
  },
  communication: [{
    type: {
      type: String,
      enum: ['email', 'message', 'call', 'note'],
      required: true
    },
    subject: String,
    message: String,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sentTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  rating: {
    candidate: {
      score: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String
    },
    employer: {
      score: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for resume URL
applicationSchema.virtual('resumeUrl').get(function() {
  return this.resume.url.startsWith('http') ? this.resume.url : `/uploads/resumes/${this.resume.url}`;
});

// Virtual for application age in days
applicationSchema.virtual('ageInDays').get(function() {
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for isActive
applicationSchema.virtual('isActive').get(function() {
  const activeStatuses = ['applied', 'under-review', 'shortlisted', 'interview', 'offered'];
  return activeStatuses.includes(this.status);
});

// Indexes for better query performance
applicationSchema.index({ job: 1 });
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ 'interview.scheduledAt': 1 });
applicationSchema.index({ 'offer.deadline': 1 });

// Pre-save middleware to track status changes
applicationSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedBy: this.employer || this.applicant, // This would need context
      createdAt: new Date()
    });
  }
  next();
});

// Static method to get job applications
applicationSchema.statics.getJobApplications = function(jobId) {
  return this.find({ job: jobId })
    .populate('applicant', 'name email profile.avatar profile.bio skills')
    .sort({ createdAt: -1 });
};

// Static method to get user applications
applicationSchema.statics.getUserApplications = function(userId) {
  return this.find({ applicant: userId })
    .populate('job', 'title company employer location type remote salary')
    .populate('job.company', 'name logo')
    .sort({ createdAt: -1 });
};

// Instance method to update status
applicationSchema.methods.updateStatus = function(newStatus, changedBy, reason = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy: changedBy,
    reason: reason,
    createdAt: new Date()
  });
  return this.save();
};

// Instance method to add communication
applicationSchema.methods.addCommunication = function(communicationData) {
  this.communication.push(communicationData);
  return this.save();
};

module.exports = mongoose.model('Application', applicationSchema);