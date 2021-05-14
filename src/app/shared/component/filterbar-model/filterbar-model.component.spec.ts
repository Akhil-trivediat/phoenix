import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterbarModelComponent } from './filterbar-model.component';

describe('FilterbarModelComponent', () => {
  let component: FilterbarModelComponent;
  let fixture: ComponentFixture<FilterbarModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterbarModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterbarModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
