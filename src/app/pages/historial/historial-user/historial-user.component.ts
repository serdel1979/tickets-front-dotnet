import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { PdfGeneratorService } from '../../../services/pdf-generator.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-historial-user',
  templateUrl: './historial-user.component.html',
  styleUrls: ['./historial-user.component.css']
})
export class HistorialUserComponent implements OnInit {


  public mostrarSpinner: boolean = false;

  
  public filtroSolicitudes : Solicitud[] = [];

  public filtroSolicitud!: string;

  public misSolicitudes: Solicitud[] = [];

  public page!: number;
  pageSize: number = 5; // Tamaño de página (número de solicitudes por página)
  totalPages: number = 0; // Total de páginas

  constructor(  private router: Router,
    private authService: AuthService,
    private miHistorialSolicitudes: SolicitudesService,
    private pdfService:PdfGeneratorService){}

  ngOnInit(): void {
    this.mostrarSpinner = true;
    this.miHistorialSolicitudes.getMiHistorial().subscribe(resp => {
      this.mostrarSpinner = false;
      this.misSolicitudes = resp;
      this.filtroSolicitudes = resp;
    },
    ()=>{
      this.mostrarSpinner = false;
    })
  }


  generaPdf(){
    this.pdfService.generatePdf(this.filtroSolicitudes,this.authService.getUserLogued());
  }


  ver(id:number) {
    this.router.navigate([`/solicitudes/detalle/${id}`]);
  }

  aplicarFiltro() {
    if (this.filtroSolicitud.trim() === '') {
      // Si el filtro está vacío, mostrar todos los usuarios
      this.filtroSolicitudes = this.misSolicitudes;
    } else {
      // Filtrar usuarios por el valor del input
      this.filtroSolicitudes = this.filtroSolicitudes.filter((solicitud: Solicitud) => {
        return solicitud.estadoActual.toLowerCase().includes(this.filtroSolicitud.toLowerCase());
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

  onPageChange(event: any) {
    this.page = event;
  }

}
