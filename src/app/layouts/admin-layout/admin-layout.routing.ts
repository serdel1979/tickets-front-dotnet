import { Routes } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { isAdminGuard } from 'src/app/guards/is-admin.guard';
import { isLoguedGuard } from 'src/app/guards/is-logued.guard';
import { loguedGuard } from 'src/app/guards/logued.guard';
import { ChatComponent } from 'src/app/pages/chat/chat.component';
import { EquiposComponent } from 'src/app/pages/equipos/equipos.component';
import { HistorialComponent } from 'src/app/pages/historial/historial.component';
import { DetalleSolicitudComponent } from 'src/app/pages/solicitudes/detalle-solicitud/detalle-solicitud.component';
import { EditaSolicitudComponent } from 'src/app/pages/solicitudes/edita-solicitud/edita-solicitud.component';
import { SolicitudesComponent } from 'src/app/pages/solicitudes/solicitudes.component';
import { UsuarioDetallaComponent } from 'src/app/pages/usuarios/usuario-detalla/usuario-detalla.component';
import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';
import { ChatrAdminComponent } from '../../pages/chat/chatr-admin/chatr-admin.component';
import { ChatrUserComponent } from '../../pages/chat/chatr-user/chatr-user.component';
import { reloadGuard } from 'src/app/guards/reload.guard';
import { AgregaComponent } from 'src/app/pages/usuarios/agrega/agrega.component';
import { NuevoEquipoComponent } from 'src/app/pages/equipos/equipos-admin/nuevo-equipo/nuevo-equipo.component';


export const AdminLayoutRoutes: Routes = [
     { path: 'login',          component: LoginComponent, canActivate:[loguedGuard] },
     { path: 'registro',          component: RegisterComponent },
     { path: 'solicitudes',      component: SolicitudesComponent, canActivate:[isLoguedGuard] },
     { path: 'solicitudes/detalle/:id', component: DetalleSolicitudComponent, canActivate : [isLoguedGuard]},
     { path: 'solicitudes/ver/:id', component: EditaSolicitudComponent, canActivate : [isLoguedGuard,isAdminGuard]},
     { path: 'historial',      component: HistorialComponent, canActivate:[isLoguedGuard] },
     { path: 'usuarios',           component: UsuariosComponent, canActivate:[isLoguedGuard,isAdminGuard] },
     { path: 'usuarios/agrega', component: AgregaComponent, canActivate:[isLoguedGuard,isAdminGuard]},
     { path: 'usuarios/detalle/:id',           component: UsuarioDetallaComponent, canActivate:[isLoguedGuard,isAdminGuard] },
     { path: 'equipos/nuevo',          component: NuevoEquipoComponent, canActivate:[isLoguedGuard,isAdminGuard] },
     { path: 'equipos',          component: EquiposComponent, canActivate:[isLoguedGuard,isAdminGuard] },
     { path: 'chat', component:ChatComponent, canActivate:[isLoguedGuard,reloadGuard]}
];