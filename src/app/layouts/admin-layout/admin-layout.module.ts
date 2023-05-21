import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SolicitudesComponent } from 'src/app/pages/solicitudes/solicitudes.component';
import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';
import { EquiposComponent } from 'src/app/pages/equipos/equipos.component';
import { AppModule } from "../../app.module";
import { AdminComponent } from '../../pages/solicitudes/admin/admin.component';
import { UsersComponent } from 'src/app/pages/solicitudes/users/users.component';


@NgModule({
    declarations: [
        SolicitudesComponent,
        UsuariosComponent,
        EquiposComponent,
        AdminComponent,
        UsersComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        NgbModule
    ]
})
export class AdminLayoutModule { }
