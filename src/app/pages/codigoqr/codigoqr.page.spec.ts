import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodigoqrPage } from './codigoqr.page';

describe('CodigoqrPage', () => {
  let component: CodigoqrPage;
  let fixture: ComponentFixture<CodigoqrPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CodigoqrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
