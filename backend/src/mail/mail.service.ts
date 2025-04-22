import fs from 'fs/promises';
import path from 'path';

import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  private readonly baseUrl = 'http://localhost:3000';

  private async loadTemplate(name: string, token: string): Promise<string> {
    // const templatePath = path.join(__dirname, 'templates', name); PROD!
    const templatePath = path.resolve(
      process.cwd(),
      'src',
      'mail',
      'templates',
      name,
    );
    let html = await fs.readFile(templatePath, 'utf8');
    const url = `${this.baseUrl}/auth/${token}`;
    html = html.replace(/{{LINK}}/g, url);
    return html;
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"No Reply" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  }

  public async sendConfirmationEmail(to: string, token: string): Promise<void> {
    const html = await this.loadTemplate(
      'confirm-email.html',
      `confirm-email?token=${token}`,
    );
    await this.sendEmail(to, '✅ Confirm your account', html);
  }

  public async sendConfirmationUpdatedEmail(
    to: string,
    token: string,
  ): Promise<void> {
    const html = await this.loadTemplate(
      'confirm-email-update.html',
      `confirm-email-update?token=${token}`,
    );
    await this.sendEmail(to, '📩 Confirm your new email', html);
  }

  public async sendRevertEmailChange(to: string, token: string): Promise<void> {
    const html = await this.loadTemplate(
      'revert-email.html',
      `revert-email?token=${token}`,
    );
    await this.sendEmail(to, '🔄 Revert email change', html);
  }

  public async sendPasswordReset(to: string, token: string): Promise<void> {
    const html = await this.loadTemplate(
      'reset-password.html',
      `reset-password?token=${token}`,
    );
    await this.sendEmail(to, '🔐 Reset your password', html);
  }
}
