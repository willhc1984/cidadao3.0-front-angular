import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-cadastro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pre-cadastro.component.html',
  styleUrl: './pre-cadastro.component.scss'
})

export class PreCadastroComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Signals para controle da tela
  isLoading = signal(false);
  mensagemErro = signal<string | null>(null);
  mensagemSucesso = signal<string | null>(null);

  // Definição do formulário reativo
  form: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    dataDeNascimento: [''],
    email: ['', [Validators.email]],
    sexo: [''],
    rg: [''],
    cpf: [''],
    logradouro: [''],
    bairro: [''],
    cidade: [''],
    celular: [''],
    cep: [''],
    numeroEleitoral: ['']
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
      console.log('Dados enviados: ', dadosFormulario);
    });
  }

  cancelar(){
    this.router.navigate(['/login']);
  }

}
