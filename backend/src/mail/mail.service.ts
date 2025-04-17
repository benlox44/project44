// mail.service.ts
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailConfirmation = async (to: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/confirm?token=${token}`;

  await transporter.sendMail({
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
    to,
    subject: '✅ Confirm your account',
    html: `
      <h2>Account Confirmation</h2>
      <p>Thanks for registering. Click the link below to confirm your account:</p>
      <a href="${confirmLink}">${confirmLink}</a>
      <p>If this was you, you can ignore this email.</p>
    `,
  });
};

export const sendNewEmailConfirmation = async (to: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/confirm-email-change?token=${token}`;

  await transporter.sendMail({
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
    to,
    subject: '📩 Confirm your new email',
    html: `
      <h2>Email Change Request</h2>
      <p>We received a request to change your email. Click the link below to confirm it:</p>
      <a href="${confirmLink}">${confirmLink}</a>
      <p>If this was you, you can ignore this email.</p>
    `,
  });
};

export const sendRevertEmailChange = async (to: string, token: string) => {
  const revertLink = `http://localhost:3000/auth/revert-email-change?token=${token}`;

  await transporter.sendMail({
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
    to,
    subject: '🔄 Revert email change',
    html: `
      <h2>Email Change Detected</h2>
      <p>Your account email was recently changed.</p>
      <p>If this wasn't you, click the link below to revert the change within 30 days:</p>
      <a href="${revertLink}">${revertLink}</a>
      <p>If it was you, you can ignore this message.</p>
    `,
  });
};
