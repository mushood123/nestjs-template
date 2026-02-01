import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { resetPasswordOtpTemplate } from 'src/common/mail-templates/reset-password-otp';

@Injectable()
export class AuthService {
  constructor(private readonly mailerService: MailerService) {}
  async register(registerDto: RegisterDto) {
    await this.mailerService.sendMail({
      to: registerDto.email,
      subject: 'Welcome to Our Platform',
      html: resetPasswordOtpTemplate('123', 'jane'),
    });
    return {
      username: registerDto.firstName + ' ' + registerDto.lastName,
      email: registerDto.email,
    };
  }
}
