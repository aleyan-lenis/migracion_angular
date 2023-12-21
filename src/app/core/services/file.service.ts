import { Injectable, SystemJsNgModuleLoader } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import * as WS from '../properties/url-web-services.parameter';
import * as XLSX from 'xlsx';
import * as PARAM from '../properties/parametros.parameter';
import { saveAs } from "file-saver";
import { Subscripcion } from '../models/subscripcion.model';
import { AlarmaReporte } from '../models/alarmas.model';
import { Response } from '../models/response.model';

export interface ArchivoSubscripciones {
	idCliente: number,
	idIdentificacion: string,
	idSubscriptor: number,
	tipoSubscripcion: string,
	estadoSubscripcion: string,
	razonEstado: string,
	tipoTecnologia: string
}

@Injectable()
export class FileService {
	private cabezerasArchivo: string[];

	constructor(private http: HttpClient) {
		this.http.get(WS.OBTENER_PARAMETRO +  PARAM.ID_FORMATO_ARCHIVO_SUBSCRIPTORES).subscribe(
			(response: Response) => {
				this.cabezerasArchivo = (<string>response.objeto).split("-");
			}
		);
	}

	public validarArchivo(archivo) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsBinaryString(archivo);
			const extension = archivo.name.split('.').pop();

			if(extension == 'csv'){
				reader.onload = (e: any) => {
					const data = e.target.result;
					const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });
					const wsname: string = workbook.SheetNames[0];
					const ws: XLSX.WorkSheet = workbook.Sheets[wsname];

					const cabezerasArchivo = <string[]>XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
					const alarmas = <ArchivoSubscripciones[]>(XLSX.utils.sheet_to_json(ws, {raw: false}));

					if (this.cabezerasArchivo.length != cabezerasArchivo.length) {
						reject('La cantidad de columnas del archivo no es el correcto ');
					}

					for (let i in this.cabezerasArchivo) {
						if (this.cabezerasArchivo[i] !== cabezerasArchivo[i]) {
							reject('Los nombres de las columnas del archivo no son correctos');
						}
					}

					const listaAlertas: ArchivoSubscripciones[] = [];

					try {
						alarmas.forEach((e: any) => {
							let alerta: ArchivoSubscripciones = {
								idCliente: e.ID_CLIENTE,
								idIdentificacion: (<any>e.ID_IDENTIFICACION).toString(),
								idSubscriptor: e.ID_SUBSCRIPCION,
								tipoSubscripcion: e.TIPO_SUBSCRIPCION,
								estadoSubscripcion: e.ESTADO_SUBSCRIPCION,
								razonEstado: e.RAZON_ESTADO,
								tipoTecnologia: e.TIPO_TECNOLOGIA
							};

							listaAlertas.push(alerta);
						});
					} catch (error) {
						if(error instanceof TypeError){
							reject("Algunos registros estan vacíos");
						}
					}
					resolve(listaAlertas);
				}
			}
			else{
				reject("Formato de archivo no valido");
			}


		});
	}

	public crearReporteErrores(datos: Subscripcion[], idArchivo: number, archivo: string,idAlarma: number, modo?:string) {
		const listaErrores: any[] = [];
		const nombreArchivo = "Reporte de errores";

		datos.forEach((item, index) => {
			let subscripcion = {
				Subscripcion: item.idSubscriptor,
				Identificacion: item.idIdentificacion,
				tipoSubscripcion: item.tipoSubscripcion,
				estadoSubscripcion: item.estadoSubscripcion,
				razonEstado: item.razonEstado,
				tipoTecnologia: item.tipoTecnologia,
				Error: item.observacion
			};

			listaErrores.push(subscripcion);
		})

		const wb = XLSX.utils.book_new();

		wb.Props = {
			Title: nombreArchivo,
			Subject: nombreArchivo,
			CreatedDate: new Date((new Date().getDate()))
		};

		wb.SheetNames.push(nombreArchivo);

		const cabezera: any[] = [
			{
				atributo: "ID ALERTA",
				contenido: idAlarma.toString()
			},
			{
				atributo: "NOMBRE ARCHIVO",
				contenido: archivo
			}
		];

		if(modo == 'creacion'){
			cabezera.push(
				{
					atributo: "ID ARCHIVO",
					contenido: idArchivo.toString()
				}
			);
		}

		const ws = XLSX.utils.json_to_sheet(cabezera, { skipHeader: true });

		XLSX.utils.sheet_add_json(ws, listaErrores, {
			origin: 'A5'
		})

		wb.Sheets[nombreArchivo] = ws;

		let wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
		const buf = new ArrayBuffer(wbOut.length);
		const view = new Uint8Array(buf);

		for (let i = 0; i < wbOut.length; i++) view[i] = wbOut.charCodeAt(i) & 0xFF;
		wbOut = buf;

		const blob = new Blob([wbOut], { type: 'application/octet-stream' });
		saveAs(blob, 'Reporte de errores.xlsx');
	}

	public crearReporteBusqueda(datos: Subscripcion[]) {
		const lista: any[] = [];
		const nombreArchivo = "Reporte de busqueda";

		datos.forEach((item, index) => {
			let subscripcion = {
				Workflow: item.idArchivo,
				Subscripcion: item.idSubscriptor,
				Identificacion: item.idIdentificacion,
				Alarma: item.idAlarma,
				Estado: item.estado
			};

			lista.push(subscripcion);
		})

		const wb = XLSX.utils.book_new();
		wb.Props = {
			Title: nombreArchivo,
			Subject: nombreArchivo,
			CreatedDate: new Date((new Date().getDate()))
		};


		wb.SheetNames.push(nombreArchivo);

		const ws = XLSX.utils.json_to_sheet(lista);

		wb.Sheets[nombreArchivo] = ws;

		let wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
		const buf = new ArrayBuffer(wbOut.length);
		const view = new Uint8Array(buf);

		for (let i = 0; i < wbOut.length; i++) view[i] = wbOut.charCodeAt(i) & 0xFF;
		wbOut = buf;

		const blob = new Blob([wbOut], { type: 'application/octet-stream' });
		saveAs(blob, 'Reporte de busqueda.xlsx');
	}

	public getCabezerasArchivo() {
		return [...this.cabezerasArchivo];
	}

	public crearReporteGeneral(datos: AlarmaReporte[]){
		const nombreArchivo = "Reporte General de Alarmas";
		const wb = XLSX.utils.book_new();

		wb.Props = {
			Title: nombreArchivo,
			Subject: nombreArchivo,
			CreatedDate: new Date((new Date().getDate()))
		};

		wb.SheetNames.push(nombreArchivo);

		const datosReporte = [];

		datos.forEach((item, index) => {
			let alarma = {
				IdAlarma: item.idAlarma,
				Nombre: item.nombre,
				Detalle: item.detalle,
				TipoAlarma: item.tipoAlarma,
				Prioridad: item.prioridad,
				Archivo: item.archivo,
				Estado: item.estado,
				FechaInicio: item.fechaInicio,
				FechaFin: (item.fechaFin == '0000-00-00' ? 'Indefinido' : item.fechaFin),
				Solicitante: item.usuarioSolicitante,
				AreaSolicitante: item.areaSolicitante,
				Sistemas: item.usuarioSIS,
				AprobacionSistemas: item.fechaAprobSIS,
				Customer: item.usuarioSAC,
				AprobacionCustomer: item.fechaAprobSAC,
				Condiciones: item.condiciones,
				FechaRegistro: item.fechaRegistro,
				UsuarioRegistro: item.usuarioRegistro,
				FechaActualiza: item.fechaActualiza,
				UsuarioActualiza: item.usuarioActualiza
			};

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
