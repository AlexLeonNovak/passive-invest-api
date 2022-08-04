import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokenEntity } from './entities/user-token.entity';
import { SendEmailHandler } from './commands/send-email/send-email.handler';
import { AuthController } from './controllers/auth.controller';
import { PasswordService } from './services/password.service';
import { AuthService } from './services/auth.service';
import { TokenRepository } from './repositories/token.repository';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { LoginHandler } from './commands/login/login.handler';
import { RegisterHandler } from './commands/register/register.handler';
// import { UsersModule } from '../users/users.module';

const CommandHandlers = [LoginHandler, RegisterHandler, SendEmailHandler];
const EventHandlers = [];
const QueryHandlers = [];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserTokenEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXP'),
        },
      }),
    }),
    // UsersModule,
  ],
  exports: [TypeOrmModule],
  controllers: [AuthController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    PasswordService,
    AuthService,
    TokenRepository,
    TokenService,
    JwtStrategy,
    JwtRefreshStrategy,
    ConfigService,
  ],
})
export class AuthModule {}
