import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'localhost',
  port: Number(process.env.EMAIL_PORT) || 1025,
  secure: false,
});

const sendEmail = async ({ to, subject, html }) => {
  return await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@ecommerce.local',
    to,
    subject,
    html,
  });
};

export default sendEmail;
