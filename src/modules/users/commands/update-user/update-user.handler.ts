import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { UserRepository } from '../../repositories/user.repository';
import { UserEntity } from '../../entities/user.entity';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute({ uuid, update }: UpdateUserCommand): Promise<UserEntity> {
    return this.userRepo.update(uuid, update);
  }
}
