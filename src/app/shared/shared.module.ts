import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';


import { NotFoundComponent } from './components/not-found/not-found.component';
import { AppRoutingModule } from '../app-rounting.module';
import { LoaderComponent } from './components/loader/loader.component';
import { ToggleMenuDirective } from './directives/toggle-menu.directive';
import { EstadoCompletoPipe } from './pipes/estado-completo.pipe';
import { CutPrefixPipe } from './pipes/cut-prefix.pipe';
import { SwitchComponent } from './components/switch/switch.component';
import { NotHavePermissionComponent } from './components/not-have-permission/not-have-permission.component';
import { FechaIndefinidaPipe } from './pipes/fecha-indefinida.pipe';
import { ModificarAlarmaComponent } from './components/modificar-alarma/modificar-alarma.component';
import { CapitalLetterPipe } from './pipes/capital-letter.pipe';
import { NoContentComponent } from './components/no-content/no-content.component';
import { AlertMessageComponent } from './components/alert-message/alert-message.component';
import { AlertMessagesService } from './services/alert-messages.service';
import { BarraCargaComponent } from './components/barra-carga/barra-carga.component';
import { BarraCargaCondicionComponent } from './components/barra-carga-condiciones/barra-carga-condiciones.component';
import { UtilService } from './services/utils.service';
import { SliceTextPipe } from './pipes/slice-text.pipe';
import { UpperCaseAreaPipe } from './pipes/upper-case-area.pipe';
import { DatoTecnicoComponent } from './components/modificar-alarma/dato-tecnico/dato-tecnico.component';
import { ObservacionesComponent } from './components/modificar-alarma/observaciones/observaciones.component';
import { TipoLogicaPipe } from './pipes/tipo-logica.pipe';
import { RolesPipe } from '../shared/pipes/roles.pipe';
import { ConfirmPopupComponent } from './components/confirm-popup/confirm-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
	declarations: [
		NotFoundComponent,
		LoaderComponent,
		ToggleMenuDirective,
		EstadoCompletoPipe,
		CutPrefixPipe,
		SwitchComponent,
		NotHavePermissionComponent,
		FechaIndefinidaPipe,
		ModificarAlarmaComponent,
		CapitalLetterPipe,
		NoContentComponent,
		AlertMessageComponent,
		BarraCargaComponent,
    BarraCargaCondicionComponent,
		SliceTextPipe,
		UpperCaseAreaPipe,
		DatoTecnicoComponent,
		ObservacionesComponent,
		TipoLogicaPipe,
		RolesPipe,
		ConfirmPopupComponent
	],
	imports: [
		CommonModule,
		AppRoutingModule,
		ReactiveFormsModule,
		MatCheckboxModule,
		MatProgressBarModule,
		FormsModule,
		BrowserModule,
		BrowserAnimationsModule,
		MatTooltipModule,
		MatDialogModule,
		MatButtonModule
	],
	exports: [
		NotFoundComponent,
		LoaderComponent,
		ToggleMenuDirective,
		EstadoCompletoPipe,
		CutPrefixPipe,
		SwitchComponent,
		NotHavePermissionComponent,
		FechaIndefinidaPipe,
		ModificarAlarmaComponent,
		CapitalLetterPipe,
		NoContentComponent,
		AlertMessageComponent,
		BarraCargaComponent,
    BarraCargaCondicionComponent,
		SliceTextPipe,
		TipoLogicaPipe,
		RolesPipe
	],
	providers: [
		AlertMessagesService,
		UtilService
	],
	entryComponents: [
		ConfirmPopupComponent
	]

})
export class SharedModule { }
