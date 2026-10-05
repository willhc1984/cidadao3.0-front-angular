import { Component, effect, input, output, signal } from '@angular/core';

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

  onToggle(){
    this.themeToggle.emit();
  }

}
