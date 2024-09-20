import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiClasePage } from './mi-clase.page';

describe('MiClasePage', () => {
  let component: MiClasePage;
  let fixture: ComponentFixture<MiClasePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiClasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
