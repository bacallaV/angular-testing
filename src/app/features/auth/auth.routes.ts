import { Routes } from '@angular/router';
/* Components */
import {
  LoginPageComponent,
  RegisterPageComponent
} from './pages';

export const routesAuth: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: '**',
    redirectTo: 'register',
  },
];
