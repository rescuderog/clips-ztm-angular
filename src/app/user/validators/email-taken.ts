import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class EmailTaken implements AsyncValidator {
    //async validator to check if the email exists in the firebase db
    constructor(private auth: AngularFireAuth) { }

    //we use firebase's api to check if there is a sign in method for the email.
    //if there is a method, that means the email is already registered, so we return an error
    validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
        return this.auth.fetchSignInMethodsForEmail(control.value).then(
            (response) => response.length ? { emailTaken: true } : null
        )
    }

}
