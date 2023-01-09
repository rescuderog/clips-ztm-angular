import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { SharedModule } from '../shared/shared.module';

//user module handling the login/register components, navbar and modal

@NgModule({
  declarations: [
    AuthModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AuthModalComponent
  ]
})
export class UserModule { }
