import { Component, effect, inject, input, output, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  //Recebe se está escuro ou não
  isDarkMode = input<boolean>(false);

  //Avisa o AdminLayout que botão foi clicado
  themeToggle = output<void>();

  private authService = inject(AuthenticationService);
  private router = inject(Router);

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onToggle(){
    this.themeToggle.emit();
  }

}
