import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import appConfig from '../config/app.config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: appConfig().supportEmailHost,
        secure: false,
        auth: {
          user: appConfig().supportEmailAddress,
          pass: appConfig().supportEmailPassword,
        },
      },
      defaults: {
        from: '"Support Team" <support@astrigatetechnologies.com>',
      },
      template: {
        dir: `${__dirname}/templates`,
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
