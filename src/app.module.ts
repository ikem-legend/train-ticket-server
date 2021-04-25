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

const nodeEnv = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !nodeEnv ? '.env' : `.env.${nodeEnv}`,
      load: [appConfig],
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
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: appConfig().database }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
