import { AbstractControl, ValidationErrors } from "@angular/forms"

export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {

  let value: string = control.value || '';
  let msg = "";
  if (!value) {
    return null
  }

  let upperCaseCharacters = /[A-Z]+/g;
  let lowerCaseCharacters = /[a-z]+/g;
  let numberCharacters = /[0-9]+/g;
  let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (upperCaseCharacters.test(value) === false || lowerCaseCharacters.test(value) === false || numberCharacters.test(value) === false || specialCharacters.test(value) === false) {
    return {
      passwordStrength: 'Password must contain at least 1 number, lowercase letter, uppercase letter and special character.'
    }

  }

//   let upperCaseCharacters = /[A-Z]+/g
//   if (upperCaseCharacters.test(value) === false) {
//     return { passwordStrength: `Password must contain at least 1 Upper case.` };
//   }

//   let lowerCaseCharacters = /[a-z]+/g
//   if (lowerCaseCharacters.test(value) === false) {
//     return { passwordStrength: `Password must contain at least 1 Lower case.` };
//   }


//   let numberCharacters = /[0-9]+/g
//   if (numberCharacters.test(value) === false) {
//     return { passwordStrength: `Password must contain at least 1 number.` };
//   }

//   let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
//   if (specialCharacters.test(value) === false) {
//     return { passwordStrength: `Password must contain at least 1 Special char.` };
//   }
//    return { 
//     passwordStrength:null  
//   }

}