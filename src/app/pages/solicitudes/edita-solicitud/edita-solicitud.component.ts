import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { SolicitudesService } from 'src/app/services/solicitudes.service';

@Component({
  selector: 'app-edita-solicitud',
  templateUrl: './edita-solicitud.component.html',
  styleUrls: ['./edita-solicitud.component.css']
})
export class EditaSolicitudComponent implements OnInit {


  public idSolicitud!: number;

  public solicitud!: Solicitud;


  public errorNotFound: boolean = false;

  public buscando: boolean = false;

  public estadosPosibles!: any[];


  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private solicitudesService: SolicitudesService){}

  ngOnInit(): void {
      this.idSolicitud = this.route.snapshot.params['id'];
      this.solicitudesService.getSolicitud(this.idSolicitud).subscribe(resp=>{
        this.solicitud = resp;
        this.solicitudesService.getEstadosPosibles(this.idSolicitud).subscribe(estados=>{
          this.estadosPosibles = estados;
          console.log(estados);
        })
      })
  }

  volver(){
    this.router.navigate([`/solicitudes`]);
  }

  agregarEstado(){
    
  }

}
