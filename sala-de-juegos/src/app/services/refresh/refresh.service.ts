import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// refrescar o idratar un componente dentro de un componente (el profe hizo el componente top ten y lo puso en los juegos)

export class RefreshService {

  private refreshSubject = new Subject<string>();

  public refresh$ = this.refreshSubject.asObservable();

  public refreshComponent(componentType: string): void{
    this.refreshSubject.next(componentType);
  }
}
