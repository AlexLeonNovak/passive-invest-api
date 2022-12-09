import { Body, Controller, Get, Post, Res, UseGuards, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PayloadDto } from '../dto/payload.dto';
import { JoinByEmailDto } from '../dto/join-by-email.dto';
import { Response } from 'express';
import { CookieService } from '../services/cookie.service';
import { JoinByEmailCommand } from '../commands/join-by-email/join-by-email.command';
import { User } from '../../../core/decorators/user.decorator';
import { UserEntity } from '../../users/entities/user.entity';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';
import { LogoutCommand } from '../commands/logout/logout.command';
import { RefreshCommand } from '../commands/refresh/refresh.command';

@ApiTags('Authentication')
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

  @ApiOperation({ summary: 'Logout' })
  @ApiNoContentResponse()
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) response: Response, @Req() request: Request) {
    const { refreshToken } = request.signedCookies;
    await this.commandBus.execute(new LogoutCommand(refreshToken));
    CookieService.removeRefreshToken(response);
    return;
  }

  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiOkResponse({ type: PayloadDto })
  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(@Res({ passthrough: true }) response: Response, @User() user: UserEntity) {
    const payload = await this.commandBus.execute(new RefreshCommand(user));
    CookieService.setRefreshToken(response, payload.refreshToken);
    return payload;
  }
}
