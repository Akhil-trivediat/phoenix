import { Component, Output, EventEmitter, Renderer2, ElementRef, ChangeDetectionStrategy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { AuthService } from '../../shared/service/auth.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: '[navbar]',
  templateUrl: './navbar.template.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar implements OnInit {
  @Output() changeSidebarPosition = new EventEmitter();
  @Output() changeSidebarDisplay = new EventEmitter();
  @Output() openSidebar = new EventEmitter(); 

  display: string = 'Left'; 
  radioModel: string = 'Left';
  searchFormState: boolean = true;
  settings: any = {
    isOpen: false
  };

  locationhierarchyform:  any;

  modalRef: BsModalRef;

  cities = [
    { id: 1, name: "Corporate" },
    { id: 2, name: "Toronto" },
    { id: 3, name: "Boston" }
  ];
  selectedCityId: string = null;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    public router: Router,
    private authService: AuthService,
    private modalService: BsModalService
  ) {}

  openLocationModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    this.selectedCityId = "Corporate";
    this.prepareLocationHierarchyForm();
  }

  prepareLocationHierarchyForm() {
    this.locationhierarchyform = new FormGroup({
      locationname: new FormControl({value: "Corporate", disabled: true}, [Validators.required])
    });
  }

  sidebarPosition(position): void {
    this.changeSidebarPosition.emit(position);
  }

  sidebarDisplay(position): void {
    this.changeSidebarDisplay.emit(position);
  }

  sidebarOpen(): void {
    this.openSidebar.emit();
  }

  searchFormOpen(): void {
    if (this.searchFormState) {
      this.changeStyleElement('#search-form', 'height', '40px');
      this.changeStyleElement('.notifications ', 'top', '86px');
    } else {
      this.changeStyleElement('#search-form', 'height', '0px');
      this.changeStyleElement('.notifications ', 'top', '46px');
    }
    this.searchFormState = !this.searchFormState;
  }

  private changeStyleElement(selector: string, styleName: string, styleValue: string): void {
    this.renderer.setStyle(this.el.nativeElement
      .querySelector(selector), styleName, styleValue);
  }

  logout() {
    localStorage.removeItem('com.pheonix.token');
    this.authService.logout().then(
      response => {

      }
    ).catch(
      error => {
        
      }
    );
  }

  get loginDetails() {
    return localStorage.getItem('USER_NAME');
    //return AppService.token;
  }

  onResetClick() {
    this.router.navigate(["/changepassword"]);
  }
}
