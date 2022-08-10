import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppRoutingModule } from './app-routing.module';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { SmtpMailerModule } from './modules/smtp-mailer/smtp-mailer.module';

const AppModules = [UsersModule];

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AppRoutingModule, CqrsModule, ...AppModules, SmtpMailerModule],
  exports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
