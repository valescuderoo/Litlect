import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReflectionDetailsPagePageRoutingModule } from './reflection-details-page-routing.module'; 

describe('ReflectionDetailsPagePage', () => {
  let component: ReflectionDetailsPagePageRoutingModule;
  let fixture: ComponentFixture<ReflectionDetailsPagePageRoutingModule>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReflectionDetailsPagePageRoutingModule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
