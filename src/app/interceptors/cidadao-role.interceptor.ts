import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SweetAlertService } from '../services/sweet-alert.service';
import { EMPTY, tap } from 'rxjs';

export const cidadaoRoleInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const alert = inject(SweetAlertService);

  // Libera endpoint de autenticação inicial
  if(req.url.includes('/authenticate')){
    return next(req);
  }

  // Libera e inspeciona a resposta da checagem de role
  if(req.url.includes('usuarios/hasrole/ROLE_CIDADAO')){
    return next(req).pipe(
      tap((event) => {
        if(event instanceof HttpResponse && event.body){
          const body: any = event.body;
          // Verifica o booleano retornado pela API
          const possuiRole = body.result === true;

          if(possuiRole){
            localStorage.setItem('possui_role', 'true');
          }else{
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('possui_role');
            alert.errorModal('Acesso negado', 'Usuário não validadao.');
            router.navigate(['/login']);
          }
        }
      })
    )
  }

  // Para demais rotas da API
  const token = localStorage.getItem('jwt_token');
  const isCidadaoValidado = localStorage.getItem('possui_role') === 'true';

  if(token && !isCidadaoValidado){
    localStorage.removeItem('jwt_token');
    alert.errorModal('Acesso negado', 'Usuário não validado');
    router.navigate(['/login']);
    return EMPTY;
  }

  return next(req);

}

