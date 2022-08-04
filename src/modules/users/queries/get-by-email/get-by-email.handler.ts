import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByEmailQuery } from './get-by-email.query';
import { UserEntity } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

@QueryHandler(GetByEmailQuery)
export class GetByEmailHandler implements IQueryHandler<GetByEmailQuery> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute({ email }: GetByEmailQuery): Promise<UserEntity | undefined> {
    return this.userRepo.findOneByEmail(email);
  }
}
