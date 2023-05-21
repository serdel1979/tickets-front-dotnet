import { Routes } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { isLoguedGuard } from 'src/app/guards/is-logued.guard';
import { EquiposComponent } from 'src/app/pages/equipos/equipos.component';
import { HistorialComponent } from 'src/app/pages/historial/historial.component';
import { SolicitudesComponent } from 'src/app/pages/solicitudes/solicitudes.component';
import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';


export const AdminLayoutRoutes: Routes = [
     { path: 'login',          component: LoginComponent },
     { path: 'registro',          component: RegisterComponent },
     { path: 'solicitudes',      component: SolicitudesComponent, canActivate:[isLoguedGuard] },
     { path: 'historial',      component: HistorialComponent, canActivate:[isLoguedGuard] },
     { path: 'usuarios',           component: UsuariosComponent, canActivate:[isLoguedGuard] },
     { path: 'equipos',          component: EquiposComponent, canActivate:[isLoguedGuard] }
];