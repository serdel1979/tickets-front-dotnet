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


  private idSolicitud!: number;

  private solicitud!: Solicitud;


  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private solicitudesService: SolicitudesService){}

  ngOnInit(): void {
      this.idSolicitud = this.route.snapshot.params['id'];
      this.solicitudesService.getSolicitud(this.idSolicitud).subscribe(resp=>{
        console.log(resp);
        this.solicitud = resp;
      })
  }

  volver(){
    this.router.navigate([`/solicitudes`]);
  }

}
