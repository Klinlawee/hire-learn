import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['employee', 'employer', 'admin'],
    default: 'employee'
  },
  avatar: {
    type: String,
    default: ''
  },
  googleId: {
    type: String,
    sparse: true
  },
  profile: {
    headline: String,
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot be more than 1000 characters']
    },
    location: String,
    phone: String,
    website: String,
    skills: [String],
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: Date,
      endDate: Date,
      current: {
        type: Boolean,
        default: false
      },
      description: String
    }],
    education: [{
      school: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      current: {
        type: Boolean,
        default: false
      }
    }]
  },
  resume: {
    url: String,
    fileName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  preferences: {
    jobAlerts: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    }
  },
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for search functionality
userSchema.index({ 
  name: 'text', 
  email: 'text', 
  'profile.headline': 'text', 
  'profile.skills': 'text' 
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
})

// Update last login on login
userSchema.methods.updateLoginStats = function() {
  this.lastLogin = new Date()
  this.loginCount += 1
  return this.save()
}

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false
  return await bcrypt.compare(enteredPassword, this.password)
}

// Transform output
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  return user
}

// Static method to get users by role
userSchema.statics.getByRole = function(role) {
  return this.find({ role })
}

// Virtual for full profile completion percentage
userSchema.virtual('profileCompletion').get(function() {
  let completion = 0
  const fields = [
    this.name,
    this.email,
    this.profile?.headline,
    this.profile?.location,
    this.profile?.skills?.length > 0,
    this.resume?.url
  ]
  
  const completedFields = fields.filter(Boolean).length
  completion = (completedFields / fields.length) * 100
  return Math.round(completion)
})

export default mongoose.model('User', userSchema)