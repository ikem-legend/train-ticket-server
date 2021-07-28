import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserLoginEvent } from '../events/user-login.event';

@Injectable()
export class UserLoginListener {
  private readonly logger = new Logger();

  @OnEvent('user.login')
  handleUserLoginEvent(event: UserLoginEvent): void {
    // Keep track of user login and in the future, possibly store in the db for
    // security features like preventing login after certain events
    this.logger.log(`${event.email} logged in at ${new Date().toISOString()}`);
  }
}
