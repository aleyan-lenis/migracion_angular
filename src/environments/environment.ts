// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // JEIS_BUSCAR_USUARIOS: "J1216942",
  // JEIS_BUSCAR_AREAS: 'J1216944',
  JEIS_VERIFICA_ESTADO_SOL: 'J1216948',
  JEIS_CONSULTA_INFO: 'J133855',
  JEIS_CONSULTA_CIUDAD: 'J133850',
  JEIS_CONSULTA_TECNOLOGIA: 'J133851',
  JEIS_CONSULTA_NIVEL1: 'J133852',
  JEIS_CONSULTA_NIVEL2: 'J133853',
  JEIS_CONSULTA_NIVEL3o4: 'J133854',

  // JEIS_OPERACIONES_JDBC: "jdbc/jeisOperd",
  JEIS_AXIS_JDBC: "jdbc/axisd",
  JEIS_AXISD_JDBC: 'jdbc/jeisAxisd',
  JEIS_CLAROVIDEO03_JDBC: 'jdbc/JeisClaroVideo03',

  URL_JEIS: 'http://192.168.37.40:50004/jeis/resources/ws/eipConsumeServicioM',
  // API_URL: 'http://192.168.0.192:7001/Gestion-alarmas/api/',
  //API_URL: 'http://localhost:7001/Gestion-alarmas/api/',
  API_URL: 'http://localhost:8080/WS_alertas_masivas_api/api/',
  // IAM_URL: 'http://192.168.37.146:8080/v1/userinfo'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.