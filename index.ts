import './style.css';

import { of, switchMap, catchError, startWith, map } from 'rxjs';

import { RestService } from './RestMock/rest.service';
import { UserData } from './RestMock/models';

const restService = new RestService();

export interface PollingResult {
  data?: UserData;
  status: 'SUCCEDED' | 'FAILED' | 'IN PROGRESS';
  error: string;
}

function processUserData() {
  return init().pipe(
    startWith({
      status: 'IN PROGRESS',
    })
  );
}

function init() {
  return restService.initPolling(true).pipe(
    switchMap(() => {
      return poll();
    }),
    catchError(() => {
      return of({
        status: 'FAILED',
        error: 'Failed to start polling',
      });
    })
  );
}

function poll() {
  const errorResponse$ = of({
    status: 'FAILED',
    error: 'Error during polling process',
  });

  return restService.getPollingProgress().pipe(
    switchMap((progress) => {
      if (progress.data.status === 'FAILED') {
        return errorResponse$;
      }

      return progress.data.status === 'DONE' ? getResult() : poll();
    }),
    catchError(() => {
      return errorResponse$;
    })
  );
}

function getResult() {
  return restService.obtainTheResult(true).pipe(
    map((response) => ({
      data: response.data,
      status: 'SUCCEDED',
    })),
    catchError(() =>
      of({
        status: 'FAILED',
        error: 'Failed to obtain user data after polling',
      })
    )
  );
}

processUserData().subscribe(console.log);
