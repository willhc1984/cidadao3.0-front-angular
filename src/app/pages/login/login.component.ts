import { Component, inject, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  private authService = inject(AuthenticationService);
  private router = inject(Router);

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

    // Subscribe despacha para o Java
    this.authService.authenticate(credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        // Sucesso -> redireciona para Home
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if(err.status == 401){
          this.errorMessage.set('Usuário ou senha inválidos.');
        }else if(err.status === 0){
          this.errorMessage.set('Não foi possivel conectar ao servidor.');
        }else{
          this.errorMessage.set('Ocorreu um erro inesperado.');
        }
      }
    });
  }

}
