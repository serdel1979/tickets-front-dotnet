import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {



  private recaptchaSiteKey = environment.recaptcha.siteKey;

  public mostrarSpinner: boolean = false;

  miFormulario: FormGroup = this.fb.group({
    user: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });


  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) { }





  async login() {
    
    try {
      // Obtener el token de reCAPTCHA v3.
      this.mostrarSpinner = true;
      const recaptchaToken = await this.recaptchaV3Service.execute(this.recaptchaSiteKey).toPromise();



      const { user, password } = this.miFormulario.value;

      const loginData = { usuario: user, password, recaptchaToken}; // Incluye el token en el objeto de inicio de sesión.

      this.authService.login(loginData)
        .subscribe(async (resp) => {
          this.mostrarSpinner = false;
          let token = JSON.stringify(resp.token);
          token = token.slice(1);
          token = token.slice(0, -1);
          localStorage.setItem('token', token);
          localStorage.setItem('usrlog', JSON.stringify(resp));

          this.authService.loginOk();

          // if (this.authService.isAdmin()) {
          //     this.authService.getAllUsers().subscribe((users)=>{
          //       for(let usr of users){
          //         this.chatrService.joinGroup(usr.userName).then()
          //       }
          //     })
          // } else {
          //   const groupName = this.authService.getUserLogued();

          //   this.chatrService.joinGroup(groupName).then()
          // }


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




}
