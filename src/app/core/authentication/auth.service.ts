import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import * as WS from '../properties/url-web-services.parameter';
import * as PARAM from '../properties/parametros.parameter';

import { Usuario } from '../models/usuario.model';
import { Response } from '../models/response.model';

export interface ModuloUsuario {
	idModulo: string,
	nombre: string,
	path: string,
	rol?: string
}

export interface DatosSesion {
	token: string,
	user: string,
	modulosUsuario?: ModuloUsuario[],
	nombreUsuario: string,
	codigoArea: string,
	nombreArea:string
}

@Injectable()
export class AuthService {
	public mensajeError: Subject<string> = new Subject<string>();
	private loginState: boolean = false;
	private minutosExpiracion = 30;
	public nuevoUsuario: Subject<any> = new Subject();

	constructor(private http: HttpClient,
		private router: Router) { }

	public login(usuario: Usuario) {
		return new Promise((resolve, reject) => {
			this.http.post(WS.LOGIN, usuario).subscribe(
				(respuesta: Response) => {

					if (respuesta.error == null) {
						this.loginState = true;

						const token = respuesta.objeto.token;
						const modulosUsuario: ModuloUsuario[] = respuesta.objeto.modulosUsuario;
						const nombreUsuario = respuesta.objeto.nombreUsuario;

						const tiempoExpiracion = new Date(new Date().getTime() + this.minutosExpiracion * 60 * 1000);
						const datosSesion: DatosSesion = {
							token: token,
							user: usuario.username,
							modulosUsuario: modulosUsuario,
							nombreUsuario: nombreUsuario,
							codigoArea: respuesta.objeto.codigoArea,
							nombreArea: respuesta.objeto.nombreArea
						};


						localStorage.setItem(PARAM.USER_TOKEN_COOKIE, JSON.stringify(datosSesion));
						localStorage.setItem(PARAM.TIEMPO_EXPIRACION_SESION, tiempoExpiracion.getTime().toString());

						this.http.get(WS.OBTENER_PARAMETRO + PARAM.TIEMPO_SESION).subscribe(
							(response: Response) => {
								if (response.error == null) {
									const tiempoExpiracion = response.objeto;
									localStorage.setItem(PARAM.MINUTOS_EXPIRACION_SESION, tiempoExpiracion);
								}
							}
						)
					}
					else {
						this.loginState = false;
						this.mensajeError.next(respuesta.error);
					}

					resolve(this.loginState);
				},
				(error: HttpErrorResponse) => {
					reject(error)
				}
			)
		});
	}

	public logout() {
		return new Promise((resolve, reject) => {
			const token = this.getToken();

			this.http.post(WS.LOGOUT, { token: token })
				.subscribe(
					(respuesta: Response) => {
						if (respuesta.error != null) {
							reject("Error al cerrar sesion");
						}
						else {
							localStorage.removeItem(PARAM.USER_TOKEN_COOKIE);
							localStorage.removeItem(PARAM.MINUTOS_EXPIRACION_SESION);
							localStorage.removeItem(PARAM.TIEMPO_EXPIRACION_SESION);
							localStorage.removeItem(PARAM.USER_TOKEN_COOKIE);
							this.router.navigate(['login']);
							resolve();
						}
					}
				);
		});
	}

	public isAuthenticated(): boolean {
		return this.loginState;
	}

	public sesionCaducada() {
		this.router.navigate(['login']);
		alert('Su sesion ha caducado');
	}

	public getAreasClaro(){
		return this.http.get(WS.OBTENER_AREAS_CLARO);
	}

	public checkHavePermission(path: string): boolean {
		const modulosUsuario = this.getModulosUsuario();
		const havePermission = modulosUsuario.map((e) => e.path).includes(path);
		return havePermission;
	}

	public buscarUsuario(nombre: string) {
		return this.http.get(WS.BUSCAR_USUARIOS_OPE + nombre);
	}

	public informacionUsuarioIAM(idUsuario: string){
		return this.http.get(WS.OBTENER_INFORMACION_IAM + idUsuario);
	}

	public crearUsuario(usuario: Usuario, rol: string) {
		return this.http.post(WS.CREAR_USUARIO, {
			usuario,
			rol
		})
	}

	public cambiarEstadoUsuario(usuario: string, estado:string){
		return this.http.post(WS.CAMBIAR_ESTADO_USUARIO, {
			usuario,estado
		})
	}

	public modificarPermisosUsuario(usuario:string, rol: string){
		return this.http.put(WS.MODIFICAR_PERMISOS_USUARIO, {
			usuario,
			rol
		});
	}

	public

	public getToken() {
		return (<DatosSesion>JSON.parse(localStorage.getItem(PARAM.USER_TOKEN_COOKIE))).token
	}

	public getUsuario() {
		return (<DatosSesion>JSON.parse(localStorage.getItem(PARAM.USER_TOKEN_COOKIE))).user
	}

	public getNombreUsuario() {
		return (<DatosSesion>JSON.parse(localStorage.getItem(PARAM.USER_TOKEN_COOKIE))).nombreUsuario;
	}

	public getCodigoAreaUsuario(){
		return (<DatosSesion>JSON.parse(localStorage.getItem(PARAM.USER_TOKEN_COOKIE))).codigoArea;
	}

	public getNombreArea(){
		return (<DatosSesion>JSON.parse(localStorage.getItem(PARAM.USER_TOKEN_COOKIE))).nombreArea;
	}

	public getModulosUsuario() {
		return (<DatosSesion>JSON.parse(localStorage.getItem(PARAM.USER_TOKEN_COOKIE))).modulosUsuario;
	}

	public getUsuariosPermitidos() {
		return this.http.get(WS.USUARIOS_PERMITIDOS);
	}

	public getRolUsuario() {
		return (<DatosSesion>JSON.parse(localStorage.getItem(PARAM.USER_TOKEN_COOKIE))).modulosUsuario[0].rol;
	}

	public isUserSIS() {
		return (<DatosSesion>JSON.parse(localStorage.getItem(PARAM.USER_TOKEN_COOKIE))).modulosUsuario[0].rol == 'ALM_SIS';
	}

	public isUserSAC() {
		return (<DatosSesion>JSON.parse(localStorage.getItem(PARAM.USER_TOKEN_COOKIE))).modulosUsuario[0].rol == 'ALM_SAC';
	}

	public isUserAdm() {
		return (<DatosSesion>JSON.parse(localStorage.getItem(PARAM.USER_TOKEN_COOKIE))).modulosUsuario[0].rol == 'ALM_ADM';
	}

	public isUserSol() {
		return (<DatosSesion>JSON.parse(localStorage.getItem(PARAM.USER_TOKEN_COOKIE))).modulosUsuario[0].rol == 'ALM_SOL';
	}

	public isSessionFinished() {
		const fechaActual = new Date();
		const tiempoExpiracion = new Date(parseInt(localStorage.getItem(PARAM.TIEMPO_EXPIRACION_SESION)));
		return tiempoExpiracion < fechaActual;
	}

	public actualizarDatosSesion() {
		const minutosSesion = parseInt(localStorage.getItem(PARAM.MINUTOS_EXPIRACION_SESION));
		const tiempoExpiracion = new Date(new Date().getTime() + minutosSesion * 60 * 1000);
		localStorage.setItem(PARAM.TIEMPO_EXPIRACION_SESION, tiempoExpiracion.getTime().toString());

		const fechaActual = new Date();
	}
}
