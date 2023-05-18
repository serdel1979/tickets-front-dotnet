import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

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
    password: ['', [Validators.required, Validators.minLength(6)]]
  });



  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
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

}
