import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { UserRegisteredEvent } from '../events/user-registered/user-registered.event';
import { SendConfirmEmailCommand } from '../../smtp-mailer/commands/send-confirm-email/send-confirm-email.command';
import { ActivationCodeService } from '../services/activation-code.service';

@Injectable()
export class AuthSagas {
  private readonly logger = new Logger('AuthSagas');

  constructor(private readonly activationCodeService: ActivationCodeService) {}

  @Saga()
  userRegistered(events$: Observable<any>): Observable<ICommand> {
    return events$.pipe(
      ofType(UserRegisteredEvent),
      map(async event => {
        this.logger.log('Saga call SendConfirmEmailCommand When userRegistered');
        const code = await this.activationCodeService.generate(event.user.uuid);
        return new SendConfirmEmailCommand({
          to: event.user.email,
          code,
        });
      }),
    );
  }
}
