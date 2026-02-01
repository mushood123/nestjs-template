import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('NODE_MAILER_EMAIL');
    const pass = this.configService.get<string>('NODE_MAILER_APP_PASSWORD');
    const provider = this.configService.get<string>('NODE_MAILER_PROVIDER');

    if (!user || !pass || !provider) {
      throw new Error(
        'NODE_MAILER_EMAIL, NODE_MAILER_APP_PASSWORD, and NODE_MAILER_PROVIDER must be set',
      );
    }

    this.transporter = nodemailer.createTransport({
      service: provider,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendMail(
    options: nodemailer.SendMailOptions,
  ): Promise<nodemailer.SentMessageInfo> {
    return this.transporter.sendMail({
      from: this.configService.get('NODE_MAILER_EMAIL'),
      ...options,
    });
  }
}
