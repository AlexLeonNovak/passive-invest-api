import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByUuidQuery } from './get-by-uuid.query';
import { UserRepository } from '../../repositories/user.repository';
import { UserEntity } from '../../entities/user.entity';

@QueryHandler(GetByUuidQuery)
export class GetByUuidHandler implements IQueryHandler<GetByUuidQuery> {
  constructor(private readonly userRepo: UserRepository) {}
  execute({ uuid }: GetByUuidQuery): Promise<UserEntity> {
    return this.userRepo.findOneByUuid(uuid);
  }
}
