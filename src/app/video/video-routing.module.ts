import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard'

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/')

const routes: Routes = [
  {
    //path for the manage videos component, at /manage and rendering the ManageComponent
    //it has the authOnly data flag, for redirecting the user after logging out
    path: 'manage',
    component: ManageComponent,
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome
    },
    //we add the guard provided by AngularFire to manage requests from logged out users (so we don't display the page)
    canActivate: [AngularFireAuthGuard]
  },
  {
    //path for the upload videos component, at /upload and rendering the UploadComponent
    //it has the authOnly data flag, for redirecting the user after logging out
    path: 'upload',
    component: UploadComponent,
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome
    },
    //we add the guard provided by AngularFire to manage requests from logged out users (so we don't display the page)
    canActivate: [AngularFireAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
