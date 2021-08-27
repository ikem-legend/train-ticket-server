import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserPasswordResetEvent } from '../events/user-password-reset.event';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class UserPasswordResetListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent('user.passwordReset')
  handleUserPasswordResetEvent(event: UserPasswordResetEvent): void {
    const { name, email, token } = event;
    this.mailService.sendPasswordReset(name, email, token);
  }
}
