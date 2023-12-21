import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, AfterViewInit } from '@angular/core';
import { ArchivoSubscripciones, FileService } from 'src/app/core/services/file.service';
import { AlarmaService } from 'src/app/core/services/alarma.service';
import { Subject } from 'rxjs';
import { Subscripcion } from 'src/app/core/models/subscripcion.model';
import { Response } from 'src/app/core/models/response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { AlertMessagesService } from '../../services/alert-messages.service';

import * as _ from 'underscore';

export interface ResultadosCargaCondicion {
	registrosExitosos: number,
	registrosProcesados: number,
	registrosConErrores: number
}

@Component({
	selector: 'app-barra-carga-condicion',
	templateUrl: './barra-carga-condiciones.component.html',
	styleUrls: ['./barra-carga-condiciones.component.scss']
})
export class BarraCargaCondicionComponent implements OnInit {

	registrosExitosos: number = 0;
	registrosConErrores: number = 0;
	registrosProcesados: number = 0;
	posicionActual: number = 0;
	isProcesando: boolean = false;
	tamañoParticion: number;
	nroParticiones: number;
	porcentajeScale: number;
	particiones: [any[]];
	arrayConErrores: any[] = [];
	registrosIngresados = new Subject<number>();

	@Input() modo: "creacion" | "modificacion";
	@Input() porcentajeCarga: number = 0;
	@Input() arrayCarga: any[] = [];
	@Input() idAlarma: number;
	@Input() idArchivo: number;
	@Input() nombreArchivo: string;
	@Output() resultadosCargaCondicion = new EventEmitter<ResultadosCargaCondicion>();
	@Output() updatePorcentajeCarga = new EventEmitter<number>();
	@Output() finalizar = new EventEmitter<any>();


	constructor(private alarmaService: AlarmaService,
		private authService: AuthService,
		private alertMessageService: AlertMessagesService,
		private fileService: FileService) { }

	ngOnInit() {
		this.registrosIngresados.subscribe(
			(posicion: number) => {
				if (this.posicionActual < this.nroParticiones) {
					this.subirSubscripcionesCondiciones(this.particiones[posicion]);
				}
				else {
					this.isProcesando = false;
					this.posicionActual = 0;
					this.resultadosCargaCondicion.emit({
						registrosConErrores: this.registrosConErrores,
						registrosExitosos: this.registrosExitosos,
						registrosProcesados: this.registrosProcesados
					});
				}
			}
		);

		this.cargar();
	}

	cargar() {
		this.nroParticiones = Math.round(this.arrayCarga.length / 20);
		this.particiones = this.particionarArray(this.arrayCarga, this.nroParticiones);
		this.nroParticiones = this.particiones.length;
		this.porcentajeScale = 100 / this.nroParticiones;
		this.isProcesando = true;

		if(this.modo == "creacion"){
			this.subirSubscripcionesCondiciones(this.particiones[0]);
		}
		else{
			this.reemplazarSubscripcionesCondicion();
		}
	}

	private particionarArray = (items, size) => {
		const result = _.groupBy(items, (item, i) => {
			return Math.floor(i / size);
		});

		return _.values(result)
	}

	private subirSubscripcionesCondiciones(subscripciones: ArchivoSubscripciones[]) {

		this.alarmaService.subirSubscripcionesCondicion(subscripciones, this.idAlarma, this.idArchivo)
			.subscribe(
				(respuesta: Response) => {

					this.posicionActual++;

					const subscripcionesConErrores: Subscripcion[] = respuesta.objeto;
					this.porcentajeCarga = this.porcentajeCarga + this.porcentajeScale;
					this.porcentajeCarga = Math.round(this.porcentajeCarga * 100) / 100;

					this.updatePorcentajeCarga.emit(this.porcentajeCarga);
					this.registrosProcesados += subscripciones.length;
					this.registrosExitosos += (subscripciones.length - subscripcionesConErrores.length);
					this.registrosConErrores += subscripcionesConErrores.length;

					if (subscripcionesConErrores.length != 0) {
						this.arrayConErrores.push(...subscripcionesConErrores);
					}
					this.registrosIngresados.next(this.posicionActual);
				},
				(error: HttpErrorResponse) => {
					if (error.status == 401) this.authService.sesionCaducada();

					if (error.status == 500) {
						this.alertMessageService.showMessage.next({
							mensaje: "Ocurrio un error inesperado",
							tipo: "error"
						});
					}
				}
			);
	}

	private reemplazarSubscripcionesCondicion(){
		this.alarmaService.eliminarSubscripcionesCondicion(this.idAlarma).subscribe(
			(response: Response) => {
				if(response.error == null){
					this.subirSubscripcionesCondiciones(this.particiones[0]);
				}
			},
			(error: HttpErrorResponse) => {
			}
		)
	}

	onGenerarReporteErrores() {

		this.fileService.crearReporteErrores(
			this.arrayConErrores,
			this.idArchivo,
			this.nombreArchivo,
			this.idAlarma,
			this.modo);
	}

	onFinalizarOperacion() {
		this.finalizar.emit();
	}


}
