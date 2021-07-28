import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import appConfig from '../config/app.config';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserLoginListener } from '../users/listeners/user-login.listener';
import { UserCreatedListener } from '../users/listeners/user-created.listener';
// import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: appConfig().jwtSecretKey,
        signOptions: { expiresIn: '1h' },
      }),
    }),
    MailModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserLoginListener,
    UserCreatedListener,
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  exports: [AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
