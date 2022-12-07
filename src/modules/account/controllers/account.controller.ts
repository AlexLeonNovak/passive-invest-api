import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../../core/decorators/user.decorator';
import { UserEntity } from '../../users/entities/user.entity';
import { ActivateCommand } from '../commads/activate/activate.command';
import { CommandBus } from '@nestjs/cqrs';

@UseGuards(JwtAuthGuard)
@Controller()
export class AccountController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('activate/:code')
  async activate(@Param('code', ParseIntPipe) code: number, @User() user: UserEntity): Promise<UserEntity> {
    return await this.commandBus.execute(new ActivateCommand({ id: user.id, code }));
  }
}
