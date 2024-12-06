import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReflexionesPage } from './reflexiones.page';

describe('ReflexionesPage', () => {
  let component: ReflexionesPage;
  let fixture: ComponentFixture<ReflexionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReflexionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
