import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
  ) {}

  // findOneByEmail(email: string): Promise<UserEntity | undefined> {
  //   // console.log('UserRepository.findOneByEmail');
  //   return this.repo.findOne({
  //     where: { email },
  //   });
  // }

  findOneById(id: string) {
    return this.repo.findOne({
      where: { id },
    });
  }

  // async exists(email: string): Promise<boolean> {
  //   const found = await this.findOneByEmail(email);
  //   return !!found;
  // }

  create(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
  }

  async update(id: string, update: Partial<UserEntity | undefined>): Promise<UserEntity> {
    const newUser = this.repo.create({ id, ...update });
    return this.repo.save(newUser);
  }
}
