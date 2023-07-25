import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { PdfMakeWrapper,Txt } from 'pdfmake-wrapper';
import { PdfGeneratorService } from '../../../services/pdf-generator.service';






@Component({
  selector: 'app-historial-admin',
  templateUrl: './historial-admin.component.html',
  styleUrls: ['./historial-admin.component.css']
})
export class HistorialAdminComponent implements OnInit {

  public spinnerMostrar: boolean = false;

  public solicitudes: Solicitud[] = [];
  public filtroSolicitudes: Solicitud[] = [];

  public filtroSolicitud!: string;

  public isLogued: boolean = false;

  public page!: number;
  public perPage: number = 5;

  @ViewChild('table', { static: false }) table!: ElementRef;

  constructor(private solicitudesService: SolicitudesService,
    private authService: AuthService,
    private router: Router,
    private pdfService: PdfGeneratorService
  ) { }

  ngOnInit(): void {
    this.isLogued = this.authService.isLogued();
    this.spinnerMostrar = true;
    if (this.isLogued) {
      this.solicitudesService.getHistorial().subscribe(resp => {
        this.solicitudes = resp;
        this.filtroSolicitudes = resp;
        this.spinnerMostrar = false;
      },
        (err) => {
          this.spinnerMostrar = false;
        })
    }
  }


 
  
  

  generaPdf(){
    this.pdfService.generatePdfgeneral(this.filtroSolicitudes);
  }
 


  onPageChange(event: any) {
    this.page = event;
  }

  verSolicitud(id: number) {
    this.router.navigate([`/solicitudes/ver/${id}`]);
  }

  aplicarFiltro() {
    if (this.filtroSolicitud.trim() === '') {
      // Si el filtro está vacío, mostrar todos los usuarios
      this.filtroSolicitudes = this.solicitudes;
    } else {
      // Filtrar usuarios por el valor del input
      this.filtroSolicitudes = this.filtroSolicitudes.filter((solicitud: Solicitud) => {
        return solicitud.departamento.toLowerCase().includes(this.filtroSolicitud.toLowerCase());
      });
    }
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
