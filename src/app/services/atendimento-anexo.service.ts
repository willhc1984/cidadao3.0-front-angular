import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AtendimentoAnexoService {

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8081/atendimentoAnexos';

  constructor() { }

  // Consome o endpoint: @GetMapping("/byatendimento/{id}")
  listarAnexosPorAtendimento(atendimentoId: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/byatendimento/${atendimentoId}`);
  }

  // Endpoint de exclusão de anexo do atendimento
  excluirAnexoAtendimento(idAnexoAtendimento: number): Observable<void>{
    return this.http.delete<void>(`${this.API_URL}/${idAnexoAtendimento}`);
  }

  // Endpoint de upload de arquivo
  uploadAnexo(file: File): Observable<any>{
    const formData = new FormData();
    formData.append('anexoFile', file, file.name);
    return this.http.post<any>(`${this.API_URL}/upload`, formData);
  }

  // Consome o endpoint de download: @GetMapping("/download/{id}")
  downloadAnexo(anexoId: number, nomeArquivo: string): void{
    this.http.get(`${this.API_URL}/download/${anexoId}`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeArquivo;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.log('Erro ao baixar arquivo: ', err)
    });
  }

}
