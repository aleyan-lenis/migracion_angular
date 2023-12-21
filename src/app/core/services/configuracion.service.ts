import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlarmaSGA } from '../models/configuracion.model';

import * as XLSX from 'xlsx';
import * as PARAM from '../properties/parametros.parameter';
import { saveAs } from "file-saver";
import { Response } from '../models/response.model';

import * as WS from '../properties/url-web-services.parameter';

@Injectable()
export class ConfiguracionService {
	public mensajeError: Subject<string> = new Subject<string>();
	public nuevaConfiguracion: Subject<any> = new Subject();

	constructor(private http: HttpClient) { }

  public consultaInfo(idCatalogo:string) {
    return this.http.post(WS.URL_JEIS_REST, {
      dsId: environment.JEIS_AXIS_JDBC,
      pnIdServicioInformacion: environment.JEIS_CONSULTA_INFO,
      sentencias_binds: [
        {
          parametros: [
            {
              parameterValue: idCatalogo
            }
          ]
        }
      ]
    })
  }

  public consultaCiudades() {
    return this.http.post(WS.URL_JEIS_REST, {
      dsId: environment.JEIS_CLAROVIDEO03_JDBC,
      pnIdServicioInformacion: environment.JEIS_CONSULTA_CIUDAD,
      sentencias_binds: [
        {}
      ]
    })
  }

  public consultaTecnologias(ciudad: string) {
    return this.http.post(WS.URL_JEIS_REST, {
      dsId: environment.JEIS_CLAROVIDEO03_JDBC,
      pnIdServicioInformacion: environment.JEIS_CONSULTA_TECNOLOGIA,
      sentencias_binds: [
        {
          parametros: [
            {
              parameterValue: ciudad
            }
          ]
        }
      ]
    })
  }

  public consultaNiveles1(ciudad: string, tecnologia: string) {
    return this.http.post(WS.URL_JEIS_REST, {
      dsId: environment.JEIS_CLAROVIDEO03_JDBC,
      pnIdServicioInformacion: environment.JEIS_CONSULTA_NIVEL1,
      sentencias_binds: [
        {
          parametros: [
            {
              parameterValue: ciudad
            },
            {
              parameterValue: tecnologia
            }
          ]
        }
      ]
    })
  }

  public consultaNiveles2(nivel1: string, tecnologia: string) {
    return this.http.post(WS.URL_JEIS_REST, {
      dsId: environment.JEIS_CLAROVIDEO03_JDBC,
      pnIdServicioInformacion: environment.JEIS_CONSULTA_NIVEL2,
      sentencias_binds: [
        {
          parametros: [
            {
              parameterValue: nivel1
            },
            {
              parameterValue: tecnologia
            }
          ]
        }
      ]
    })
  }

  public consultaNiveles3(nivel2: string, tecnologia: string, nivelNecesitado: string) {
    return this.http.post(WS.URL_JEIS_REST, {
      dsId: environment.JEIS_CLAROVIDEO03_JDBC,
      pnIdServicioInformacion: environment.JEIS_CONSULTA_NIVEL3o4,
      sentencias_binds: [
        {
          parametros: [
            {
              parameterValue: nivel2
            },
            {
              parameterValue: tecnologia
            },
            {
              parameterValue: nivelNecesitado
            }
          ]
        }
      ]
    })
  }

  public consultaNiveles4(nivel3: string, tecnologia: string, nivelNecesitado: string) {
    return this.http.post(WS.URL_JEIS_REST, {
      dsId: environment.JEIS_CLAROVIDEO03_JDBC,
      pnIdServicioInformacion: environment.JEIS_CONSULTA_NIVEL3o4,
      sentencias_binds: [
        {
          parametros: [
            {
              parameterValue: nivel3
            },
            {
              parameterValue: tecnologia
            },
            {
              parameterValue: nivelNecesitado
            }
          ]
        }
      ]
    })
  }


	public buscarConfiguracion(nombre: string,id_grupo: string) {
		return this.http.post(WS.OBTENER_CONFIGURACION, {
      nombre,
      id_grupo
    });
	}

	public crearConfiguracion(nombre: string, idGrupo: string, usuarioRegistro: string) {
		return this.http.post(WS.CREAR_CONFIGURACION, {
			nombre,
			idGrupo,
      usuarioRegistro
		})
	}

	public cambiarEstado(idCatalogo: number){
		return this.http.put(WS.MODIFICAR_ESTADO_CONFIGURACION, {
			idCatalogo
		})
	}

	public modificarNombre(idCatalogo:number, nombre: string, usuarioModificacion: string){
		return this.http.put(WS.MODIFICAR_NOMBRE_CONFIGURACION, {
			idCatalogo,
			nombre,
      usuarioModificacion
		});
	}

  public crearAlarma(alarma:AlarmaSGA, modo:string) {
    if (modo != "Editar") {
			return this.http.post(WS.CREAR_ALARMA, alarma);
		}
		else {
			return this.http.post(WS.MODIFICAR_ALARMA_SGA, alarma);
		}
	}

  public crearAlarmaDT(alarma:AlarmaSGA, cantidad: number) {
		return this.http.post(WS.CREAR_ALARMA_DT, {
      alarma,
      cantidad
    });
	}

  public obtenerAlarmas() {
    return this.http.get(WS.OBTENER_ALARMAS);
  }

  public obtenerAlarmasReportes(){
    return this.http.get(WS.OBTENER_ALARMAS_REPORTE);
  }

  private dateDiff(diaInicio: Date, diaFin: Date) {
    let diffTime = Math.abs(diaFin.getTime() - diaInicio.getTime()) / 1000;
    if (diffTime == 0 || !diffTime)
      return {dias: 0, time: 0};
    let hour = Math.floor(diffTime / 3600);
    diffTime = diffTime - (3600 * hour);
    let days = Math.floor(hour / 24);
    const minutes = Math.floor (diffTime / 60);
    diffTime = diffTime - ( 60 * minutes);
    return {
      dias: days,
      time: `${hour < 10 ? "0" : ""}${hour}:${minutes < 10 ? "0" : ""}${minutes}:${diffTime < 10 ? "0" : ""}${diffTime}`
    };
  }

  public crearReporteGeneral(datos: AlarmaSGA[]){
		const nombreArchivo = "Reporte General de Alarmas SGA";
		const wb = XLSX.utils.book_new();

		wb.Props = {
			Title: nombreArchivo,
			Subject: nombreArchivo,
			CreatedDate: new Date((new Date().getDate()))
		};

		wb.SheetNames.push(nombreArchivo);

		const datosReporte = [];

		datos.forEach((item, index) => {
      const fechaIngreso = new Date(Date.parse(item.fecha_ingreso));
      var fechaFin;
      var fechaInicio;
      var horaFin = item.hora_fin;
      var horaInicio = item.hora_inicio;
      if (item.hora_fin != null){
        fechaFin = new Date(item.fecha_fin.replace("00:00:00","") + item.hora_fin);
      } else {
        fechaFin = new Date(Date.parse(item.fecha_fin));
        horaFin = item.hora_inicio
      }
      if (item.hora_inicio != null){
        fechaInicio = new Date(item.fecha_inicio.replace("00:00:00","") + item.hora_inicio);
      } else {
        fechaInicio = new Date(Date.parse(item.fecha_inicio));
      }
      var fechaActualizacion = new Date(Date.parse(item.fecha_modificacion));
      const diff = this.dateDiff(fechaInicio, fechaFin);

			let alarma = {
        Fecha: `${fechaIngreso.getDate()}/${fechaIngreso.getMonth()}/${fechaIngreso.getFullYear()}`,
				Ticket: item.id_ticket,
        Nodo: item.nivel2,
        Hub: item.nivel1,
        Ciudad: item.ciudad,
        "Tipo De Problema": item.tipo_prob,
        "Cantidad De Afectados": item.cantidad_afectados,
        "Hora Inicio Del Trabajo": horaInicio,
        "Hora Actualización Snr": `${fechaActualizacion.getHours()}:${fechaActualizacion.getMinutes()}:${fechaActualizacion.getSeconds()}`,
        "Hora Fin Del Trabajo": horaFin,
        "Paso Al Asesor": item.atencion_asesor,
        "Tiempo De trabajo": diff.time,
        "Veces De Ingreso Del Mismo Ticket": item.numero_ingresos,
        "Cantidad De Días Trabajados En El Mes": diff.dias
			};

      if (!item.fecha_modificacion)
      alarma['Hora Actualización Snr']="";

			datosReporte.push(alarma);
		})
		const ws = XLSX.utils.json_to_sheet(datosReporte);
		wb.Sheets[nombreArchivo] = ws;
		let wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
		const buf = new ArrayBuffer(wbOut.length);
		const view = new Uint8Array(buf);

		for (let i = 0; i < wbOut.length; i++) view[i] = wbOut.charCodeAt(i) & 0xFF;
		wbOut = buf;

		const blob = new Blob([wbOut], { type: 'application/octet-stream' });
		const date = new Date();
		saveAs(blob, nombreArchivo + ' - ' + date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() +'.xlsx');
	}
}
