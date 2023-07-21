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
  public TotalItems: number = 2;

  constructor(private equipoService: EquiposService){}

  ngOnInit(): void {
    this.obtenerEquipos()
  }

  obtenerEquipos() {
    this.equipoService.getEquipos(this.page, this.porPagina).subscribe((response:HttpResponse<any[]>) => {

      this.equipos = response.body || []; 
      this.equiposFiltrados = response.body || []; 

      console.log('Tipo de objeto response:', typeof response);
      //this.cantidadPaginas = response.headers.get('x-total-count'); 
      this.cantidadPaginas = response.headers.get('X-Total-Count');

      console.log('Total recibido: ',this.cantidadPaginas);
    });
  }
  

  onPageChange(event: any) {
    this.page = event;
    this.obtenerEquipos();
  }

}
