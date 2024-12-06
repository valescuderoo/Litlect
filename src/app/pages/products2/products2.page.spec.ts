import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Products2Page } from './products2.page';

describe('Products2Page', () => {
  let component: Products2Page;
  let fixture: ComponentFixture<Products2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Products2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
