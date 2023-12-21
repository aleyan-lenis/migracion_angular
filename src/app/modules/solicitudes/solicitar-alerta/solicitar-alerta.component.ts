import { Component, OnInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'underscore';

import { TipoAlarma, Alarma } from 'src/app/core/models/alarmas.model';
import { AlarmaService, InfoCargaArchivo } from 'src/app/core/services/alarma.service';
import { Response } from 'src/app/core/models/response.model';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FileService, ArchivoSubscripciones } from 'src/app/core/services/file.service';
import { Subject } from 'rxjs';
import { Subscripcion } from 'src/app/core/models/subscripcion.model';
import { AlertMessagesService } from 'src/app/shared/services/alert-messages.service';
import { ResultadosCarga } from 'src/app/shared/components/barra-carga/barra-carga.component';
import { ResultadosCargaCondicion } from 'src/app/shared/components/barra-carga-condiciones/barra-carga-condiciones.component';
import { UtilService } from 'src/app/shared/services/utils.service';
import * as PARAM from '../../../core/properties/parametros.parameter';
import * as MENSAJES from 'src/app/core/properties/messages.parameters';
import { Area, Usuario } from 'src/app/core/models/usuario.model';
import { JEIS_RESPONSE } from 'src/app/core/models/framework.model';

interface UsuarioSolicitante {
	username: string,
	nombre: string
}

@Component({
	selector: 'app-solicitar-alerta',
	templateUrl: './solicitar-alerta.component.html',
	styleUrls: ['./solicitar-alerta.component.scss']
})
export class SolicitarAlertaComponent implements OnInit {

	idAlarma: number;

	nombreSolicitante: string;
	solicitante: string;
	usuariosSolicitantes: UsuarioSolicitante[] = [];
	codigoArea: string;
	nombreArea: string;
	tiposAlarmas: TipoAlarma[] = [];
	isSolicitanteDefecto: boolean = true;
	idAlertaRegistrado: number = null;
	isAlarmaPorArchivo: boolean = true;
	isAlarmaIndefinida: boolean = false;
	alarmaRegistradaExito: boolean = false;
	closeResult: string;
	idArchivo: number;
	mensajeErrorCargaArchivo: string;
	partitionSubscripciones: [ArchivoSubscripciones[]];
	aumentoPorcentaje: number;
	nroParticiones: number;
	subscripcionesConErrores: Subscripcion[] = [];

	registrosExitosos: number = 0;
	registrosConErrores: number = 0;
	registrosProcesados: number = 0;
	isProcesandoAlertas: boolean = false;
	isCorrectFormatFeatures: boolean = true;
	isCorrectFormatPlanes: boolean = true;

	listaSubscripciones: ArchivoSubscripciones[] = [];
	isArchivoCargado = false;
	nombreArchivo: string;
	posicionActual: number = 0;
	subscripcionesIngresadas = new Subject<number>();
	porcentajeCarga: number = 0;
	isOperacionFinalizada: boolean = true;
  isArchivoCondicion = false;
	listaAreas: Area[] = [];
	formatoArchivo: string = "";
	caracteresNombre: number = 200;
	caracteresDetalle: number = 500;

  cargaArchivo: File;
	archivo = ['SI', 'NO','AMBOS'];
	solicitantes: Usuario[] = [];
	nombreUsuario: string;
	isSearch: boolean;

	@ViewChild('condiciones') inputCondiciones: ElementRef;

	formulario: FormGroup;

	constructor(private alarmaService: AlarmaService,
		private authService: AuthService,
		private formBuilder: FormBuilder,
		private modalService: NgbModal,
		private fileService: FileService,
		private alertMessageService: AlertMessagesService,
		private utilService: UtilService) { }

	ngOnInit() {
		this.solicitante = this.authService.getUsuario();
		this.codigoArea = this.authService.getCodigoAreaUsuario();
		this.nombreArea = this.authService.getNombreArea();
		this.nombreSolicitante = this.authService.getNombreUsuario();

		this.initForm();

		this.alarmaService.getTiposAlarmas({ idTipoAlarma: 0, estado: 'A' }).subscribe(
			(respuesta: Response) => {
				if (respuesta.error == null) this.tiposAlarmas = respuesta.objeto
			},
			(error: HttpErrorResponse) => {
				if (error.status == 401) this.authService.sesionCaducada()
			},
			() => {
				this.authService.actualizarDatosSesion();
			}
		);

		this.authService.getUsuariosPermitidos().subscribe(
			(response: Response) => {
				if (response.error == null) {
					this.usuariosSolicitantes = response.objeto;
				}
			},
			(error: HttpErrorResponse) => {
				if (error.status == 401) this.authService.sesionCaducada();
			},
			() => {
				this.authService.actualizarDatosSesion();
			}
		);

		this.authService.getAreasClaro().subscribe(
			(response: JEIS_RESPONSE) => {
				console.log(response);
				if (response.pnerrorOut == 0 && response.pvresultadoOut != '') {
					this.listaAreas = response.pvresultadoOut.datos.registro;
				}
			}
		)

		this.utilService.obtenerParametro('FORMATO_ARCHIVO_SUBSCRIPTORES').subscribe(
			(response: Response) => {
				if (response.error == null) {
					response.objeto.split('-').forEach((e, i) => {
						if (i == 0) this.formatoArchivo = this.formatoArchivo + e;
						else this.formatoArchivo = this.formatoArchivo + "  " + e;
					});
				}
			},
			(error: HttpErrorResponse) => {
			}
		)
	}

	initForm() {
		this.isAlarmaPorArchivo = true;
		this.formulario = this.formBuilder.group({
			solicitante: [{ value: this.nombreSolicitante, disabled: this.isSolicitanteDefecto }, Validators.required],
			area: [{ value: this.codigoArea, disabled: true }],
			nombre: ['', Validators.required],
			detalle: ['', Validators.required],
			archivo: [this.archivo[0]],
			condiciones: [{ value: '', disabled: this.isAlarmaPorArchivo }, Validators.required],
			tipoAlarma: ['', Validators.required],
			fechaInicio: ['', Validators.required],
			fechaFin: ['', Validators.required],
			indefinida: [''],
			features: [''],
			planes: ['']
		});


		this.formulario.get('archivo').valueChanges.subscribe(archivo => {
			if (archivo == 'NO') {
        console.log('l '+archivo);
				this.formulario.get('condiciones').enable();
				this.listaSubscripciones = [];
				this.isArchivoCargado = false;
				this.mensajeErrorCargaArchivo = null;
        this.isArchivoCondicion = false;
			}
			else if (archivo == 'SI') {
        console.log(archivo);
				this.formulario.get('condiciones').reset();
				this.formulario.get('condiciones').disable();
        this.isArchivoCondicion = false;
			}
      else if(archivo == 'AMBOS') {
        console.log(archivo);
        this.formulario.get('condiciones').enable();
        this.isArchivoCondicion = true;
      }
      console.log(archivo);
      console.log(' cambio : '+this.isArchivoCondicion);
		});

		this.formulario.get('indefinida').valueChanges.subscribe(check => {
			if (check) {
				this.formulario.get('fechaFin').disable();
			}
			else {
				this.formulario.get('fechaFin').enable();
			}
		})
	}

	onRegistrarAlarma(e) {

    console.log('registrar '+this.isArchivoCondicion);
		this.alarmaRegistradaExito = false;
		let usuarioSolicitante;
		let condiciones;

		if (this.isSolicitanteDefecto) {
			usuarioSolicitante = this.formulario.get('area').value + " " + this.nombreSolicitante;
		}
		else {
			usuarioSolicitante = this.formulario.get('area').value + " " + this.formulario.value.solicitante;
		}

		condiciones = this.formulario.value.condiciones == null ? '' : this.formulario.value.condiciones.trim();

		const alarma: Alarma = {
			nombre: this.formulario.value.nombre,
			detalle: this.formulario.value.detalle,
			condiciones: condiciones,
			idTipoAlarma: this.formulario.value.tipoAlarma,
			fechaInicio: this.formulario.value.fechaInicio,
			fechaFin: this.formulario.value.fechaFin,
			usuarioRegistro: this.solicitante,
			usuarioSolicitante: usuarioSolicitante,
			archivo: this.formulario.value.archivo,
			features: this.formulario.value.features,
			planes: this.formulario.value.planes
		};


		this.isAlarmaPorArchivo = (alarma.archivo == 'SI');

		this.alarmaService.solicitarNuevaAlarma(alarma).subscribe(
			(respuesta: Response) => {
				if (respuesta.error == null) {

					if (alarma.archivo == 'NO') {
						this.alertMessageService.showMessage.next({
							mensaje: "Alerta registrada correctamente",
							tipo: "success"
						});
					}

					const ids = respuesta.objeto;
					this.idAlarma = ids[0];
					this.idArchivo = ids[1];

					if (alarma.archivo == "SI" || alarma.archivo == "AMBOS") {
						this.procesarSubscripciones();
            if(alarma.archivo == 'AMBOS'){
              this.isArchivoCondicion = true;
            }
					}
					this.alarmaRegistradaExito = true;
					this.formulario.reset();
					this.initForm();

				}
				else {
					this.alertMessageService.showMessage.next({
						mensaje: respuesta.error,
						tipo: "error"
					});
				}
			},
			(error: HttpErrorResponse) => {
				this.alertMessageService.showMessage.next({
					mensaje: MENSAJES.UNKNOWN_ERROR,
					tipo: "error"
				});

				if (error.status == 401) this.authService.sesionCaducada();
			},
			() => {
				this.isSolicitanteDefecto = true;
				this.authService.actualizarDatosSesion();
			}
		)
	}

	onChangeAlarmaArchivo(estado: boolean) {
		this.isAlarmaPorArchivo = estado;

	}

	onAlarmaIndefinida() {
		this.isAlarmaIndefinida = !this.isAlarmaIndefinida;
	}

	cambiarSolicitante() {
		this.isSolicitanteDefecto = false;
		this.formulario.get('solicitante').setValue(null);
		this.formulario.get('solicitante').enable();
		// this.formulario.get('area').enable();
	}

	open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

	onCargarArchivo(inputFile: any) {
		const cargaArchivo = inputFile.target.files[0];
    this.cargaArchivo = cargaArchivo;

		this.mensajeErrorCargaArchivo = "";
		this.isArchivoCargado = false;
		this.nombreArchivo = cargaArchivo.name;

		this.fileService.validarArchivo(cargaArchivo).then(
			(listaAlertas: ArchivoSubscripciones[]) => {
				this.listaSubscripciones = listaAlertas;
				this.isArchivoCargado = true;
			}
		)
			.catch(
				(error: any) => {
					this.mensajeErrorCargaArchivo = error;
				}
			);
	}

	actualizarPorcentajeCarga(porcetaje: number) {
		this.porcentajeCarga = porcetaje;
	}

	private procesarSubscripciones() {
		this.isProcesandoAlertas = true;
		this.isOperacionFinalizada = false;
	}

	finalizarCarga() {
		this.isOperacionFinalizada = true;
		this.isProcesandoAlertas = false;
		this.idAlarma = 0;
		this.idArchivo = 0;
		this.registrosConErrores = 0;
		this.registrosExitosos = 0;
		this.registrosProcesados = 0;
		this.subscripcionesConErrores = [];
		this.porcentajeCarga = 0;
		this.aumentoPorcentaje = 0;
		this.isArchivoCargado = false;
    this.isArchivoCondicion = false;
	}

	onReiniciarFormulario() {
		this.formulario.reset();
		this.initForm();
		this.listaSubscripciones = [];
		this.isArchivoCargado = false;
		this.mensajeErrorCargaArchivo = null;
    this.isArchivoCondicion = false;
	}

	onReiniciarFile() {
		this.listaSubscripciones = [];
		this.isArchivoCargado = false;
		this.mensajeErrorCargaArchivo = null;
	}

	registrarInformacionCargaArchivo(resultados: ResultadosCarga) {
		const datos: InfoCargaArchivo = {
			cantRegistros: resultados.registrosProcesados,
			cantExitoso: resultados.registrosExitosos,
			cantError: resultados.registrosConErrores,
			idAlarma: this.idAlarma,
			nombreArchivo: this.nombreArchivo,
			idUsuario: this.authService.getUsuario()
		};


		this.alarmaService.registrarInformacionCargaArchivo(datos).subscribe(
			(response: Response) => {
			},
			(error: HttpErrorResponse) => {
			},
			() => {
				this.authService.actualizarDatosSesion();
			}
		)
	}

  registrarInformacionCargaArchivoCondicion(resultados: ResultadosCargaCondicion) {
		const datos: InfoCargaArchivo = {
			cantRegistros: resultados.registrosProcesados,
			cantExitoso: resultados.registrosExitosos,
			cantError: resultados.registrosConErrores,
			idAlarma: this.idAlarma,
			nombreArchivo: this.nombreArchivo,
			idUsuario: this.authService.getUsuario()
		};


		this.alarmaService.registrarInformacionCargaArchivo(datos).subscribe(
			(response: Response) => {
			},
			(error: HttpErrorResponse) => {
			},
			() => {
				this.authService.actualizarDatosSesion();
			}
		)
	}

	calcularCaracteres(input) {
		if (input.name == 'nombre') {
			this.caracteresNombre = 200 - input.value.length;
		}
		else if (input.name == 'detalle') {
			this.caracteresDetalle = 500 - input.value.length;
		}
	}

	onKeyValidarFeatures(e) {
		const valor = e.target.value;
		this.isCorrectFormatFeatures = /^[-\w\s]+(?:,[-\w\s]+)*$/g.test(valor);

	}

	onKeyValidarPlanes(e) {
		const valor = e.target.value;
		this.isCorrectFormatPlanes = /^[-\w\s]+(?:,[-\w\s]+)*$/g.test(valor);

	}

	onBuscarUsuario(e) {
		if (e.keyCode == 13) {
			this.isSearch = false;
			this.solicitantes = [];

			const value = (<string>e.target.value).toUpperCase();
			this.authService.buscarUsuario(value).subscribe(
				(response: JEIS_RESPONSE) => {
					this.isSearch = true;
					if (response.pnerrorOut == 0 && response.pvresultadoOut != '') {
						if (Array.isArray(response.pvresultadoOut.datos.registro)) {
							this.solicitantes = response.pvresultadoOut.datos.registro;
						}
						else {
							this.solicitantes.push(response.pvresultadoOut.datos.registro);
						}
					}
				}
			);
		}
	}

	chooseUsuario(codigoUsuario){
		this.isSolicitanteDefecto = true;
		this.nombreSolicitante = (this.solicitantes.find((e) => e.username == codigoUsuario)).nombre;
		this.formulario.get('solicitante').setValue((this.solicitantes.find((e) => e.username == codigoUsuario)).nombre);
		this.formulario.get('area').setValue((this.solicitantes.find((e) => e.username == codigoUsuario)).departamento);

		this.isSearch = false;
		this.formulario.get('solicitante').disable();
	}

  private getTipoImplementacion(reason: any): string[] {
		return this.archivo;
	}

}
