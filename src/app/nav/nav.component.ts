import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  constructor (public modal: ModalService) {

  }

  //catches the event when the link to open the modal is clicked and prevents that event
  //then, it toggles the modal via the service
  openModal ($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal();
  }

}
