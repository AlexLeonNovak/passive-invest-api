import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { mergeMap, Observable } from 'rxjs';
import { UserRegisteredByEmailEvent } from '../events/user-registered-by-email/user-registered-by-email.event';
import { SendConfirmEmailCommand } from '../../smtp-mailer/commands/send-confirm-email/send-confirm-email.command';
import { ActivationCodeService } from '../services/activation-code.service';

@Injectable()
export class AuthSagas {
  private readonly logger = new Logger('AuthSagas');

  constructor(private readonly activationCodeService: ActivationCodeService) {}

  @Saga()
  userRegistered(events$: Observable<any>): Observable<ICommand> {
    return events$.pipe(
      ofType(UserRegisteredByEmailEvent),
      mergeMap(async event => {
        this.logger.log('Saga call SendConfirmEmailCommand When userRegistered');
        const code = await this.activationCodeService.generate(event.user.id);
        return new SendConfirmEmailCommand({
          to: event.email,
          code,
        });
      }),
    );
  }
}
