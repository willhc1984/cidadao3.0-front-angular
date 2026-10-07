import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthenticationRequest } from '../models/authentication-request';
import { Observable, tap } from 'rxjs';
import { AuthenticationResponse } from '../models/authentication-response';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private http = inject(HttpClient);

  // URL do backend
  private readonly API_URL = 'http://localhost:8081/authenticate';
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

  logout(){
    this.token = null;
    localStorage.removeItem('jwt_token');
  }


}
