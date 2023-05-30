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

  public solicitud!: Solicitud

  constructor(private router: Router,
    private route: ActivatedRoute,
    private solicitudesService: SolicitudesService){}



  ngOnInit(): void {
    this.idSolicitud = this.route.snapshot.params['id'];
    this.solicitudesService.getDetalleSolicitud(this.idSolicitud)
    .subscribe(resp=>{
      this.solicitud = resp;
    },
    error=>{
      console.log(error);
    })
  }



  volver(){
    this.router.navigate(['/solicitudes']);
  }


}
