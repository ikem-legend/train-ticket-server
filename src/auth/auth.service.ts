import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { compare, hash } from 'bcrypt';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { Users, UserStatus } from '../users/entities/users.entity';
import { generateUserId } from '../helpers/utils';
import { UserLoginEvent } from '../users/events/user-login.event';
import { UserCreatedEvent } from '../users/events/user-created.event';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger();

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const passwordCompare = await compare(pass, user.password);
    if (!passwordCompare) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const { password, ...result } = user;
    return result;
  }

  async login(user: Users, response: Response): Promise<void> {
    // Since an error will be thrown if user does not exist, no need to duplicate the check here
    // Ensure no user login if user isn't confirmed
    if (!user.status || user.status === 'Pending') {
      response.status(HttpStatus.UNAUTHORIZED).send({
        message: 'Pending account. Please verify your email',
      });
    }
    const userLoginEvent = new UserLoginEvent();
    userLoginEvent.email = user.email;
    this.eventEmitter.emit('user.login', userLoginEvent);
    const payload = { username: user.email, sub: user.userId };
    response
      .status(HttpStatus.OK)
      .send({ access_token: this.jwtService.sign(payload) });
  }

  async register(user: Users): Promise<string> {
    const saltRounds = Number(this.configService.get('saltRounds', 10));
    user.password = await hash(user.password, saltRounds);
    const userId = generateUserId();
    user.userId = userId;
    // Check user ID existence before writing user to DB
    const userIdExists = await this.usersService.findOneByUserId(userId);
    const token = uuidv4();
    user.confirmationToken = token;
    user.status = UserStatus.Pending;
    if (userIdExists) {
      this.register(user);
    } else {
      const phoneExists = await this.usersService.findOneByPhone(user.phone);
      if (phoneExists) {
        throw new BadRequestException(
          'Error creating user',
          'Phone number already exists',
        );
      } else {
        this.logger.log('Signup successful');
        this.logger.log({ user });
        try {
          await this.usersService.create(user).then(() => {
            const userCreatedEvent = new UserCreatedEvent();
            userCreatedEvent.name = user.firstName;
            userCreatedEvent.email = user.email;
            userCreatedEvent.token = token;
            this.eventEmitter.emit('user.created', userCreatedEvent);
          });
          return 'User registered successfully. Please verify your email';
        } catch (err) {
          this.logger.error(err);
          throw new BadRequestException(
            'Error creating user. Please try again',
          );
        }
      }
    }
  }

  async confirm(confirmationToken: string): Promise<string> {
    const user = await this.usersService.findOneByToken(confirmationToken);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.status = UserStatus.Active;
    try {
      await this.usersService.edit(user._id, user);
      return 'User confirmed successfully';
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('Error confirming user, please try again');
    }
  }
}
