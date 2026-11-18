import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit{
  
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  // Signal para guardar o nome do usuário logado
  nomeUsuario = signal<string>('');
  // Signal para guardar a string da foto
  fotoUsuario = signal<string>('images/user.jpg');

  //Recebe se está escuro ou não
  isDarkMode = input<boolean>(false);

  //Avisa o AdminLayout que botão foi clicado
  themeToggle = output<void>();

  ngOnInit(): void {
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario(): void {
    this.authService.getDadosCidadao().subscribe({
      next: (dados) => {
        if(dados.nome){
          this.nomeUsuario.set(dados.pronomeDeTratamento + ' ' + dados.nome);
        }

        if(dados.fotoBase64 && dados.fotoContentType){
          const dataUrl = `data:${dados.fotoContentType}; base64, ${dados.fotoBase64}`;
          this.fotoUsuario.set(dataUrl);
          localStorage.setItem('foto_cidadao', dataUrl);
        }else{
          this.fotoUsuario.set('images/user.jpg');
          localStorage.removeItem('foto_cidadao');
        }
      },
      error: () => {
        // Fallback padrão silencioso
      }
    });
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onToggle(){
    this.themeToggle.emit();
  }

}
