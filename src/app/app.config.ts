import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { cidadaoRoleInterceptor } from './interceptors/cidadao-role.interceptor';

export const appConfig: ApplicationConfig = {
  providers: 
  [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor, 
        cidadaoRoleInterceptor
      ])
    ),
    provideEnvironmentNgxMask()
  ]
};
