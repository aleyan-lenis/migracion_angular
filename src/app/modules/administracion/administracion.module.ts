import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { ColorPickerModule } from 'ngx-color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AdministracionComponent } from './administracion.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfiguracionAlarmasComponent } from './configuracion-alarmas/configuracion-alarmas.component';
import { TipoAlarmaComponent } from './configuracion-alarmas/tipo-alarma/tipo-alarma.component';
import { AdministracionAlarmasComponent } from './administracion-alarmas/administracion-alarmas.component';

@NgModule({
	declarations: [
		AdministracionComponent,
		ConfiguracionAlarmasComponent,
		TipoAlarmaComponent,
		AdministracionAlarmasComponent
	],
	imports: [
		CommonModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		ColorPickerModule,
		RouterModule,
		BrowserAnimationsModule,
		MatProgressBarModule,
		DragDropModule,
		MatCheckboxModule,
		MatRadioModule
	],
	exports: [],
	providers: [],
})
export class AdministracionModule { }