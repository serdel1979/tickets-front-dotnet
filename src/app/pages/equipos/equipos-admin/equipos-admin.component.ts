import { Component, OnInit } from '@angular/core';
import { EquiposService } from '../../../services/equipos.service';
import { HttpResponse } from '@angular/common/http';
import { Equipos } from 'src/app/interfaces/equipos.paginado';

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
  public totalItems: number = 0;

  constructor(private equipoService: EquiposService){}

  ngOnInit(): void {
    this.obtenerEquipos()
  }

  obtenerEquipos() {
    this.equipoService.getEquipos(this.page, this.porPagina).subscribe((response:Equipos) => {
      this.equipos = response.equipos;
      this.equiposFiltrados = response.equipos;
      this.totalItems = response.total;
    });
  }
  

  onPageChange(event: any) {
    this.page = event;
    this.obtenerEquipos();
  }

}
