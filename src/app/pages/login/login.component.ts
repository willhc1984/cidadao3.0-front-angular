import { Component, inject, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

    // Subscribe despacha para o Java
    this.authService.authenticate(credentials).subscribe({
      next: (response) => {
        // Login OK! Agora checar se é também um Cidadão na API
        this.http.get<any>('http://localhost:8081/cidadaos').subscribe({
          next: (res) => {

            // Descobre onde está a lista: se 'res' ja é um array ou está dentro de content (paginação)
            const listaCidadaos = Array.isArray(res) ? res : (res?.elements || []);
            this.isLoading.set(false);

            // Procura na lista se existe algum cidadão com usuarioLogin igual ao login digitado
            const cidadaoVinculado = listaCidadaos.find(
              (c: any) => c.usuarioLogin === credentials.login
            );

            if(cidadaoVinculado){
              // Sucesso: o usuário é um cidadao válido
              this.router.navigate(['/home']);
            }else{
              // Bloqueio: usuario não é um cidadão válido
              this.authService.logout(); // limpa token
              this.errorMessage.set('Acesso negado: usuário não é um cidadão válido no sistema.');
            }
          }
        });
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
