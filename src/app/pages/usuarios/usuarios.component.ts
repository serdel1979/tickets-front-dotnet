import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit{


  users: any[] = [];
  public page!: number;


  constructor(private usersService: UsersService){}

  ngOnInit(): void {
    this.usersService.getUsers()
    .subscribe((users:any[])=>{
      this.users = users;
      console.log(users);
    })
  }


  onPageChange(event: any) {
    this.page = event;
  }

  verUsuario(){

  }


  habilitarToggle(usr: any) {

    console.log(`${usr.id} `);
    
  }

 

}
