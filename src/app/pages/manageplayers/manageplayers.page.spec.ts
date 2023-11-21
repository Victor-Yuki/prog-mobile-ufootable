import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageplayersPage } from './manageplayers.page';

describe('ManageplayersPage', () => {
  let component: ManageplayersPage;
  let fixture: ComponentFixture<ManageplayersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManageplayersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
