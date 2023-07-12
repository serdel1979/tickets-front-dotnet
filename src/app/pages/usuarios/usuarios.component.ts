import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit{


  users: any[] = [];
  public page!: number;

  public spinnerMostrar: boolean = false;

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

    console.log(`${usr.id} `);
    this.usersService.habilitaToggle(usr.id,usr).subscribe(()=>{
      this.toastr.success(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Usuario editado!!!</span>',
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
  

}
