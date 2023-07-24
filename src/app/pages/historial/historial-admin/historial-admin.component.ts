import { Component, OnInit } from '@angular/core';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-admin',
  templateUrl: './historial-admin.component.html',
  styleUrls: ['./historial-admin.component.css']
})
export class HistorialAdminComponent implements OnInit {

  public spinnerMostrar:boolean = false;

  public solicitudes : Solicitud[] = [];

  public isLogued: boolean = false;
  
  public page!: number;

  constructor(private solicitudesService: SolicitudesService, 
    private authService: AuthService,
    private router: Router
    ){}

  ngOnInit(): void {
    this.isLogued = this.authService.isLogued();
    this.spinnerMostrar = true;
    if (this.isLogued) {
      this.solicitudesService.getHistorial().subscribe( resp => {
        this.solicitudes = resp;
        this.spinnerMostrar = false;
      },
      (err)=>{
        this.spinnerMostrar = false;
      })
    }
  }

  onPageChange(event: any) {
    this.page = event;
  }

  verSolicitud(id: number) {
    this.router.navigate([`/solicitudes/ver/${id}`]);
  }


  getColorStyles(estado: string) {
    switch (estado) {
      case 'CERRADO':
      return { color: 'black', 'font-weight': 'bold' };
    case 'Solucionado':
      return { color: 'green', 'font-weight': 'bold' };
    case 'PENDIENTE':
      return { color: 'red', 'font-weight': 'bold' };
    case 'Visto':
      return { color: 'brown', 'font-weight': 'bold' };
    default:
      return { 'font-weight': 'bold' };
    }
  }


}
