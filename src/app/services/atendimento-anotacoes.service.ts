import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoAnotacoesService {

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8081/anotacoes/byatendimento'

  constructor() { }

  // Busca anotações pelo ID do atendimento
  buscaAnotacoesIdAtendimento(id: number): Observable<any>{
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

}
