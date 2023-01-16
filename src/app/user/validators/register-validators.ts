import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms";

export class RegisterValidators {
    //Factory function that accepts a string with the control names 
    static match(controlName: string, matchingControName: string): ValidatorFn {
        //accepts FormGroup or FormControl via the AbstractControl class which is inherited by both
        return (group: AbstractControl) : ValidationErrors | null => {
            const control = group.get(controlName);
            const matchingControl = group.get(matchingControName);
        
            if(!control || !matchingControl) {
                return { controlNotFound: false }
            }

            const error = control.value === matchingControl.value ? 
                null :
                { noMatch: true }
            return error
        }
    }
}
