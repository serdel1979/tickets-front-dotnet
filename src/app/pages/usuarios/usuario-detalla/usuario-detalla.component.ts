import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../../interfaces/usuario.interface';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-usuario-detalla',
  templateUrl: './usuario-detalla.component.html',
  styleUrls: ['./usuario-detalla.component.css']
})
export class UsuarioDetallaComponent implements OnInit{

  public idUsuario: string = '';

  public usuario: any;

  constructor(private router: Router,
    private route: ActivatedRoute, 
    private usersService: UsersService){}

  ngOnInit(): void {
    this.idUsuario = this.route.snapshot.params['id'];

    console.log(this.idUsuario);

    this.usersService.getUser(this.idUsuario).subscribe((usr: any)=>{
       this.usuario = usr;
       console.log(this.usuario);
    })
  }


  volver(){
    this.router.navigate(['/usuarios']);
  }

}
