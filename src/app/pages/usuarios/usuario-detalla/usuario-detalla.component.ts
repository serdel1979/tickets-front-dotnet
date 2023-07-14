import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario, UsuarioDetalle } from '../../../interfaces/usuario.interface';
import { UsersService } from '../../../services/users.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario-detalla',
  templateUrl: './usuario-detalla.component.html',
  styleUrls: ['./usuario-detalla.component.css']
})
export class UsuarioDetallaComponent implements OnInit {


  
  @ViewChild("modalResetPassword", { static: false }) modalResetPassword!: TemplateRef<any>;

  miFormulario: FormGroup = this.fb.group({
    user: ['', [Validators.required]],
    password1: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]]
  });


  public idUsuario: string = '';

  public usuario!: UsuarioDetalle;

  public errorNotFound!: string;

  public nuevaPasswd!: string;

  public mostrarResetearPass: boolean = false;
  public verPass: boolean = false;

  public buscando: boolean = false;
  public mostrarSpinner: boolean = false;

  constructor(private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private toastr: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.idUsuario = this.route.snapshot.params['id'];
    this.buscando = true;
    this.usersService.getUser(this.idUsuario).subscribe((usr: UsuarioDetalle) => {
      this.usuario = usr;
      this.buscando = false;
      this.inicializaFormulario(this.usuario.userName);
    },
      (err) => {
        this.errorNotFound = err;
        this.buscando = false;
      })
  }


  resetForm() {
    this.miFormulario.reset();
    this.inicializaFormulario(this.usuario.userName);
  }

  inicializaFormulario(user: string){
    this.miFormulario.patchValue({
      user: user,
    });
  }

  volver() {
    this.router.navigate(['/usuarios']);
  }

  onChange() {
    this.usuario.esAdmin = !this.usuario.esAdmin;
  }

  onChangeHabilit() {
    this.usuario.habilitado = !this.usuario.habilitado;
  }

  guardar() {
    this.mostrarSpinner = true;
    if (this.usuario.esAdmin) {
      this.usersService.hacerAdmin(this.usuario)
        .subscribe(() => {
          this.mostrarSpinner = false;
        }
          ,
          (err) => {
            console.log(err);
            this.mostrarSpinner = false;
          })
    } else {
      this.usersService.borrarAdmin(this.usuario)
        .subscribe(() => {
          this.mostrarSpinner = false;
        },
          (err) => {
            console.log(err);
            this.mostrarSpinner = false;
          })
    }

  }


  restablecerContrasena(){
    this.nuevaPasswd = '';
  }

 

  mostrarModalReset() {
    this.modalService.open(this.modalResetPassword).result.then(async r => {
      if (r) {
        await this.onSubmit();
      } else {
        this.resetForm();
      }
    }, err => {
      this.resetForm();
    })
  }

  async onSubmit() {
    this.mostrarSpinner = true;
    
    this.usersService.resetPassword(this.miFormulario.value).subscribe({
      next: () => {
        this.resetForm();
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Contraseña actualizada!!!</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + "top" + "-" + "center"
          }
        );
       
        this.mostrarSpinner = false;
      },
      error: (error: string) => {
        this.toastr.error(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + error + '</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + "top" + "-" + "center"
          }
        );
        this.mostrarSpinner = false;
      }

    })
  }

  capitalizarPrimeraLetra(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }


  get passErrorMsg():string {
    const errors = this.miFormulario.get('password1')?.errors;
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

  get pass2ErrorMsg():string {
    const errors = this.miFormulario.get('password2')?.errors;
    if(errors?.['required']){
      return "El password es obligatorio";
    }else if(errors?.['invalidLength']){
      return "Longitud mínima debe ser de 6 caracteres";
    }else if(errors?.['noUppercase']){
      return "Debe tener una mayúscula";
    }else if(errors?.['noNumber']){
      return "Debe tener un número"
    }else if(this.miFormulario.get('password2')?.value!=this.miFormulario.get('password1')?.value){
         return "Las contraseñas deben coincidir"
    }
    return("Debe contener un símbolo");
  }

  passwordNoValido(passw: string){
    return this.miFormulario.get(passw)?.invalid && this.miFormulario.get(passw)?.touched
  }

  password2NoValido(passw: string){
    return this.miFormulario.get(passw)?.invalid && this.miFormulario.get(passw)?.touched
  }


}
