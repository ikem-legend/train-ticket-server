import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  private readonly logger = new Logger();

  async sendUserConfirmation(name: string, email: string, token: string) {
    const url = `https://example.com/auth/confirm?token=${token}`;

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Welcome to Train Booking App! Confirm your email',
        template: './confirmation',
        context: {
          name,
          url,
        },
      })
      .then(() => {
        this.logger.log('Confirmation email successfully sent');
      })
      .catch((error) => {
        this.logger.log('Error sending confirmation email');
        this.logger.error(error);
      });
  }
}
