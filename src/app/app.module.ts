import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from './app.component';
import { AppRoutes } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { SidebarModule } from './sidebar/sidebar.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { HistorialComponent } from './pages/historial/historial.component';
import { HttpClientModule,  HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './middleware/auth.interceptor';
import { DetalleSolicitudComponent } from './pages/solicitudes/detalle-solicitud/detalle-solicitud.component';
import { EditaSolicitudComponent } from './pages/solicitudes/edita-solicitud/edita-solicitud.component';
//import { list } from '@angular/fire/database';
import { AngularFireModule} from '@angular/fire/compat'
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AdminLayoutComponent,
    HistorialComponent,
    DetalleSolicitudComponent,
    EditaSolicitudComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(AppRoutes,{
      useHash: true
    }),
    ToastrModule.forRoot(),
    SidebarModule,
    NavbarModule,
    FooterModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
