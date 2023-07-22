import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsuarioDetalle } from 'src/app/interfaces/usuario.interface';
import { UsersService } from '../../../../services/users.service';
import { EquiposService } from '../../../../services/equipos.service';

@Component({
  selector: 'app-nuevo-equipo',
  templateUrl: './nuevo-equipo.component.html',
  styleUrls: ['./nuevo-equipo.component.css']
})
export class NuevoEquipoComponent implements OnInit {

  public mostrarSpinner: boolean = false;

  public usuarios: UsuarioDetalle[] = []

  miFormulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    usuarioId: ['', [Validators.required, Validators.maxLength(450)]],
    inventario: ['', [Validators.required, Validators.maxLength(100)]],
    serie: ['', [Validators.required, Validators.maxLength(100)]],
    comentario: ['', [Validators.required, Validators.maxLength(250)]]
  });


  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private userService: UsersService,
    private equiposService: EquiposService
  ) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((resp) => {
      this.usuarios = resp;
    })
  }

  guardar() {
    this.mostrarSpinner = true;
    this.equiposService.guardaEquipo(this.miFormulario.value)
      .subscribe((resp) => {
        this.mostrarSpinner = false;
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Guardado!!!</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + "top" + "-" + "center"
          }
        );
      },
        (err) => {
          this.mostrarSpinner = false;
          console.log(err);
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
        })
  }


  campoNoValido(campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched
  }







}
