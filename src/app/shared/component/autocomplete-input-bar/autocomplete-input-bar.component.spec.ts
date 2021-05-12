import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteInputBarComponent } from './autocomplete-input-bar.component';

describe('AutocompleteInputBarComponent', () => {
  let component: AutocompleteInputBarComponent;
  let fixture: ComponentFixture<AutocompleteInputBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteInputBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteInputBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
