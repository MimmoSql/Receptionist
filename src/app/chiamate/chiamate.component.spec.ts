import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiamateComponent } from './chiamate.component';

describe('ChiamateComponent', () => {
  let component: ChiamateComponent;
  let fixture: ComponentFixture<ChiamateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChiamateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChiamateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
