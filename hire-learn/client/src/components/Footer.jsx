import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, GraduationCap, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'For Job Seekers',
      links: [
        { name: 'Browse Jobs', href: '/jobs' },
        { name: 'Career Advice', href: '/advice' },
        { name: 'Resume Builder', href: '/resume-builder' },
        { name: 'Job Alerts', href: '/alerts' }
      ]
    },
    {
      title: 'For Employers',
      links: [
        { name: 'Post a Job', href: '/employer/dashboard' },
        { name: 'Browse Candidates', href: '/candidates' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Employer Resources', href: '/employer-resources' }
      ]
    },
    {
      title: 'Learning',
      links: [
        { name: 'Course Catalog', href: '/courses' },
        { name: 'Skill Assessments', href: '/assessments' },
        { name: 'Certifications', href: '/certifications' },
        { name: 'Learning Paths', href: '/learning-paths' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' }
      ]
    }
  ]

  return (
    <footer className="bg-navy-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Hire & Learn</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Connecting talented professionals with great opportunities while providing 
              the skills needed to succeed in today's competitive job market.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Links */}
              {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label={social}
                >
                  {/* In a real app, you would use actual social media icons */}
                  <span className="text-sm font-semibold">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-navy-700 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-primary-400 mr-3" />
              <span className="text-gray-300">contact@hirelearn.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-primary-400 mr-3" />
              <span className="text-gray-300">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-primary-400 mr-3" />
              <span className="text-gray-300">New York, NY 10001</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-navy-700 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Hire & Learn. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer