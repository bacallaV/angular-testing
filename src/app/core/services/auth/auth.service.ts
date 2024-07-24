import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Auth, User } from '@shared/interfaces';
import { TokenService } from '@core/services';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/auth`;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService,
  ) { }

  public login(email: string, password: string): Observable<Auth> {
    return this.http.post<Auth>(`${this.apiUrl}/login`, {email, password})
    .pipe(
      tap(response => this.tokenService.saveToken(response.access_token))
    );
  }

  public getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  public loginAndGet(email: string, password: string): Observable<User> {
    return this.login(email, password)
    .pipe(
      switchMap(() => this.getProfile()),
    );
  }
}
