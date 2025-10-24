import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Company from '../models/Company.js'
import Job from '../models/Job.js'
import Course from '../models/Course.js'

dotenv.config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Company.deleteMany({})
    await Job.deleteMany({})
    await Course.deleteMany({})

    console.log('Database cleared')

    // Create sample users
    const employerUser = await User.create({
      name: 'John Employer',
      email: 'employer@example.com',
      password: 'password123',
      role: 'employer'
    })

    const employeeUser = await User.create({
      name: 'Jane Employee',
      email: 'employee@example.com',
      password: 'password123',
      role: 'employee'
    })

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    })

    // Create company
    const company = await Company.create({
      name: 'Tech Solutions Inc',
      description: 'A leading technology company specializing in web development',
      industry: 'Technology',
      size: '51-200',
      location: {
        city: 'San Francisco',
        state: 'CA',
        country: 'United States'
      },
      userId: employerUser._id
    })

    console.log('Sample data created successfully')
    process.exit(0)

  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedData()