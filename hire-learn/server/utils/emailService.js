const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, // Use app password for Gmail
    },
    // For other email services
    /* 
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    */
  });
};

// Load and compile email templates
const loadTemplate = (templateName, data) => {
  try {
    const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.html`);
    
    if (!fs.existsSync(templatePath)) {
      console.warn(`Template not found: ${templatePath}`);
      return null;
    }

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    return template(data);
  } catch (error) {
    console.error('Error loading email template:', error);
    return null;
  }
};

// Default email templates for common scenarios
const defaultTemplates = {
  welcome: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Hire & Learn! 🎉</h1>
        </div>
        <div class="content">
          <h2>Hello ${data.name},</h2>
          <p>Welcome to Hire & Learn! We're excited to have you on board.</p>
          <p>Your account has been successfully created with the following details:</p>
          <ul>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Role:</strong> ${data.role}</li>
            <li><strong>Account Type:</strong> ${data.role === 'employee' ? 'Job Seeker' : 'Employer'}</li>
          </ul>
          ${data.role === 'employee' ? 
            '<p>Start exploring job opportunities and courses to enhance your skills!</p>' :
            '<p>Start posting jobs and finding the perfect candidates for your company!</p>'
          }
          <a href="${process.env.CLIENT_URL}" class="button">Get Started</a>
          <p>If you have any questions, feel free to contact our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Hire & Learn. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  jobApplication: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .job-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4facfe; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Job Application Submitted ✅</h1>
        </div>
        <div class="content">
          <h2>Hello ${data.applicantName},</h2>
          <p>Your application has been successfully submitted!</p>
          
          <div class="job-info">
            <h3>Application Details:</h3>
            <p><strong>Position:</strong> ${data.jobTitle}</p>
            <p><strong>Company:</strong> ${data.companyName}</p>
            <p><strong>Applied On:</strong> ${new Date(data.applicationDate).toLocaleDateString()}</p>
            <p><strong>Application ID:</strong> ${data.applicationId}</p>
          </div>

          <p><strong>What's Next?</strong></p>
          <ul>
            <li>The employer will review your application</li>
            <li>You may be contacted for an interview</li>
            <li>Check your email regularly for updates</li>
          </ul>

          <p>You can track your application status from your dashboard.</p>
          <p>Best of luck with your application! 🚀</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Hire & Learn. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  courseEnrollment: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .course-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ff6b6b; }
        .button { display: inline-block; padding: 12px 30px; background: #ff6b6b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Course Enrollment Confirmation 📚</h1>
        </div>
        <div class="content">
          <h2>Hello ${data.studentName},</h2>
          <p>You have been successfully enrolled in the course!</p>
          
          <div class="course-info">
            <h3>Course Details:</h3>
            <p><strong>Course:</strong> ${data.courseTitle}</p>
            <p><strong>Instructor:</strong> ${data.instructorName}</p>
            <p><strong>Duration:</strong> ${data.duration}</p>
            <p><strong>Level:</strong> ${data.level}</p>
            <p><strong>Enrolled On:</strong> ${new Date(data.enrollmentDate).toLocaleDateString()}</p>
          </div>

          <p><strong>Get Started:</strong></p>
          <ul>
            <li>Access course materials immediately</li>
            <li>Complete lessons at your own pace</li>
            <li>Track your progress in the dashboard</li>
            <li>Earn a certificate upon completion</li>
          </ul>

          <a href="${process.env.CLIENT_URL}/courses/${data.courseId}" class="button">Start Learning</a>
          <p>Happy learning! We're excited to see your progress. 🌟</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Hire & Learn. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  passwordReset: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #fd746c 0%, #ff9068 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reset-code { background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; border: 2px dashed #fd746c; }
        .code { font-size: 32px; font-weight: bold; color: #fd746c; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${data.name},</h2>
          <p>We received a request to reset your password for your Hire & Learn account.</p>
          
          <div class="reset-code">
            <p>Your reset code is:</p>
            <div class="code">${data.resetCode}</div>
            <p><small>This code will expire in 1 hour</small></p>
          </div>

          <p><strong>Instructions:</strong></p>
          <ol>
            <li>Go to the password reset page</li>
            <li>Enter the reset code above</li>
            <li>Create your new password</li>
          </ol>

          <p>If you didn't request this reset, please ignore this email or contact support if you have concerns.</p>
          <p>Stay secure! 🔒</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Hire & Learn. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

// Main email service functions
const emailService = {
  /**
   * Send email with template
   */
  sendEmail: async (to, subject, templateName, data = {}, attachments = []) => {
    try {
      const transporter = createTransporter();

      // Get email content
      let html;
      if (defaultTemplates[templateName]) {
        html = defaultTemplates[templateName](data);
      } else {
        html = loadTemplate(templateName, data);
      }

      if (!html) {
        throw new Error(`Email template '${templateName}' not found`);
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Hire & Learn" <${process.env.EMAIL_USERNAME}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: subject,
        html: html,
        attachments: attachments
      };

      const result = await transporter.sendMail(mailOptions);
      
      console.log(`✅ Email sent to ${to}: ${subject}`);
      return {
        success: true,
        messageId: result.messageId,
        response: result.response
      };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Send welcome email to new users
   */
  sendWelcomeEmail: async (user) => {
    const data = {
      name: user.name,
      email: user.email,
      role: user.role
    };

    return await emailService.sendEmail(
      user.email,
      'Welcome to Hire & Learn! 🎉',
      'welcome',
      data
    );
  },

  /**
   * Send job application confirmation
   */
  sendJobApplicationEmail: async (application, job, company, applicant) => {
    const data = {
      applicantName: applicant.name,
      jobTitle: job.title,
      companyName: company.name,
      applicationDate: application.createdAt,
      applicationId: application._id
    };

    return await emailService.sendEmail(
      applicant.email,
      `Application Submitted: ${job.title} at ${company.name}`,
      'jobApplication',
      data
    );
  },

  /**
   * Send course enrollment confirmation
   */
  sendCourseEnrollmentEmail: async (enrollment, course, student) => {
    const data = {
      studentName: student.name,
      courseTitle: course.title,
      instructorName: course.instructor.name,
      duration: course.duration.value + ' ' + course.duration.unit,
      level: course.level,
      enrollmentDate: enrollment.issueDate,
      courseId: course._id
    };

    return await emailService.sendEmail(
      student.email,
      `Enrollment Confirmed: ${course.title}`,
      'courseEnrollment',
      data
    );
  },

  /**
   * Send password reset email
   */
  sendPasswordResetEmail: async (user, resetCode) => {
    const data = {
      name: user.name,
      resetCode: resetCode
    };

    return await emailService.sendEmail(
      user.email,
      'Password Reset Request - Hire & Learn',
      'passwordReset',
      data
    );
  },

  /**
   * Send certificate email with attachment
   */
  sendCertificateEmail: async (user, course, certificate, certificateBuffer) => {
    const data = {
      name: user.name,
      courseTitle: course.title,
      issueDate: certificate.issueDate,
      certificateId: certificate.certificateId
    };

    const attachments = [{
      filename: `Certificate-${course.title.replace(/\s+/g, '_')}.pdf`,
      content: certificateBuffer,
      contentType: 'application/pdf'
    }];

    return await emailService.sendEmail(
      user.email,
      `🎓 Certificate of Completion: ${course.title}`,
      'courseEnrollment', // Reusing template, could create specific one
      data,
      attachments
    );
  },

  /**
   * Send custom email with HTML content
   */
  sendCustomEmail: async (to, subject, htmlContent, attachments = []) => {
    try {
      const transporter = createTransporter();

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Hire & Learn" <${process.env.EMAIL_USERNAME}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: subject,
        html: htmlContent,
        attachments: attachments
      };

      const result = await transporter.sendMail(mailOptions);
      
      console.log(`✅ Custom email sent to ${to}: ${subject}`);
      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      console.error('❌ Custom email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Verify email configuration
   */
  verifyConfiguration: async () => {
    try {
      const transporter = createTransporter();
      await transporter.verify();
      console.log('✅ Email server configuration is correct');
      return true;
    } catch (error) {
      console.error('❌ Email configuration error:', error);
      return false;
    }
  }
};

module.exports = emailService;