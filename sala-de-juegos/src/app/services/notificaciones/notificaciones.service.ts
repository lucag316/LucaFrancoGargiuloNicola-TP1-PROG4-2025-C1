import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class NotificacionesService {

  constructor(private snackBar: MatSnackBar) { }
  /**
   * Muestra una notificación tipo snackbar en pantalla.
   * @param mensaje Texto del mensaje a mostrar.
   * @param esError Si es true, se aplica estilo de error. Si es false, de éxito.
   */
  showMessage(mensaje: string, esError: boolean = false): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [esError ? 'snackbar-error' : 'snackbar-success']
    });
  }
}
