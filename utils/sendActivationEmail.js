const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendActivationEmail = async (to, token) => {
  const link = `http://localhost:3000/activate/${token}`;
  await transporter.sendMail({
    from: '"LeanFlow" <no-reply@leanflow.com>',
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
