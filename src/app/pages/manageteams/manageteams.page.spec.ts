import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageteamsPage } from './manageteams.page';

describe('ManageteamsPage', () => {
  let component: ManageteamsPage;
  let fixture: ComponentFixture<ManageteamsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManageteamsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
