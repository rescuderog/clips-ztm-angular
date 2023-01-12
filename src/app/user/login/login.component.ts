import { Component } from '@angular/core';

//note: the login form was made using Template Forms, so that's why we don't have much on the class
//it's all in the html file

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //object to store the credentials
  credentials = {
    email: '',
    password: ''
  }

  //login function, called from the form, TODO: backend
  login() {
    console.log(this.credentials);
  }
}
