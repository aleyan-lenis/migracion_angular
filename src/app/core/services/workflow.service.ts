import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as WS from '../properties/url-web-services.parameter';
import { Workflow } from '../models/workflow.model';
import { AuthService } from '../authentication/auth.service';

export interface TramiteObservacion{
	nroTramite: number,
	observacion: string
}

@Injectable()
export class WorkflowService{

	constructor(private http:HttpClient,
					private authService: AuthService){}

	public obtenerObservacionesAlarma(idAlarma: number){
		const datos = {
			idUsuario: this.authService.getUsuario(),
			rolUsuario: this.authService.getRolUsuario(),
			idAlarma: idAlarma
		};

		return this.http.post(WS.OBTENER_OBSERVACIONES, datos);
	}

	public obtenerInformacionAprob(idAlarma: number){
		return this.http.post(WS.OBTENER_INFO_APROB, {
			idAlarma: idAlarma
		})
	}

	public obtenerFlujoAlarma(idAlarma: number){
		return this.http.post(WS.OBTENER_FLUJO_ALARMA, {
			idAlarma: idAlarma
		});
	}
	
	public obtenerHistModificacion(idAlarma: number){
		return this.http.post(WS.OBTENER_HIST_MODIFICACION, {
			idAlarma: idAlarma
		});
	}

	public obtenerInformacionCancelacion(idAlarma: number){
		return this.http.post(WS.OBTENER_INFO_CANCELACION, {
			idAlarma: idAlarma
		});
	}

	public getComentarios(idAlarma: number){
		return this.http.post(WS.OBTENER_COMENTARIOS, {
			idAlarma: idAlarma
		});
	}

	public getNroAlarmasAprobadas(filtros: string){
		return this.http.post(WS.OBTENER_NRO_ALARMAS, {
			filtros: filtros
		});
	}
}