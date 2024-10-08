import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallStatisticaComponent } from './recall-statistica.component';

describe('RecallStatisticaComponent', () => {
  let component: RecallStatisticaComponent;
  let fixture: ComponentFixture<RecallStatisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecallStatisticaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecallStatisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
