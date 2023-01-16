import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  constructor (
    public modal: ModalService,
    public auth: AuthService,
    public afAuth: AngularFireAuth
  ) {}

  //catches the event when the link to open the modal is clicked and prevents that event
  //then, it toggles the modal via the service
  openModal ($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal('auth');
  }

  //catches the event on logout and prevents default behavior, then logs out the user

  async logout ($event: Event) {
    $event.preventDefault();
    await this.afAuth.signOut();
  }

}
