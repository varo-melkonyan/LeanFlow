const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendActivationEmail = async (to, token) => {
  const link = `https://yerevan.me/activate/${token}`;

  await transporter.sendMail({
    from: `"LeanFlow" <${process.env.EMAIL_USER}>`, 
    to,
    subject: 'Activate your account',
    html: `
      <h2>Activate your account</h2>
      <p>Click below to activate:</p>
      <a href="${link}" style="padding:10px 20px;background:#22c55e;color:#fff;text-decoration:none;border-radius:5px;">Activate</a>
      <p>This link is valid until used.</p>
    `
  });
};

module.exports = sendActivationEmail;
