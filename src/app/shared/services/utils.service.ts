import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as WS from '../../core/properties/url-web-services.parameter';

@Injectable()
export class UtilService{
	constructor(private http: HttpClient){}

	reemplazarParametros(cadena:string, parametros:string[]){

			parametros.forEach((param, i) => {
				const pos = cadena.indexOf('<%x%>');
				cadena =  cadena.slice(0,pos) + cadena.slice(pos+5);
				cadena = [cadena.slice(0,pos), param, cadena.slice(pos)].join('');
			});

			return cadena;
	}

	obtenerParametro(parametro: string){
		return this.http.get(WS.OBTENER_PARAMETRO + parametro);
	}
	
}