export interface Usuario {
	username:string,
	password?:string,
	nombre?:string,
	correo?:string,
	rol?:string,
	fechaDesde?:string,
	estado?:string,
	position?: number,
	fechaActualizacion?: string,
	departamento?:string,
	nombre_departamento?: string,
	cod_trabajador?:string,
	externo?:boolean
}

export interface Area{
	codigo: string,
	nombre: string
}