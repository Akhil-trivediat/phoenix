import {ValidatorFn, Validator, AbstractControl, FormGroup} from '@angular/forms';

export const patternValidator = (control: AbstractControl): {[key: string]: boolean} | null => {
    const regex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, "g");
    if (!regex.test(control.value)) {
        return {invalid: true};
    }
    return null
}

export const confirmPasswordValidator = (control: AbstractControl): {[key: string]: boolean} | null => {
    if (control.get('password').dirty && control.get('confirmPassword').dirty && control.get('password').value !== control.get('confirmPassword').value) {
        return {passwordsDoNotMatch: true};
    }
    return null;
}