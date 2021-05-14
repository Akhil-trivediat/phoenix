import { Component, OnInit, ContentChild, ContentChildren, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { AutocompleteContentDirective } from './autocomplete-content.directive';
import { AutocompleteOptionComponent } from './autocomplete-option/autocomplete-option.component';
import { switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  selector: 'app-autocomplete-input-bar',
  template: `
    <ng-template #root>
      <div class="autocomplete">
        <ng-container *ngTemplateOutlet="content.tpl"></ng-container>
      </div>
    </ng-template>
  `,
  exportAs: 'appAutocomplete',
  styleUrls: ['./autocomplete-input-bar.component.css']
})
export class AutocompleteInputBarComponent implements OnInit {

  @ViewChild('root',{static: false}) rootTemplate: TemplateRef<any>;

  @ContentChild(AutocompleteContentDirective,{static: false})
  content: AutocompleteContentDirective;

  @ContentChildren(AutocompleteOptionComponent) options: QueryList<AutocompleteOptionComponent>;

  optionsClick() {
    return this.options.changes.pipe(
      switchMap(options => {
        const clicks$ = options.map(option => option.click$);
        return merge(...clicks$);
      })
    );
  }

  constructor() { }

  ngOnInit() {
  }

}
