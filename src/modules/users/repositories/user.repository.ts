import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { Uuid } from '../../../core/value-objects/uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
  ) {}

  findOneByEmail(email: string): Promise<UserEntity | undefined> {
    // console.log('UserRepository.findOneByEmail');
    return this.repo.findOne({
      where: { email },
    });
  }

  findOneByUuid(uuid: Uuid) {
    return this.repo.findOne({
      where: { uuid },
    });
  }

  async exists(email: string): Promise<boolean> {
    // console.log('UserRepository.exists');
    const found = await this.findOneByEmail(email);
    return !!found;
  }

  async create(user: Partial<UserEntity>) {
    return this.repo.save(user);
  }
}
