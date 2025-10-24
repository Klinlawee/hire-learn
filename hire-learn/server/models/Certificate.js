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
  revokedReason: String
}, {
  timestamps: true
})

// Generate certificate ID before saving
certificateSchema.pre('save', function(next) {
  if (!this.certificateId) {
    this.certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  if (!this.verificationCode) {
    this.verificationCode = Math.random().toString(36).substr(2, 12).toUpperCase()
  }
  
  next()
})

export default mongoose.model('Certificate', certificateSchema)