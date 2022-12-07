import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { ActivateHandler } from './commads/activate/activate.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthSagas } from './sagas/auth.sagas';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEmailActivationCodesEntity } from './entities/user-email-activation-codes.entity';
import { EmailActivationCodesRepository } from './repositories/email-activation-codes.repository';
import { ActivationCodeService } from './services/activation-code.service';
import { ConfigModule } from '@nestjs/config';

const CommandHandlers = [ActivateHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEmailActivationCodesEntity]), ConfigModule],
  controllers: [AccountController],
  providers: [...CommandHandlers, AuthSagas, EmailActivationCodesRepository, ActivationCodeService],
})
export class AccountModule {}
