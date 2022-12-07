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
import { JoinByEmailHandler } from './commands/join-by-email/join-by-email.handler';
import { PassportModule } from '@nestjs/passport';
import { LogoutHandler } from './commands/logout/logout.handler';
import { RefreshHandler } from './commands/refresh/refresh.handler';
import { UserAuthSourcesEntity } from './entities/user-auth-sources.entity';
import { AuthSourcesService } from './services/auth-sources.service';
import { AuthSourceRepository } from './repositories/auth-source.repository';

const CommandHandlers = [JoinByEmailHandler, LogoutHandler, RefreshHandler];
const EventHandlers = [];
const QueryHandlers = [];

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    TypeOrmModule.forFeature([UserTokenEntity, UserAuthSourcesEntity]),
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
    AuthSourcesService,
    AuthSourceRepository,
  ],
})
export class AuthModule {}
