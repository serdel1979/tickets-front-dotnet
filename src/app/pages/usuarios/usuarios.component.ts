import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UsuarioDetalle } from 'src/app/interfaces/usuario.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit{


  
  @ViewChild("myModalInfo", { static: false }) myModalInfo!: TemplateRef<any>;



  users: UsuarioDetalle[] = [];
  usuariosFiltrados: UsuarioDetalle[] = [];

  filtroUsuario: string = ''; // Variable para almacenar el valor del filtro


  public page!: number;

  public spinnerMostrar: boolean = false;

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event:any) {
    this.router.navigate([`solicitudes`]);
  }

  constructor(private usersService: UsersService, 
    private toastr: ToastrService, 
    private router: Router,
    private modalService: NgbModal){}

  ngOnInit(): void {
    this.inicializa();
  }

  inicializa(){
    this.spinnerMostrar = true;
    this.usersService.getUsers()
    .subscribe((users:any[])=>{
      this.users = users;
      this.usuariosFiltrados = users;
      this.spinnerMostrar = false;
    },
    ()=>{
      this.spinnerMostrar = false;
    })
  }

  onPageChange(event: any) {
    this.page = event;
  }

  

  habilitarToggle(usr: any) {

    this.usersService.habilitaToggle(usr.id,usr).subscribe(()=>{
      this.toastr.success(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Actualizado!!!</span>',
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
    })
    
  }

 
  verUsuario(id: string){
  
    this.router.navigate([`usuarios/detalle/${id}`]);
    
  }
  
  agregar(){
    this.router.navigate(['usuarios/agrega']);
  }

  aplicarFiltro() {
    if (this.filtroUsuario.trim() === '') {
      // Si el filtro está vacío, mostrar todos los usuarios
      this.usuariosFiltrados = this.users;
    } else {
      // Filtrar usuarios por el valor del input
      this.usuariosFiltrados = this.users.filter((user: UsuarioDetalle) => {
        return user.userName.toLowerCase().includes(this.filtroUsuario.toLowerCase());
      });
    }
  }


 



  
  mostrarModalInfo(id: string): void {
    this.modalService.open(this.myModalInfo).result.then(
        async (userConfirmed) => {
            if (userConfirmed) {
                await this.deleteUser(id);
            }
        },
        () => {}
    );
}

async deleteUser(id: string): Promise<void> {
    this.usersService.borraUsuario(id)
    .subscribe(
      ()=>{
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Usuario eliminado!!!</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + "top" + "-" + "center"
          }
        );
        this.inicializa();
      },
      (err)=>{
        if (err.status == 404) {
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
}

}
