import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export const MismatchValidator = function (control: AbstractControl): ValidationErrors | null {

    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('confirmPassword').value;

    if (password !== confirmPassword) {
        return {
            passwordMisMatch: 'Password mismatch.'
        }
    }
    return null;
}

// export class MismatchValidator {

//     static passwordMatchValidator(control: AbstractControl): {[key: string]: any} {
//         const password: string = control.get('password').value; // get password from our password form control
//         const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
//         // compare is the password math
//         if (password !== confirmPassword) {
//           // if they don't match, set an error in our confirmPassword form control
//           return { mismatchedPasswords: true };
//         }
//         return null;
//     }
// }