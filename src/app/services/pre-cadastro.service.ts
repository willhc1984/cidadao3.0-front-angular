import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CidadaoPreCadastro } from '../models/pre-cadastro.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PreCadastroService {

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8081/cidadao/pre-cadastro';
  
  salvar(dados: CidadaoPreCadastro): Observable<any>{
    return this.http.post<any>(this.API_URL, dados);
  }


}
