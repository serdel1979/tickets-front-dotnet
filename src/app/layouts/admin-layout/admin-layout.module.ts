import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SolicitudesComponent } from 'src/app/pages/solicitudes/solicitudes.component';
import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';
import { EquiposComponent } from 'src/app/pages/equipos/equipos.component';
import { AdminComponent } from '../../pages/solicitudes/admin/admin.component';
import { UsersComponent } from 'src/app/pages/solicitudes/users/users.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChatComponent } from 'src/app/pages/chat/chat.component';
import { ChatAdminComponent } from 'src/app/pages/chat/chat-admin/chat-admin.component';
import { ChatUserComponent } from 'src/app/pages/chat/chat-user/chat-user.component';
import { ChatrAdminComponent } from 'src/app/pages/chat/chatr-admin/chatr-admin.component';
import { ChatrUserComponent } from 'src/app/pages/chat/chatr-user/chatr-user.component';
import { FirstWordBoldPipe } from 'src/app/pipes/world-brawn';

@NgModule({
    declarations: [
        SolicitudesComponent,
        UsuariosComponent,
        EquiposComponent,
        AdminComponent,
        UsersComponent,
        ChatComponent,
        ChatAdminComponent,
        ChatUserComponent,
        ChatrAdminComponent,
        ChatrUserComponent,
        FirstWordBoldPipe
    ],
    imports: [
        NgxPaginationModule,
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        NgbModule
    ]
})
export class AdminLayoutModule { }
