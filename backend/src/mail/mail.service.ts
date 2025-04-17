import * as nodemailer from 'nodemailer';

export const sendConfirmationEmail = async (to: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/confirm?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
    to,
    subject: '✅ Confirma tu cuenta',
    html: `
      <h2>Confirmación de Cuenta</h2>
      <p>Gracias por registrarte. Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
      <a href="${confirmLink}">${confirmLink}</a>
      <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
    `,
  });
};
