import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReportesComponent } from './reportes.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [ReportesComponent],
	imports: [ 
		CommonModule,
		SharedModule,
		FormsModule
	],
	exports: [],
	providers: [],
})
export class ReportesModule {}