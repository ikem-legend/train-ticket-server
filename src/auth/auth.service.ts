import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { Users, UserStatus } from '../users/entities/users.entity';
import { generateUserId } from '../helpers/utils';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
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
        this.logger.log({ user });
        try {
          await this.usersService.create(user).then(() => {
            this.mailService.sendUserConfirmation(user, token);
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
