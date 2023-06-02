import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { ValidaFormsService } from '../../validators/valida-forms.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {


  public mostrarSpinner: boolean = false;
  
  miFormulario: FormGroup = this.fb.group({
    user: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, this.validaPassword.passInvalid]]
  });



  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private validaPassword: ValidaFormsService
    ){}


    solicitaUsuario(){
      this.mostrarSpinner = true;
      const {user, email, password} = this.miFormulario.value;
 
      this.authService.solicitaUsuario(user,email,password)
      .subscribe((ok)=>{
        this.mostrarSpinner = false;

        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Solicitud enviada, ahora soporte técnico debe habilitar el usuario!!!</span>',
          "",
          {
            timeOut: 6000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + "top" + "-" + "center"
          }
        );

      },
      (err)=>{
        this.mostrarSpinner = false;
        this.toastr.error(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+err.error+'</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + "top" + "-" + "center"
          }
        );
      }
      )
    }


    get emailErrorMsg():string {
      const errors = this.miFormulario.get('email')?.errors;
      if(errors?.['required']){
        return "El email es obligatorio";
      }else if(errors?.['pattern']){
        return "No es un formato de mail válido";
      }
      return("Error en el email");
    }


    campoNoValido(campo:string){
      return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched
    }

    get passErrorMsg():string {
      const errors = this.miFormulario.get('password')?.errors;
      if(errors?.['required']){
        return "El password es obligatorio";
      }else if(errors?.['invalidLength']){
        return "Longitud mínima debe ser de 6 caracteres";
      }else if(errors?.['noUppercase']){
        return "Debe tener una mayúscula";
      }else if(errors?.['noNumber']){
        return "Debe tener un número"
      }
      return("Debe contener un símbolo");
    }

    passwordNoValido(passw: string){
      return this.miFormulario.get(passw)?.invalid && this.miFormulario.get(passw)?.touched
    }

   

}
