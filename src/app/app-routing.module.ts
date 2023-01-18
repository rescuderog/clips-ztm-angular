import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

//this is a routing module for the app where we config all the paths and corresponding components that
//angular should render

const routes: Routes = [
  //home component routing at /. Contains intro and list of videos
  {
    path: '',
    component: HomeComponent
  },
  //about component routing at /about. Contains a small about us page.
  {
    path: 'about',
    component: AboutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
