import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Users } from '../users/entities/users.entity';
import { generateUserId } from '../helpers/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
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

  async login(user: Users) {
    const payload = { username: user.email, sub: user.userId }; // check if username or email
    console.log({ payload });
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: Users) {
    const saltRounds = Number(this.configService.get('saltRounds', 10));
    const hashPassword = await hash(user.password, saltRounds);
    user.password = hashPassword;
    const userId = generateUserId();
    user.userId = userId;
    // Check user ID existence before writing user to DB
    const userIdExists = await this.usersService.findOneByUserId(userId);
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
          await this.usersService.create(user);
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
