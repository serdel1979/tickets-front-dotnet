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
      const formValues = this.miFormulario.value;
      let isDifferent = false;
    
      // Verificar cada campo del formulario con el objeto equipo
      if (formValues.nombre !== this.equipo.nombre) {
        isDifferent = true;
      }
      if (formValues.usuarioId !== this.equipo.usuarioId) {
        isDifferent = true;
      }
      if (formValues.inventario !== this.equipo.inventario) {
        isDifferent = true;
      }
      if (formValues.serie !== this.equipo.serie) {
        isDifferent = true;
      }
      if (formValues.comentario !== this.equipo.comentario) {
        isDifferent = true;
      }
    
      // Realizar alguna acción si los valores son diferentes
      if (isDifferent) {
          this.equiposService.actualizaEquipo(this.idEquipo,this.miFormulario.value)
          .subscribe(()=>{
            this.toastr.success(
              '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Actualización correcta!!!</span>',
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
          (err)=>{

            if(err.status == 400){
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
            }else{
              this.toastr.error(
                '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Error desconocido</span>',
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
            
          })
      } else {
        this.toastr.error(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">No se realizaron cambios!!!</span>',
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
    

  campoNoValido(campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched
  }

}
