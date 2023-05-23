import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  
  public mostrarSpinner: boolean = false;

  miFormulario: FormGroup = this.fb.group({
    user: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
    ){}


    login(){
      this.mostrarSpinner = true;
      const {user, password} = this.miFormulario.value;
 
      this.authService.login(user,password)
      .subscribe((resp)=>{
          this.mostrarSpinner = false;
          let token = JSON.stringify(resp.token);
          token = token.slice(1);
          token = token.slice(0, -1);
          localStorage.setItem('token',token);
          localStorage.setItem('usrlog',JSON.stringify(resp));

          this.authService.loginOk();
          this.toastr.success(
            '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Acceso correcto!!!</span>',
            "",
            {
              timeOut: 4000,
              closeButton: true,
              enableHtml: true,
              toastClass: "alert alert-success alert-with-icon",
              positionClass: "toast-" + "top" + "-" + "center"
            }
          );
          this.router.navigateByUrl('/solicitudes');
      },
      (err)=>{
        console.log(err);
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
