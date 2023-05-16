import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { EquiposComponent } from './pages/equipos/equipos.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FixedpluginComponent } from './shared/fixedplugin/fixedplugin.component';

@NgModule({
  declarations: [
    AppComponent,
    SolicitudesComponent,
    UsuariosComponent,
    EquiposComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    FixedpluginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
