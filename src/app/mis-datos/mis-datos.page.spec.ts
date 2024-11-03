import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisDatosPage } from './mis-datos.page';

describe('MisDatosPage', () => {
  let component: MisDatosPage;
  let fixture: ComponentFixture<MisDatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
