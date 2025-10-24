import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  courseTitle: {
    type: String,
    required: true
  },
  completionDate: {
    type: Date,
    required: true
  },
  grade: {
    type: String,
    enum: ['Distinction', 'Excellent', 'Good', 'Pass'],
    default: 'Pass'
  },
  finalScore: {
    type: Number,
    min: 0,
    max: 100
  },
  certificateUrl: {
    type: String,
    required: true
  },
  verificationCode: {
    type: String,
    unique: true,
    required: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  revokedAt: Date,
  revokedReason: String,
  metadata: {
    issuedBy: {
      type: String,
      default: 'Hire & Learn Platform'
    },
    template: {
      type: String,
      default: 'default'
    },
    expiresAt: Date
  }
}, {
  timestamps: true
})

// Generate certificate ID and verification code before saving
certificateSchema.pre('save', function(next) {
  if (!this.certificateId) {
    this.certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  if (!this.verificationCode) {
    this.verificationCode = Math.random().toString(36).substr(2, 12).toUpperCase()
  }
  
  next()
})

// Index for efficient queries
certificateSchema.index({ userId: 1, courseId: 1 })
certificateSchema.index({ verificationCode: 1 })
certificateSchema.index({ certificateId: 1 })

// Static method to verify certificate
certificateSchema.statics.verifyCertificate = function(verificationCode) {
  return this.findOne({ 
    verificationCode,
    isRevoked: false 
  }).populate('userId', 'name email').populate('courseId', 'title instructor')
}

// Static method to get user certificates
certificateSchema.statics.getUserCertificates = function(userId) {
  return this.find({ userId, isRevoked: false })
    .populate('courseId', 'title category duration instructor')
    .sort({ completionDate: -1 })
}

// Method to revoke certificate
certificateSchema.methods.revoke = function(reason = '') {
  this.isRevoked = true
  this.revokedAt = new Date()
  this.revokedReason = reason
  return this.save()
}

// Virtual for certificate status
certificateSchema.virtual('status').get(function() {
  return this.isRevoked ? 'revoked' : 'active'
})

// Virtual for expiration status
certificateSchema.virtual('isExpired').get(function() {
  if (!this.metadata.expiresAt) return false
  return new Date() > this.metadata.expiresAt
})

export default mongoose.model('Certificate', certificateSchema)