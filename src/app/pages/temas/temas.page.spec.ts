import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemasPage } from './temas.page';

describe('TemasPage', () => {
  let component: TemasPage;
  let fixture: ComponentFixture<TemasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TemasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
