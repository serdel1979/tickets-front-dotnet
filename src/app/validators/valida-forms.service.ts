import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidaFormsService {

  constructor() { }

  passInvalid(control: AbstractControl): ValidationErrors | null{
    const password = control.value?.trim();
    // Validar longitud
    if (password && password.length < 8) {
      return { invalidLength: true };
    }

    // // Validar al menos una mayúscula
    // if (!/[A-Z]/.test(password)) {
    //   return { noUppercase: true };
    // }

    // // Validar al menos un número
    // if (!/\d/.test(password)) {
    //   return { noNumber: true };
    // }

    // // Validar al menos un símbolo
    // if (!/[!@#$%^&-.*]/.test(password)) {
    //   return { noSymbol: true };
    // }

    // El password cumple con todos los requisitos
    return null;
    
  }

  textInvalid(control: AbstractControl): ValidationErrors | null{
    const text = control.value?.trim().replace(/\s+/g, '');
    if (text && text.length > 256) {
      return { invalidLength: true };
    }else if (text && text.value && control.value() === '') {
      return { notOnlyWhitespace: true };
    }else if(text === ''){
      return { required: true };
    }
    return null;
  }


}
