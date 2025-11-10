import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import {
  User,
  Mail,
  MapPin,
  Phone,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Edit3,
  Camera,
  Save,
  X,
  Plus,
  Trash2,
  Linkedin,
  Github,
  Twitter
} from 'lucide-react'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [formData, setFormData] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/auth/profile')
      setProfile(response.data.data)
      setFormData(response.data.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (path, value) => {
    const keys = path.split('.')
    setFormData(prev => {
      const newData = { ...prev }
      let current = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateProfile(formData)
      setIsEditing(false)
      fetchUserProfile() // Refresh data
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  const addEducation = () => {
    const newEducation = {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    setFormData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEducation]
    }))
  }

  const updateEducation = (index, field, value) => {
    setFormData(prev => {
      const newEducation = [...(prev.education || [])]
      newEducation[index] = { ...newEducation[index], [field]: value }
      return { ...prev, education: newEducation }
    })
  }

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const addExperience = () => {
    const newExperience = {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    setFormData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newExperience]
    }))
  }

  const updateExperience = (index, field, value) => {
    setFormData(prev => {
      const newExperience = [...(prev.experience || [])]
      newExperience[index] = { ...newExperience[index], [field]: value }
      return { ...prev, experience: newExperience }
    })
  }

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), '']
    }))
  }

  const updateSkill = (index, value) => {
    setFormData(prev => {
      const newSkills = [...(prev.skills || [])]
      newSkills[index] = value
      return { ...prev, skills: newSkills }
    })
  }

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading profile..." />
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-error-600 text-lg mb-4">Failed to load profile</div>
          <button onClick={fetchUserProfile} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center mb-6 lg:mb-0">
              {/* Avatar */}
              <div className="relative">
                {formData.profile?.avatar ? (
                  <img
                    src={formData.profile.avatar}
                    alt={formData.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                
                {isEditing && (
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:bg-primary-700 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>

              <div className="ml-6">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-primary-500 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                )}
                
                <div className="flex items-center text-lg text-gray-600 mt-2">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span className="capitalize">{profile.role}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{profile.email}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="btn-outline flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary flex items-center"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['personal', 'education', 'experience', 'skills', 'social'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
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
        <div className="card p-6">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="input"
                    />
                  ) : (
                    <div className="text-gray-900">{profile.name}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="text-gray-900">{profile.email}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.profile?.phone || ''}
                      onChange={(e) => handleInputChange('profile.phone', e.target.value)}
                      className="input"
                    />
                  ) : (
                    <div className="text-gray-900">{profile.profile?.phone || 'Not provided'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.profile?.location || ''}
                      onChange={(e) => handleInputChange('profile.location', e.target.value)}
                      className="input"
                    />
                  ) : (
                    <div className="text-gray-900">{profile.profile?.location || 'Not provided'}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                {isEditing ? (
                  <textarea
                    value={formData.profile?.bio || ''}
                    onChange={(e) => handleInputChange('profile.bio', e.target.value)}
                    rows={4}
                    className="input"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="text-gray-900 whitespace-pre-line">
                    {profile.profile?.bio || 'No bio provided'}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.profile?.website || ''}
                    onChange={(e) => handleInputChange('profile.website', e.target.value)}
                    className="input"
                    placeholder="https://example.com"
                  />
                ) : (
                  <div className="text-gray-900">
                    {profile.profile?.website ? (
                      <a href={profile.profile.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                        {profile.profile.website}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Education</h2>
                {isEditing && (
                  <button onClick={addEducation} className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </button>
                )}
              </div>

              {(!formData.education || formData.education.length === 0) ? (
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No education added</h3>
                  <p className="text-gray-600">Add your educational background to complete your profile.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      {isEditing && (
                        <div className="flex justify-end mb-4">
                          <button
                            onClick={() => removeEducation(index)}
                            className="text-error-600 hover:text-error-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label">Institution</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={edu.institution || ''}
                              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                              className="input"
                            />
                          ) : (
                            <div className="text-gray-900">{edu.institution}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Degree</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={edu.degree || ''}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                              className="input"
                            />
                          ) : (
                            <div className="text-gray-900">{edu.degree}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Field of Study</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={edu.field || ''}
                              onChange={(e) => updateEducation(index, 'field', e.target.value)}
                              className="input"
                            />
                          ) : (
                            <div className="text-gray-900">{edu.field}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Duration</label>
                          <div className="grid grid-cols-2 gap-2">
                            {isEditing ? (
                              <>
                                <input
                                  type="month"
                                  value={edu.startDate || ''}
                                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                                  className="input"
                                />
                                <input
                                  type="month"
                                  value={edu.current ? '' : edu.endDate || ''}
                                  onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                                  disabled={edu.current}
                                  className="input"
                                  placeholder={edu.current ? 'Present' : ''}
                                />
                              </>
                            ) : (
                              <div className="text-gray-900 col-span-2">
                                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                              </div>
                            )}
                          </div>
                          {isEditing && (
                            <div className="flex items-center mt-2">
                              <input
                                type="checkbox"
                                checked={edu.current || false}
                                onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                                className="mr-2"
                              />
                              <label className="text-sm text-gray-600">I currently study here</label>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-group mt-4">
                        <label className="form-label">Description</label>
                        {isEditing ? (
                          <textarea
                            value={edu.description || ''}
                            onChange={(e) => updateEducation(index, 'description', e.target.value)}
                            rows={3}
                            className="input"
                          />
                        ) : (
                          <div className="text-gray-900 whitespace-pre-line">
                            {edu.description || 'No description provided'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Work Experience</h2>
                {isEditing && (
                  <button onClick={addExperience} className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </button>
                )}
              </div>

              {(!formData.experience || formData.experience.length === 0) ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No experience added</h3>
                  <p className="text-gray-600">Add your work experience to showcase your professional background.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      {isEditing && (
                        <div className="flex justify-end mb-4">
                          <button
                            onClick={() => removeExperience(index)}
                            className="text-error-600 hover:text-error-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label">Company</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={exp.company || ''}
                              onChange={(e) => updateExperience(index, 'company', e.target.value)}
                              className="input"
                            />
                          ) : (
                            <div className="text-gray-900">{exp.company}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Position</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={exp.position || ''}
                              onChange={(e) => updateExperience(index, 'position', e.target.value)}
                              className="input"
                            />
                          ) : (
                            <div className="text-gray-900">{exp.position}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Location</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={exp.location || ''}
                              onChange={(e) => updateExperience(index, 'location', e.target.value)}
                              className="input"
                            />
                          ) : (
                            <div className="text-gray-900">{exp.location || 'Not specified'}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Duration</label>
                          <div className="grid grid-cols-2 gap-2">
                            {isEditing ? (
                              <>
                                <input
                                  type="month"
                                  value={exp.startDate || ''}
                                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                  className="input"
                                />
                                <input
                                  type="month"
                                  value={exp.current ? '' : exp.endDate || ''}
                                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                  disabled={exp.current}
                                  className="input"
                                  placeholder={exp.current ? 'Present' : ''}
                                />
                              </>
                            ) : (
                              <div className="text-gray-900 col-span-2">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </div>
                            )}
                          </div>
                          {isEditing && (
                            <div className="flex items-center mt-2">
                              <input
                                type="checkbox"
                                checked={exp.current || false}
                                onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                className="mr-2"
                              />
                              <label className="text-sm text-gray-600">I currently work here</label>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-group mt-4">
                        <label className="form-label">Description</label>
                        {isEditing ? (
                          <textarea
                            value={exp.description || ''}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                            rows={3}
                            className="input"
                          />
                        ) : (
                          <div className="text-gray-900 whitespace-pre-line">
                            {exp.description || 'No description provided'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Skills & Expertise</h2>
                {isEditing && (
                  <button onClick={addSkill} className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </button>
                )}
              </div>

              {(!formData.skills || formData.skills.length === 0) ? (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No skills added</h3>
                  <p className="text-gray-600">Add your skills to help employers find you.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="relative group">
                      {isEditing ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateSkill(index, e.target.value)}
                            className="input pr-8"
                            placeholder="Skill name"
                          />
                          <button
                            onClick={() => removeSkill(index)}
                            className="absolute right-2 text-error-600 hover:text-error-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Social Links</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label flex items-center">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.socialLinks?.linkedin || ''}
                      onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                      className="input"
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : (
                    <div className="text-gray-900">
                      {profile.socialLinks?.linkedin ? (
                        <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                          {profile.socialLinks.linkedin}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.socialLinks?.github || ''}
                      onChange={(e) => handleInputChange('socialLinks.github', e.target.value)}
                      className="input"
                      placeholder="https://github.com/username"
                    />
                  ) : (
                    <div className="text-gray-900">
                      {profile.socialLinks?.github ? (
                        <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                          {profile.socialLinks.github}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.socialLinks?.twitter || ''}
                      onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                      className="input"
                      placeholder="https://twitter.com/username"
                    />
                  ) : (
                    <div className="text-gray-900">
                      {profile.socialLinks?.twitter ? (
                        <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                          {profile.socialLinks.twitter}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Portfolio
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.socialLinks?.portfolio || ''}
                      onChange={(e) => handleInputChange('socialLinks.portfolio', e.target.value)}
                      className="input"
                      placeholder="https://yourportfolio.com"
                    />
                  ) : (
                    <div className="text-gray-900">
                      {profile.socialLinks?.portfolio ? (
                        <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                          {profile.socialLinks.portfolio}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Upload Modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Update Profile Picture"
        size="md"
      >
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <User className="w-16 h-16 text-gray-400" />
          </div>
          
          <p className="text-gray-600 mb-6">
            Upload a new profile picture. Recommended size: 256x256 pixels.
          </p>
          
          <div className="flex space-x-3">
            <button className="btn-outline flex-1">
              Choose File
            </button>
            <button className="btn-primary flex-1">
              Upload
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Profile