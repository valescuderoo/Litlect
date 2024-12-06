import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurposePage } from './purpose.page';

describe('PurposePage', () => {
  let component: PurposePage;
  let fixture: ComponentFixture<PurposePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PurposePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
