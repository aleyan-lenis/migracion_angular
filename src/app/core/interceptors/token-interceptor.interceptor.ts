import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Cookie from 'js-cookie'

import * as PARAM from '../properties/parametros.parameter';
import { AuthService } from '../authentication/auth.service';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	constructor(private authService: AuthService){}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (localStorage.getItem(PARAM.USER_TOKEN_COOKIE) != null) {
			this.authService.actualizarDatosSesion();

			if(request.url == environment.URL_JEIS){
				request = request.clone();
			}
			else{
				request = request.clone({
					setHeaders: {
						'Authorization': this.authService.getToken()
					}
				});
			}
			
		}

		return next.handle(request);
	}
}