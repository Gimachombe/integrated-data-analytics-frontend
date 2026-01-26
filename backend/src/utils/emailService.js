const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('Email service is ready');
  }
});

// Email templates
const templates = {
  welcome: user => ({
    subject: 'Welcome to DataBizPro - Your Business Services Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to DataBizPro!</h1>
        <p>Hello ${user.firstName},</p>
        <p>Thank you for registering with DataBizPro. Your account has been created successfully.</p>
        <p>You can now access all our services including:</p>
        <ul>
          <li>Data Analytics Services</li>
          <li>Business Registration</li>
          <li>KRA Services</li>
          <li>Bookkeeping & Audit Support</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <br>
        <p>Best regards,<br>The DataBizPro Team</p>
      </div>
    `,
  }),
  serviceRequest: (user, service) => ({
    subject: `Service Request Confirmation - ${service.type}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Service Request Received</h1>
        <p>Hello ${user.firstName},</p>
        <p>We have received your request for <strong>${service.type}</strong> service.</p>
        <p><strong>Request Details:</strong></p>
        <ul>
          <li>Service Type: ${service.type}</li>
          <li>Request ID: ${service.id}</li>
          <li>Status: ${service.status}</li>
          <li>Date: ${new Date(service.createdAt).toLocaleDateString()}</li>
        </ul>
        <p>Our team will review your request and get back to you within 24 hours.</p>
        <p>You can track the progress of your request from your dashboard.</p>
        <br>
        <p>Best regards,<br>The DataBizPro Team</p>
      </div>
    `,
  }),
  paymentConfirmation: (user, payment) => ({
    subject: `Payment Confirmation - ${payment.transactionId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Payment Confirmed</h1>
        <p>Hello ${user.firstName},</p>
        <p>Your payment has been confirmed successfully.</p>
        <p><strong>Payment Details:</strong></p>
        <ul>
          <li>Transaction ID: ${payment.transactionId}</li>
          <li>Amount: KES ${payment.amount}</li>
          <li>Method: ${payment.method}</li>
          <li>Date: ${new Date(payment.date).toLocaleDateString()}</li>
        </ul>
        <p>You can download your invoice from the payments section in your dashboard.</p>
        <br>
        <p>Best regards,<br>The DataBizPro Team</p>
      </div>
    `,
  }),
};

// Send email function
const sendEmail = async (to, templateName, data) => {
  try {
    const template = templates[templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    const { subject, html } = template(data);

    const mailOptions = {
      from: `"DataBizPro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
