import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit  {


  public isAdmin: boolean = false;

  constructor(private authService: AuthService){}
  
  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
  }



  
}
