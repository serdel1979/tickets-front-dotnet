import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit{

  public isAdmin: boolean=false

  ngOnInit(): void {
      this.isAdmin = this.authService.isAdmin();
  }

  constructor(private authService: AuthService){}

}
