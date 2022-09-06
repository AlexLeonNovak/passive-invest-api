import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from './get-by-id.query';
import { UserRepository } from '../../repositories/user.repository';
import { UserEntity } from '../../entities/user.entity';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetByIdQuery> {
  constructor(private readonly userRepo: UserRepository) {}
  execute({ id }: GetByIdQuery): Promise<UserEntity> {
    return this.userRepo.findOneById(id);
  }
}
