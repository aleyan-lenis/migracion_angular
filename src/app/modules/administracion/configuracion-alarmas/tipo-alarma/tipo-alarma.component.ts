import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

import { TipoAlarma } from 'src/app/core/models/alarmas.model';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
	selector: 'app-tipo-alarma',
	templateUrl: './tipo-alarma.component.html',
	styleUrls: ['./tipo-alarma.component.scss']
})
export class TipoAlarmaComponent implements OnInit, OnChanges {

	color: string;
	@Input() tipoAlarma: TipoAlarma = null;
	@Input() modo: "Nuevo" | "Editar";
	@Output() aceptar: EventEmitter<TipoAlarma> = new EventEmitter();

	formulario: FormGroup;

	constructor(private formBuilder: FormBuilder,
					private authService: AuthService) { }

	ngOnChanges(changes: SimpleChanges){
		this.cargarFormulario();
	}

	ngOnInit() {
		this.cargarFormulario();
	}
	
	private cargarFormulario(){
		this.color = "#ffffff";
		if(this.tipoAlarma == null){
			this.formulario = this.formBuilder.group({
				tipo: ['', Validators.required],
				prioridad: ['', [Validators.required, Validators.min(1)]],
				observacion: ['', Validators.required],
				estado: ['', Validators.required]
			});
		}
		else{
			this.formulario = this.formBuilder.group({
				tipo: [this.tipoAlarma.tipo.toUpperCase(), Validators.required],
				prioridad: [{ value: this.tipoAlarma.orden, disabled: this.modo == "Editar" }, this.tipoAlarma.orden,[ Validators.required, Validators.min(1)]],
				observacion: [this.tipoAlarma.observacion, Validators.required],
				estado: [this.tipoAlarma.estado, Validators.required]
			});

			this.color = this.tipoAlarma.color;
		}
	}

	onAceptarCambios() {
		if(this.modo == "Nuevo"){
			this.tipoAlarma = {
				tipo: this.formulario.value.tipo,
				color: this.color,
				orden: this.formulario.value.prioridad,
				observacion: this.formulario.value.observacion,
				estado: this.formulario.value.estado,
				usuarioRegistro: this.authService.getUsuario()
			};
		}
		else{
			this.tipoAlarma = {
				...this.tipoAlarma,
				tipo: this.formulario.value.tipo,
				color: this.color,
				observacion: this.formulario.value.observacion,
				estado: this.formulario.value.estado,
				usuarioActualiza: this.authService.getUsuario()
			}
		}
		this.aceptar.emit(this.tipoAlarma);
	}

}
