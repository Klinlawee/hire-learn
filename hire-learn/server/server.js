import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'

// Import database connection
import { connectDB, getConnectionStats } from './config/db.js'

// Import routes
import authRoutes from './routes/authRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import certificateRoutes from './routes/certificateRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

// Load env variables
dotenv.config()

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Database connection
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB()
    
    // Routes
    app.use('/api/auth', authRoutes)
    app.use('/api/jobs', jobRoutes)
    app.use('/api/courses', courseRoutes)
    app.use('/api/certificates', certificateRoutes)
    app.use('/api/admin', adminRoutes)

    // Health check route with DB status
    app.get('/api/health', (req, res) => {
      const dbStats = getConnectionStats()
      res.status(200).json({ 
        status: 'OK', 
        message: 'Hire & Learn API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: {
          status: dbStats.state,
          models: dbStats.models.length,
          collections: dbStats.collections.length
        }
      })
    })

    // Database status route
    app.get('/api/health/db', (req, res) => {
      const stats = getConnectionStats()
      res.status(200).json({
        success: true,
        data: stats
      })
    })

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({ 
        success: false,
        message: 'API route not found' 
      })
    })

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error Stack:', err.stack)
      
      // Multer errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Please upload a smaller file.'
        })
      }
      
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          message: 'Unexpected field in file upload.'
        })
      }

      // MongoDB errors
      if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        })
      }

      // Mongoose validation errors
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message)
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: messages
        })
      }

      // Default error
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      })
    })

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🔗 API URL: http://localhost:${PORT}/api`)
      console.log(`💾 Database: ${getConnectionStats().state}`)
    })

  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()

export default app