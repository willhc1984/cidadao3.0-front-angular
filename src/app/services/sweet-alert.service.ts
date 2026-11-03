import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class SweetAlertService {

  constructor() { }

  sucess(mensagem: string): void{
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: mensagem,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true
    });
  }

  error(mensagem: string): void{
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: mensagem,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true
    });
  }

  notice(mensagem: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: mensagem,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true
    });
  }

  errorModal(titulo: string, mensagem: string): void{
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensagem,
      confirmButtonText: 'OK',
      confirmButtonColor: '#2563EB'
    });
  }

  successModal(titulo: string, mensagem: string): void{
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensagem,
      confirmButtonText: 'OK',
      confirmButtonColor: '#2563EB'
    });
  }

  confirm(titulo: string, texto: string): Promise<boolean>{
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then(resultado => resultado.isConfirmed);
  }

}
