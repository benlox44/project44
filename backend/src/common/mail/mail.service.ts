import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<void> => {
  await transporter.sendMail({
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const sendConfirmationEmail = async (
  to: string,
  token: string,
): Promise<void> => {
  const link = `http://localhost:3000/auth/confirm-email?token=${token}`;
  const html = `
    <h2>Account Confirmation</h2>
    <p>Thanks for registering. Click the link below to confirm your account:</p>
    <a href="${link}">${link}</a>
    <p>If this was you, you can ignore this email.</p>
  `;
  await sendEmail(to, '✅ Confirm your account', html);
};

export const sendConfirmationUpdatedEmail = async (
  to: string,
  token: string,
): Promise<void> => {
  const link = `http://localhost:3000/auth/confirm-email-change?token=${token}`;
  const html = `
    <h2>Email Change Request</h2>
    <p>We received a request to change your email. Click the link below to confirm it:</p>
    <a href="${link}">${link}</a>
    <p>If this was you, you can ignore this email.</p>
  `;
  await sendEmail(to, '📩 Confirm your new email', html);
};

export const sendRevertEmailChange = async (
  to: string,
  token: string,
): Promise<void> => {
  const link = `http://localhost:3000/auth/revert-email?token=${token}`;
  const html = `
    <h2>Email Change Detected</h2>
    <p>Your account email was recently changed.</p>
    <p>If this wasn't you, click the link below to revert the change within 30 days:</p>
    <a href="${link}">${link}</a>
    <p>If it was you, you can ignore this message.</p>
  `;
  await sendEmail(to, '🔄 Revert email change', html);
};
