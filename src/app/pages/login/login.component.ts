import { Component, inject, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { SweetAlertService } from '../../services/sweet-alert.service';

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
  private alert = inject(SweetAlertService);

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
      switchMap((res: any) => {
        // Salva o token para que a proxima requisição ja saia com o token atrelado
        localStorage.setItem('jwt_token', res.token);
        // Consulta o endpoint de verificação de role
        return this.http.get<any>('http://localhost:8081/usuarios/hasrole/ROLE_CIDADAO');
      })
    ).subscribe({
      next: (roleResponse: any) => {
        const possuiRole = roleResponse?.result === true;

        if(possuiRole){
          // Somente navega para dentro quem tiver a role confirmada
          this.router.navigate(['/meus-atendimentos']);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('possui_role');
        this.alert.errorModal('Erro', 'Falha na autenticação ou verificação de permissões.');
        this.isLoading.set(false);
      }
    });
  }
}
