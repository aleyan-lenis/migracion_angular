import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Alarma, DatosArchivo, TipoAlarma, DatosTecnicos } from 'src/app/core/models/alarmas.model';
import { AlarmaService, InfoCargaArchivo } from 'src/app/core/services/alarma.service';
import { Response } from 'src/app/core/models/response.model';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Observacion } from 'src/app/core/models/observacion.model';
import { WorkflowService } from 'src/app/core/services/workflow.service';
import { DatosAprobacion, HistModificacion, DatosCancelacion } from 'src/app/core/models/workflow.model';
import { AlertMessagesService } from '../../services/alert-messages.service';
import { FileService, ArchivoSubscripciones } from 'src/app/core/services/file.service';
import { ResultadosCarga } from '../barra-carga/barra-carga.component';
import { trigger, style, state, transition, animate } from '@angular/animations';
import * as MENSAJES from 'src/app/core/properties/messages.parameters';
import { JEIS_RESPONSE } from 'src/app/core/models/framework.model';
import { Area } from 'src/app/core/models/usuario.model';

@Component({
	selector: 'app-modificar-alarma',
	templateUrl: './modificar-alarma.component.html',
	styleUrls: ['./modificar-alarma.component.scss'],
	animations: [
		trigger('showHistMod', [
			state('show', style({
				marginRight: '0px'
			})),
			state('hide', style({
				marginRight: '-200%'
			})),
			transition('show => hide', [
				animate('.35s')
			]),
			transition('hide => show', [
				animate('.35s')
			])
		])
	]
})
export class ModificarAlarmaComponent implements OnInit {

	@Input('alarma') alarma: Alarma;
	@Output('onModificarAlarma') onModificarAlarma = new EventEmitter<number>();
	@ViewChild('content') content: ElementRef;

	observaciones: Observacion[] = [];
	listaTiposAlarmas: TipoAlarma[] = [];
	datosAprobacion: DatosAprobacion[] = [];
	listaSubscripciones: ArchivoSubscripciones[] = [];
	historialModificaciones: HistModificacion[] = [];
	condicionesAlarma: string[] = [];

	formulario: FormGroup;
	modalReference: NgbModalRef;
	datosArchivo: DatosArchivo;
	datosCancelacion: DatosCancelacion;
	tipoAlarma: TipoAlarma;
	datosTecnicos: DatosTecnicos;
	mostrarInformacionDT: boolean;
	v_desabilitado: boolean = true;
	isDisabled = true;
	closeResult: string;
	mensajeErrorCargaArchivo: string;
	observacioModificacion: string = "";
	observacionesAprobacion: string = "";
	comentariosAprobacion: string = "";
	nombreArchivo: string;
	placeholder: string = "";
	nroTramite: number;
	indexObservacion: number;
	onEditSAC: boolean = false;
	onEditSIS: boolean = false;
	onEditAdm: boolean = false;
	onEditSol: boolean = false;
	isUserSIS: boolean;
	isUserSAC: boolean;
	isProcesandoArchivo: boolean = false;
	isUserAdm: boolean;
	isUserSol: boolean;
	isArchivoCargado: boolean = false;
	isDevolucion: boolean = false;
	havePermission: boolean = true;
	waitingForObservation: boolean = false;
	errorModificacion: boolean;
	isShowHistModificacion: boolean = false;
	isCancelacion: boolean;
	isAprobacion: boolean = false;
	areaSolicitante: string;
	estadoSolicitante: string;

	constructor(private alarmaService: AlarmaService,
		private authService: AuthService,
		private formBuilder: FormBuilder,
		private workflowService: WorkflowService,
		private alertMessageService: AlertMessagesService,
		private fileService: FileService,
		private modalService: NgbModal) { }

	ngOnInit() {
		this.tipoAlarma = {
			color: this.alarma.color,
			idTipoAlarma: this.alarma.idTipoAlarma,
			tipo: this.alarma.tipoAlarma
		};

		if (this.alarma.condiciones !== null) {
			this.condicionesAlarma = this.alarma.condiciones.split("\n");
		}

		this.authService.getAreasClaro().subscribe(
			(response: JEIS_RESPONSE) => {
				const codigoArea = this.alarma.usuarioSolicitante.substring(0, this.alarma.usuarioSolicitante.indexOf(' '));

				if (response.pnerrorOut == 0 && response.pvresultadoOut != '') {
					this.areaSolicitante = ((<Area[]>response.pvresultadoOut.datos.registro).find((e) => e.codigo == codigoArea)).nombre;
				}
			}
		)

		this.isUserSIS = this.authService.isUserSIS();
		this.isUserSAC = this.authService.isUserSAC();
		this.isUserAdm = this.authService.isUserAdm();
		this.isUserSol = this.authService.isUserSol();

		this.formulario = this.formBuilder.group({
			fechaInicio: [''],
			fechaFin: [''],
			nombre: [''],
			detalle: [''],
			razonDevolucion: [''],
			condiciones: [''],
			features: [''],
			planes: ['']
		});

		if (this.authService.isUserSIS() || this.authService.isUserAdm()) {
			this.formulario.addControl('datosTecnicos', this.formBuilder.group({
				idServicio: [''],
				tipoServicio: [''],
				puertoServicio: [''],
				dbServicio: [''],
				instancia: [''],
				distribuidor: [''],
				integrador: [''],
				tipoLogica: [''],
				informacionAdicional: [false],
				endpoint: [''],
				campoIdentificacion: [''],
				campoSubscripcion: [''],
				campoResult: [''],
				campoInfAdicional: ['']
			}));
			this.mostrarInformacionDT = true;
			this.cargarDatosTecnicos();
		}

		this.workflowService.obtenerObservacionesAlarma(this.alarma.idAlarma).subscribe(
			(response: Response) => {
				if (response.error == null) {
					this.observaciones = response.objeto;
				}
			},
			(error: HttpErrorResponse) => {
			},
			() => {
				this.authService.actualizarDatosSesion();
			}
		);

		this.alarmaService.getDatosArchivo(this.alarma.idAlarma).subscribe(
			(response: Response) => {
				if (response.error == null) {
					this.datosArchivo = response.objeto;
				}
			},
			(error: HttpErrorResponse) => {
				if (error.status == 401) {
					this.authService.sesionCaducada();
				}
			},
			() => {
				this.authService.actualizarDatosSesion();
			}
		);

		this.workflowService.obtenerInformacionAprob(this.alarma.idAlarma).subscribe(
			(response: Response) => {
				if (response.error == null) {
					this.datosAprobacion = response.objeto;
				}
			},
			(error: HttpErrorResponse) => {
				if (error.status == 401) this.authService.sesionCaducada();
			},
			() => {
				this.authService.actualizarDatosSesion();
			}
		)

		if (this.checkPermissionModificarFechas()) {
			this.alertMessageService.showMessage.next({
				mensaje: this.estadoSolicitante == "L" ? MENSAJES.ACTUALIZA_FECHA_ADM : MENSAJES.ACTUALIZA_FECHA_SOL,
				tipo: 'warning'
			});
		}

		this.alarmaService.getTiposAlarmas({ estado: 'A' }).subscribe(
			(response: Response) => {
				if (response.error == null) {
					this.listaTiposAlarmas = response.objeto;
				}
			},
			() => {
				this.authService.actualizarDatosSesion();
			}
		);

		if (this.alarma.estado == 'C') {
			this.workflowService.obtenerInformacionCancelacion(this.alarma.idAlarma).subscribe(
				(response: Response) => {
					if (response.error == null) {
						this.datosCancelacion = response.objeto;
					}
				},
				(error: HttpErrorResponse) => {
				},
				() => {
					this.authService.actualizarDatosSesion();
				}
			);
		}

		this.workflowService.getComentarios(this.alarma.idAlarma).subscribe(
			(response: Response) => {
				if (response.error == null) {
					this.comentariosAprobacion = response.objeto;
				}
			},
			(error: HttpErrorResponse) => {
			}
		)


		this.obtenerHistorialModificaciones();

		this.alarmaService.verificaEstadoUsuario(this.alarma.usuarioRegistro).subscribe(
			(response: JEIS_RESPONSE) => {
				if (response.pnerrorOut == 0 && response.pvresultadoOut != '') {
					this.estadoSolicitante  = response.pvresultadoOut.datos.registro.estado;
				}

				if (this.checkPermissionModificarFechas()) {
					this.alertMessageService.showMessage.next({
						mensaje: this.estadoSolicitante == "L" ? MENSAJES.ACTUALIZA_FECHA_ADM : MENSAJES.ACTUALIZA_FECHA_SOL,
						tipo: 'warning'
					});
				}
			},
			(error: HttpErrorResponse) => {

			}
		);
	}

	private cargarDatosTecnicos(){
		this.alarmaService.getDatosTecnicos(this.alarma.idAlarma).subscribe(
			(response: Response) => {
				if (response.error == null && response.objeto != null) {
					this.datosTecnicos = response.objeto;
				}
				else {
					this.datosTecnicos = {
						idServicio: '',
						dbServicio: '0',
						informacionAdicional: false,
						instancia: null,
						distribuidor: null,
						integrador: null,
						puertoServicio: 0,
						tipoLogica: 'IYS',
						tipoServicio: '0',
						endpoint: '',
						campoIdentificacion: '',
						campoSubscripcion: '',
						campoResult: '',
						campoInfAdicional: ''
					};
				}

				this.formulario.get('datosTecnicos').patchValue(this.datosTecnicos);
				this.alarmaService.setDatosTecnicos.next(this.datosTecnicos);
			},
			(error: HttpErrorResponse) => {
				this.alertMessageService.showMessage.next(
					{
						mensaje: MENSAJES.UNKNOWN_ERROR,
						tipo: "error"
					}
				);
			}
		)
	}

	private obtenerHistorialModificaciones() {
		this.workflowService.obtenerHistModificacion(this.alarma.idAlarma).subscribe(
			(response: Response) => {
				if (response.error == null) {
					this.historialModificaciones = response.objeto;

					if (this.historialModificaciones.length != 0) {
						if (this.alarma.usuarioActualiza == this.authService.getUsuario()) {
							this.alarma.usuarioActualiza = this.authService.getNombreUsuario();
							const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
							let current_datetime = new Date();
							let formatted_date = months[current_datetime.getMonth()] + " " + current_datetime.getDate() + ", " + current_datetime.getFullYear() + ", " + current_datetime.getHours() + ":" + current_datetime.getMinutes();
							this.alarma.fechaActualiza = formatted_date;
						}
					}
					else {
						this.alarma.usuarioActualiza = null;
					}

					if (this.isUserSAC) this.historialModificaciones = this.historialModificaciones.filter(
						(e) => e.tipoFlujo == 'SAC' || e.rolUsuario == 'SAC'
					);
					else if (this.isUserSIS) this.historialModificaciones = this.historialModificaciones.filter(
						(e) => e.tipoFlujo == 'SIS' || e.rolUsuario == 'SIS'
					);

				}
			},
			(error: HttpErrorResponse) => {
				this.alertMessageService.showMessage.next({
					mensaje: MENSAJES.UNKNOWN_ERROR,
					tipo: "error"
				});
			},
			() => {
				this.authService.actualizarDatosSesion();
			}
		)
	}

	checkPermissionModificarFechas() {
		let havePermission = false;

		if (((this.alarma.archivo == 'SI' && this.alarma.aprobacionSAC == 'A') ||
			(this.alarma.archivo == 'NO' && this.alarma.aprobacionSAC == 'A' && this.alarma.aprobacionSIS == 'A') ||
			(this.alarma.archivo == 'AMBOS' && this.alarma.aprobacionSAC == 'A' && this.alarma.aprobacionSIS == 'A')) &&
			this.alarma.estado == 'P') {

			havePermission = true;
		}

		return havePermission;
	}

	checkPermissionEditar() {
		let havePermission = false;

		if (this.alarma.estado != 'A') {
			if (this.authService.isUserSAC()) {
				if (this.alarma.aprobacionSAC == 'P' && this.alarma.estado == 'P') havePermission = true;
			}
			else if (this.authService.isUserAdm()) {
				if (this.alarma.estado == 'I' || (this.alarma.estado == 'P' && this.checkPermissionModificarFechas() && this.estadoSolicitante == 'L')){
					havePermission = true;
				}
			}
			else if (this.authService.isUserSol()) {
				if (this.onEditSAC || this.onEditSIS || this.checkPermissionModificarFechas())
					havePermission = true;

			}
			else if (this.authService.isUserSIS()) {
				if (this.alarma.aprobacionSIS == 'P' && this.alarma.estado == 'P') havePermission = true;
			}
		}
		else {
			if (this.authService.isUserAdm())
				havePermission = true;
		}

		return havePermission;
	}

	checkPermissionCambiarEstado() {
		let havePermission = false;

		if (this.alarma.estado != 'A') {

			if (this.authService.isUserSAC()) {
				if (this.alarma.aprobacionSAC == 'P') {
					havePermission = true;
				}
			}
			else if (this.authService.isUserSIS() && (this.alarma.archivo == 'NO' || this.alarma.archivo == 'AMBOS')) {
				if (this.alarma.aprobacionSIS == 'P') {
					havePermission = true;
				}
			}
			else if (this.authService.isUserAdm()) {
				if (this.alarma.estado == 'I') {
					havePermission = true;
				}
			}
			else if (this.authService.isUserSol()) {
				havePermission = true;
			}

		}
		else {
			if (this.authService.isUserAdm())
				havePermission = true;
		}

		return havePermission;
	}

	cambiarEstadoAlarma(estado?: string) {
		let datos = {
			idAlarma: this.alarma.idAlarma,
			estado: estado,
			rol: this.authService.getRolUsuario(),
			observacion: this.formulario.value.razonDevolucion,
			idUsuario: this.authService.getUsuario(),
			datosTecnicos: this.datosTecnicos
		};

		if (estado == 'C' || estado == 'A') {
			datos = { ...datos, observacion: this.observacioModificacion };
		}

		this.isDevolucion = false;
		this.isCancelacion = false;

		if (estado == 'C' && (this.observacioModificacion == "" || this.observacioModificacion == null)) {
			this.isCancelacion = true;
			this.placeholder = "Ingrese las razones por las que se cancelo la alarma";
			this.open(this.content);
		}
		else if (estado == 'A' && this.observacioModificacion == "" && this.authService.isUserSIS()) {
			this.isAprobacion = true;
			this.placeholder = "Comentarios de las pruebas realizadas";
			this.open(this.content);
		}
		else {
			if (estado != null) {
				this.alarmaService.cambiarEstadoAlarma(datos).subscribe(
					(response: Response) => {
						if (response.error == null) {
							this.onModificarAlarma.emit(this.alarma.idAlarma);
						}
						else {
							this.alertMessageService.showMessage.next({
								mensaje: response.error,
								tipo: "error"
							})
						}
					},
					(error: HttpErrorResponse) => {
						if (error.status === 401) {
							this.authService.sesionCaducada();
						}
					},
					() => {
						this.authService.actualizarDatosSesion();
					}
				)
			} else {
				this.isDevolucion = true;
			}
		}
	}

	cambiarEstadoModificacion(accion: string) {

		if (accion == 'F') {
			const features = this.formulario.value.features == null ? '' : this.formulario.value.features;
			const planes = this.formulario.value.planes == null ? '' : this.formulario.value.planes;

			const alarma = {
				...this.alarma,
				fechaInicio: this.formulario.value.fechaInicio,
				fechaFin: this.formulario.value.fechaFin,
				nombre: this.formulario.value.nombre,
				detalle: this.formulario.value.detalle,
				usuarioActualiza: this.authService.getUsuario(),
				condiciones: this.formulario.value.condiciones,
				observacion: this.observacioModificacion,
				idTipoAlarma: this.tipoAlarma.idTipoAlarma,
				features: (<string>features).replace(/ /g, ''),
				planes: (<string>planes).replace(/ /g, '')
			}

			let datosTecnicos = null;

			if (this.isUserSIS || this.isUserAdm) {
				datosTecnicos = this.formulario.value.datosTecnicos
			}

			if (this.authService.isUserAdm() && this.observacioModificacion == "") {
				this.placeholder = "Ingrese las razones por las que se modifico la alarma";
				this.open(this.content);
			} else {
				this.alarmaService.modificarAlarma(alarma, this.nroTramite, datosTecnicos).subscribe(
					(response: Response) => {
						if (response.error === null) {
							this.alarma = alarma;

							this.obtenerHistorialModificaciones();
							this.cargarDatosTecnicos();

							if (this.alarma.condiciones !== null) {
								this.condicionesAlarma = this.alarma.condiciones.split("\n");
							}

							if (this.authService.isUserAdm()) {
								this.onEditAdm = !this.onEditAdm;
							}

							if ((this.authService.isUserSol() || (this.authService.isUserAdm() && this.estadoSolicitante == 'L')) && this.checkPermissionModificarFechas()) {
								this.onEditSol = !this.onEditSol;
								this.onModificarAlarma.next(this.alarma.idAlarma);
								this.alertMessageService.showMessage.next({
									mensaje: MENSAJES.ALARMA_ACTIVA_AUTO,
									tipo: "success"
								});
							}

							if (this.indexObservacion != null) {
								if (this.observaciones[this.indexObservacion].rol == 'SAC') {
									this.alarma.aprobacionSAC = 'P';
									this.onEditSAC = !this.onEditSAC;
								}
								else {
									this.alarma.aprobacionSIS = 'P';
									this.onEditSIS = !this.onEditSIS;
								}

								this.observaciones[this.indexObservacion].estado = 'F';
								this.indexObservacion = null;
							}
							else {
								if (this.authService.isUserSAC()) this.onEditSAC = !this.onEditSAC;
								else if (this.authService.isUserSIS()) this.onEditSIS = !this.onEditSIS;
							}

						}
						else {
							this.alertMessageService.showMessage.next({
								mensaje: response.error,
								tipo: "error"
							})
						}
					},
					(error: HttpErrorResponse) => {
						this.alertMessageService.showMessage.next({
							mensaje: MENSAJES.UNKNOWN_ERROR,
							tipo: "error"
						})
						if (error.status == 401) this.authService.sesionCaducada()
					},
					() => {
						this.authService.actualizarDatosSesion();
					}
				);
			}

		} else {

			if (this.authService.isUserSIS() || this.authService.isUserAdm()) {
				this.formulario.setValue({
					fechaInicio: this.alarma.fechaInicio,
					fechaFin: this.alarma.fechaFin,
					nombre: this.alarma.nombre,
					detalle: this.alarma.detalle,
					razonDevolucion: '',
					condiciones: this.alarma.condiciones,
					features: this.alarma.features,
					planes: this.alarma.planes,
					datosTecnicos: this.datosTecnicos
				});
			}
			else {
				this.formulario.setValue({
					fechaInicio: this.alarma.fechaInicio,
					fechaFin: this.alarma.fechaFin,
					nombre: this.alarma.nombre,
					detalle: this.alarma.detalle,
					razonDevolucion: '',
					condiciones: this.alarma.condiciones,
					features: this.alarma.features,
					planes: this.alarma.planes
				});
			}

			if (this.authService.isUserAdm()) {
				this.onEditAdm = !this.onEditAdm;
			}

			if (this.indexObservacion != null) {
				if (this.observaciones[this.indexObservacion].rol == 'SAC') {
					this.onEditSAC = !this.onEditSAC;
				}
				else {
					this.onEditSIS = !this.onEditSIS;
				}
			}
			else {
				if (this.authService.isUserSAC()) this.onEditSAC = !this.onEditSAC;
				else if (this.authService.isUserSIS()) this.onEditSIS = !this.onEditSIS;
			}

			if (this.checkPermissionModificarFechas() && this.authService.isUserSol()) {
				this.onEditSol = !this.onEditSol;
			}

		}
	}

	onCancelarDevolucion() {
		this.isDevolucion = false;
	}

	onCambiarEstadoObservacion(index: number) {
		if (this.observaciones[index].estado != 'F' && this.authService.isUserSol() && this.alarma.estado != "A") {
			this.nroTramite = this.observaciones[index].nroTramite;
			const alm = {
				...this.alarma,
				usuarioActualiza: this.authService.getUsuario()
			}

			if (this.observaciones[index].rol == 'SAC') {
				this.onEditSAC = true;

				this.formulario.setValue({
					fechaInicio: this.alarma.fechaInicio,
					fechaFin: this.alarma.fechaFin,
					nombre: this.alarma.nombre,
					detalle: this.alarma.detalle,
					razonDevolucion: '',
					condiciones: this.alarma.condiciones,
					planes: '',
					features: ''
				});

				if ((this.alarma.archivo == 'NO' || this.alarma.archivo == 'AMBOS') && this.authService.isUserSIS()) {
					this.formulario.get('datosTecnicos').patchValue(this.datosTecnicos);
				}

			}
			else if (this.observaciones[index].rol == 'SIS') {
				this.onEditSIS = true;
				this.formulario.setValue({
					fechaInicio: this.alarma.fechaInicio,
					fechaFin: this.alarma.fechaFin,
					nombre: this.alarma.nombre,
					detalle: this.alarma.detalle,
					razonDevolucion: '',
					condiciones: this.alarma.condiciones,
					planes: '',
					features: ''
				});

				if ((this.alarma.archivo == 'NO' || this.alarma.archivo == 'AMBOS') && this.authService.isUserSIS()) {
					this.formulario.get('datosTecnicos').patchValue(this.datosTecnicos);
				}
			}

			this.indexObservacion = index;
		}
	}

	onModificarArchivo() {
		this.isProcesandoArchivo = true;
	}

	onCargarArchivo(inputFile: any) {

		const archivo = inputFile.target.files[0];
    var binaryString = archivo.target.result;

		this.isArchivoCargado = false;
		this.mensajeErrorCargaArchivo = "";
		this.nombreArchivo = archivo.name;

		this.fileService.validarArchivo(archivo).then(
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

	finalizarCarga() {
		this.isProcesandoArchivo = false;
		this.isArchivoCargado = false;
	}

	registrarInformacionCargaArchivo(resultados: ResultadosCarga) {
		const datos: InfoCargaArchivo = {
			cantRegistros: resultados.registrosProcesados,
			cantExitoso: resultados.registrosExitosos,
			cantError: resultados.registrosConErrores,
			idAlarma: this.alarma.idAlarma,
			nombreArchivo: '',
			idUsuario: this.authService.getUsuario()
		};

		this.alarmaService.registrarInformacionCargaArchivo(datos).subscribe(
			(response: Response) => {
			},
			(error: HttpErrorResponse) => {
				if (error.status == 401) this.authService.sesionCaducada();
			},
			() => {
				this.authService.actualizarDatosSesion();
			}
		)
	}


	open(content) {
		this.observacioModificacion = "";
		this.modalReference = this.modalService.open(content);
		this.modalReference.result.then((result) => {
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

	confirmarModificacion() {
		this.errorModificacion = false;
		if (this.observacioModificacion == "") {
			this.errorModificacion = true;
		}

		else {
			if (this.isCancelacion) {
				this.cambiarEstadoAlarma('C');
				this.modalReference.close();
				this.isCancelacion = false;
			}
			else if (this.isAprobacion) {
				this.cambiarEstadoAlarma('A');
				this.modalReference.close();
				this.isAprobacion = false;
			}
			else {
				this.cambiarEstadoModificacion('F');
				this.modalReference.close();
				this.observacioModificacion = "";
			}
			this.errorModificacion = false;
		}
	}

	onChangeTipoAlarma(tipoAlarma) {
		const idTipo = tipoAlarma.target.value;
		this.tipoAlarma = this.listaTiposAlarmas.find((e) => e.idTipoAlarma == idTipo);
	}

	cerrarModal() {
		this.modalService.dismissAll('Cross click');
		this.isCancelacion = false;
		this.observacioModificacion = "";
		this.errorModificacion = false;
	}
}
