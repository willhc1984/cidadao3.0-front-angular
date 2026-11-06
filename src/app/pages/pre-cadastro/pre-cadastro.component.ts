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
    rg: ['', [Validators.pattern(/^$|^\d{7,10}$/)]],
    cpf: ['', [Validators.pattern(/^\d{11}$/)]],
    cep: [''],
    logradouro: [''],
    bairro: [''],
    cidade: [''],
    estado: [''],
    celular: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
    numero: [''],
    numeroEleitoral: ['']
  });

  // Validar somente no frontend e devolver mensagem genérica para limpar o código
  salvar(): void{
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    
    this.service.salvar(this.form.value).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: () => {
        console.log("Dados form: ", this.form.value);
        this.alert.successModal("Pré-cadastro realizado!", "Aguarde a liberação do gabinete para acessar o sistema.");
        this.form.reset();
      },
      error: (erro) => {
        console.log("Dados form: ", this.form.value);
        const mensagem = this.extrairMensagemErro(erro);
        this.alert.errorModal('Atenção', mensagem);
      }
    });
  }

  // Extrai a mensagens de negócio ou genéricas
  private extrairMensagemErro(erro: any): string{
    return erro.error?.message || erro.error?.detail || 'Ocorreu um erro ao salvar pré-cadastro.';
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
