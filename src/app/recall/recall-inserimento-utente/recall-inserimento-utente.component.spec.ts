import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallInserimentoUtenteComponent } from './recall-inserimento-utente.component';

describe('RecallInserimentoUtenteComponent', () => {
  let component: RecallInserimentoUtenteComponent;
  let fixture: ComponentFixture<RecallInserimentoUtenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecallInserimentoUtenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecallInserimentoUtenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
