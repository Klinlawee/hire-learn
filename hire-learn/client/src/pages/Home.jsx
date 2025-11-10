import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, GraduationCap, ArrowRight } from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Career Journey
            <span className="block gradient-text">Starts Here</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing job opportunities and enhance your skills with our 
            comprehensive learning platform. Hire talent or get hired - we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs" className="btn-primary text-lg px-8 py-3">
              <Briefcase className="w-5 h-5 mr-2" />
              Find Jobs
            </Link>
            <Link to="/courses" className="btn-outline text-lg px-8 py-3">
              <GraduationCap className="w-5 h-5 mr-2" />
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Hire & Learn?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to advance your career or find the perfect talent.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Your Dream Job</h3>
              <p className="text-gray-600">
                Browse thousands of job listings from top companies and startups.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn New Skills</h3>
              <p className="text-gray-600">
                Access courses taught by industry experts to boost your career.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
              <p className="text-gray-600">
                Combine job opportunities with learning for continuous growth.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home