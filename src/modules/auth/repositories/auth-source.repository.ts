import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuthSourcesEntity } from '../entities/user-auth-sources.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthSourceRepository {
  constructor(
    @InjectRepository(UserAuthSourcesEntity)
    private repo: Repository<UserAuthSourcesEntity>,
  ) {}

  async create(data: Partial<UserAuthSourcesEntity>) {
    const source = this.repo.create(data);
    return await this.repo.save(source);
  }

  findOne(where) {
    return this.repo.findOne({
      where,
      relations: { user: true },
    });
  }
}
