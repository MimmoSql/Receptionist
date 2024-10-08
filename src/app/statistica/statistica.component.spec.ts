import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticaComponent } from './statistica.component';

describe('StatisticaComponent', () => {
  let component: StatisticaComponent;
  let fixture: ComponentFixture<StatisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
