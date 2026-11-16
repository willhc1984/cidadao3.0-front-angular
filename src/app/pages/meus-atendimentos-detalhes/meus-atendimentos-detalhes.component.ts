import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AtendimentosService } from '../../services/atendimentos.service';
import { AtendimentoAnexoService } from '../../services/atendimento-anexo.service';
import { SweetAlertService } from '../../services/sweet-alert.service';

@Component({
  selector: 'app-meus-atendimentos-detalhes',
  imports: [CommonModule, RouterLink],
  templateUrl: './meus-atendimentos-detalhes.component.html',
  styleUrl: './meus-atendimentos-detalhes.component.scss'
})

export class MeusAtendimentosDetalhesComponent implements OnInit{

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private atendimentoService = inject(AtendimentosService);
  private atendimentoAnexoService = inject(AtendimentoAnexoService);
  private alert = inject(SweetAlertService);

  // Signals para o estado da tela
  atendimento = signal<any>(null);
  anexos = signal<any[]>([]);
  isLoading = signal(true);
  anotacoes = signal<any[]>([]);

  // Variavel para guardar arquivo arquivo selecionado para upload
  arquivoSelecionado: File | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam){
      const id = Number(idParam);
      this.carregarDadosAtendimento(id);
      //this.carregarAnexos(id);
      //this.carregarAnotacoesAtendimento(id);
    }
  }

  carregarDadosAtendimento(id: number){
    this.atendimentoService.buscarPorId(id).subscribe({
      next: (res) => {
        this.atendimento.set(res);
        this.anexos.set(res.anexos || []);
        console.log(res.anexos)
        this.anotacoes.set(res.anotacoes);
        console.log(res.anotacoes);
        this.isLoading.set(false);
      },
      error: (err) => {
        //console.log('Erro ao carregar detalhes do atendimento: ', err);
        this.isLoading.set(false);
        // Captura mensagem que veio da API
        const msg = err.error?.message || 'Erro ao carregar o atendimento.';
        // Atribui ao signal para HTML exibir alert do Bootstrap
        this.router.navigate(['/meus-atendimentos'], {
          queryParams: { erro: msg }
        })
      }
    });
  }

  excluirAnexoAtendimento(idAnexoAtendimento: number, nomeArquivo: string): void{
    this.alert.confirm('Excluir anexo', `Deseja realmente excluir o anexo "${nomeArquivo}"? Está ação não poderá ser desfeita.`)
      .then((result) => {
        if(result){
          this.atendimentoAnexoService.excluirAnexoAtendimento(idAnexoAtendimento).subscribe({
            next: () => {
              this.alert.successModal('Excluido','Anexo removido com sucesso.');  
              this.anexos.update(listaAtual => 
                listaAtual.filter((anexo: any) => Number(anexo.id) !== Number(idAnexoAtendimento))
              )
            },
            error: (erro) => {
              const mensagem = erro.error?.message || erro.error?.detail || 'Erro ao excluir anexo.';
              this.alert.errorModal('Atenção', mensagem);            
            }
          });
       }
    })
  }

  baixarAnexo(id: number, nome: string){
    this.atendimentoAnexoService.downloadAnexo(id, nome);
  }

  // Captura o arquivo quando usuário escolhe na janela do sistema
  onFileSelected(event: any): void{
    const file: File = event.target.files[0];
    if(file){
      this.arquivoSelecionado = file;
    }else{
      this.arquivoSelecionado = null;
    }
  }

  //Dispara a requisição de upload para o backend
  enviarArquivo(): void{
    if(!this.arquivoSelecionado) return;
    this.atendimentoAnexoService.uploadAnexo(this.arquivoSelecionado).subscribe({
      next: (res) => {
        this.alert.successModal('Arquivo enviado', 'Arquivo enviado e salvo com sucesso!');

        // Limpa a seleção e o input file visualmente
        this.arquivoSelecionado = null;
        const fileInput = document.getElementById('inputGroupFile') as HTMLInputElement;
        if(fileInput) fileInput.value = '';

        // Recarrega a lista de anexos para o novo arquivo ser exibido
        const idParam = this.route.snapshot.paramMap.get('id');
        if(idParam){
          this.carregarDadosAtendimento(Number(idParam));
        }
      },
      error: (err) => {
        const mensagem = err.error?.message || err.error?.detail || 'Erro no upload de arquivo';
        this.alert.errorModal('Atenção', mensagem);
      }
    });
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
