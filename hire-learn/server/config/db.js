import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hire-learn'

// Connection options for better performance and stability
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // and MongoDB driver buffering
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5, // Maintain at least 5 socket connections
  maxIdleTimeMS: 30000, // Close idle connections after 30s
  family: 4, // Use IPv4, skip trying IPv6
}

// Cache the connection to prevent multiple connections in development
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { 
    conn: null, 
    promise: null 
  }
}

/**
 * Connect to MongoDB with connection pooling and caching
 * @returns {Promise<mongoose.Connection>}
 */
async function connectDB() {
  // If we have a cached connection, return it
  if (cached.conn) {
    console.log('📀 Using cached MongoDB connection')
    return cached.conn
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      ...connectionOptions
    }

    console.log('🔄 Attempting to connect to MongoDB...')
    console.log(`📊 Database: ${MONGODB_URI.replace(/(mongodb\+srv?:\/\/[^:]+:)[^@]+@/, '$1****@')}`) // Hide password in logs

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully')
        return mongoose
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error)
        cached.promise = null // Reset promise on error to allow retry
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null // Reset promise on error
    throw error
  }

  return cached.conn
}

/**
 * Close the MongoDB connection
 * @returns {Promise<void>}
 */
async function disconnectDB() {
  if (!cached.conn) {
    return
  }

  try {
    await mongoose.disconnect()
    cached.conn = null
    cached.promise = null
    console.log('📀 MongoDB connection closed')
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error)
    throw error
  }
}

/**
 * Get the current connection state
 * @returns {number} MongoDB connection state (0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting)
 */
function getConnectionState() {
  return mongoose.connection.readyState
}

/**
 * Check if the database is connected
 * @returns {boolean}
 */
function isConnected() {
  return getConnectionState() === 1
}

/**
 * Get database connection statistics
 * @returns {Object} Connection stats
 */
function getConnectionStats() {
  const state = getConnectionState()
  const stateNames = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting'
  }

  return {
    state: stateNames[state] || 'unknown',
    readyState: state,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
    models: Object.keys(mongoose.connection.models),
    collections: Object.keys(mongoose.connection.collections)
  }
}

// Event listeners for connection monitoring
mongoose.connection.on('connected', () => {
  console.log('📀 MongoDB connection established')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('📀 MongoDB connection disconnected')
})

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB connection reestablished')
})

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await disconnectDB()
    console.log('👋 Application terminated, MongoDB connection closed')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during application termination:', error)
    process.exit(1)
  }
})

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('💥 Uncaught Exception:', error)
  try {
    await disconnectDB()
  } catch (disconnectError) {
    console.error('❌ Error disconnecting MongoDB during crash:', disconnectError)
  }
  process.exit(1)
})

// Export functions and connection
export {
  connectDB,
  disconnectDB, 
  getConnectionState,
  isConnected,
  getConnectionStats,
  mongoose
}

export default connectDB