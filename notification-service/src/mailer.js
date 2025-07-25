const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendMail = async (subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.SMTP_USER, // You can also make this dynamic
    subject,
    text
  });
};

module.exports = sendMail;
