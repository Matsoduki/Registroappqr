import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MirutaPage } from './miruta.page';

describe('MirutaPage', () => {
  let component: MirutaPage;
  let fixture: ComponentFixture<MirutaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MirutaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
