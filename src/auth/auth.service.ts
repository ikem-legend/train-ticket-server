import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
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
    // fix sub to existing unique user ID
    const payload = { username: user.email, sub: user.userId }; // check if username or email
    console.log(payload);
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: Users) {
    const saltRounds = process.env.SALT_ROUNDS || 10;
    const hashPassword = await hash(user.password, saltRounds);
    user.password = hashPassword;
    this.logger.log({ user });
    try {
      return this.usersService.create(user);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('Error creating user. Please try again');
    }
  }
}
