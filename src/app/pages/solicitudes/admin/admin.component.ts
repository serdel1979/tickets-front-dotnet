import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { AuthService } from '../../../auth/auth.service';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { Router } from '@angular/router';
import { HubConnectionBuilder } from '@microsoft/signalr';
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

  public solicitudes!: Solicitud[];

  constructor(private solicitudesService: SolicitudesService,
    private authService: AuthService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {

    console.log(URLHub);
    const connection = new HubConnectionBuilder()
      .withUrl(URLHub) // URL del concentrador en tu servidor
      .build();

     // Inicia la conexión con el servidor
     connection.start().then(() => {
      // La conexión se ha establecido correctamente
      console.log("conexión socket ok...");
    }).catch(err => {
      console.error(err.toString());
    });

    connection.on('Refresh', async (userId: string) => {
      // Lógica para recargar los datos en el cliente para el usuario específico
      console.log('Recibida notificación de recarga de datos para el usuario:', userId);
      // Aquí puedes llamar a la función o método para recargar los datos en tu componente
      await this.refresh();
    });

   
    // this.isLogued = this.authService.isLogued();
    // if (this.isLogued) {
    //   this.solicitudesService.getSolicitudes().subscribe(resp => {
    //     this.solicitudes = resp;
    //   })
    // }
    await this.refresh()
  }


  async refresh(){
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
