import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './controllers/users.controller';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserCreatedHandler } from './events/user-created/user-created.handler';
import { CreateUserHandler } from './commands/create-user/create-user.handler';
import { GetByEmailHandler } from './queries/get-by-email/get-by-email.handler';
import { UpdateUserHandler } from './commands/update-user/update-user.handler';
import { GetByUuidHandler } from './queries/get-by-uuid/get-by-uuid.handler';

const CommandHandlers = [CreateUserHandler, UpdateUserHandler];
const EventHandlers = [UserCreatedHandler];
const QueryHandlers = [GetByEmailHandler, GetByUuidHandler];

@Module({
  imports: [CqrsModule, PassportModule, TypeOrmModule.forFeature([UserEntity])],
  exports: [TypeOrmModule, UserRepository],
  controllers: [UsersController],
  providers: [UserRepository, ...EventHandlers, ...CommandHandlers, ...QueryHandlers],
})
export class UsersModule {}
