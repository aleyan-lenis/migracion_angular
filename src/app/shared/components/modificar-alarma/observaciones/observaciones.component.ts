import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observacion } from 'src/app/core/models/observacion.model';
import { Alarma } from 'src/app/core/models/alarmas.model';

@Component({
	selector: 'app-observaciones',
	templateUrl: './observaciones.component.html',
	styleUrls: ['./observaciones.component.scss']
})
export class ObservacionesComponent implements OnInit {

 	@Input('observaciones') observaciones: Observacion[];
	@Output() onChangeStatusObservacion: EventEmitter<number> = new EventEmitter();
	alarma: Alarma;

	constructor() { }

	ngOnInit() {
	}

	onCambiarEstadoObservacion(index){
		this.onChangeStatusObservacion.emit(index);
	}

}
