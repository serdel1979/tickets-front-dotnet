import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { AuthService } from '../../../auth/auth.service';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{

  public isLogued: boolean = false;
  public page!: number;

  public solicitudes!: Solicitud[];

  constructor(private solicitudesService: SolicitudesService,
    private authService: AuthService){}

  ngOnInit(): void {
    this.isLogued = this.authService.isLogued();
    if (this.isLogued) {
      this.solicitudesService.getSolicitudes().subscribe(resp => {
        this.solicitudes = resp;
        console.log(this.solicitudes);
      })
    }
  }
}
