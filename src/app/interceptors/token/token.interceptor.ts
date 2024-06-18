import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { TokenService } from '../../services/token/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenService).getToken();

  if(!token) return next(req);

  req = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });

  return next(req);
};
