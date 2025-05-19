import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopJugadoresComponent } from './top-jugadores.component';

describe('TopJugadoresComponent', () => {
  let component: TopJugadoresComponent;
  let fixture: ComponentFixture<TopJugadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopJugadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopJugadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
