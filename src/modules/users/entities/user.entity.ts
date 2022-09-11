import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../core/entity/base.entity';
import { UserRole, UserStatus } from '../../../core/enums/user.enum';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @Column({ default: UserStatus.NEW, length: 16 })
  status: UserStatus;

  @Column({ length: 8, enum: UserRole, default: UserRole.USER })
  roles: UserRole;

  isActive() {
    return this.status === UserStatus.ACTIVE;
  }

  isWait() {
    return this.status === UserStatus.WAIT;
  }
}
