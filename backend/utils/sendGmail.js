const nodemailer = require('nodemailer');

const sendGmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${process.env.GMAIL_EMAIL}`,
    pass: `${process.env.GMAIL_PASSWORD}`
  },
  tls: { rejectUnauthorized: false }
});


module.exports = sendGmail;