import { BadRequestException, Injectable, Logger, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { v4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { Users } from '../users/entities/users.entity';
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
    const passwordCompare = await compare(pass, user.password);
    if (user && passwordCompare) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Users, @Res() response) {
    // TODO: Ensure no user login if user isn't confirmed
    if (user.status === 'Pending') {
      return response.status(401).send({
        message: 'Pending account. Please verify your email',
      });
    }
    const payload = { username: user.email, sub: user.userId };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: Users) {
    const saltRounds = Number(this.configService.get('saltRounds', 10));
    user.password = await hash(user.password, saltRounds);
    const userId = generateUserId();
    user.userId = userId;
    // Check user ID existence before writing user to DB
    const userIdExists = await this.usersService.findOneByUserId(userId);
    const token = v4();
    console.log({ token });
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
          return 'User successfully created';
        } catch (err) {
          this.logger.error(err);
          throw new BadRequestException(
            'Error creating user. Please try again',
          );
        }
      }
    }
  }
}
