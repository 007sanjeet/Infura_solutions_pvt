const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const sendEmail = require('../utils/email');
const sendApplicationEmail = require('../utils/sendEmail');

const prisma = new PrismaClient();

const apply = async (req, res, next) => {
  try {
    const {
  jobId,
  fullName,
  email,
  phone,
  experience,
  coverLetter
} = req.body;

    if (!jobId || !fullName || !email || !phone) {
      return res.status(400).json({ error: 'Job ID, Full Name, Email, and Phone number are required.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume file (PDF, DOC, or DOCX).' });
    }

    // Verify job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { title: true },
    });

    if (!job) {
      return res.status(400).json({ error: 'The specified job position does not exist.' });
    }

    // Relative path for uploads
    const resumePath = req.file.path.replace(/\\/g, '/'); // Normalize path separator
    const relativePath = resumePath.includes('uploads/') 
      ? 'uploads/' + resumePath.split('uploads/')[1] 
      : resumePath;

    // Save in DB
 const application = await prisma.application.create({
  data: {
    jobId,
    fullName,
    email,
    phone,
    coverLetter,
    resumePath: relativePath,
  },
});

// Send email to HR/Admin Gmail
await sendApplicationEmail(
  {
    fullName,
    email,
    phone,
    position: job.title,
    experience,
    coverLetter,
  },
  req.file.path
);

    // Send confirmation email asynchronously
    try {
      const emailContent = `
        <div style="font-family: Arial, sans-serif; color: #334155; line-height: 1.6;">
          <h2 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Application Received - Infura Solutions</h2>
          <p>Dear <strong>${fullName}</strong>,</p>
          <p>Thank you for applying for the position of <strong>${job.title}</strong> at Infura Solutions.</p>
          <p>We have successfully received your application and resume. Our recruiting team is reviewing your profile against the role requirements. If your background matches what we are seeking, we will reach out to discuss the next steps.</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #c5a880; padding: 12px; margin: 16px 0;">
            <p style="margin: 0; font-weight: bold;">Application Details:</p>
            <ul style="margin: 8px 0 0 0; padding-left: 20px;">
              <li><strong>Position:</strong> ${job.title}</li>
              <li><strong>Submitted On:</strong> ${new Date().toLocaleDateString()}</li>
              <li><strong>Status:</strong> Under Review (Pending)</li>
            </ul>
          </div>
          <p>Should you have any questions, feel free to respond to this email.</p>
          <p style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 12px; color: #64748b;">
            Best regards,<br/>
            <strong>Infura Solutions Recruitment Team</strong><br/>
            noida uttar pradesh<br/>
            +91 98765 43210<br/>
          </p>
        </div>
      `;

      await sendEmail({
        to: email,
        subject: `Application Received: ${job.title} - Infura Solutions`,
        html: emailContent,
      });
      console.log(`Confirmation email sent to ${email} for job: ${job.title}`);
    } catch (mailError) {
      console.error('Mail notification failed to send:', mailError);
    }

    return res.status(201).json({
      message: 'Your application has been submitted successfully.',
      application,
    });
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const { jobId, status, search, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (jobId) {
      where.jobId = jobId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.application.count({ where });

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            jobType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    return res.status(200).json({
      applications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PENDING, SHORTLISTED, REJECTED, SELECTED

    const validStatuses = ['PENDING', 'SHORTLISTED', 'REJECTED', 'SELECTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid application status. Allowed: ${validStatuses.join(', ')}` });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application record not found.' });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    // Send email alert on status update
    try {
      let statusSubject = `Update on your application for ${application.job.title} - Infura Solutions`;
      let statusBody = '';

      if (status === 'SHORTLISTED') {
        statusBody = `
          <p>Dear <strong>${application.fullName}</strong>,</p>
          <p>We are pleased to inform you that your application for <strong>${application.job.title}</strong> has been <strong>shortlisted</strong>!</p>
          <p>Our consulting team would like to schedule an introductory interview to learn more about your experience and expectations. We will contact you by telephone or email shortly to arrange a date.</p>
        `;
      } else if (status === 'REJECTED') {
        statusBody = `
          <p>Dear <strong>${application.fullName}</strong>,</p>
          <p>Thank you for your interest in the <strong>${application.job.title}</strong> role and for taking the time to apply.</p>
          <p>After careful review of all applicants, we regret to inform you that we will not be moving forward with your application for this specific position. We will keep your CV on file for future openings that match your skills.</p>
        `;
      } else if (status === 'SELECTED') {
        statusBody = `
          <p>Dear <strong>${application.fullName}</strong>,</p>
          <p>Congratulations! We are delighted to inform you that you have been <strong>selected</strong> for the position of <strong>${application.job.title}</strong>.</p>
          <p>Our onboarding manager will reach out with the official offer details, agreement documentation, and next steps.</p>
        `;
      }

      if (statusBody) {
        const fullHtml = `
          <div style="font-family: Arial, sans-serif; color: #334155; line-height: 1.6;">
            <h2 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Application Status Update</h2>
            ${statusBody}
            <p style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 12px; color: #64748b;">
              Best regards,<br/>
              <strong>Infura Solutions Recruitment Team</strong>
            </p>
          </div>
        `;

        await sendEmail({
          to: application.email,
          subject: statusSubject,
          html: fullHtml,
        });
      }
    } catch (emailErr) {
      console.error('Failed to send status update email:', emailErr);
    }

    return res.status(200).json({
      message: 'Application status updated successfully.',
      application: updated,
    });
  } catch (error) {
    next(error);
  }
};

const downloadResume = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    // Find application
    const application =
      await prisma.application.findUnique(
        {
          where: { id },
          select: {
            resumePath: true,
            fullName: true,
          },
        }
      );

    // Check application exists
    if (!application) {
      return res.status(404).json({
        error:
          'Application not found.',
      });
    }

    // Check resume path exists in DB
    if (
      !application.resumePath
    ) {
      return res.status(412).json({
        error:
          'Resume file path missing.',
      });
    }

    console.log(
      'Resume Path:',
      application.resumePath
    );

    // Create correct absolute path
    const fullPath =
      path.join(
        process.cwd(),
        application.resumePath
      );

    console.log(
      'Full File Path:',
      fullPath
    );

    // Check file exists physically
    if (
      !fs.existsSync(fullPath)
    ) {
      return res.status(404).json({
        error:
          'Resume file not found on server.',
      });
    }

    // Get extension
    const extension =
      path.extname(fullPath);

    // Clean filename
    const safeName =
      application.fullName
        ?.replace(/\s+/g, '_')
        .replace(
          /[^a-zA-Z0-9_]/g,
          ''
        ) || 'resume';

    const fileName = `${safeName}_Resume${extension}`;

    // Force download
    return res.download(
      fullPath,
      fileName,
      (err) => {
        if (err) {
          console.error(
            'Download Error:',
            err
          );

          if (
            !res.headersSent
          ) {
            return res
              .status(500)
              .json({
                error:
                  'Failed to download resume.',
              });
          }
        }
      }
    );
  } catch (error) {
    console.error(
      'Resume Download Error:',
      error
    );

    next(error);
  }
};

module.exports = {
  apply,
  getApplications,
  updateApplicationStatus,
  downloadResume,
};
