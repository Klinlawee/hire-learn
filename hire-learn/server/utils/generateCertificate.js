import PDFDocument from 'pdfkit'
import path from 'path'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import Certificate from '../models/Certificate.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

/**
 * Generate a professional certificate PDF
 * @param {Object} certificateData - Certificate data
 * @param {string} certificateData.userName - Full name of the user
 * @param {string} certificateData.courseTitle - Title of the course
 * @param {string} certificateData.completionDate - Date of completion
 * @param {string} certificateData.grade - Grade achieved (Distinction, Excellent, Good, Pass)
 * @param {number} certificateData.finalScore - Final score percentage
 * @param {string} certificateData.certificateId - Unique certificate ID
 * @param {string} certificateData.verificationCode - Verification code
 * @returns {Promise<Buffer>} PDF buffer
 */
export const generateCertificatePDF = async (certificateData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      })

      const chunks = []
      
      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Add background color
      doc.rect(0, 0, doc.page.width, doc.page.height)
        .fill('#f8fafc')

      // Border
      doc.strokeColor('#0ea5e9')
      doc.lineWidth(8)
      doc.roundedRect(30, 30, doc.page.width - 60, doc.page.height - 60, 15)
        .stroke()

      // Header decoration
      doc.fillColor('#0ea5e9')
      doc.rect(0, 0, doc.page.width, 120)
        .fill()

      // Logo or platform name
      doc.fillColor('#ffffff')
      doc.fontSize(24)
      doc.font('Helvetica-Bold')
      doc.text('HIRE & LEARN', 50, 50, { align: 'left' })

      // Certificate title
      doc.fillColor('#1e293b')
      doc.fontSize(36)
      doc.font('Helvetica-Bold')
      doc.text('CERTIFICATE OF COMPLETION', 0, 150, { 
        align: 'center',
        width: doc.page.width 
      })

      // Subtitle
      doc.fillColor('#64748b')
      doc.fontSize(16)
      doc.font('Helvetica')
      doc.text('This certificate is proudly presented to', 0, 210, {
        align: 'center',
        width: doc.page.width
      })

      // Student name
      doc.fillColor('#0f172a')
      doc.fontSize(42)
      doc.font('Helvetica-Bold')
      doc.text(certificateData.userName.toUpperCase(), 0, 240, {
        align: 'center',
        width: doc.page.width
      })

      // Completion text
      doc.fillColor('#475569')
      doc.fontSize(18)
      doc.font('Helvetica')
      doc.text('has successfully completed the course', 0, 310, {
        align: 'center',
        width: doc.page.width
      })

      // Course title
      doc.fillColor('#0ea5e9')
      doc.fontSize(24)
      doc.font('Helvetica-Bold')
      doc.text(`"${certificateData.courseTitle}"`, 0, 340, {
        align: 'center',
        width: doc.page.width
      })

      // Grade and score
      doc.fillColor('#475569')
      doc.fontSize(16)
      doc.font('Helvetica')
      doc.text(`with a grade of ${certificateData.grade} (${certificateData.finalScore}%)`, 0, 380, {
        align: 'center',
        width: doc.page.width
      })

      // Completion date
      const completionDate = new Date(certificateData.completionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      doc.text(`Completed on ${completionDate}`, 0, 410, {
        align: 'center',
        width: doc.page.width
      })

      // Certificate ID
      doc.fillColor('#94a3b8')
      doc.fontSize(12)
      doc.text(`Certificate ID: ${certificateData.certificateId}`, 0, 470, {
        align: 'center',
        width: doc.page.width
      })

      // Verification section
      doc.fillColor('#64748b')
      doc.fontSize(10)
      doc.text('Verify this certificate at:', 50, doc.page.height - 80, {
        continued: true
      })
      
      doc.fillColor('#0ea5e9')
      doc.text(' https://hirelearn.com/verify', { continued: false })
      
      doc.fillColor('#64748b')
      doc.text('Verification Code:', 50, doc.page.height - 60, {
        continued: true
      })
      
      doc.fillColor('#0ea5e9')
      doc.font('Helvetica-Bold')
      doc.text(` ${certificateData.verificationCode}`)

      // Signatures area
      const signatureY = doc.page.height - 120
      
      // Instructor signature
      doc.fillColor('#475569')
      doc.fontSize(10)
      doc.font('Helvetica')
      doc.text('_________________________', 100, signatureY, { align: 'left' })
      doc.text('Platform Director', 100, signatureY + 15, { align: 'left' })
      doc.text('Hire & Learn', 100, signatureY + 30, { align: 'left' })

      // Date signature
      doc.text('_________________________', doc.page.width - 200, signatureY, { align: 'left' })
      doc.text('Date Issued', doc.page.width - 200, signatureY + 15, { align: 'left' })
      doc.text(completionDate, doc.page.width - 200, signatureY + 30, { align: 'left' })

      // Footer note
      doc.fillColor('#94a3b8')
      doc.fontSize(8)
      doc.text('This certificate verifies successful completion of the mentioned course. All rights reserved.', 
        0, doc.page.height - 30, {
          align: 'center',
          width: doc.page.width
        })

      doc.end()

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Upload certificate PDF to Cloudinary
 * @param {Buffer} pdfBuffer - PDF buffer
 * @param {string} certificateId - Certificate ID for filename
 * @returns {Promise<string>} Cloudinary URL
 */
export const uploadCertificateToCloudinary = async (pdfBuffer, certificateId) => {
  const { Readable } = await import('stream')
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'hire-learn/certificates',
        public_id: `certificate-${certificateId}`,
        format: 'pdf',
        type: 'authenticated', // Optional: for additional security
        access_mode: 'public'
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result.secure_url)
        }
      }
    )

    // Create a readable stream from buffer and pipe to Cloudinary
    const readableStream = Readable.from(pdfBuffer)
    readableStream.pipe(uploadStream)
  })
}

/**
 * Generate and save a complete certificate
 * @param {Object} options - Certificate generation options
 * @param {string} options.userId - User ID
 * @param {string} options.courseId - Course ID
 * @param {string} options.userName - User's full name
 * @param {string} options.courseTitle - Course title
 * @param {number} options.finalScore - Final score percentage
 * @returns {Promise<Object>} Created certificate document
 */
export const generateAndSaveCertificate = async (options) => {
  try {
    const {
      userId,
      courseId,
      userName,
      courseTitle,
      finalScore
    } = options

    // Determine grade based on score
    const getGrade = (score) => {
      if (score >= 90) return 'Distinction'
      if (score >= 80) return 'Excellent'
      if (score >= 70) return 'Good'
      return 'Pass'
    }

    const grade = getGrade(finalScore)
    const completionDate = new Date()

    // Generate certificate data
    const certificateData = {
      userName,
      courseTitle,
      completionDate: completionDate.toISOString(),
      grade,
      finalScore,
      certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      verificationCode: Math.random().toString(36).substr(2, 12).toUpperCase()
    }

    // Generate PDF
    console.log('📄 Generating certificate PDF...')
    const pdfBuffer = await generateCertificatePDF(certificateData)

    // Upload to Cloudinary
    console.log('☁️ Uploading certificate to Cloudinary...')
    const certificateUrl = await uploadCertificateToCloudinary(pdfBuffer, certificateData.certificateId)

    // Create certificate record in database
    console.log('💾 Saving certificate to database...')
    const certificate = new Certificate({
      certificateId: certificateData.certificateId,
      userId,
      courseId,
      userName,
      courseTitle,
      completionDate,
      grade,
      finalScore,
      certificateUrl,
      verificationCode: certificateData.verificationCode,
      metadata: {
        issuedBy: 'Hire & Learn Platform',
        template: 'professional-v1',
        expiresAt: new Date(completionDate.getFullYear() + 5, completionDate.getMonth(), completionDate.getDate()) // 5 years validity
      }
    })

    await certificate.save()

    console.log('✅ Certificate generated and saved successfully')
    return certificate

  } catch (error) {
    console.error('❌ Error generating certificate:', error)
    throw new Error(`Certificate generation failed: ${error.message}`)
  }
}

/**
 * Verify a certificate by verification code
 * @param {string} verificationCode - Verification code
 * @returns {Promise<Object>} Certificate verification result
 */
export const verifyCertificate = async (verificationCode) => {
  try {
    const certificate = await Certificate.verifyCertificate(verificationCode)
    
    if (!certificate) {
      return {
        isValid: false,
        message: 'Certificate not found or has been revoked'
      }
    }

    if (certificate.metadata.expiresAt && new Date() > certificate.metadata.expiresAt) {
      return {
        isValid: false,
        message: 'Certificate has expired'
      }
    }

    return {
      isValid: true,
      certificate: {
        userName: certificate.userName,
        courseTitle: certificate.courseTitle,
        completionDate: certificate.completionDate,
        grade: certificate.grade,
        finalScore: certificate.finalScore,
        issuedBy: certificate.metadata.issuedBy,
        certificateId: certificate.certificateId
      }
    }

  } catch (error) {
    console.error('❌ Error verifying certificate:', error)
    throw new Error(`Certificate verification failed: ${error.message}`)
  }
}

/**
 * Get certificate download URL
 * @param {string} certificateId - Certificate ID
 * @returns {Promise<string>} Download URL
 */
export const getCertificateDownloadUrl = async (certificateId) => {
  try {
    const certificate = await Certificate.findOne({ certificateId })
    
    if (!certificate) {
      throw new Error('Certificate not found')
    }

    if (certificate.isRevoked) {
      throw new Error('Certificate has been revoked')
    }

    // Generate signed URL for Cloudinary (optional, for additional security)
    const signedUrl = cloudinary.url(certificate.certificateUrl, {
      resource_type: 'raw',
      type: 'authenticated',
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiry
    })

    return signedUrl

  } catch (error) {
    console.error('❌ Error generating download URL:', error)
    throw new Error(`Download URL generation failed: ${error.message}`)
  }
}

/**
 * Revoke a certificate
 * @param {string} certificateId - Certificate ID
 * @param {string} reason - Reason for revocation
 * @returns {Promise<Object>} Updated certificate
 */
export const revokeCertificate = async (certificateId, reason = '') => {
  try {
    const certificate = await Certificate.findOne({ certificateId })
    
    if (!certificate) {
      throw new Error('Certificate not found')
    }

    if (certificate.isRevoked) {
      throw new Error('Certificate is already revoked')
    }

    certificate.isRevoked = true
    certificate.revokedAt = new Date()
    certificate.revokedReason = reason

    await certificate.save()

    return certificate

  } catch (error) {
    console.error('❌ Error revoking certificate:', error)
    throw new Error(`Certificate revocation failed: ${error.message}`)
  }
}

/**
 * Get user's certificates
 * @param {string} userId - User ID
 * @returns {Promise<Array>} User's certificates
 */
export const getUserCertificates = async (userId) => {
  try {
    const certificates = await Certificate.getUserCertificates(userId)
    return certificates
  } catch (error) {
    console.error('❌ Error fetching user certificates:', error)
    throw new Error(`Failed to fetch user certificates: ${error.message}`)
  }
}

export default {
  generateCertificatePDF,
  uploadCertificateToCloudinary,
  generateAndSaveCertificate,
  verifyCertificate,
  getCertificateDownloadUrl,
  revokeCertificate,
  getUserCertificates
}