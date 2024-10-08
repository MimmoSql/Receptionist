import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricaComponent } from './rubrica.component';

describe('RubricaComponent', () => {
  let component: RubricaComponent;
  let fixture: ComponentFixture<RubricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RubricaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RubricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
