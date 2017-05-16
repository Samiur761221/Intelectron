import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDetailsFormComponent } from './basic-details-form.component';

describe('BasicDetailsFormComponent', () => {
  let component: BasicDetailsFormComponent;
  let fixture: ComponentFixture<BasicDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
