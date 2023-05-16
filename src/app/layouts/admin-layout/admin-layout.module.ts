import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SolicitudesComponent } from 'src/app/pages/solicitudes/solicitudes.component';
import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';
import { EquiposComponent } from 'src/app/pages/equipos/equipos.component';


@NgModule({
  declarations: [
    SolicitudesComponent,
    UsuariosComponent,
    EquiposComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule
  ]
})
export class AdminLayoutModule { }
