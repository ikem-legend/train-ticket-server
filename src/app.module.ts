import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      envFilePath: ['.env.development, .env.production'],
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        JWT_SECRET_KEY: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    UsersModule,
    TicketsModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27020/train-ticket'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
