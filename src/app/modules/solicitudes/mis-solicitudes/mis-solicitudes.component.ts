import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { AlarmaService } from 'src/app/core/services/alarma.service';
import { Alarma } from 'src/app/core/models/alarmas.model';
import { Response } from 'src/app/core/models/response.model';
import { HttpErrorResponse } from '@angular/common/http';
import * as FILTROS from 'src/app/core/properties/filtro-alarmas.parameters';


@Component({
	selector: 'app-mis-solicitudes',
	templateUrl: './mis-solicitudes.component.html',
	styleUrls: ['./mis-solicitudes.component.scss']
})
export class MisSolicitudesComponent implements OnInit {

	listaAlarmas: Alarma[] = [];
	isShowDetalleAlarma: boolean = false;
	alarmaSeleccionada: Alarma;
	alarmasAprobadas: Alarma[] = [];
	alarmasCanceladas:Alarma[] = [];
	isLoadingAlarmas: boolean = true;
	isLoadingAlarmasUsuarios: boolean = true;
	lblAlarmaAprobada: string = "Aprobadas";
	lblAlarmaCancelada: string = "Canceladas";
	lblAlarmaEstadoActual = this.lblAlarmaAprobada;
	isUserSol: boolean;

	constructor(private authService: AuthService,
		private alarmaService: AlarmaService) { }

	ngOnInit() {
		// if(this.authService.isSessionFinished()) this.authService.sesionCaducada();
		this.isUserSol = this.authService.isUserSol();
		this.obtenerAlarmas();
	}

	onVerDetalleAlarma(alarma: Alarma) {
		this.isShowDetalleAlarma = true;
		this.alarmaSeleccionada = alarma;
	}

	obtenerAlarmas() {
		this.alarmaService.getAlarma(FILTROS.ESTADO_PENDIENTE_ORDEN_REGISTRO).subscribe(
			(response: Response) => {
				if (response.error == null) {
					if (this.authService.isUserSAC()) {
						this.listaAlarmas = (<Alarma[]>response.objeto).filter((e) => e.aprobacionSAC == 'P' || e.aprobacionSAC == 'D');
					}
					else if(this.authService.isUserSIS()){
						this.listaAlarmas = (<Alarma[]>response.objeto).filter((e) => e.aprobacionSIS == 'P' || e.aprobacionSIS == 'D');
					}
					else {
						this.listaAlarmas = (<Alarma[]>response.objeto).filter((e) => e.usuarioRegistro == this.authService.getNombreUsuario());
					}
				}
			},
			(error: HttpErrorResponse) => {
				if (error.status == 401)
					this.authService.sesionCaducada();
			},
			() =>  {
				this.isLoadingAlarmas = false;
				this.authService.actualizarDatosSesion();
			}
		);

		this.alarmaService.getAlarmasUsuario(this.authService.getUsuario()).subscribe(
			(response: Response) => {
				if(response.error == null){
					const alarmas:Alarma[] = response.objeto;
					if(this.authService.isUserSAC()) this.alarmasAprobadas = alarmas.filter((e) => e.aprobacionSAC == 'A');
					else if(this.authService.isUserSIS()) this.alarmasAprobadas = alarmas.filter((e) => e.aprobacionSIS == "A");
					else if(this.authService.isUserSol()) this.alarmasAprobadas = alarmas.filter((e) => e.estado == 'A');
					
					this.alarmasCanceladas = alarmas.filter((e) => e.estado == 'C');
				}
			},
			(error: HttpErrorResponse) => {
			},
			() => {
				this.isLoadingAlarmasUsuarios = false;
				this.authService.actualizarDatosSesion();
			}
		)
	}	

	onMostraAlarmas() {
		this.isShowDetalleAlarma = false;
		this.alarmaSeleccionada = null;
		this.lblAlarmaEstadoActual = this.lblAlarmaAprobada;
		this.obtenerAlarmas();
	}

	modificarAlarma() {
		this.isShowDetalleAlarma = false;
		this.alarmaSeleccionada = null;
		this.obtenerAlarmas();
	}

	cambiarAlarmasEstado(opcion: string) {
		if (opcion == this.lblAlarmaAprobada) {
			this.lblAlarmaEstadoActual = this.lblAlarmaAprobada;
		}
		else if (opcion == this.lblAlarmaCancelada) {
			this.lblAlarmaEstadoActual = this.lblAlarmaCancelada;
		}
	}

}
