import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

//service that manages the modals visibility, refactored with an id system to use with multiple modals

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() { }

  //method that registers a new modal with an id, creating a IModal type of structure and pushing it to the modals array

  register(id: string) {
    this.modals.push({
      id,
      visible: false
    });
  }

  //method that returns the modal status as a boolean
  isModalOpen(id: string): boolean {
    return Boolean(this.modals.find(element => element.id === id)?.visible);
  }

  //sets the visible property to its opposite
  toggleModal(id: string) {
    const modal = this.modals.find(element => element.id === id);
    if (modal) {
      modal.visible = !modal.visible
    }
  }
}
