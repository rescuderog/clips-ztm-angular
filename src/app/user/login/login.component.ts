import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import CustomAlert from 'src/app/models/alert.model';

//note: the login form was made using Template Forms, so that's why we don't have much on the class
//it's all in the html file

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //we inject the AngularFireAuth service to authenticate the user
  constructor(private auth: AngularFireAuth) {}

  //object to store the credentials
  credentials = {
    email: '',
    password: ''
  }

  alertObj = new CustomAlert();

  //login function, called from the form, we try to log the user in
  async login() {
    this.alertObj.setAlertNormal('Please wait, logging you in.', true);
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, 
        this.credentials.password
      );
    } catch(e) {
      this.alertObj.setAlertError('Cannot log you in. Please check your email and/or password.');
      return
    }
    this.alertObj.setAlertSuccess('Logged in successfully. Returning to the previous page.')
  }
}
