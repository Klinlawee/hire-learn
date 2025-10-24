import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Clock, Users, PlayCircle, FileText, Download, CheckCircle, BookOpen } from 'lucide-react'

const CourseDetail = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock course data - in real app, this would come from API
  const course = {
    id: 1,
    title: 'React Masterclass 2024',
    instructor: {
      name: 'John Doe',
      bio: 'Senior Frontend Developer with 8+ years of experience',
      avatar: '/api/placeholder/100/100',
      rating: 4.9,
      students: 15000
    },
    description: 'Learn React from basics to advanced concepts with hands-on projects. This comprehensive course covers everything you need to become a professional React developer.',
    longDescription: `In this comprehensive React Masterclass, you'll learn everything from the fundamentals of React to advanced concepts like state management, hooks, context API, and performance optimization.

What you'll learn:
• React fundamentals and JSX syntax
• Components, props, and state management
• React Hooks (useState, useEffect, useContext, etc.)
• Routing with React Router
• State management with Context API and Redux
• Performance optimization techniques
• Testing React applications
• Building and deploying React apps

This course includes hands-on projects that simulate real-world scenarios, giving you practical experience that you can apply immediately in your job or personal projects.`,
    duration: '12 hours',
    level: 'Intermediate',
    students: 2500,
    rating: 4.8,
    totalRatings: 1247,
    price: 89.99,
    originalPrice: 129.99,
    thumbnail: '/api/placeholder/800/450',
    category: 'Web Development',
    lastUpdated: 'January 2024',
    language: 'English',
    certificate: true,
    lifetimeAccess: true,
    features: [
      '12 hours on-demand video',
      '50+ coding exercises',
      '5 real-world projects',
      'Certificate of completion',
      'Lifetime access',
      'Mobile and TV access'
    ],
    curriculum: [
      {
        section: 'Getting Started with React',
        lessons: [
          { id: 1, title: 'Introduction to React', duration: '15:30', type: 'video', free: true },
          { id: 2, title: 'Setting up Development Environment', duration: '20:15', type: 'video', free: true },
          { id: 3, title: 'Your First React Component', duration: '25:45', type: 'video', free: false }
        ]
      },
      {
        section: 'React Fundamentals',
        lessons: [
          { id: 4, title: 'JSX Deep Dive', duration: '30:20', type: 'video', free: false },
          { id: 5, title: 'Props and Component Communication', duration: '35:10', type: 'video', free: false },
          { id: 6, title: 'State and Event Handling', duration: '28:45', type: 'video', free: false },
          { id: 7, title: 'Exercise: Building a Todo App', duration: '45:00', type: 'exercise', free: false }
        ]
      },
      {
        section: 'Advanced React Concepts',
        lessons: [
          { id: 8, title: 'React Hooks Masterclass', duration: '50:15', type: 'video', free: false },
          { id: 9, title: 'Context API for State Management', duration: '40:30', type: 'video', free: false },
          { id: 10, title: 'Performance Optimization', duration: '35:20', type: 'video', free: false }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        user: 'Sarah M.',
        rating: 5,
        comment: 'Excellent course! The instructor explains complex concepts in a very understandable way.',
        date: '2 weeks ago',
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 2,
        user: 'Mike R.',
        rating: 4,
        comment: 'Great content, but some exercises could be more challenging.',
        date: '1 month ago',
        avatar: '/api/placeholder/40/40'
      }
    ]
  }

  const totalLessons = course.curriculum.reduce((total, section) => total + section.lessons.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            <nav className="text-sm text-gray-500 mb-4">
              <span>Courses </span>
              <span> &gt; {course.category} </span>
              <span> &gt; {course.title}</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{course.description}</p>

            {/* Course Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(course.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 font-semibold">{course.rating}</span>
                <span className="text-gray-600 ml-1">({course.totalRatings} ratings)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-1" />
                <span>{course.students.toLocaleString()} students</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-1" />
                <span>{course.duration} total</span>
              </div>
              <div className="flex items-center text-gray-600">
                <BookOpen className="w-5 h-5 mr-1" />
                <span>{totalLessons} lessons</span>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-6">
              <span>Created by <strong>{course.instructor.name}</strong></span>
              <span className="mx-2">•</span>
              <span>Last updated {course.lastUpdated}</span>
              <span className="mx-2">•</span>
              <span>{course.language}</span>
            </div>
          </div>

          {/* Right Column - Pricing & Enrollment */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6">
              <div className="relative mb-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                  <PlayCircle className="w-16 h-16 text-white" />
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl font-bold text-primary-600">${course.price}</span>
                <span className="text-lg text-gray-500 line-through">${course.originalPrice}</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                  {Math.round((1 - course.price / course.originalPrice) * 100)}% off
                </span>
              </div>

              <button className="w-full btn-primary text-lg py-3 mb-4">
                Enroll Now
              </button>

              <div className="text-center text-sm text-gray-600 mb-4">
                30-Day Money-Back Guarantee
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">This course includes:</h3>
                <ul className="space-y-2">
                  {course.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{course.longDescription}</p>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Course Content</h2>
                  <div className="text-sm text-gray-600">
                    {course.curriculum.length} sections • {totalLessons} lessons • {course.duration}
                  </div>
                </div>

                <div className="space-y-4">
                  {course.curriculum.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold">{section.section}</h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                            <div className="flex items-center">
                              {lesson.type === 'video' ? (
                                <PlayCircle className="w-5 h-5 text-gray-400 mr-3" />
                              ) : (
                                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                              )}
                              <div>
                                <h4 className="font-medium">{lesson.title}</h4>
                                <p className="text-sm text-gray-500">{lesson.duration}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {lesson.free && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  Free
                                </span>
                              )}
                              {lesson.type === 'video' && (
                                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                  Preview
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">Instructor</h2>
                <div className="flex items-start space-x-6">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-20 h-20 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{course.instructor.name}</h3>
                    <p className="text-gray-600 mb-4">{course.instructor.bio}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>{course.instructor.rating} Instructor Rating</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{course.instructor.students.toLocaleString()} Students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
                <div className="space-y-6">
                  {course.reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.avatar}
                          alt={review.user}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{review.user}</h4>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6">
              <h3 className="font-semibold mb-4">Download Resources</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm">Course Slides</span>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm">Exercise Files</span>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail