export const TODAS = "ORDER BY A.FECHA_FIN, A.FECHA_REGISTRO DESC";

export const ESTADO_ACTIVO_SIN_ARCHIVO = `AND A.ESTADO = 'A' 
														AND A.FECHA_FIN >= SYSDATE 
														ORDER BY A.FECHA_FIN"`;

export const ESTADO_ACTIVO_CON_ARCHIVO = `AND A.ESTADO = 'A' 
														AND (A.FECHA_FIN >= SYSDATE OR A.FECHA_FIN IS NULL)
														AND A.ARCHIVO = 'SI'
														ORDER BY A.FECHA_FIN`;

export const ESTADO_INACTIVO = ` AND (A.ESTADO = 'I' OR A.FECHA_FIN < SYSDATE)
											ORDER BY A.FECHA_FIN`;

export const ESTADO_PENDIENTE_ORDEN_REGISTRO = `AND A.ESTADO = 'P'
																			ORDER BY A.FECHA_REGISTRO DESC`;

export const GET_ALARMA_BY_ID = `AND A.ID_ALARMA = `;

export const REPORTE_FECHA_INICIO = ` AND A.FECHA_INICIO >= TO_DATE('<%x%>', 'YYYY-MM-DD') `;

export const REPORTE_FECHA_FIN = ` AND A.FECHA_FIN <= TO_DATE('<%x%>', 'YYYY-MM-DD') `;

export const REPORTE_ESTADO = ` AND A.ESTADO = '<%x%>' `;