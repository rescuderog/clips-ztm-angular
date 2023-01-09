import { Injectable } from '@angular/core';

//service that manages the modals visibility

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private visible = false;

  constructor() { }

  //method that returns the modal status as a boolean
  isModalOpen(): boolean {
    return this.visible;
  }

  //sets the visible property to its opposite
  toggleModal() {
    this.visible = !this.visible;
  }
}
