import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario, UsuarioDetalle } from '../../../interfaces/usuario.interface';
import { UsersService } from '../../../services/users.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuario-detalla',
  templateUrl: './usuario-detalla.component.html',
  styleUrls: ['./usuario-detalla.component.css']
})
export class UsuarioDetallaComponent implements OnInit {

  public idUsuario: string = '';

  public usuario!: UsuarioDetalle;

  public errorNotFound!: string;

  public nuevaPasswd!: string;

  public mostrarResetearPass: boolean = false;
  public verPass: boolean = false;

  public buscando: boolean = false;
  public mostrarSpinner: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.idUsuario = this.route.snapshot.params['id'];
    this.buscando = true;
    this.usersService.getUser(this.idUsuario).subscribe((usr: UsuarioDetalle) => {
      this.usuario = usr;
      this.buscando = false;
    },
      (err) => {
        this.errorNotFound = err;
        this.buscando = false;
      })
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

  openModal() {
    this.modalService.open('#resetPasswordModal', { ariaLabelledBy: 'resetPasswordModalLabel' });
  }


}
