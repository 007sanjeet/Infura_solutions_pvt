const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    let transporter;

    // Check if configuration exists
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Fallback: create mock/test Ethereal transport
      console.log('--- EMAIL CONFIGURATION MISSING: Using Ethereal Mailer ---');
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Infura Solutions" <no-reply@infurasolutions.com>',
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html || '',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully dispatched: ${info.messageId}`);
    
    // If Ethereal mailer, output the URL to preview the email
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`Preview email at: ${previewUrl}`);
    }
    
    return info;
  } catch (error) {
    console.error('Nodemailer failed to dispatch message:', error);
    throw error;
  }
};

module.exports = sendEmail;
