const nodemailer = require('nodemailer');

const sendGmail = nodemailer.createTransport({
  host: 'smtp.purchasejunction.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    //user: "enquiry@purchasejunction.com",
   // pass: "xve4rlgN%o!unnlk"
	user: `${process.env.WEBMAIL_EMAIL}`,
    pass: `${process.env.WEBMAIL_PASSWORD}`
  },
  tls: { rejectUnauthorized: false },
  logger: true,
  debug: true
});


module.exports = sendGmail;