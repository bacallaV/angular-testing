import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

import { User, CreateUserDTO } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.API_URL}/users`;

  constructor(private readonly http: HttpClient) {}

  public create(dto: CreateUserDTO): Observable<User> {
    return this.http.post<User>(this.apiUrl, dto);
  }

  public getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
