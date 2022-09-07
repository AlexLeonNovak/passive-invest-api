import { Body, Controller, Get, ParseIntPipe, Post, Param, Res, UseGuards, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { PayloadDto } from '../dto/payload.dto';
import { JoinByEmailDto } from '../dto/join-by-email.dto';
import { IUserAuthPayload } from '../services/auth.service';
import { Response } from 'express';
import { CookieService } from '../services/cookie.service';
import { ActivateCommand } from '../commands/activate/activate.command';
import { JoinByEmailCommand } from '../commands/join-by-email/join-by-email.command';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../../../core/decorators/user.decorator';
import { UserEntity } from '../../users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Register user' })
  @ApiCreatedResponse({ type: PayloadDto })
  @Post('join-by-email')
  async joinByEmail(@Body() joinByEmail: JoinByEmailDto, @Res({ passthrough: true }) response: Response) {
    const payload = await this.commandBus.execute(new JoinByEmailCommand(joinByEmail));
    CookieService.setRefreshToken(response, payload.refreshToken);
    return payload;
  }

  @UseGuards(JwtAuthGuard)
  @Get('activate/:code')
  async activate(@Param('code', ParseIntPipe) code: number, @User() user: UserEntity): Promise<IUserAuthPayload> {
    return await this.commandBus.execute(new ActivateCommand({ id: user.id, code }));
  }
}
