import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { error } from 'console';
import { Solicitud } from '../../../interfaces/solicitud.interface';

@Component({
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.component.html',
  styleUrls: ['./detalle-solicitud.component.css']
})
export class DetalleSolicitudComponent implements OnInit {

  

  public idSolicitud!: number;

  public solicitud!: Solicitud;

  public errorNotFound: boolean = false;

  public buscando: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private solicitudesService: SolicitudesService){}



  ngOnInit(): void {
    this.idSolicitud = this.route.snapshot.params['id'];
    this.buscando = true;
    this.solicitudesService.getDetalleSolicitud(this.idSolicitud)
    .subscribe(resp=>{
      this.solicitud = resp;
      this.buscando = false;
      this.errorNotFound = false;
    },
    error=>{
      console.log(error);
      this.buscando=false;
      this.errorNotFound = true;
    })
  }



  volver(){
    this.router.navigate(['/solicitudes']);
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
