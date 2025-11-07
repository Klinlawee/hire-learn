const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > this.issueDate;
      },
      message: 'Expiry date must be after issue date'
    }
  },
  fileUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'revoked'],
    default: 'active'
  },
  verificationCode: {
    type: String,
    required: true,
    unique: true
  },
  progress: {
    completed: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    quizScore: {
      type: Number,
      min: 0,
      max: 100
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  metadata: {
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    templateUsed: String,
    format: {
      type: String,
      enum: ['pdf', 'png', 'jpg'],
      default: 'pdf'
    },
    quality: {
      type: String,
      enum: ['standard', 'high', 'premium'],
      default: 'standard'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for certificate URL
certificateSchema.virtual('certificateUrl').get(function() {
  return this.fileUrl.startsWith('http') ? this.fileUrl : `/uploads/certificates/${this.fileUrl}`;
});

// Virtual for isExpired
certificateSchema.virtual('isExpired').get(function() {
  return this.expiryDate && this.expiryDate < new Date();
});

// Virtual for isValid
certificateSchema.virtual('isValid').get(function() {
  return this.status === 'active' && !this.isExpired;
});

// Indexes for better query performance
certificateSchema.index({ user: 1 });
certificateSchema.index({ course: 1 });
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ verificationCode: 1 });
certificateSchema.index({ issueDate: -1 });
certificateSchema.index({ user: 1, course: 1 }, { unique: true });
certificateSchema.index({ status: 1, expiryDate: 1 });

// Pre-save middleware to generate certificate ID and verification code
certificateSchema.pre('save', function(next) {
  if (this.isNew) {
    // Generate unique certificate ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.certificateId = `CERT-${timestamp}-${random}`.toUpperCase();
    
    // Generate verification code
    this.verificationCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    
    // Set status to expired if expiry date passed
    if (this.expiryDate && this.expiryDate < new Date()) {
      this.status = 'expired';
    }
  }
  next();
});

// Static method to find by verification code
certificateSchema.statics.findByVerificationCode = function(code) {
  return this.findOne({ verificationCode: code.toUpperCase() })
    .populate('user', 'name email profile.avatar')
    .populate('course', 'title instructor category duration');
};

// Static method to get user certificates
certificateSchema.statics.getUserCertificates = function(userId) {
  return this.find({ user: userId })
    .populate('course', 'title category thumbnail instructor')
    .sort({ issueDate: -1 });
};

// Instance method to verify certificate
certificateSchema.methods.verify = function() {
  return this.status === 'active' && 
    (!this.expiryDate || this.expiryDate > new Date());
};

// Instance method to revoke certificate
certificateSchema.methods.revoke = function() {
  this.status = 'revoked';
  return this.save();
};

module.exports = mongoose.model('Certificate', certificateSchema);