import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Equipo } from 'src/app/interfaces/equipos.paginado';
import { EquiposService } from '../../../services/equipos.service';

@Component({
  selector: 'app-equipos-user',
  templateUrl: './equipos-user.component.html',
  styleUrls: ['./equipos-user.component.css']
})
export class EquiposUserComponent implements OnInit {

  public buscando: boolean = false;
  public miId!: string;

  public equipos: Equipo[] = [];

  public page!: number;

  ngOnInit(): void {
     this.buscando = true;
     this.equiposService.getMisEquipos()
     .subscribe((resp)=>{
      this.buscando = false;
      this.equipos = resp;
     },
     ()=>{
      this.buscando = false;
     })
  }

  constructor(private authService: AuthService, private equiposService: EquiposService){}

  onPageChange(event: any) {
    this.page = event;
  }

}
