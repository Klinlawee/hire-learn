const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true,
    maxlength: [100, 'Course title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  thumbnail: {
    url: String,
    publicId: String
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a course category'],
    enum: [
      'web-development', 'mobile-development', 'data-science', 
      'design', 'marketing', 'business', 'photography',
      'music', 'health', 'language', 'other'
    ]
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
    default: 'beginner'
  },
  duration: {
    value: {
      type: Number,
      required: [true, 'Please provide course duration']
    },
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks', 'months'],
      default: 'hours'
    }
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Please provide course price'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true
    },
    discount: {
      percentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      validUntil: Date
    },
    isFree: {
      type: Boolean,
      default: false
    }
  },
  curriculum: [{
    section: {
      type: String,
      required: true,
      maxlength: [100, 'Section title cannot be more than 100 characters']
    },
    lectures: [{
      title: {
        type: String,
        required: true,
        maxlength: [100, 'Lecture title cannot be more than 100 characters']
      },
      duration: {
        type: Number, // in minutes
        required: true,
        min: [1, 'Duration must be at least 1 minute']
      },
      videoUrl: String,
      resources: [{
        name: String,
        url: String,
        type: String
      }],
      isPreview: {
        type: Boolean,
        default: false
      }
    }]
  }],
  requirements: [{
    type: String,
    maxlength: [200, 'Requirement cannot be more than 200 characters']
  }],
  learningOutcomes: [{
    type: String,
    maxlength: [200, 'Learning outcome cannot be more than 200 characters']
  }],
  tags: [String],
  language: {
    type: String,
    default: 'English'
  },
  captions: [{
    language: String,
    url: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  certificate: {
    included: {
      type: Boolean,
      default: false
    },
    template: String,
    requirements: {
      minProgress: {
        type: Number,
        min: 0,
        max: 100,
        default: 80
      },
      minQuizScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 70
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for thumbnail URL
courseSchema.virtual('thumbnailUrl').get(function() {
  if (!this.thumbnail || !this.thumbnail.url) {
    return '/images/default-course-thumbnail.jpg';
  }
  return this.thumbnail.url.startsWith('http') ? this.thumbnail.url : `/uploads/courses/${this.thumbnail.url}`;
});

// Virtual for current price (with discount)
courseSchema.virtual('currentPrice').get(function() {
  if (this.price.isFree) return 0;
  
  const now = new Date();
  const hasValidDiscount = this.price.discount.percentage > 0 && 
    (!this.price.discount.validUntil || this.price.discount.validUntil > now);
  
  if (hasValidDiscount) {
    const discountAmount = (this.price.amount * this.price.discount.percentage) / 100;
    return this.price.amount - discountAmount;
  }
  
  return this.price.amount;
});

// Virtual for total duration in hours
courseSchema.virtual('totalDuration').get(function() {
  const totalMinutes = this.curriculum.reduce((total, section) => {
    return total + section.lectures.reduce((sectionTotal, lecture) => {
      return sectionTotal + (lecture.duration || 0);
    }, 0);
  }, 0);
  
  return Math.round(totalMinutes / 60 * 10) / 10; // Convert to hours with 1 decimal
});

// Virtual for students
courseSchema.virtual('students', {
  ref: 'Certificate',
  localField: '_id',
  foreignField: 'course'
});

// Indexes for better query performance
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ 'price.amount': 1 });
courseSchema.index({ featured: 1 });
courseSchema.index({ enrollmentCount: -1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Pre-save middleware to generate slug
courseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Static method to find published courses
courseSchema.statics.getPublishedCourses = function() {
  return this.find({ status: 'published' });
};

// Instance method to check if course is published
courseSchema.methods.isPublished = function() {
  return this.status === 'published';
};

// Instance method to update rating
courseSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }

  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = Math.round((total / this.reviews.length) * 10) / 10;
  this.rating.count = this.reviews.length;
  
  // Update distribution
  this.rating.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  this.reviews.forEach(review => {
    this.rating.distribution[review.rating]++;
  });
};

module.exports = mongoose.model('Course', courseSchema);