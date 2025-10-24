import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Lesson title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: true
  },
  videoUrl: String,
  duration: {
    type: Number, // in minutes
    required: true
  },
  resources: [{
    name: String,
    url: String,
    type: String
  }],
  order: {
    type: Number,
    required: true
  },
  isFree: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  }
})

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Quiz title cannot be more than 200 characters']
  },
  description: String,
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      text: {
        type: String,
        required: true
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }],
    explanation: String,
    points: {
      type: Number,
      default: 1
    }
  }],
  passingScore: {
    type: Number,
    default: 70,
    min: 0,
    max: 100
  },
  timeLimit: Number, // in minutes
  maxAttempts: {
    type: Number,
    default: 3
  },
  isPublished: {
    type: Boolean,
    default: false
  }
})

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    completedLessons: [{
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
      },
      completedAt: {
        type: Date,
        default: Date.now
      },
      timeSpent: Number // in minutes
    }],
    completedQuizzes: [{
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
      },
      score: Number,
      maxScore: Number,
      completedAt: {
        type: Date,
        default: Date.now
      },
      attempts: {
        type: Number,
        default: 1
      }
    }],
    lastAccessed: Date,
    totalTimeSpent: {
      type: Number,
      default: 0
    }
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped'],
    default: 'active'
  }
})

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide course title'],
    trim: true,
    maxlength: [200, 'Course title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide course description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot be more than 500 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please provide course category'],
    enum: [
      'Web Development', 'Mobile Development', 'Data Science', 'Design',
      'Business', 'Marketing', 'Finance', 'Personal Development', 'Other'
    ]
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  previewVideo: String,
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0,
    validate: {
      validator: function(value) {
        return value <= this.price
      },
      message: 'Discount price cannot be higher than regular price'
    }
  },
  duration: {
    type: Number, // total hours
    required: true
  },
  lessons: [lessonSchema],
  quizzes: [quizSchema],
  enrolledStudents: [enrollmentSchema],
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    review: {
      type: String,
      maxlength: [1000, 'Review cannot be more than 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  requirements: [String],
  learningOutcomes: [String],
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  metadata: {
    totalLessons: {
      type: Number,
      default: 0
    },
    totalQuizzes: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
})

// Index for search functionality
courseSchema.index({
  title: 'text',
  description: 'text',
  shortDescription: 'text',
  tags: 'text'
})

// Pre-save middleware to update calculated fields
courseSchema.pre('save', function(next) {
  // Update total lessons and quizzes
  this.metadata.totalLessons = this.lessons.length
  this.metadata.totalQuizzes = this.quizzes.length
  
  // Update total students
  this.totalStudents = this.enrolledStudents.length
  
  // Calculate average rating
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0)
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10
  }
  
  next()
})

// Method to enroll student
courseSchema.methods.enrollStudent = function(studentId) {
  const existingEnrollment = this.enrolledStudents.find(
    enrollment => enrollment.studentId.toString() === studentId.toString()
  )
  
  if (!existingEnrollment) {
    this.enrolledStudents.push({
      studentId,
      enrolledAt: new Date()
    })
    return this.save()
  }
  return Promise.resolve(this)
}

// Method to update lesson progress
courseSchema.methods.updateLessonProgress = function(studentId, lessonId, timeSpent = 0) {
  const enrollment = this.enrolledStudents.find(
    enroll => enroll.studentId.toString() === studentId.toString()
  )
  
  if (enrollment) {
    const existingLesson = enrollment.progress.completedLessons.find(
      lesson => lesson.lessonId.toString() === lessonId.toString()
    )
    
    if (!existingLesson) {
      enrollment.progress.completedLessons.push({
        lessonId,
        timeSpent
      })
      enrollment.progress.lastAccessed = new Date()
      enrollment.progress.totalTimeSpent += timeSpent
    }
  }
  
  return this.save()
}

// Method to calculate student progress
courseSchema.methods.getStudentProgress = function(studentId) {
  const enrollment = this.enrolledStudents.find(
    enroll => enroll.studentId.toString() === studentId.toString()
  )
  
  if (!enrollment) return 0
  
  const totalItems = this.lessons.length + this.quizzes.length
  if (totalItems === 0) return 0
  
  const completedItems = enrollment.progress.completedLessons.length + 
                        enrollment.progress.completedQuizzes.length
  
  return Math.round((completedItems / totalItems) * 100)
}

// Static method for course search
courseSchema.statics.searchCourses = function(query, filters = {}) {
  const searchQuery = { status: 'published' }

  if (query) {
    searchQuery.$text = { $search: query }
  }

  // Apply filters
  if (filters.category) searchQuery.category = filters.category
  if (filters.difficulty) searchQuery.difficulty = filters.difficulty
  if (filters.instructor) searchQuery.instructor = filters.instructor
  if (filters.minRating) searchQuery.averageRating = { $gte: filters.minRating }
  if (filters.isFeatured !== undefined) searchQuery.isFeatured = filters.isFeatured
  if (filters.priceRange) {
    if (filters.priceRange === 'free') {
      searchQuery.price = 0
    } else if (filters.priceRange === 'paid') {
      searchQuery.price = { $gt: 0 }
    }
  }

  return this.find(searchQuery)
    .populate('instructor', 'name avatar profile.headline')
}

export default mongoose.model('Course', courseSchema)