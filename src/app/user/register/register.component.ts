import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import CustomAlert from 'src/app/models/alert.model';
import { RegisterValidators } from '../validators/register-validators';

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

  alertObj = new CustomAlert();
  
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password', 'confirm_password')]);

  //called by the NgSubmit event, we show an alert and register the user.

  async register() {
    this.alertObj.setAlertNormal('Please wait, your account is being created', true);

    try {
      await this.auth.createUser(this.registerForm.value as IUser);
    } catch (e) {
      console.error(e);
      this.alertObj.setAlertError('An unexpected error ocurred, please try again later.');
      return
    }

    this.alertObj.setAlertSuccess('Sucess! Your account has been created!');
  }
}
