import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminReflexionesPage } from './admin-reflexiones.page';

describe('AdminReflexionesPage', () => {
  let component: AdminReflexionesPage;
  let fixture: ComponentFixture<AdminReflexionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReflexionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
