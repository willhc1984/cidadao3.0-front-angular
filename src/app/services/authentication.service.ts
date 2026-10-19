import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthenticationRequest } from '../models/authentication-request';
import { map, Observable, tap } from 'rxjs';
import { AuthenticationResponse } from '../models/authentication-response';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private http = inject(HttpClient);

  // URL do backend
  private readonly API_URL = 'http://localhost:8081/authenticate';
  private readonly CIDADAO_URL = 'http://localhost:8081/cidadaos';

  // Guarda o token na memoria quando login da certo
  token: string | null = null;

  authenticate(request: AuthenticationRequest): Observable<AuthenticationResponse>{
    return this.http.post<AuthenticationResponse>(this.API_URL, request).pipe(
      tap((response) => {
        this.token = response.token;
        localStorage.setItem('jwt_token', response.token);
      })
    );
  }

  // Verifica se usuário é um cidadão válido no sistema
  verificarVinculoCidadao(loginUsuario: string): Observable<boolean>{
    return this.http.get<any>(this.CIDADAO_URL).pipe(
      map((res) => {
        const listaCidadaos = Array.isArray(res) ? res : (res?.elements || []);
        const cidadaoVinculado = listaCidadaos.find(
          (c: any) => c.usuarioLogin === loginUsuario,
        );

        if(cidadaoVinculado){
          localStorage.setItem('usuario_login', loginUsuario);
          localStorage.setItem('usuario_nome', cidadaoVinculado.pronomeDeTratamento + ' ' + cidadaoVinculado.nome);

          if(cidadaoVinculado.fotoFile && cidadaoVinculado.fotoFile.base64Content){
            localStorage.setItem('foto_cidadao', cidadaoVinculado.fotoFile.base64Content);
          }
          
          return true;
        }else{
          this.logout(); //Remove token se não for cidadão válido
          throw new Error('Acesso negado: usuário não é um cidadão válido no sistema.');
        }
      })
    );
  }

  logout(){
    this.token = null;
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('usuario_login');
    localStorage.removeItem('usuario_nome');
  }

}