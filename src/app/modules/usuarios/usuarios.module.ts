import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule  } from '@angular/material/input';

import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsuariosComponent } from './usuarios.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
	declarations: [LoginComponent, UsuariosComponent, NuevoUsuarioComponent],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		MatTableModule,
		MatFormFieldModule,
		MatSortModule,
		MatPaginatorModule,
		MatInputModule,
		MatCheckboxModule,
		MatButtonModule,
		MatDialogModule,
		MatRadioModule,
		MatSelectModule
	],
	exports: [],
	providers: [],
	entryComponents: [NuevoUsuarioComponent]
})
export class UsuariosModule { }