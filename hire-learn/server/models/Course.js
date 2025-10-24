import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  videoUrl: String,
  duration: Number, // in minutes
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
  }
})

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      text: String,
      isCorrect: Boolean
    }],
    explanation: String
  }],
  passingScore: {
    type: Number,
    default: 70
  },
  timeLimit: Number // in minutes
})

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide course title'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Please provide course description'],
    maxlength: 1000
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
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  duration: {
    type: Number, // total hours
    required: true
  },
  lessons: [lessonSchema],
  quizzes: [quizSchema],
  enrolledStudents: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      completedLessons: [{
        lessonId: mongoose.Schema.Types.ObjectId,
        completedAt: Date
      }],
      completedQuizzes: [{
        quizId: mongoose.Schema.Types.ObjectId,
        score: Number,
        completedAt: Date
      }]
    },
    certificateIssued: {
      type: Boolean,
      default: false
    }
  }],
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
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
  tags: [String]
}, {
  timestamps: true
})

// Calculate average rating
courseSchema.methods.updateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0
    return
  }
  
  const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0)
  this.averageRating = (sum / this.ratings.length).toFixed(1)
}

export default mongoose.model('Course', courseSchema)