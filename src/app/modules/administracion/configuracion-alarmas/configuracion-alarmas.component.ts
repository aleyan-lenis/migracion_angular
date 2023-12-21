import { Component, OnInit } from '@angular/core';
import { TipoAlarma, Alarma } from 'src/app/core/models/alarmas.model';
import { AlarmaService } from 'src/app/core/services/alarma.service';
import { Response } from 'src/app/core/models/response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AlertMessagesService } from 'src/app/shared/services/alert-messages.service';

@Component({
	selector: 'app-configuracion-alarmas',
	templateUrl: './configuracion-alarmas.component.html',
	styleUrls: ['./configuracion-alarmas.component.scss']
})
export class ConfiguracionAlarmasComponent implements OnInit {

	listaTiposAlarmas: TipoAlarma[] = [];
	tipoAlarma: TipoAlarma = null;
	mostrarFormulario: boolean = false;
	modo: "Nuevo" | "Editar";

	constructor(private alarmaService: AlarmaService,
		private authService: AuthService,
		private alertMessageService: AlertMessagesService) { }

	ngOnInit() {
		this.cargarTiposAlarmas();
	}

	private cargarTiposAlarmas() {
		this.alarmaService.getTiposAlarmas({}).subscribe(
			(respuesta: Response) => {
				if (respuesta.error == null) {
					this.listaTiposAlarmas = respuesta.objeto;
				}
			},
			(error: HttpErrorResponse) => {
				if (error.status == 401) this.authService.sesionCaducada();
			},
			() => {
				this.authService.actualizarDatosSesion();
			}
		);
	}

	onEditTipoAlarma(tipoAlarma: TipoAlarma) {
		this.mostrarFormulario = true;
		this.tipoAlarma = tipoAlarma;
		this.modo = "Editar";
	}

	onNuevoTipoAlarma() {
		this.mostrarFormulario = true;
		this.tipoAlarma = null;
		this.modo = "Nuevo";
	}

	onActualizarTipoAlarmas(tipoAlarma: TipoAlarma) {
		this.alarmaService.actualizarTiposAlarmas(tipoAlarma, this.modo).subscribe(
			(respuesta: Response) => {
				if(respuesta.error == null){
					this.tipoAlarma = null;
					this.modo = null;
					this.mostrarFormulario = false;

					this.alertMessageService.showMessage.next({
						mensaje: "Tipo de alarma actualizado",
						tipo: "success"
					})
				}
				else{
					this.alertMessageService.showMessage.next({
						mensaje: respuesta.error,
						tipo: "error"
					});
				}
			},
			(error: HttpErrorResponse) => {
				if (error.status == 401) this.authService.sesionCaducada()
			},
			() => {
				this.cargarTiposAlarmas();
				this.authService.actualizarDatosSesion();
			}
		);
	}

	drop(event: CdkDragDrop<TipoAlarma[]>) {
		moveItemInArray(this.listaTiposAlarmas, event.previousIndex, event.currentIndex);
		const alarma = this.listaTiposAlarmas[event.currentIndex];
		const nuevaPrioridad = event.currentIndex + 1;
		const anteriorProridad = event.previousIndex + 1;
		let prioridad = "";

		if(anteriorProridad !== nuevaPrioridad){

			prioridad = nuevaPrioridad > anteriorProridad ? "MENOR" : "MAYOR";
			
			const datos = {
				idTipo: alarma.idTipoAlarma,
				anteriorPrioridad: anteriorProridad,
				nuevaPrioridad: nuevaPrioridad,
				nivelPrioridad: prioridad
			};

			this.alarmaService.actualizarPrioridadAlarma(datos).subscribe(
				(response: Response) => {
					if(response.error == null){
						this.cargarTiposAlarmas();
					}
				},
				(error: HttpErrorResponse) => {
				},
				() => {
					this.authService.actualizarDatosSesion();
				}
			)
		}
		
	}

}
