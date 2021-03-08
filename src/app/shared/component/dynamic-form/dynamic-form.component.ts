import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  @Input() formControls: any = [];
  @Input() title: string;
  @Input() action: string;
  @Input() type: string;
  @Output() cancelBtnClickEvent = new EventEmitter;
  @Output() saveBtnClickEvent = new EventEmitter;
  @Output() deleteBtnClickEvent = new EventEmitter;
  form: FormGroup;
  emitData: any;

  constructor() { }

  ngOnInit() {
    this.form = this.toFormGroup(this.formControls);
  }

  toFormGroup(controls: any ) {
    const group: any = {};
    if(controls) {
      controls.forEach(control => {
        group[control.key] = control.required ? new FormControl({value: control.value || '', disabled: control.disabled}, Validators.required)
          : new FormControl({value: control.value || '', disabled: control.disabled});
      });
    }
    return new FormGroup(group);
  }

  onSubmit() {
    
  }

  onCancel() {
    this.cancelBtnClickEvent.emit();
  }

  onSave(formValue: FormGroup) {
    this.emitData = {
      type: this.type,
      action: this.action,
      data: formValue
    };
    this.saveBtnClickEvent.emit(this.emitData);
  }

  onDelete(formValue: FormGroup) {
    this.emitData = {
      type: this.type,
      action: this.action,
      data: formValue
    };
    this.deleteBtnClickEvent.emit(this.emitData);
  }
}
