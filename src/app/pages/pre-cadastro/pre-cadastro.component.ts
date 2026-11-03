import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { debounce, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { HttpBackend, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pre-cadastro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pre-cadastro.component.html',
  styleUrl: './pre-cadastro.component.scss'
})

export class PreCadastroComponent implements OnInit{

  ngOnInit(): void {
    this.configurarBuscaCep();
  }

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private alert = inject(SweetAlertService);
  private http = inject(HttpClient);

  // Signals para controle da tela
  isLoading = signal(false);
  mensagemErro = signal<string | null>(null);
  mensagemSucesso = signal<string | null>(null);

  // Definição do formulário reativo
  form: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    dataDeNascimento: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    sexo: ['', [Validators.required], [Validators.required]],
    rg: ['', [Validators.required]],
    cpf: ['', [Validators.required]],
    cep: ['', [Validators.required]],
    logradouro: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    cidade: ['', [Validators.required]],
    estado: ['', [Validators.required]],
    celular: ['', [Validators.required]],
    numeroEleitoral: ['', [Validators.required]]
  });

  salvar(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.mensagemErro.set(null);
    this.mensagemSucesso.set(null);

    const dadosFormulario = this.form.value;

    //Service
    setTimeout(() => {
      this.isLoading.set(false);
      this.mensagemSucesso.set('Pré-cadastro realizado com sucesso.');
      this.alert.successModal('Pré-cadastro realizado com sucesso', 'Aguarde confirmação do gabinete.');
      console.log('Dados enviados: ', dadosFormulario);
    });
  }

  cancelar(){
    this.router.navigate(['/login']);
  }

  // Configura escuta reativa do campo CEP para preenchimenot automatico ViaCEP
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
          console.log(dados);
          this.preencherEndereco(dados);
        }else{
          console.warn('CEP não encontrado.')
        }
      },
      error: (err) => {
        console.error('Erro ao consultar CEP: ', err);
      }
    })
  }

  // Preenche os campos de endereço com base no retorno da API ViaCEP
  preencherEndereco(dados: any): void{
    this.form.patchValue({
      logradouro: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      cep: dados.cep
    });
  }

}
