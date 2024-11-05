import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiclasePage } from './miclase.page';

describe('MiclasePage', () => {
  let component: MiclasePage;
  let fixture: ComponentFixture<MiclasePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiclasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
