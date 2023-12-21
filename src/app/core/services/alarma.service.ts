import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as WS from '../properties/url-web-services.parameter';
import * as FILTROS from '../properties/filtro-alarmas.parameters';
import { ArchivoSubscripciones } from './file.service';
import { TipoAlarma, Alarma, DatosTecnicos } from '../models/alarmas.model';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { ModificarAlarmaComponent } from 'src/app/shared/components/modificar-alarma/modificar-alarma.component';

export interface InfoCargaArchivo {
	cantRegistros: number,
	cantExitoso: number,
	cantError: number,
	idAlarma: number,
	nombreArchivo: string,
	idUsuario: string,

}

@Injectable()
export class AlarmaService {
	public setDatosTecnicos: Subject<DatosTecnicos> = new Subject<DatosTecnicos>();
  public modificarComponent: ModificarAlarmaComponent;
	constructor(private http: HttpClient) { }

	public getTiposAlarmas(tipoAlarma: { idTipoAlarma?: number, estado?: string }) {
		return this.http.post(WS.GET_TIPOS_ALARMAS, tipoAlarma);
	}

	public getAlarma(filtros: string, idAlarma?: number) {
		if (filtros == FILTROS.GET_ALARMA_BY_ID) {
			filtros = filtros + idAlarma;
		};

		return this.http.post(WS.GET_ALARMAS, {
			filtros: filtros
		});
	}

	public subirSubscripciones(listaSubscripciones: ArchivoSubscripciones[], idAlarma: number, idArchivo: number) {
		const datosCarga = {
			listaSubscripciones: listaSubscripciones,
			idAlarma: idAlarma,
			idArchivo: idArchivo
		};

		return this.http.post(WS.SUBIR_SUBSCRIPCIONES, datosCarga);

	}

  public subirSubscripcionesCondicion(listaSubscripciones: ArchivoSubscripciones[], idAlarma: number, idArchivo: number) {
		const datosCarga = {
			listaSubscripciones: listaSubscripciones,
			idAlarma: idAlarma,
			idArchivo: idArchivo
		};

		return this.http.post(WS.SUBIR_SUBSCRIPCIONES_CONDICION, datosCarga);
	}

	public actualizarTiposAlarmas(tipoAlarma: TipoAlarma, modo: string) {
		if (modo == "Nuevo") {
			return this.http.post(WS.REGISTRAR_TIPO_ALARMA, tipoAlarma);
		}
		else {
			return this.http.post(WS.ACTUALIZAR_TIPO_ALARMA, tipoAlarma);
		}
	}

	public solicitarNuevaAlarma(alarma: Alarma) {
		return this.http.post(WS.SOLICITAR_NUEVA_ALARMA, alarma);
	}

	public cambiarEstadoAlarma(datos: { idAlarma: number, estado: string }) {
		return this.http.post(WS.CAMBIAR_ESTADO_ALARMA, datos);
	}

	public actualizarPrioridadAlarma(datos: { idTipo: number, nuevaPrioridad: number }) {
		return this.http.post(WS.ACTUALIZAR_PRIORIDAD_TIPO, datos);
	}

	public modificarAlarma(alarma: Alarma, nroTramite?: number, datosTecnicos?: DatosTecnicos) {
		const datos = {
			alarma: alarma,
			nroTramite: nroTramite,
			datosTecnicos: datosTecnicos
		};

		return this.http.post(WS.MODIFICAR_ALARMA, datos);
	}

	public getAlarmasUsuario(usuario: string) {
		return this.http.post(WS.GET_ALARMAS_USUARIO, { idUsuario: usuario });
	}

	public registrarInformacionCargaArchivo(datos: InfoCargaArchivo){
		return this.http.post(WS.REGISTRAR_INFO_CARGA_ARCHIVO, datos);
	}

	public getDatosArchivo(idAlarma: number){
		return this.http.post(WS.OBTENER_DATOS_ARCHIVO, {
			idAlarma: idAlarma
		})
	}

	public eliminarSubscripciones(idAlarma: number){
		const datos = {
			idAlarma: idAlarma
		};

		return this.http.post(WS.ELIMINAR_SUBSCRIPCIONES, datos);
	}

  public eliminarSubscripcionesCondicion(idAlarma: number){
		const datos = {
			idAlarma: idAlarma
		};

		return this.http.post(WS.ELIMINAR_SUBSCRIPCIONES_CONDICION, datos);
	}

	public getAlarmasReporte(filtros?: string, paginacion?: number){
		return this.http.post(WS.REPORTE_ALARMAS, {
			filtros: filtros,
			paginacion: paginacion
		});
	}

	public getSubscripciones(estado: string, idAlarma?: number){
		return this.http.post(WS.OBTENER_SUBSCRIPCIONES, {
			estado: estado,
			idAlarma: idAlarma
		})
	}

	public getDatosTecnicos(idAlarma: number){
		return this.http.post(WS.CONSULTAR_DTOS_TECNICOS, {
			idAlarma: idAlarma
		});
	}

	public verificaEstadoUsuario(idUsuario:string){
		return this.http.post(WS.URL_JEIS_REST, {
			dsId: environment.JEIS_AXIS_JDBC,
			pnIdServicioInformacion: environment.JEIS_VERIFICA_ESTADO_SOL,
			sentencias_binds: [
				{
					parametros: [
						{
							parameterValue: idUsuario
						}
					]
				}
			]
		})
	}
}
