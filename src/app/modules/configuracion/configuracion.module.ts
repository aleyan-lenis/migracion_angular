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

import { ConfiguracionComponent } from './configuracion.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AtribuibleComponent } from './atribuible/atribuible.component';
import { DetalleComponent } from './detalle/detalle.component';
import { TipoEventoComponent } from './tipo-evento/tipo-evento.component';
import { TipoProblemaComponent } from './tipo-problema/tipo-problema.component';
import { MatButtonModule, MatDialogModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatListModule, MatPaginatorModule, MatSelectModule, MatSortModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { NuevoAtribuibleComponent } from './atribuible/nuevo-atribuible/nuevo-atribuible.component';
import { NuevoDetalleComponent } from './detalle/nuevo-detalle/nuevo-detalle.component';
import { NuevoTipoEventoComponent } from './tipo-evento/nuevo-tipo-evento/nuevo-tipo-evento.component';
import { NuevoTipoProblemaComponent } from './tipo-problema/nuevo-tipo-problema/nuevo-tipo-problema.component';
@NgModule({
	declarations: [
		ConfiguracionComponent,
		AtribuibleComponent,
		DetalleComponent,
		TipoEventoComponent,
    TipoProblemaComponent,
    NuevoAtribuibleComponent,
    NuevoDetalleComponent,
    NuevoTipoEventoComponent,
    NuevoTipoProblemaComponent
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
  entryComponents: [NuevoAtribuibleComponent,NuevoDetalleComponent,NuevoTipoEventoComponent,NuevoTipoProblemaComponent],
})
export class ConfiguracionModule { }
