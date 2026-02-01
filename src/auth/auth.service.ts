import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { MailerService } from '../mailer/mailer.service';
import { resetPasswordOtpTemplate } from '../common/mail-templates/reset-password-otp';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  async register(registerDto: RegisterDto) {
    const appName = this.configService.get<string>('PROJECT_NAME') ?? 'Our Platform';
    await this.mailerService.sendMail({
      to: registerDto.email,
      subject: 'Welcome to Our Platform',
      html: resetPasswordOtpTemplate('123', 'jane', appName),
    });
    return {
      username: registerDto.firstName + ' ' + registerDto.lastName,
      email: registerDto.email,
    };
  }
}
