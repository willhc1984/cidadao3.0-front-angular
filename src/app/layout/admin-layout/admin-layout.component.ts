import { Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})

export class AdminLayoutComponent {

   // Signal guarda se o o modo escuro esta on/off
  isDarkMode = signal<boolean>(false);

  constructor(){
    // Effect fica vigiando o isDarkMode e altera o atributo HTML automaticamente
    effect(() => {
      const dark = this.isDarkMode();
      const htmlElement = document.documentElement; //Pega a tag <html> raiz

      if(dark){
        htmlElement.setAttribute('data-bs-theme', 'dark');
      }else{
        htmlElement.setAttribute('data-bs-theme', 'light');
      }
    });
  }
  
  toggleTheme(){
    this.isDarkMode.update(current => !current);
  }

}
