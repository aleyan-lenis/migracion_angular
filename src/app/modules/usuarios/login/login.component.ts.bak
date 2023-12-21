import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Usuario } from 'src/app/core/models/usuario.model';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

   public isLoading = false;
   public errorLogin = false;
   public mensajeError = '';

	@ViewChild('inputUser') inputUser: ElementRef;

   constructor(private authService: AuthService,
               private router: Router) { }

	ngOnInit() {
      this.authService.mensajeError.subscribe(
         (error: string) => this.mensajeError = error
      );
	}

	public onLogin(form: NgForm) {
      this.resetAttrs();

		const userInput = (<string>this.inputUser.nativeElement.value).toUpperCase();
		this.inputUser.nativeElement.value = userInput;

		const usuario: Usuario = {
			username: (<string>form.value.usuario).toUpperCase().trim(),
			password: (<string>form.value.password).trim()
		};

      this.authService.login(usuario)
      .then(
         (isLogin: boolean) => {
            if(isLogin){
               this.router.navigate(['home']);
            }
            else{
               this.errorLogin = true;
            }
         }
      )
      .catch(
         (error: HttpErrorResponse) => {
				this.errorLogin = true;
				if(error.status == 0)
					this.mensajeError = 'Error al conectarse con el servidor';
				else
            	this.mensajeError = 'Ocurrio un error inesperado'
         }
      )
      .finally(() => this.isLoading = false);
   }
   
   private resetAttrs(){
      this.isLoading = true;
      this.errorLogin = false;
      this.mensajeError = '';
   }

}
