const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendApplicationEmail = async (
  applicationData,
  resumePath
) => {
  try {
    const {
      fullName,
      email,
      phone,
      position,
      experience,
      coverLetter,
    } = applicationData;

    // Convert to absolute path
    const absoluteResumePath =
      resumePath
        ? path.resolve(resumePath)
        : null;

    // Check if file exists
    const fileExists =
      absoluteResumePath &&
      fs.existsSync(
        absoluteResumePath
      );

    console.log(
      'Resume Path:',
      absoluteResumePath
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Job Application - ${position}`,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #334155;">
          
          <h2 style="color: #0284c7;">
            New Job Application Received
          </h2>

          <hr style="border:1px solid #e2e8f0;" />

          <p>
            <strong>Full Name:</strong>
            ${fullName}
          </p>

          <p>
            <strong>Email:</strong>
            ${email}
          </p>

          <p>
            <strong>Phone:</strong>
            ${phone}
          </p>

          <p>
            <strong>Position:</strong>
            ${position}
          </p>

      

          <p>
            <strong>Cover Letter:</strong><br/>
            ${coverLetter ||
        'No cover letter provided.'
        }
          </p>

        </div>
      `,

      attachments: fileExists
        ? [
          {
            filename:
              path.basename(
                absoluteResumePath
              ),
            path: absoluteResumePath,

            contentType:
              absoluteResumePath.endsWith(
                '.pdf'
              )
                ? 'application/pdf'
                : absoluteResumePath.endsWith(
                  '.doc'
                )
                  ? 'application/msword'
                  : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          },
        ]
        : [],
    };

    await transporter.sendMail(
      mailOptions
    );

    console.log(
      'Email sent successfully'
    );
  } catch (error) {
    console.error(
      'Email Error:',
      error
    );
  }
};

module.exports =
  sendApplicationEmail;