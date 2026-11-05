import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild, ElementRef, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { debounce, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PreCadastroService } from '../../services/pre-cadastro.service';

@Component({
  selector: 'app-pre-cadastro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pre-cadastro.component.html',
  styleUrl: './pre-cadastro.component.scss'
})

export class PreCadastroComponent implements OnInit{

  @ViewChild('inputNumero') inputNumero!: ElementRef;

  ngOnInit(): void {
    this.configurarBuscaCep();
  }

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private alert = inject(SweetAlertService);
  private http = inject(HttpClient);
  private service = inject(PreCadastroService);

  // Signals para controle da tela
  isLoading = signal(false);
  mensagemErro = signal<string | null>(null);
  mensagemSucesso = signal<string | null>(null);
  cepNaoEncontrado = signal(false);

  // Definição do formulário reativo
  form: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    dataDeNascimento: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    sexo: ['', [Validators.required]],
    rg: [''],
    cpf: [''],
    cep: [''],
    logradouro: [''],
    bairro: [''],
    cidade: [''],
    estado: [''],
    celular: ['', [Validators.required]],
    numero: [''],
    numeroEleitoral: ['']
  });

  salvar() : void{
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    
    const dados = this.prepararDadosEnvio();
    console.log("Dados sanitizados: ", dados);

    this.service.salvar(dados).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: () => {
        this.alert.successModal("Pré-cadastro realizado!", "Aguarde a liberação do gabinete para acessar o sistema.");
        this.form.reset();
      },
      error: (erro) => {
        const mensagem = this.extrairMensagemErro(erro);
        this.alert.errorModal('Atenção', mensagem);
      }
    });
  }

  // Prepara os dados do formulario removendo mascaras e caracteres especiais
  private prepararDadosEnvio(){
    const valores = this.form.value;
    return{
      ...valores,
      cep: this.form.value.cep ? this.form.value.cep.replace(/\D/g, '') : '',
      cpf: this.form.value.cpf ? this.form.value.cpf.replace(/\D/g, '') : '',
      celular: this.form.value.celular ? this.form.value.celular.replace(/\D/g, '') : '',
      rg: this.form.value.rg ? this.form.value.rg.replace(/\D/g, '') : ''
    };
  }

  // Extrai a mensagem correta independente do formato retornado pela API
  private extrairMensagemErro(erro: any): string{
    // Se for o Map de validação de campos do @Valid
    if(erro.status === 400 && erro.error && typeof erro.error === 'object' && !erro.error.message && !erro.error.detail){
       return Object.values(erro.error).join('\n');
    }
    // Se for mensgem customizada da API
    return erro.error?.message || erro.error?.detail || (typeof erro.error === 'string' ? erro.error : 'Ocorreu um erro ao salvar pré-cadastro.');
  }

  // Configura escuta reativa do campo CEP para preenchimento automatico ViaCEP
  private configurarBuscaCep(): void{
    const cepControl = this.form.get('cep');

    if(!cepControl) return;

    cepControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(cep => (cep ? cep.replace(/\D/g, '') : '')),
      filter(cepLimpo => cepLimpo.length === 8),
      switchMap(cepLimpo => this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json`))
    ).subscribe({
      next: (dados) => {
        if(!dados.erro){
          this.cepNaoEncontrado.set(false);
          this.preencherEndereco(dados);
        }else{
          this.cepNaoEncontrado.set(true);
          this.limparCamposEndereco();
        }
      },
      error: (err) => {
        this.cepNaoEncontrado.set(true);
        this.limparCamposEndereco();
      }
    })
  }

  // Preenche os campos de endereço com base no retorno da API ViaCEP
  preencherEndereco(dados: any): void{
    this.form.patchValue({
      logradouro: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      cep: dados.cep,
      estado: dados.uf
    });

    setTimeout(() => {
      if(this.inputNumero){
        this.inputNumero.nativeElement.focus();
      }
    }, 100);
  }

  // Limpar campos de endereço
  limparCamposEndereco(){
    this.form.patchValue({
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  }

   cancelar(){
    this.router.navigate(['/login']);
  }

}
