import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService, ModuloUsuario } from 'src/app/core/authentication/auth.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	error: string = '';
	modulosUsuario: ModuloUsuario[] = [];
	idAdministracion = "ADA";
	nombreUsuario: string;
	rolUsuario: string;

	constructor(private router: Router,
		private authSer: AuthService) { }

	ngOnInit() {
		this.modulosUsuario = this.authSer.getModulosUsuario();
		this.router.navigate([this.modulosUsuario[0].path]);
		const rol = this.authSer.getRolUsuario().substr(4);

		// if(rol == "SOL"){
			this.nombreUsuario = this.authSer.getNombreUsuario();
		// }
		// else
			// this.nombreUsuario = rol + " " + this.authSer.getNombreUsuario();

		switch(rol){
			case 'SAC': this.rolUsuario = 'Customer'; break;
			case 'SIS': this.rolUsuario = 'Sistemas'; break;
			case 'SOL': this.rolUsuario = 'Solicitante'; break;
			case 'ADM': this.rolUsuario = 'Administrador'; break;
		}

	}

	onLogout() {
		this.authSer.logout().catch(
			(error: string) => this.error = error
		);
	}

	isAccess(idModulo): boolean{
		return true;
	}

}
