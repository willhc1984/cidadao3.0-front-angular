import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthenticationService)
  
  // Pega token da memoria ou localStorage
  const token = authService.token || localStorage.getItem('jwt_token');

  // Se o token existir, clonamos a requisição injetando o cabeçalho de autorização
  if(token){
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // Se não existir, a requisição segue viagem normalmente 
  return next(req);
};
