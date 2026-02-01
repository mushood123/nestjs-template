import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [MailerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
