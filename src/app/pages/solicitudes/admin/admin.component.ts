import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { AuthService } from '../../../auth/auth.service';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { url } from 'inspector';


const URLHub = environment.urlHub;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public isLogued: boolean = false;
  public page!: number;
  private connection: HubConnection;
  public solicitudes!: Solicitud[];

  constructor(private solicitudesService: SolicitudesService,
    private authService: AuthService,
    private router: Router) {
    this.connection = new HubConnectionBuilder()
      .withUrl(URLHub) // URL del concentrador en tu servidor
      .build();

    // Inicia la conexión con el servidor
    
  }

  async ngOnInit(): Promise<void> {
    this.connection.start().then(() => {
      // La conexión se ha establecido correctamente
      console.log("conexión socket ok...");
      this.connection.on("Refresh", () => {
        this.refresh(); // Llamar al método refresh para actualizar los datos
    });
    }).catch(err => {
      console.error(err.toString());
    });
    await this.refresh()
  }


  async refresh() {
    console.log("haciendo refresh");
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

  verSolicitud(id: number) {
    this.router.navigate([`/solicitudes/ver/${id}`]);
  }
}
