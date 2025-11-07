const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters'],
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  logo: {
    url: String,
    publicId: String
  },
  coverImage: {
    url: String,
    publicId: String
  },
  description: {
    type: String,
    required: [true, 'Please provide a company description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide a valid website URL']
  },
  industry: {
    type: String,
    required: [true, 'Please provide an industry'],
    enum: [
      'technology', 'finance', 'healthcare', 'education', 'retail',
      'manufacturing', 'entertainment', 'hospitality', 'real-estate',
      'transportation', 'energy', 'telecommunications', 'other'
    ]
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    required: true
  },
  founded: {
    type: Number,
    min: [1800, 'Founded year seems too early'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  headquarters: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  locations: [{
    type: {
      type: String,
      enum: ['headquarters', 'office', 'remote'],
      default: 'office'
    },
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  }],
  contact: {
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: String,
    linkedin: String,
    twitter: String,
    facebook: String
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String,
    youtube: String
  },
  culture: {
    mission: String,
    vision: String,
    values: [String]
  },
  benefits: [{
    title: String,
    description: String,
    icon: String
  }],
  techStack: [String],
  tags: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  owners: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'recruiter'],
      default: 'recruiter'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  stats: {
    totalJobs: {
      type: Number,
      default: 0
    },
    activeJobs: {
      type: Number,
      default: 0
    },
    totalApplications: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for logo URL
companySchema.virtual('logoUrl').get(function() {
  if (!this.logo || !this.logo.url) {
    return '/images/default-company-logo.png';
  }
  return this.logo.url.startsWith('http') ? this.logo.url : `/uploads/companies/${this.logo.url}`;
});

// Virtual for jobs
companySchema.virtual('jobs', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'company'
});

// Virtual for active jobs
companySchema.virtual('activeJobs', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'company',
  match: { status: 'active' }
});

// Indexes for better query performance
companySchema.index({ name: 1 });
companySchema.index({ slug: 1 });
companySchema.index({ industry: 1 });
companySchema.index({ size: 1 });
companySchema.index({ 'headquarters.country': 1 });
companySchema.index({ isVerified: 1 });
companySchema.index({ name: 'text', description: 'text', tags: 'text' });

// Pre-save middleware to generate slug
companySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Static method to find by slug
companySchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug }).populate('owners.user', 'name email profile.avatar');
};

// Instance method to check if user is owner
companySchema.methods.isOwner = function(userId) {
  return this.owners.some(owner => owner.user.toString() === userId.toString());
};

// Instance method to get public profile
companySchema.methods.getPublicProfile = function() {
  const companyObject = this.toObject();
  delete companyObject.owners;
  return companyObject;
};

module.exports = mongoose.model('Company', companySchema);