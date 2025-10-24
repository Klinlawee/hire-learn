import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide company description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  logo: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please provide a valid URL'
    ]
  },
  industry: {
    type: String,
    required: [true, 'Please provide industry'],
    enum: [
      'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
      'Retail', 'Hospitality', 'Construction', 'Transportation', 'Other'
    ]
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'United States'
    },
    zipCode: String
  },
  contact: {
    email: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: String
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    totalJobs: {
      type: Number,
      default: 0
    },
    totalHires: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
})

// Index for search functionality
companySchema.index({ 
  name: 'text', 
  description: 'text', 
  industry: 'text' 
})

// Update total jobs count when jobs are added/removed
companySchema.methods.updateJobCount = async function() {
  const Job = mongoose.model('Job')
  const jobCount = await Job.countDocuments({ companyId: this._id, status: 'active' })
  this.metadata.totalJobs = jobCount
  return this.save()
}

// Virtual for company rating
companySchema.virtual('rating').get(function() {
  return this.metadata.averageRating
})

export default mongoose.model('Company', companySchema)