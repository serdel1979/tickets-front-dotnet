import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ValidaFormsService } from 'src/app/validators/valida-forms.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-agrega',
  templateUrl: './agrega.component.html',
  styleUrls: ['./agrega.component.css']
})
export class AgregaComponent {

  public mostrarSpinner: boolean = false;

  miFormulario: FormGroup = this.fb.group({
    user: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, this.validaPassword.passInvalid]]
  });

  public verPass: boolean = false;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private userService: UsersService,
    private validaPassword: ValidaFormsService
  ) { }



  get emailErrorMsg(): string {
    const errors = this.miFormulario.get('email')?.errors;
    if (errors?.['required']) {
      return "El email es obligatorio";
    } else if (errors?.['pattern']) {
      return "No es un formato de mail válido";
    }
    return ("Error en el email");
  }




  guardar() {
    this.mostrarSpinner = true;
    const { user, email, password } = this.miFormulario.value;
    this.userService.guardaUsuario(user, email, password)
      .subscribe((ok) => {
        this.mostrarSpinner = false;

        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Usuario guardado!!!</span>',
          "",
          {
            timeOut: 6000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + "top" + "-" + "center"
          }
        );

        this.resetForm();
      },
        (err) => {
          this.mostrarSpinner = false;
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
        }
      )

  }



  resetForm() {
    this.miFormulario.reset(); // Reinicia el formulario
    this.miFormulario.markAsPristine(); // Marca el formulario como "pristine"
    this.miFormulario.markAsUntouched(); // Marca el formulario como "untouched"
  }



  campoNoValido(campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched
  }

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
