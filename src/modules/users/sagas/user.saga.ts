import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { delay, map, Observable } from 'rxjs';
import { UserCreatedEvent } from '../events/user-created/user-created.event';

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
        return null;
        // console.log('Saga', event);
        // return new SendEmailCommand({
        //   to: event.user.email,
        //   subject: 'Activate your account',
        //   body: 'should be link',
        // });
      }),
    );
  }
}
