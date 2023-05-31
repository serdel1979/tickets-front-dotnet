import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { AuthService } from '../../../auth/auth.service';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { Router } from '@angular/router';

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
    private authService: AuthService,
    private router: Router){}

  ngOnInit(): void {
    this.isLogued = this.authService.isLogued();
    if (this.isLogued) {
      this.solicitudesService.getSolicitudes().subscribe(resp => {
        this.solicitudes = resp;
      })
    }
  }



  onPageChange(event: any) {
    this.page = event;
  }

  verSolicitud(id:number){
    this.router.navigate([`/solicitudes/ver/${id}`]);
  }
}
