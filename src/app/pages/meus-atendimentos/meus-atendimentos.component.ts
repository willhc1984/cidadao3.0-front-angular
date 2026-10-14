import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AtendimentosService } from '../../services/atendimentos.service';

@Component({
  selector: 'app-meus-atendimentos',
  imports: [CommonModule],
  templateUrl: './meus-atendimentos.component.html',
  styleUrl: './meus-atendimentos.component.scss'
})

export class MeusAtendimentosComponent {
  private http = inject(HttpClient);
  private atendimentoService = inject(AtendimentosService);

  // Signals para armazenar o estado da tela
  atendimentos = signal<any[]>([]);
  totalPages = signal(0);
  totalElements = signal(0);
  currentPage = signal(0);
  pageSize = signal(10);
  isLoading = signal(true);

  ngOnInit(){
    this.carregarAtendimentos();
  }

  carregarAtendimentos(){
    this.isLoading.set(true);
    // Envia os parametros de paginação (page e pageLength) que o backend espera
    const params = new HttpParams()
      .set('page', this.currentPage())
      .set('pageLength', this.pageSize());

  // Requisição para o endpoint Java Spring
  this.atendimentoService.buscarAtendimentos(this.currentPage(), this.pageSize()).subscribe({
    next: (res) => {
        // O PageDTO do Java retorna 'elements', 'totalPages', 'totalElements'
        this.atendimentos.set(res.elements || []);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements || 0);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar atendimentos do cidadão: ', err);
        this.isLoading.set(false);
      }
    })
  };

  // Método disparado pelos botões de paginação HTML
  mudarPagina(novaPagina: number) {
    if(novaPagina >= 0 && novaPagina <this.totalPages()){
      this.currentPage.set(novaPagina);
      this.carregarAtendimentos();
    }
  }

  // Formata o texto que vem da API no campo estado 
  formatarDescricaoEstado(descricao: string): string{
    if(!descricao) return 'Desconhecido';

    return descricao
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Mudar cor de badge no HTML
  obterCorBadgeEstado(estadoDescricao: string): string {
    switch(estadoDescricao){
      case 'ABERTO':
        return 'bg-primary';
      case 'EM_ANDAMENTO':
        return 'bg-info';
      case 'AGUARDANDO':
        return 'bg-warning text-dark';
      case 'FECHADO':
        return 'bg-success';
      case 'ARQUIVADO':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  }

  // Método chamado quando usuário alterar quantidade de registros no select
  mudarPageSize(event: Event){
    const selectElement = event.target as HTMLSelectElement;
    const novoTamanho = Number(selectElement.value);

    this.pageSize.set(novoTamanho);
    this.currentPage.set(0);
    this.carregarAtendimentos();
  }
}
