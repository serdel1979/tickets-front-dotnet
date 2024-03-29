import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { ValidaFormsService } from '../../validators/valida-forms.service';
import { environment } from 'src/environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {


  private recaptchaSiteKey = environment.recaptcha.siteKey;
  public mostrarSpinner: boolean = false;

  miFormulario: FormGroup = this.fb.group({
    user: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), this.validaPassword.passInvalid]]
  });


  public verPass: boolean = false;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private validaPassword: ValidaFormsService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) { }


  async solicitaUsuario() {

    try {
      this.mostrarSpinner = true;


      const recaptchaToken = await this.recaptchaV3Service.execute(this.recaptchaSiteKey).toPromise();


      const { user, email, password } = this.miFormulario.value;

      const solicitaIngreso = { user, email, password, recaptchaToken }

      this.authService.solicitaUsuario(solicitaIngreso)
        .subscribe((ok) => {
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
          (err) => {
            this.mostrarSpinner = false;
            if (err.status == 400) {
              this.toastr.error(
                '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + err.error + '</span>',
                "",
                {
                  timeOut: 4000,
                  closeButton: true,
                  enableHtml: true,
                  toastClass: "alert alert-danger alert-with-icon",
                  positionClass: "toast-" + "top" + "-" + "center"
                }
              );
            } else {
              this.toastr.error(
                '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Error desconocido!!!</span>',
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

          }
        )



    } catch (error) {
      this.mostrarSpinner = false;
      this.toastr.error(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Error en reCAPTCHA!!!</span>',
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
  }


  get emailErrorMsg(): string {
    const errors = this.miFormulario.get('email')?.errors;
    if (errors?.['required']) {
      return "El email es obligatorio";
    } else if (errors?.['pattern']) {
      return "No es un formato de mail válido";
    }
    return ("Error en el email");
  }


  campoNoValido(campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched
  }

  // get passErrorMsg():string {
  //   const errors = this.miFormulario.get('password')?.errors;
  //   if(errors?.['required']){
  //     return "El password es obligatorio";
  //   }else if(errors?.['invalidLength']){
  //     return "Longitud mínima debe ser de 8 caracteres";
  //   }else if(errors?.['noUppercase']){
  //     return "Debe tener una mayúscula";
  //   }else if(errors?.['noNumber']){
  //     return "Debe tener un número"
  //   }
  //   return("Debe contener un símbolo");
  // }

  get passErrorMsg(): string {
    const errors = this.miFormulario.get('password')?.errors;
    if (errors?.['required']) {
      return "El password es obligatorio";
    }
    return ("Longitud mínima debe ser de 8 caracteres");
  }


  passwordNoValido(passw: string) {
    return this.miFormulario.get(passw)?.invalid && this.miFormulario.get(passw)?.touched
  }



}
