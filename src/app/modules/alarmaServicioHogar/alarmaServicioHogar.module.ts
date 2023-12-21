import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ColorPickerModule } from 'ngx-color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AlarmaServicioHogarComponent } from './alarmaServicioHogar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NuevaAlarmaComponent } from './configuracion-alarmas/nueva-alarma.component';
import { MatButtonModule, MatDialogModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatListModule, MatPaginatorModule, MatSelectModule, MatSortModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { ConsultaAlarmasComponent } from './consultas/consulta-alarmas.component';
import { ReporteAlarmasComponent } from './reporte-alarmas/reporte-alarmas.component';

@NgModule({
	declarations: [
		AlarmaServicioHogarComponent,
    NuevaAlarmaComponent,
    ConsultaAlarmasComponent,
    ReporteAlarmasComponent,
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
		MatRadioModule,
		MatTableModule,
		MatFormFieldModule,
		MatSortModule,
		MatPaginatorModule,
		MatInputModule,
		MatButtonModule,
		MatDialogModule,
		MatSelectModule,
		MatTooltipModule,
    MatDividerModule,
    MatListModule
	],
	exports: [],
	providers: [],
  entryComponents: [NuevaAlarmaComponent],
})
export class AlarmaServicioHogarModule { }
