import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Briefcase, GraduationCap, Users, ArrowRight, Star } from 'lucide-react'

const Home = () => {
  const stats = [
    { number: '10,000+', label: 'Jobs Available' },
    { number: '5,000+', label: 'Companies Hiring' },
    { number: '500+', label: 'Courses' },
    { number: '50,000+', label: 'Happy Users' }
  ]

  const featuredJobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80,000 - $100,000',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$70,000 - $90,000',
      posted: '1 day ago'
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'DataInsights',
      location: 'San Francisco, CA',
      type: 'Remote',
      salary: '$100,000 - $130,000',
      posted: '3 days ago'
    }
  ]

  const featuredCourses = [
    {
      id: 1,
      title: 'React Masterclass',
      instructor: 'John Doe',
      duration: '12 hours',
      level: 'Intermediate',
      rating: 4.8,
      students: 2500,
      price: 89.99
    },
    {
      id: 2,
      title: 'Node.js Backend Development',
      instructor: 'Jane Smith',
      duration: '15 hours',
      level: 'Advanced',
      rating: 4.7,
      students: 1800,
      price: 99.99
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Johnson',
      duration: '8 hours',
      level: 'Beginner',
      rating: 4.9,
      students: 3200,
      price: 69.99
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-navy-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find Your Dream Job & Grow Your Skills
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with top employers, learn new skills, and advance your career with our all-in-one platform.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-2 shadow-lg">
            <div className="flex items-center">
              <Search className="text-gray-400 ml-3" size={20} />
              <input
                type="text"
                placeholder="Search for jobs, companies, or skills..."
                className="w-full px-4 py-3 text-gray-800 outline-none"
              />
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Search
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-8 mt-8">
            <Link to="/register?role=employee" className="btn-primary text-lg px-8 py-3">
              Find Jobs
            </Link>
            <Link to="/register?role=employer" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Post Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Hire & Learn?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Briefcase className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Find Great Jobs</h3>
              <p className="text-gray-600">Connect with top companies and find opportunities that match your skills.</p>
            </div>
            <div className="text-center p-6">
              <GraduationCap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Learn New Skills</h3>
              <p className="text-gray-600">Access hundreds of courses to upgrade your skills and advance your career.</p>
            </div>
            <div className="text-center p-6">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Build Connections</h3>
              <p className="text-gray-600">Network with professionals and build meaningful career connections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Jobs</h2>
            <Link to="/employee/dashboard" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View All Jobs <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map(job => (
              <div key={job.id} className="card p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.company} • {job.location}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                    {job.type}
                  </span>
                  <span className="text-gray-600">{job.salary}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{job.posted}</span>
                  <button className="btn-primary text-sm px-4 py-2">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Courses</h2>
            <Link to="/courses" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              Browse All Courses <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map(course => (
              <div key={course.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                    {course.level}
                  </span>
                  <div className="flex items-center ml-auto">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-2">By {course.instructor}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">{course.duration}</span>
                  <span className="text-sm text-gray-600">{course.students} students</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary-600">${course.price}</span>
                  <button className="btn-primary text-sm px-4 py-2">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs and upgraded their skills with us.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register?role=employee" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get Started as Job Seeker
            </Link>
            <Link to="/register?role=employer" className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors">
              Post Jobs as Employer
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home