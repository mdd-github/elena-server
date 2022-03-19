import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async send(receiver: string, subject: string, html: string) {
    const from = this.configService.get('APP_MAIL_USER');

    const transporter = nodemailer.createTransport({
      host: this.configService.get('APP_MAIL_SMTP_HOST'),
      port: +this.configService.get<number>('APP_MAIL_SMTP_PORT'),
      secure: this.configService.get<boolean>('APP_MAIL_SMTP_IS_SECURE'),
      auth: {
        user: from,
        pass: this.configService.get('APP_MAIL_PASSWORD'),
      },
    });

    await transporter.sendMail({
      from: from,
      to: receiver,
      subject: subject,
      html: html,
    });
  }
}
