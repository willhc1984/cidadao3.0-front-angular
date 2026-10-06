import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthenticationService);
  const router = inject(Router);

  // Verifica se o token existe na memoria do serviço ou localStorage
  const hasToken = authService.token || localStorage.getItem('jwt_token');

  if(hasToken){
    // Se tem token, o segurança deixa passar
    return true;
  }

  return router.createUrlTree(['/login']);
};
