export interface Workflow {
	idWorkflow?: number,
	idUsuario: string,
	fechaSolicita?: string,
	fechaTermino?: string,
	estado?: string,
	observacion: string
}

export interface DatosAprobacion {
	rol: string,
	nombreUsuario: string,
	fechaAprobacionUsuario: string
	fechaAprobacionAlm: string,
	observacion: string
}

export interface DatosCancelacion{
	razonCancelacion: string,
	fecha: string
}

export interface FlujoAlarma {
	etapa: string,
	fecha: string
}

export interface HistModificacion {
	campo: string;
	valor: string;
	fecha: string;
	usuario: string;
	rolUsuario: string;
	tipoFlujo: string;
	observaciones: string;
} 