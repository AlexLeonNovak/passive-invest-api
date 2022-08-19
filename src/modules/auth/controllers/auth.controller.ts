import { Body, Controller, Get, Next, Param, Post, Query, Res } from '@nestjs/common';
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
import { ActivateDto } from '../dto/activate.dto';
import { ActivateCommand } from '../commands/activate/activate.command';

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

  @Get('activate/:email/:code')
  async activate(@Query() activateDto: ActivateDto): Promise<IUserAuthPayload> {
    return await this.commandBus.execute(new ActivateCommand(activateDto));
  }
}
