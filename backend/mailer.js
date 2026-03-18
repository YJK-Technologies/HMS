// mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'yjktechnologies.com',
  port: 465,
  secure: true,
  auth: {
    user: 'harishkumar.s@yjktechnologies.com',
    pass: 'P@ss1234',
  },
});

module.exports = transporter;
