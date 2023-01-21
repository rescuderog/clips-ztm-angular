import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { NotFoundComponent } from './not-found/not-found.component';

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
  },
  //clip component for viewing videos. It is routed at /clip, with additional routing as per the id (route parameter)
  {
    path: 'clip/:id',
    component: ClipComponent
  },
  //wildcard route (user inputs whatever but a valid route), redirects to the NotFound component, which shows a 404 error.
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
