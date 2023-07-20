import { Component, OnInit } from '@angular/core';
import { EquiposService } from '../../../services/equipos.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-equipos-admin',
  templateUrl: './equipos-admin.component.html',
  styleUrls: ['./equipos-admin.component.css']
})
export class EquiposAdminComponent implements OnInit {


  equipos: any[] | null = [];
  equiposFiltrados: any[] | null =[];

  public page: number = 1;
  public porPagina: number = 2;
  public cantidadPaginas!: string | null;

  constructor(private equipoService: EquiposService){}

  ngOnInit(): void {
    this.obtenerEquipos()
  }

  obtenerEquipos() {
    this.equipoService.getEquipos(this.page, this.porPagina).subscribe((response:HttpResponse<any[]>) => {
      const headersRecibidos = response.headers;
      this.equipos = response.body || []; 
      this.equiposFiltrados = response.body || []; 

      this.cantidadPaginas = headersRecibidos.get('Totalpaginas'); // Obtener el total de páginas del encabezado

      console.log(headersRecibidos);
    });
  }
  

  onPageChange(event: any) {
    this.page = event;
    this.obtenerEquipos();
  }

}
