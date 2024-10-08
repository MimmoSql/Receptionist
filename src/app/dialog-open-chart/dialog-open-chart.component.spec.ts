import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOpenChartComponent } from './dialog-open-chart.component';

describe('DialogOpenChartComponent', () => {
  let component: DialogOpenChartComponent;
  let fixture: ComponentFixture<DialogOpenChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogOpenChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogOpenChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
