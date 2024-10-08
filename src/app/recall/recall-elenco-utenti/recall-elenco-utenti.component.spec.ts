import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallElencoUtentiComponent } from './recall-elenco-utenti.component';

describe('RecallElencoUtentiComponent', () => {
  let component: RecallElencoUtentiComponent;
  let fixture: ComponentFixture<RecallElencoUtentiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecallElencoUtentiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecallElencoUtentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
