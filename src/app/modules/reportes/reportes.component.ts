import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AlarmaReporte } from 'src/app/core/models/alarmas.model';
import { AlarmaService } from 'src/app/core/services/alarma.service';
import { Response } from 'src/app/core/models/response.model';
import { AuthService } from 'src/app/core/authentication/auth.service';
import * as FILTERS from 'src/app/core/properties/filtro-alarmas.parameters';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';

import { FileService } from 'src/app/core/services/file.service';
import { AlertMessagesService } from 'src/app/shared/services/alert-messages.service';
import { WorkflowService } from 'src/app/core/services/workflow.service';
import { FlujoAlarma } from 'src/app/core/models/workflow.model';
import { UtilService } from 'src/app/shared/services/utils.service';
import { Subscripcion } from 'src/app/core/models/subscripcion.model';
import * as MENSAJES from 'src/app/core/properties/messages.parameters';
import { JEIS_RESPONSE } from 'src/app/core/models/framework.model';
import { Area } from 'src/app/core/models/usuario.model';

interface Filtros{
	fechaInicio: string,
	fechaFin: string,
	estado: string
}

@Component({
	selector: 'app-reportes',
	templateUrl: './reportes.component.html',
	styleUrls: ['./reportes.component.scss'],
	animations: [
		trigger('showDetail', [
			state('show', style({
				height: '175px'
			})),
			state('hide', style({
				height: '0px'
			})),
			transition('show => hide', [
				animate('.2s')
			]),
			transition('hide => show', [
				animate('.2s')
			])
		]),
		trigger('showFilter', [
			state('show', style({
				height: '80px'
			})),
			state('hide', style({
				height: '0px'
			})),
			transition('show => hide', [
				animate('.2s')
			]),
			transition('hide => show', [
				animate('.2s')
			])
		])
	]
})
export class ReportesComponent implements OnInit {

	listaAlarmas: AlarmaReporte[] = [];
	states: any;
	isLoadingAlarmas: boolean = true;
	closeResult: string;
	showFilter:boolean = false;
	totalAlarmas: number;
	filtros: Filtros = {
		estado: '',
		fechaFin: '',
		fechaInicio: ''
	};
	paginaActual = 1;
	nroAlarmasCargadas: number = 0;
	opcionPaginacion: string = "mas";
	nroAlarmasCargadasAnterior: number;
	private listaAreas: Area[];

	constructor(private alarmaService: AlarmaService,
		private authService: AuthService,
		private workflowService: WorkflowService,
		private alertMessageService: AlertMessagesService,
		private fileService: FileService,
		private modalService: NgbModal,
		private utilService: UtilService) { }

	ngOnInit() {
		this.obtenerAlarmas("");
	}

	obtenerAlarmas(filtros?: string){
		const getAreas = new Promise((resolve, reject) => {
			this.authService.getAreasClaro().subscribe(
				(response: JEIS_RESPONSE) => {
					if(response.pnerrorOut == 0 && response.pvresultadoOut != ''){
						this.listaAreas = (<Area[]>response.pvresultadoOut.datos.registro);
						resolve();
					}
				}
			)
		});


		this.workflowService.getNroAlarmasAprobadas(filtros).subscribe(
			(response: Response) => {

				if(response.error == null){
					this.totalAlarmas = response.objeto;
				}
			},
			(error: HttpErrorResponse) => {
				this.alertMessageService.showMessage.next({
					mensaje: MENSAJES.UNKNOWN_ERROR,
					tipo: "error"
				})
			}
		);

		this.alarmaService.getAlarmasReporte(filtros, this.paginaActual).subscribe(
			(response: Response) => {

				if (response.error == null) {

					getAreas.then(() => {
						this.listaAlarmas = (<AlarmaReporte[]>response.objeto).map((e) => {
							return {...e,
								nombre: e.nombre.toUpperCase(),
								detalle: e.detalle.toLowerCase(),
								areaSolicitante: (this.listaAreas.find((l) => l.codigo == e.usuarioSolicitante.substr(0, e.usuarioSolicitante.indexOf(' ')))).nombre
							  }
						});

						if(this.opcionPaginacion == "mas"){
							this.nroAlarmasCargadas = this.nroAlarmasCargadas + this.listaAlarmas.length;
							this.nroAlarmasCargadasAnterior =  this.listaAlarmas.length;
						}
						else{
							this.nroAlarmasCargadas = this.nroAlarmasCargadas - this.nroAlarmasCargadasAnterior;
						}

						this.states = this.listaAlarmas.map(() => 'hide');
					})
				}
			},
			(error: HttpErrorResponse) => {
				if (error.status == 401) this.authService.sesionCaducada();
				if (error.status == 0) this.alertMessageService.showMessage.next({
					mensaje: 'Ocurrio un error inesperado',
					tipo: "error"
				});
			},
			() => {
				this.isLoadingAlarmas = false;
				this.authService.actualizarDatosSesion();
			}
		);
	}

	mostrarMas(){
		this.opcionPaginacion = "mas";
		this.paginaActual++;
		this.isLoadingAlarmas = true;
		this.obtenerAlarmas('');
	}

	mostrarMenos(){
		this.opcionPaginacion = "menos";
		this.paginaActual--;
		this.isLoadingAlarmas = true;
		this.obtenerAlarmas("");
	}

	showDetail(i: number) {
		this.states[i] = this.states[i] == 'hide' ? 'show' : 'hide';
	}

	onGenerarReporte() {
		this.fileService.crearReporteGeneral(this.listaAlarmas);
	}

	open(content) {
	this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
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

	onFilter(e:any, tipoFiltro: string){
		const value = e.target.value;

		if(tipoFiltro == "fechaInicio"){
			this.filtros.fechaInicio = value;
		}
		else if(tipoFiltro == "fechaFin"){
			this.filtros.fechaFin = value;
		}else if(tipoFiltro == "estado"){
			this.filtros.estado = value;
		}

		let cadenaFiltros = "";
		const parametros = [];

		if(this.filtros.fechaInicio != ""){
			cadenaFiltros = cadenaFiltros + FILTERS.REPORTE_FECHA_INICIO;
			parametros.push(this.filtros.fechaInicio);
		}
		if(this.filtros.fechaFin != ""){
			cadenaFiltros = cadenaFiltros + FILTERS.REPORTE_FECHA_FIN;
			parametros.push(this.filtros.fechaFin);
		}

		if(this.filtros.estado != ""){
			cadenaFiltros = cadenaFiltros + FILTERS.REPORTE_ESTADO;
			parametros.push(this.filtros.estado);
		}

		const filtros = this.utilService.reemplazarParametros(cadenaFiltros, parametros);
		this.nroAlarmasCargadas = 0;
		this.paginaActual = 1;
		this.obtenerAlarmas(filtros);
	}

	onShowFilters(){
		this.showFilter = !this.showFilter;
	}

	onDescargarReporteErrores(idAlarma: number){
		this.alarmaService.getSubscripciones('E', idAlarma).subscribe(
			(response: Response) => {
				if(response.error == null){
					const datos:Subscripcion[] = response.objeto;
					const idArchivo = datos[0].idArchivo;
					const idAlarma = datos[0].idAlarma;
					const nombreArchivo = datos[0].nombreArchivo;
					this.fileService.crearReporteErrores(
						datos,
						idArchivo,
						nombreArchivo,
						idAlarma
					);
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
