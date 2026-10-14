import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})

export class AtendimentosService {

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8081/atendimentos/cidadao/meus-atendimentos';

  constructor() { }

  buscarAtendimentos(page: number, pageLength: number): Observable<PageResponse<any>>{
    const params = new HttpParams()
      .set('page', page)
      .set('pageLength', pageLength);
    
    return this.http.get<PageResponse<any>>(this.API_URL, { params });
  }
}
