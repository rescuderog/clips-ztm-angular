import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

//this component complements the modal component of the shared module and handles the form for the auth

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit {

  constructor(public modal: ModalService) { }

  ngOnInit(): void {
    this.modal.register('auth');
  }
}
