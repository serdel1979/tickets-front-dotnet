import { Component, OnInit } from '@angular/core';
import { EquiposService } from '../../../services/equipos.service';
import { HttpResponse } from '@angular/common/http';
import { Equipos } from 'src/app/interfaces/equipos.paginado';
import { Router } from '@angular/router';
import { PdfGeneratorService } from 'src/app/services/pdf-generator.service';

@Component({
  selector: 'app-equipos-admin',
  templateUrl: './equipos-admin.component.html',
  styleUrls: ['./equipos-admin.component.css']
})
export class EquiposAdminComponent implements OnInit {


  public spinnerMostrar: boolean=false;
  equipos: any[] | null = [];
  equiposFiltrados: any[] | null =[];

  loadingPdf: boolean = false;

  allEquipos: any[] = [];

  public filtroBuscaUsuario: string = '';
  public page: number = 1;
  public porPagina: number = 5;
  public cantidadPaginas!: string | null;
  public totalItems: number = 0;

  constructor(private equipoService: EquiposService, private router: Router, private reportesPdf: PdfGeneratorService){}

  ngOnInit(): void {
    if(this.filtroBuscaUsuario === ''){
      this.obtenerEquipos();
    }else{
      this.buscar();
    }
  }

  obtenerEquipos() {
    this.spinnerMostrar = true;
    this.equipoService.getEquipos(this.page, this.porPagina).subscribe((response:HttpResponse<any>) => {
      this.equipos = response.body.equipos;
      this.equiposFiltrados = response.body.equipos;
      this.totalItems = response.body.total;
      const CANTIDAD = response.headers.get('x-total-count');
      this.spinnerMostrar = false;
    },
    (err)=>{
      console.error(err);
      this.spinnerMostrar = false;
    });
  }
  

  onPageChange(event: any) {
    this.page = event;
    if(this.filtroBuscaUsuario === ''){
      this.obtenerEquipos();
    }else{
      this.buscar();
    }
  }

  buscar(){
    this.spinnerMostrar = true;
    this.equipoService.getEquiposFiltro(this.page, this.porPagina,this.filtroBuscaUsuario).subscribe((response:HttpResponse<any>) => {
      this.equipos = response.body.equipos;
      this.equiposFiltrados = response.body.equipos;
      this.totalItems = response.body.total;
      const CANTIDAD = response.headers.get('x-total-count');
      this.spinnerMostrar = false;
    },
    (err)=>{
      console.error(err);
      this.spinnerMostrar = false;
    });
  }

  filtrar(){
    if(this.filtroBuscaUsuario === ''){
      this.obtenerEquipos();
    }else{
      this.buscar();
    }
  }

  agregar(){
    this.router.navigate(['equipos/nuevo']);
  }

  detalle(id: number){
    this.router.navigate([`equipos/detalle/${id}`]);
  }

  generaPdfEquipos(){
    this.loadingPdf = true;
    this.equipoService.getAllEquipos().subscribe(resp=>{
      this.allEquipos = resp;
      this.reportesPdf.generateInventario(resp)
      this.loadingPdf = false;
    },
    (err)=>{
      this.loadingPdf = false;
    })
  }


  generaPdfGrupEquipos(){
    this.loadingPdf = true;
    this.equipoService.getGrupEquipos().subscribe(resp=>{
      this.allEquipos = resp;
      this.reportesPdf.inventarioPorEquipo(resp)
      this.loadingPdf = false;
    },
    (err)=>{
      this.loadingPdf = false;
    })
  }


  generaPdfGrupEquiposSoporte(){
    this.loadingPdf = true;
    this.equipoService.getGrupEquiposSoporte().subscribe(resp=>{
      this.allEquipos = resp;
      this.reportesPdf.inventarioPorEquipoSoporte(resp)
      this.loadingPdf = false;
    },
    (err)=>{
      this.loadingPdf = false;
    })
  }



  generaPdfGrupUsuarios(){
    this.loadingPdf = true;
    this.equipoService.getGrupUsuarios().subscribe(resp=>{
      this.allEquipos = resp;
      this.reportesPdf.inventarioPorUsuario(resp)
      this.loadingPdf = false;
    },
    (err)=>{
      this.loadingPdf = false;
    })
  }




}
