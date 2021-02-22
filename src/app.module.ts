import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    TicketsModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27020/train-ticket'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
