import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  //we inject the AngularFireAuth service for firebase authentication
  constructor(
    private auth: AuthService
  ) {}

  inSubmission = false;

  //we register the form via the FormGroup object as FormControl objects with their corresponding Validators
  name = new FormControl<string>('', [
    Validators.required, 
    Validators.minLength(3)
  ]);
  email = new FormControl<string>('', [
    Validators.required,
    Validators.email
  ]);
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ]);
  password = new FormControl<string>('', [
    Validators.required,
    //at least 8 characters, with at least 1 upper, 1 lower and a number
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ]);
  confirm_password = new FormControl<string>('', [
    Validators.required
  ]);
  phoneNumber = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(11),
    Validators.maxLength(11)
  ]);

  showAlert: boolean = false;
  alertMsg: string = '';
  alertColor: string = 'blue';

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
  });

  //called by the NgSubmit event, we show an alert. TODO: implementing backend

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait, your account is being created';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.createUser(this.registerForm.value as IUser);
    } catch (e) {
      console.error(e);
      this.alertMsg = 'An unexpected error ocurred, please try again later.';
      this.alertColor = 'red';
      this.inSubmission = false;
      return
    }

    this.alertMsg = 'Sucess! Your account has been created!';
    this.alertColor = 'green';
    this.inSubmission = false;
  }
}
