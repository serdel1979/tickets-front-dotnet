import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit{

  public admin: boolean = false;

  ngOnInit(): void {
    // this.authService.subsLogued.subscribe((logued)=>{

    // })
    this.admin = this.authService.isAdmin();
  }

  constructor(private authService: AuthService){}

}
