import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { firstValueFrom } from 'rxjs';

import { AuthService } from './auth.service';

import { environment } from '@environments/environment';
import { TokenService } from '@core/services';
import { Auth } from '@shared/interfaces';

describe('AuthService', () => {
  let service: AuthService;

  let tokenService: TokenService;

  let httpTesting: HttpTestingController;

  const API_URL = `${environment.API_URL}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#login tests', () => {
    it('should return a token', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'password123';
        const authMock: Auth = {
          access_token: '123',
        };
        // Con callThrough no se ejecuta lo decrito en la función
        spyOn(tokenService, 'saveToken').and.callThrough();

        // Act
        const servicePromise = firstValueFrom(
          service.login(email, password)
        );
        const req = httpTesting.expectOne({
          method: 'POST',
          url: `${API_URL}/login`,
        });

        req.flush(authMock);
        const serviceResponse = await servicePromise;

        // Assert
        expect(tokenService.saveToken).toHaveBeenCalledOnceWith(authMock.access_token);
        expect(req.request.body).toEqual({email, password});
        expect(serviceResponse).toEqual(authMock);
    });
  });
});
