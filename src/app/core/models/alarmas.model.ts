export interface Alarma {
	idAlarma?: number,
	nombre: string,
	detalle: string,
	idTipoAlarma: number,
	fechaInicio: string,
	fechaFin: string,
	usuarioSolicitante: string,
	usuarioRegistro: string,
	fechaRegistro?: string,
	usuarioActualiza?: string,
	fechaActualiza?: string,
	observacion?: string,
	estado?: string,
	condiciones: string,
	datoTecnico?: string,
	archivo?: string,
	aprobacionSIS?: string,
	aprobacionSAC?: string,
	color?: string,
	tipoAlarma?: string,
	features?: string,
	planes?: string
}

export interface TipoAlarma {
	idTipoAlarma?: number,
	orden?: number,
	tipo: string,
	color: string,
	observacion?: string,
	estado?: string,
	usuarioRegistro?: string,
	usuarioActualiza?: string,
	fechaRegistro?: string,
	fechaActualiza?: string
}

export interface DatosArchivo {
	cantRegistro: number,
	cantExitosos: number,
	cantErrores: number,
	idArchivo: number
}

export interface DatosTecnicos {
	idServicio: string,
	tipoServicio: string,
	puertoServicio: number,
	dbServicio: string,
	instancia: string,
	distribuidor: string,
	integrador: string,
	tipoLogica: string,
	informacionAdicional: boolean,
	endpoint: string,
	campoIdentificacion: string,
	campoSubscripcion: string,
	campoResult: string,
	campoInfAdicional: string
}

export interface AlarmaReporte {
	idAlarma: number,
	nombre: string,
	detalle: string,
	fechaInicio: string,
	fechaFin: string,
	usuarioSolicitante: string,
	usuarioRegistro: string,
	fechaRegistro: string,
	usuarioActualiza: string,
	fechaActualiza: string,
	observacion: string,
	estado: string,
	condiciones: string,
	datoTecnico: string,
	archivo: string,
	color: string,
	tipoAlarma: string,
	usuarioSIS: string,
	usuarioSAC: string,
	fechaAprobSAC: string,
	fechaAprobSIS: string,
	prioridad: number;
	hasError: number,
	areaSolicitante?: string
}