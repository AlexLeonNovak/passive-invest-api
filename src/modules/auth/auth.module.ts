import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokenEntity } from './entities/user-token.entity';
import { AuthController } from './controllers/auth.controller';
import { PasswordService } from './services/password.service';
import { AuthService } from './services/auth.service';
import { TokenRepository } from './repositories/token.repository';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthSagas } from './sagas/auth.sagas';
import { ActivateHandler } from './commands/activate/activate.handler';
import { ActivationCodeService } from './services/activation-code.service';
import { EmailActivationCodesRepository } from './repositories/email-activation-codes.repository';
import { UserEmailActivationCodesEntity } from './entities/user-email-activation-codes.entity';
import { JoinByEmailHandler } from './commands/join-by-email/join-by-email.handler';

const CommandHandlers = [JoinByEmailHandler, ActivateHandler];
const EventHandlers = [];
const QueryHandlers = [];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserTokenEntity, UserEmailActivationCodesEntity]),
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
    AuthSagas,
    EmailActivationCodesRepository,
    ActivationCodeService,
  ],
})
export class AuthModule {}
