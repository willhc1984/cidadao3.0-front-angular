import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AtendimentosService } from '../../services/atendimentos.service';
import { AtendimentoAnexoService } from '../../services/atendimento-anexo.service';

@Component({
  selector: 'app-meus-atendimentos-detalhes',
  imports: [CommonModule, RouterLink],
  templateUrl: './meus-atendimentos-detalhes.component.html',
  styleUrl: './meus-atendimentos-detalhes.component.scss'
})

export class MeusAtendimentosDetalhesComponent implements OnInit{

  private route = inject(ActivatedRoute);
  private atendimentoService = inject(AtendimentosService);
  private atendimentoAnexoService = inject(AtendimentoAnexoService);

  // Signals para o estado da tela
  atendimento = signal<any>(null);
  anexos = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam){
      const id = Number(idParam);
      this.carregarDadosAtendimento(id);
      this.carregarAnexos(id);
    }
  }

  carregarDadosAtendimento(id: number){
    this.atendimentoService.buscarPorId(id).subscribe({
      next: (res) => {
        this.atendimento.set(res);
        this.isLoading.set(false); 
      },
      error: (err) => {
        console.log('Erro ao carregar detalhes do atendimento: ', err);
        this.isLoading.set(false);
      }
    });
  }

  carregarAnexos(id: number){
    this.atendimentoAnexoService.listarAnexosPorAtendimento(id).subscribe({
      next: (res) => {
        this.anexos.set(res.anexos || []);
      },
      error: (err) => {
        console.error('Erro ao carregar anexos: ', err)
      }
    });
  }

  baixarAnexo(id: number, nome: string){
    this.atendimentoAnexoService.downloadAnexo(id, nome);
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

}
