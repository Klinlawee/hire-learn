const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { cloudinaryUtils } = require('../config/cloudinary');

class CertificateGenerator {
  constructor() {
    this.templates = {
      default: {
        background: null,
        colors: {
          primary: '#2c5aa0',
          secondary: '#4a90e2',
          accent: '#ff6b6b',
          text: '#333333',
          lightText: '#666666'
        },
        fonts: {
          title: 'Helvetica-Bold',
          subtitle: 'Helvetica-Bold',
          body: 'Helvetica',
          signature: 'Helvetica-Oblique'
        },
        layout: {
          margin: 50,
          contentWidth: 495,
          headerHeight: 150,
          footerHeight: 100
        }
      },
      premium: {
        background: null,
        colors: {
          primary: '#8B4513',
          secondary: '#D2691E',
          accent: '#FFD700',
          text: '#2F4F4F',
          lightText: '#696969'
        },
        fonts: {
          title: 'Times-Bold',
          subtitle: 'Times-Bold',
          body: 'Times-Roman',
          signature: 'Times-Italic'
        },
        layout: {
          margin: 60,
          contentWidth: 475,
          headerHeight: 180,
          footerHeight: 120
        }
      }
    };
  }

  /**
   * Generate a certificate PDF
   */
  async generateCertificate(certificateData, templateName = 'default') {
    return new Promise(async (resolve, reject) => {
      try {
        const template = this.templates[templateName] || this.templates.default;
        const doc = new PDFDocument({
          layout: 'landscape',
          size: 'A4',
          margins: {
            top: template.layout.margin,
            bottom: template.layout.margin,
            left: template.layout.margin,
            right: template.layout.margin
          }
        });

        const chunks = [];
        
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', async () => {
          try {
            const pdfBuffer = Buffer.concat(chunks);
            
            // Upload to Cloudinary or save locally
            let fileUrl;
            if (process.env.NODE_ENV === 'production') {
              const uploadResult = await this.uploadToCloudinary(pdfBuffer, certificateData);
              fileUrl = uploadResult.secure_url;
            } else {
              fileUrl = await this.saveLocally(pdfBuffer, certificateData);
            }

            resolve({
              buffer: pdfBuffer,
              fileUrl: fileUrl,
              size: pdfBuffer.length
            });
          } catch (error) {
            reject(error);
          }
        });

        // Generate certificate content
        await this.generateCertificateContent(doc, certificateData, template);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate the certificate content
   */
  async generateCertificateContent(doc, data, template) {
    const { width, height } = doc.page;
    
    // Add background if available
    if (template.background) {
      // You can add background images here
      // doc.image(template.background, 0, 0, { width, height });
    }

    // Add decorative border
    this.addDecorativeBorder(doc, width, height, template);

    // Header section
    this.addHeader(doc, data, template, width);

    // Main content
    this.addMainContent(doc, data, template, width, height);

    // Footer section
    this.addFooter(doc, data, template, width, height);

    // Add security features
    this.addSecurityFeatures(doc, data, width, height);
  }

  /**
   * Add decorative border to certificate
   */
  addDecorativeBorder(doc, width, height, template) {
    const borderWidth = 8;
    
    doc.lineWidth(borderWidth)
       .strokeColor(template.colors.primary)
       .rect(borderWidth/2, borderWidth/2, width - borderWidth, height - borderWidth)
       .stroke();

    // Inner border
    doc.lineWidth(2)
       .strokeColor(template.colors.secondary)
       .rect(20, 20, width - 40, height - 40)
       .stroke();
  }

  /**
   * Add header section with title and logo
   */
  addHeader(doc, data, template, width) {
    const headerY = 60;

    // Certificate title
    doc.fontSize(32)
       .font(template.fonts.title)
       .fillColor(template.colors.primary)
       .text('CERTIFICATE OF COMPLETION', width / 2, headerY, {
         align: 'center',
         width: template.layout.contentWidth
       });

    // Decorative line
    doc.moveTo(width / 2 - 100, headerY + 50)
       .lineTo(width / 2 + 100, headerY + 50)
       .lineWidth(2)
       .strokeColor(template.colors.accent)
       .stroke();

    // Subtitle
    doc.fontSize(16)
       .font(template.fonts.subtitle)
       .fillColor(template.colors.lightText)
       .text('This is to certify that', width / 2, headerY + 70, {
         align: 'center',
         width: template.layout.contentWidth
       });
  }

  /**
   * Add main content (student name, course, etc.)
   */
  addMainContent(doc, data, template, width, height) {
    const contentStartY = 180;

    // Student name
    doc.fontSize(28)
       .font(template.fonts.title)
       .fillColor(template.colors.primary)
       .text(data.studentName.toUpperCase(), width / 2, contentStartY, {
         align: 'center',
         width: template.layout.contentWidth
       });

    // Completion text
    doc.fontSize(14)
       .font(template.fonts.body)
       .fillColor(template.colors.text)
       .text('has successfully completed the course', width / 2, contentStartY + 50, {
         align: 'center',
         width: template.layout.contentWidth
       });

    // Course title
    doc.fontSize(20)
       .font(template.fonts.subtitle)
       .fillColor(template.colors.secondary)
       .text(`"${data.courseTitle}"`, width / 2, contentStartY + 80, {
         align: 'center',
         width: template.layout.contentWidth
       });

    // Course details
    const detailsY = contentStartY + 130;
    doc.fontSize(12)
       .font(template.fonts.body)
       .fillColor(template.colors.lightText);

    // Duration
    doc.text(`Duration: ${data.courseDuration}`, width / 2 - 150, detailsY, {
      width: 140,
      align: 'right'
    });

    // Level
    doc.text(`Level: ${data.courseLevel}`, width / 2 + 10, detailsY, {
      width: 140,
      align: 'left'
    });

    // Completion date
    doc.text(`Completed on: ${this.formatDate(data.completionDate)}`, width / 2, detailsY + 30, {
      align: 'center',
      width: template.layout.contentWidth
    });

    // Certificate ID
    doc.text(`Certificate ID: ${data.certificateId}`, width / 2, detailsY + 50, {
      align: 'center',
      width: template.layout.contentWidth
    });
  }

  /**
   * Add footer with signatures and verification
   */
  addFooter(doc, data, template, width, height) {
    const footerY = height - 120;

    // Signatures area
    const signatureWidth = 200;
    const leftSignatureX = width / 2 - signatureWidth - 20;
    const rightSignatureX = width / 2 + 20;

    // Instructor signature
    doc.moveTo(leftSignatureX, footerY)
       .lineTo(leftSignatureX + signatureWidth, footerY)
       .lineWidth(1)
       .strokeColor(template.colors.lightText)
       .stroke();

    doc.fontSize(10)
       .font(template.fonts.signature)
       .fillColor(template.colors.lightText)
       .text(data.instructorName, leftSignatureX, footerY + 5, {
         width: signatureWidth,
         align: 'center'
       })
       .text('Course Instructor', leftSignatureX, footerY + 20, {
         width: signatureWidth,
         align: 'center'
       });

    // CEO/Director signature
    doc.moveTo(rightSignatureX, footerY)
       .lineTo(rightSignatureX + signatureWidth, footerY)
       .lineWidth(1)
       .strokeColor(template.colors.lightText)
       .stroke();

    doc.fontSize(10)
       .font(template.fonts.signature)
       .fillColor(template.colors.lightText)
       .text('Sarah Johnson', rightSignatureX, footerY + 5, {
         width: signatureWidth,
         align: 'center'
       })
       .text('CEO, Hire & Learn', rightSignatureX, footerY + 20, {
         width: signatureWidth,
         align: 'center'
       });

    // Verification QR code area (placeholder)
    const qrSize = 60;
    const qrX = width - 80;
    const qrY = height - 80;

    doc.rect(qrX, qrY, qrSize, qrSize)
       .strokeColor(template.colors.lightText)
       .lineWidth(1)
       .stroke();

    doc.fontSize(8)
       .fillColor(template.colors.lightText)
       .text('Scan to verify', qrX, qrY + qrSize + 5, {
         width: qrSize,
         align: 'center'
       });

    // Verification URL
    doc.fontSize(8)
       .fillColor(template.colors.lightText)
       .text(
         `Verify at: ${process.env.CLIENT_URL}/verify/${data.verificationCode}`,
         50,
         height - 30,
         { width: width - 100, align: 'center' }
       );
  }

  /**
   * Add security features to prevent forgery
   */
  addSecurityFeatures(doc, data, width, height) {
    // Add watermark
    doc.opacity(0.1)
       .fillColor('#000000')
       .fontSize(80)
       .text('HIRE & LEARN', width / 2, height / 2 - 40, {
         align: 'center',
         width: template.layout.contentWidth,
         rotation: 45
       })
       .opacity(1);

    // Add microprint border
    const microprintText = `CERT-${data.certificateId}-${data.verificationCode} `;
    doc.fontSize(4)
       .fillColor('#cccccc');

    // Top border
    for (let i = 0; i < width; i += 50) {
      doc.text(microprintText, i, 15, { continued: true });
    }

    // Bottom border
    for (let i = 0; i < width; i += 50) {
      doc.text(microprintText, i, height - 15, { continued: true });
    }
  }

  /**
   * Upload certificate to Cloudinary
   */
  async uploadToCloudinary(pdfBuffer, certificateData) {
    try {
      // Save buffer to temporary file
      const tempFilePath = path.join(__dirname, '../temp_uploads', `certificate-${certificateData.certificateId}.pdf`);
      fs.writeFileSync(tempFilePath, pdfBuffer);

      const uploadResult = await cloudinaryUtils.uploadImage(tempFilePath, {
        folder: 'hire-learn/certificates',
        resource_type: 'raw', // For PDF files
        public_id: `certificate-${certificateData.certificateId}`,
        format: 'pdf'
      });

      // Clean up temp file
      fs.unlinkSync(tempFilePath);

      return uploadResult;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload certificate to cloud storage');
    }
  }

  /**
   * Save certificate locally (for development)
   */
  async saveLocally(pdfBuffer, certificateData) {
    const certificatesDir = path.join(__dirname, '../temp_uploads/certificates');
    
    // Ensure directory exists
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    const filePath = path.join(certificatesDir, `certificate-${certificateData.certificateId}.pdf`);
    fs.writeFileSync(filePath, pdfBuffer);

    return `/uploads/certificates/certificate-${certificateData.certificateId}.pdf`;
  }

  /**
   * Format date for certificate
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Generate certificate data for a user and course
   */
  prepareCertificateData(user, course, certificate) {
    return {
      studentName: user.name,
      courseTitle: course.title,
      courseDuration: `${course.duration.value} ${course.duration.unit}`,
      courseLevel: course.level,
      instructorName: course.instructor.name,
      completionDate: certificate.issueDate,
      certificateId: certificate.certificateId,
      verificationCode: certificate.verificationCode
    };
  }
}

// Create singleton instance
const certificateGenerator = new CertificateGenerator();

module.exports = certificateGenerator;