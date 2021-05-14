import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-filterbar-model',
  templateUrl: './filterbar-model.component.html',
  styleUrls: ['./filterbar-model.component.css']
})
export class FilterbarModelComponent implements OnInit {

  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit() {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onDateTimeChange(event) {
    
  }

}
