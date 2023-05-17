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

  


  miFormulario: FormGroup = this.fb.group({
    user: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
    ){}


    login(){
      const {user, password} = this.miFormulario.value;
 
      this.authService.login(user,password)
      .subscribe((ok)=>{
         if(ok===true){
            this.router.navigateByUrl('/solicitudes');
         }else{
            console.log('error');
         }
      })
    }

 


}
