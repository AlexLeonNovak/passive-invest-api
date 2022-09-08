import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Param,
  Res,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
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
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';
import { LogoutCommand } from '../commands/logout/logout.command';
import { RefreshCommand } from '../commands/refresh/refresh.command';

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
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) response: Response, @Req() request: Request) {
    const { refreshToken } = request.signedCookies;
    await this.commandBus.execute(new LogoutCommand(refreshToken));
    CookieService.removeRefreshToken(response);
    return;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(@Res({ passthrough: true }) response: Response, @User() user: UserEntity) {
    const payload = await this.commandBus.execute(new RefreshCommand(user));
    CookieService.setRefreshToken(response, payload.refreshToken);
    return payload;
  }

  @UseGuards(JwtAuthGuard)
  @Get('activate/:code')
  async activate(@Param('code', ParseIntPipe) code: number, @User() user: UserEntity): Promise<IUserAuthPayload> {
    return await this.commandBus.execute(new ActivateCommand({ id: user.id, code }));
  }
}
