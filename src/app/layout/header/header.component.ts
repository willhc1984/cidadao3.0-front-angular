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

  carregarDadosUsuario() {
    // Resgata nome salvo no localStorage
    const nome = localStorage.getItem('usuario_nome') || 'Cidadão';
    const fotoSalva = localStorage.getItem('foto_cidadao');
    this.nomeUsuario.set(nome);

    if(fotoSalva && fotoSalva !== '[object Object]'){
      const fotoFormatada = fotoSalva.startsWith('data:image')
      ? fotoSalva 
      : `data:image/jpeg;base64,${fotoSalva}`;
    
      this.fotoUsuario.set(fotoFormatada);
    }
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onToggle(){
    this.themeToggle.emit();
  }

}
