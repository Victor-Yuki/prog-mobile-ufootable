import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageleaguesPage } from './manageleagues.page';

describe('ManageleaguesPage', () => {
  let component: ManageleaguesPage;
  let fixture: ComponentFixture<ManageleaguesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManageleaguesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
