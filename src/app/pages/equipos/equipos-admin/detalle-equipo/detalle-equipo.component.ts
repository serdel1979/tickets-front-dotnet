import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Equipo } from 'src/app/interfaces/equipos.paginado';
import { UsuarioDetalle } from 'src/app/interfaces/usuario.interface';
import { EquiposService } from 'src/app/services/equipos.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-detalle-equipo',
  templateUrl: './detalle-equipo.component.html',
  styleUrls: ['./detalle-equipo.component.css']
})
export class DetalleEquipoComponent implements OnInit {


  public mostrarSpinner: boolean = false;

  public usuarios: UsuarioDetalle[] = []

  private idEquipo!: number;

  public equipo!: Equipo;

  miFormulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    usuarioId: ['', [Validators.required, Validators.maxLength(450)]],
    inventario: ['', [Validators.required, Validators.maxLength(100)]],
    serie: ['', [Validators.required, Validators.maxLength(100)]],
    comentario: ['', [Validators.required, Validators.maxLength(250)]]
  });

  ngOnInit(): void {
    this.idEquipo = this.route.snapshot.params['id'];
    this.traeUsuarios();
    this.traeEquipo();
  }

  traeUsuarios(){
    this.userService.getUsers().subscribe((resp) => {
      this.usuarios = resp;
    })
  }

  traeEquipo() {
    this.mostrarSpinner = false;
    this.equiposService.getEquipo(this.idEquipo)
      .subscribe((eq) => {
        this.equipo = eq;
        this.miFormulario.patchValue({
          nombre: this.equipo.nombre,
          usuarioId: this.equipo.usuarioId,
          inventario: this.equipo.inventario,
          serie: this.equipo.serie,
          comentario: this.equipo.comentario
        });
        this.mostrarSpinner = false;
      },
        () => {
          this.mostrarSpinner = false;
        })
  }

  constructor(private toastr: ToastrService,
    private fb: FormBuilder,
    private userService: UsersService,
    private route: ActivatedRoute,
    private equiposService: EquiposService) { }

  actualizar() {
    console.log(this.miFormulario.value);
  }

  campoNoValido(campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched
  }

}
