import { Routes } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { EquiposComponent } from 'src/app/pages/equipos/equipos.component';
import { SolicitudesComponent } from 'src/app/pages/solicitudes/solicitudes.component';
import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';


export const AdminLayoutRoutes: Routes = [
     { path: 'login',          component: LoginComponent },
     { path: 'solicitudes',      component: SolicitudesComponent },
     { path: 'usuarios',           component: UsuariosComponent },
     { path: 'equipos',          component: EquiposComponent }
];