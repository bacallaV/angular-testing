import { defer, Observable, of } from 'rxjs';

export function deferredResolve<T>(data: T): Observable<Awaited<T>> {
  return defer( () => Promise.resolve(data) );
}

export function deferredReject(errMessage: string): Observable<never> {
  return defer( () => Promise.reject(errMessage) );
}

export function mockObservable<T>(data: T): Observable<T> {
  return of(data);
}

export function mockPromiseResolve<T>(data: T): Promise<Awaited<T>> {
  return Promise.resolve(data);
}
