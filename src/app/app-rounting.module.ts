import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './modules/home/home.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LoginComponent } from './modules/usuarios/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdministracionComponent } from './modules/administracion/administracion.component';
import { SolicitudesComponent } from './modules/solicitudes/solicitudes.component';
import { UsrModulesGuard } from './core/guards/usr_modules.guard';
import { NotHavePermissionComponent } from './shared/components/not-have-permission/not-have-permission.component';
import { ConfiguracionComponent } from './modules/configuracion/configuracion.component';
import { AlarmaServicioHogarComponent } from './modules/alarmaServicioHogar/alarmaServicioHogar.component';
import { ReportesComponent } from './modules/reportes/reportes.component';
import { UsuariosComponent } from './modules/usuarios/usuarios.component';

const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{
		path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
			{ path: 'administracion', component: AdministracionComponent, canActivate: [UsrModulesGuard] },
			{ path: 'solicitudes', component: SolicitudesComponent, canActivate: [UsrModulesGuard] },
			{ path: 'reportes', component: ReportesComponent, canActivate: [UsrModulesGuard] },
			{ path: 'usuarios', component: UsuariosComponent, canActivate: [UsrModulesGuard] },
      { path: 'alarmas', component: AlarmaServicioHogarComponent, canActivate: [UsrModulesGuard] },
      { path: 'configuracion', component: ConfiguracionComponent, canActivate: [UsrModulesGuard] },
		]
	},
	{ path: 'not-have-permission', component: NotHavePermissionComponent },
	{ path: '404', component: NotFoundComponent },
	{ path: '**', redirectTo: '404' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
