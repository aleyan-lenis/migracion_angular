import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Alarma } from 'src/app/core/models/alarmas.model';
import { AlarmaService } from 'src/app/core/services/alarma.service';
import { Response } from 'src/app/core/models/response.model';
import * as _ from 'underscore';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/core/authentication/auth.service';
import * as FILTROS from 'src/app/core/properties/filtro-alarmas.parameters';
import * as MENSAJES from 'src/app/core/properties/messages.parameters';
import { AlertMessagesService } from 'src/app/shared/services/alert-messages.service';

@Component({
	selector: 'app-administracion-alarmas',
	templateUrl: './administracion-alarmas.component.html',
	styleUrls: ['./administracion-alarmas.component.scss']
})
export class AdministracionAlarmasComponent implements OnInit {

	lblAlarmaInactiva: string = "Inactivas";
	lblAlarmaPendientes: string = "Pendientes y Canceladas";
	lblAlarmaEstadoActual: string;
	isShowDetalleAlarma: boolean = false;
	onSearchAlarma: boolean = false;
	alarmaSeleccionada: Alarma;
	isUserAdm: boolean;
	isLoadingAlarmas: boolean = true;
	listaActivas: Alarma[] = [];
	listaInactivas: Alarma[] = [];
	listaPendientes: Alarma[] = [];
	filtro: "todas" | "archivo" | "condicion" = "todas";

	listaAlarmas: {} | [] = [];
	listaAlarmasOriginal: any[] = [];

	@ViewChild('inputSearch') inputSeach: ElementRef;

	constructor(private alarmaService: AlarmaService,
		private authService: AuthService,
		private alertMsgService:AlertMessagesService) { }

	ngOnInit() {
		this.obtenerAlarmas();
		this.isUserAdm = this.authService.isUserAdm();
	}

	private obtenerAlarmas(idAlarmaModificada?: number) {
		this.lblAlarmaEstadoActual = this.lblAlarmaInactiva;
		this.alarmaService.getAlarma(FILTROS.TODAS).subscribe(
			(response: Response) => {
				if (response.error == null) {
					this.listaAlarmas = response.objeto;
					this.listaAlarmas = _.groupBy(response.objeto, (alarma: Alarma) => alarma.estado);

					this.listaActivas = this.listaAlarmas['A'];
					this.listaInactivas = this.listaAlarmas['I'];
					this.listaPendientes = this.listaAlarmas['P'];

					this.listaAlarmasOriginal = JSON.parse(JSON.stringify(this.listaAlarmas));
				}
			},
			(error: HttpErrorResponse) => {
				if(error.status == 0){
					this.alertMsgService.showMessage.next({
						mensaje: MENSAJES.COMMUNICATION_SERVER_ERROR,
						tipo: "error"
					});
				}
				else if(error.status == 401){
					this.authService.sesionCaducada();
				}else{
					this.alertMsgService.showMessage.next({
						mensaje: MENSAJES.UNKNOWN_ERROR,
						tipo: "error"
					});
				}
			},
			() => {
				this.isLoadingAlarmas = false;
				this.authService.actualizarDatosSesion();

			}
		);

	}

	get misDosListas () {
		let mi_lista = [this.listaAlarmas['P'],
			this.listaAlarmas['C']
		]
		console.log(this.misDosListas);
		return mi_lista;
	}

	cambiarAlarmasEstado(opcion: string) {
		if (opcion == this.lblAlarmaPendientes) {
			this.lblAlarmaEstadoActual = this.lblAlarmaPendientes;
		}
		else if (opcion == this.lblAlarmaInactiva) {
			this.lblAlarmaEstadoActual = this.lblAlarmaInactiva;
		}
	}

	onVerDetalleAlarma(alarma: Alarma) {
		this.isShowDetalleAlarma = true;
		this.alarmaSeleccionada = alarma;
	}

	onMostraAlarmas() {
		this.isShowDetalleAlarma = false;
		this.alarmaSeleccionada = null;
		this.obtenerAlarmas();
	}

	modificarAlarma(idAlarmaModificada: any) {
		this.isShowDetalleAlarma = false;
		this.alarmaSeleccionada = null;
		this.obtenerAlarmas(idAlarmaModificada);
	}

	onBuscarAlarma(e: any) {
		const texto = (<string>e.target.value).toUpperCase().trim();
		this.alarmaSeleccionada = null;

		if (texto != "") {
			this.onSearchAlarma = true;
			const listaFiltro = { 'A': [], 'I': [], 'P': [], 'C': [] };

			const promise = new Promise((resolve, reject) => {
				this.listaAlarmas = JSON.parse(JSON.stringify(this.listaAlarmasOriginal));

				Object.values(this.listaAlarmas).map((lista: Alarma[]) => {
					lista.map((alarma, index) => {
						if (alarma.idAlarma.toString().includes(texto) ||
							alarma.nombre.toUpperCase().includes(texto)) {

							if (this.filtro != "todas") {
								if (this.filtro == "archivo" && alarma.archivo == "SI")
									listaFiltro[alarma.estado].push(alarma);
								else if (this.filtro == "condicion" && alarma.archivo == "NO")
									listaFiltro[alarma.estado].push(alarma);
							}
							else {
								listaFiltro[alarma.estado].push(alarma);
							}
						}

						resolve();
					});
				});
			});

			promise.then(() => {
				this.listaAlarmas = listaFiltro;
			});
		}
		else {
			const e = { value: this.filtro };

			this.onChangeFilter(e);
			this.onSearchAlarma = false;
		}
	}

	isAlarmaPorArchivo(alarma: Alarma) {
		return alarma.archivo == 'SI';
	}

	onChangeFilter(e: any) {
		this.filtro = e.value;
		this.inputSeach.nativeElement.value = "";

		this.onSearchAlarma = (this.filtro != "todas");

		const listaFiltro = { 'A': [], 'I': [], 'P': [], 'C': [] };

		const promise = new Promise((resolve, reject) => {
			this.listaAlarmas = JSON.parse(JSON.stringify(this.listaAlarmasOriginal));

			Object.values(this.listaAlarmas).map((lista: Alarma[]) => {
				
				lista.map((alarma, index) => {
					if (this.filtro == 'archivo') {
						if (alarma.archivo == 'SI') {
							listaFiltro[alarma.estado].push(alarma);
						}
					}
					else if (this.filtro == 'condicion') {
						if (alarma.archivo != 'SI') {
							listaFiltro[alarma.estado].push(alarma);
						}
					}
					else {
						listaFiltro[alarma.estado].push(alarma);
					}

					resolve();
				});
			});
		});

		promise.then(() => {
			this.listaAlarmas = listaFiltro;
		});

	}

}
