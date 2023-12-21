import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SolicitudesComponent } from './solicitudes.component';
import { SolicitarAlertaComponent } from './solicitar-alerta/solicitar-alerta.component';
import { MisSolicitudesComponent } from './mis-solicitudes/mis-solicitudes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
	declarations: [
		SolicitudesComponent,
		SolicitarAlertaComponent,
		MisSolicitudesComponent
	],
	imports: [
		CommonModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		MatProgressBarModule,
		MatTooltipModule
	],
	exports: [],
	providers: [],
})
export class SolicitudesModule {}
