import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { SolicitudesService } from '../../../services/solicitudes.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {




  private isLogued: boolean = false;
  private id!: string;
  constructor(private authService: AuthService, private solicitudesServices:SolicitudesService){}

  public misSolicitudes : any[]=[];

  ngOnInit() {
    this.isLogued = this.authService.isLogued();
    if (this.isLogued){
      this.id = this.authService.getIdLogued();
      this.solicitudesServices.getMisSolicitudes(this.id).subscribe(resp=>{
        this.misSolicitudes = resp;
      })
    }
  }

}
