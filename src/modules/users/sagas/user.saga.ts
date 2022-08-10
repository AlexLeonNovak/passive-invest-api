import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { delay, map, Observable } from 'rxjs';
import { UserCreatedEvent } from '../events/user-created/user-created.event';
import { SendEmailCommand } from '../../smtp-mailer/commands/send-email/send-email.command';

@Injectable()
export class UserSaga {
  private readonly logger = new Logger('UserSaga');

  @Saga()
  userCreated(events$: Observable<any>): Observable<ICommand> {
    return events$.pipe(
      ofType(UserCreatedEvent),
      delay(1000),
      map(event => {
        this.logger.log('Saga call SendEmailCommand When UserCreatedEvent');
        // console.log('Saga', event);
        return new SendEmailCommand({
          to: event.user.email,
          subject: 'Activate your account',
          body: 'should be link',
        });
      }),
    );
  }
}
