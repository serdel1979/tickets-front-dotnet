import { Component, HostListener, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UsuarioDetalle } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit{


  users: UsuarioDetalle[] = [];
  public page!: number;

  public spinnerMostrar: boolean = false;

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event:any) {
    // Aquí se puede agregar el código para manejar el evento
    console.log('La página se está recargando o cerrando');
    this.router.navigate([`solicitudes`]);
    
  }

  constructor(private usersService: UsersService, private toastr: ToastrService, private router: Router){}

  ngOnInit(): void {
    this.spinnerMostrar = true;
    this.usersService.getUsers()
    .subscribe((users:any[])=>{
      this.users = users;
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

}
