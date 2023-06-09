import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChatService } from 'src/app/services/chat.service';
import { ChatredisService } from 'src/app/services/chatredis.service';

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
    private authService: AuthService,
    private chatrService: ChatredisService
  ) { }


  login() {
    this.mostrarSpinner = true;
    const { user, password } = this.miFormulario.value;

    this.authService.login(user, password)
      .subscribe(async (resp) => {
        this.mostrarSpinner = false;
        let token = JSON.stringify(resp.token);
        token = token.slice(1);
        token = token.slice(0, -1);
        localStorage.setItem('token', token);
        localStorage.setItem('usrlog', JSON.stringify(resp));

        this.authService.loginOk();
        
        if (this.authService.isAdmin()) {
            this.authService.getAllUsers().subscribe((users)=>{
              for(let usr of users){
                this.chatrService.joinGroup(usr.userName).then()
              }
            })
        } else {
          const groupName = this.authService.getUserLogued();
         
          this.chatrService.joinGroup(groupName).then()
        }


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
          this.toastr.error(
            '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + err.name + '</span>',
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
