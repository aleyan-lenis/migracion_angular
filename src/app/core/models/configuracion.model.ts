import { NumberSymbol } from "@angular/common";

export interface Configuracion {
	id_catalogo:number,
	descripcion:string,
	id_estado:string,
	usuario_creacion:string,
	fecha_creacion:string,
	usuario_modificiacion:string,
	fecha_modificacion:string,
  position?: number
}

export interface AlarmaSGA {
  id_ticket?:number,
	estado?:string,
	fecha_inicio?:string,
	hora_inicio?:string,
	fecha_fin?:string,
	hora_fin?:string,
	severidad?:string,
  fecha_pos_sol?: string,
  tiempo_pos_sol?: string,
  atencion_asesor?: number,
  alarmado_por?: string,
  tipo_evento?: string,
  id_ticket_NOC?: number,
  atribuible?: string,
  detalle?: string,
  tipo_prob?: string,
  confirmacion_NOC?: string,
  activa_voceo?: number,
  usuario_ingreso?: string,
  fecha_ingreso?: string,

  // datos tecnicos
  id_ciudad?: number,
  id_tecnologia?: number,
  ciudad?: string,
  tecnologia?: string,
  nivel1?: string,
  id_nivel1?: number,
  nivel2?: string,
  id_nivel2?: number,
  nivel3?: string,
  id_nivel3?: number,
  nivel4?: string,
  id_nivel4?: number,

  cantidad_incidentes?: number,
  fecha_ult_incidente?:string,
  servicio_afectado?:string,
  id_tipo_evento?:number,
  usuario_modificacion?: string,
  fecha_modificacion?: string,

  cantidad_afectados?: number,
  numero_ingresos?: number,

  // servicios afectados
  srv_internet?: number,
  srv_telefonia?: number,
  srv_television?: number,

  hora_actualizacion?: string,
  tiempo_trabajado?: number,
  dias_trabajados?: number,
  position?: number
}

export interface Nivel {
  id_det_pla_ext?: string,
  dato_equipo?: string,
}
