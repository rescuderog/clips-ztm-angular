import { Component } from '@angular/core';

//separation of responsibilities of the modal components: this component, pertaining to the shared module
//renders the modal and takes care of closing and opening it. The content of it is handled by
//other components via content projection

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

}
