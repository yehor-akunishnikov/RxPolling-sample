import { of, tap, delay, Observable, throwError } from 'rxjs';

import { PollingProgress, Response, UserData } from './models';

const pollingGenerator = function* (
  isSuccessfulPolling: boolean
): Generator<Observable<Response<PollingProgress>>> {
  if (isSuccessfulPolling) {
    yield of({ statusCode: 200, data: { status: 'STARTING', state: 0 } });
    yield of({ statusCode: 200, data: { status: 'IN PROGRESS', state: 20 } });
    yield of({ statusCode: 200, data: { status: 'IN PROGRESS', state: 40 } });
    yield of({ statusCode: 200, data: { status: 'IN PROGRESS', state: 60 } });
    yield of({ statusCode: 200, data: { status: 'IN PROGRESS', state: 80 } });
    yield of({ statusCode: 200, data: { status: 'DONE', state: 100 } });
  } else {
    yield of({ statusCode: 200, data: { status: 'STARTING', state: 0 } });
    yield of({ statusCode: 200, data: { status: 'IN PROGRESS', state: 20 } });
    yield of({ statusCode: 200, data: { status: 'IN PROGRESS', state: 40 } });
    yield of({ statusCode: 200, data: { status: 'IN PROGRESS', state: 60 } });
    yield of({ statusCode: 200, data: { status: 'IN PROGRESS', state: 80 } });
    yield of({ statusCode: 200, data: { status: 'FAILED', state: 100 } });
  }
};

export class RestService {
  private generator: Generator<Observable<Response<PollingProgress>>>;

  public initPolling(
    isSuccess: boolean,
    isSuccessfulPolling: boolean = true
  ): Observable<Response> {
    let response: Observable<Response>;

    if (isSuccess) {
      response = of({ statusCode: 200 }).pipe(
        tap(() => {
          this.generator = pollingGenerator(isSuccessfulPolling);
        })
      );
    } else {
      response = throwError(() => ({
        status: 400,
        error: 'Failed to start a polling',
      }));
    }

    return response.pipe(delay(3000));
  }

  public getPollingProgress(): Observable<Response<PollingProgress>> {
    let response: Observable<Response<PollingProgress>>;

    if (this.generator) {
      response = this.generator.next().value;
    } else {
      response = throwError(() => ({
        statusCode: 400,
        error: 'No polling process in progress at the moment',
      }));
    }

    return response.pipe(delay(3000));
  }

  public obtainTheResult(isSuccess: boolean): Observable<Response<UserData>> {
    let response: Observable<Response<UserData>>;

    if (isSuccess) {
      response = of({ statusCode: 200, data: { name: 'John', age: 10 } });
    } else {
      response = throwError(() => ({
        statusCode: 400,
        error: 'Failed to process data',
      }));
    }

    return response.pipe(delay(3000));
  }
}
