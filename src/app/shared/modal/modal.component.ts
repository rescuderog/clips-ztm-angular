import { Component, Input } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

//separation of responsibilities of the modal components: this component, pertaining to the shared module
//renders the modal and takes care of closing and opening it. The content of it is handled by
//other components via content projection

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  // this property acts as the input of the value we pass down by the more specific modal as ID
  @Input() modalID = '';
  
  constructor (public modal: ModalService) {

  }

  //closes the modal, doesn't need event handling as we're working with div elements only
  closeModal() {
    this.modal.toggleModal(this.modalID);
  }

}
