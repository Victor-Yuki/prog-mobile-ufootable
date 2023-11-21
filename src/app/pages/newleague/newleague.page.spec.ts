import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewleaguePage } from './newleague.page';

describe('NewleaguePage', () => {
  let component: NewleaguePage;
  let fixture: ComponentFixture<NewleaguePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewleaguePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
