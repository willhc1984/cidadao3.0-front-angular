import { Component, inject, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  private authService = inject(AuthenticationService);
  private router = inject(Router);
  private http = inject(HttpClient);

  // Signals para guardar os campos do formulário
  login = signal('');
  senha = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  entrar(){
    this.errorMessage.set('');
    this.isLoading.set(true);

    const credentials = {
      login: this.login(),
      senha: this.senha()
    };

    // Faz autenticação obtendo token, depois valida se é cidadao usando switchMap
    this.authService.authenticate(credentials).pipe(
      switchMap(() => this.authService.verificarVinculoCidadao(credentials.login))
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/home']); // Sucesso total e redirecionamento
      },
      error: (err) => {
        this.isLoading.set(false);
        if(err.status == 401){
          this.errorMessage.set('Usuário ou senha inválidos.');
        }else if(err.status === 0){
          this.errorMessage.set('Não foi possivel conectar ao servidor.');
        }else{ 
          // Exibe msg de erro vinda da validação do cidadão
          this.errorMessage.set(err.message || 'Ocorreu um erro inesperado.');
        }
      }
    });
  }

}
