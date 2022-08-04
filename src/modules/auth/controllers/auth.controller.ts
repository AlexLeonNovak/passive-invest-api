import { Body, Controller, Next, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { PayloadDto } from '../dto/payload.dto';
import { JoinByEmailDto } from '../dto/join-by-email.dto';
import { IUserAuthPayload } from '../services/auth.service';
import { LoginCommand } from '../commands/login/login.command';
import { NotFoundError } from 'rxjs';
import { RegisterCommand } from '../commands/register/register.command';
import { NextFunction, Response } from 'express';
import { CookieService } from '../services/cookie.service';

@Controller()
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Register user' })
  @ApiCreatedResponse({ type: PayloadDto })
  @Post('join-by-email')
  async joinByEmail(
    @Body() joinByEmail: JoinByEmailDto,
    @Res({ passthrough: true }) response: Response,
    @Next() next: NextFunction,
  ) {
    let payload: IUserAuthPayload;
    try {
      payload = await this.commandBus.execute(new LoginCommand(joinByEmail));
      CookieService.setRefreshToken(response, payload.refreshToken);
    } catch (e) {
      if (!(e instanceof NotFoundError)) {
        next(e);
      }
      try {
        payload = await this.commandBus.execute(new RegisterCommand(joinByEmail));
      } catch (e) {
        next(e);
      }
    }
    return payload;
  }
}
