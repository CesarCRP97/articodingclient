import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaseDetailComponent } from './clase-detail.component';

describe('ClaseDetailComponent', () => {
  let component: ClaseDetailComponent;
  let fixture: ComponentFixture<ClaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaseDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
