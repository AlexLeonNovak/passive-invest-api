import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @ApiProperty()
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  id: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
