import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Usuario } from 'src/app/core/models/usuario.model';
import { Response } from 'src/app/core/models/response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertMessagesService } from 'src/app/shared/services/alert-messages.service';
import { JEIS_RESPONSE } from 'src/app/core/models/framework.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UNKNOWN_ERROR } from 'src/app/core/properties/messages.parameters';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.scss']
})
export class NuevoUsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuarioElejido: Usuario;
  isSearch:boolean = false;
  rolUsuario:string;
  nombreUsuario: string = '';

  constructor(private authService: AuthService,
      private alertMessageService: AlertMessagesService,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if(this.data.usuario != null){
      this.rolUsuario = this.data.usuario.rol;
    }
  }

  onBuscarUsuario(e) {
    if(e.keyCode == 13){
      this.isSearch = false;
      this.usuarios = [];

      const value = (<string>e.target.value).toUpperCase();
      this.authService.buscarUsuario(value).subscribe(
        (response: JEIS_RESPONSE) => {
          this.isSearch = true;
          if(response.pnerrorOut == 0 && response.pvresultadoOut != ''){
            if(Array.isArray(response.pvresultadoOut.datos.registro)){
              this.usuarios = response.pvresultadoOut.datos.registro;  
            }
            else{
              this.usuarios.push(response.pvresultadoOut.datos.registro);
            }
          }
        }
      );
    }
  }

  chooseUsuario(codigoUsuario){
    this.usuarioElejido = this.usuarios.find((e) => e.username == codigoUsuario);
    this.nombreUsuario = this.usuarioElejido.nombre;
    this.isSearch = false;
  }

  crearNuevoUsuario(){

    this.authService.informacionUsuarioIAM(this.usuarioElejido.username).subscribe(
      (response: any) => {
        this.usuarioElejido.username = (<string>(<any[]>response.userAssets).find((e) => e.type == 'WINDOWS').userID).toUpperCase();
        this.usuarioElejido.username = this.usuarioElejido.username;

        this.authService.crearUsuario(this.usuarioElejido, this.rolUsuario).subscribe(
          (response: Response) => {
            if(response.error == null){
              this.alertMessageService.showMessage.next(
                {
                  mensaje: 'Usuario registrado correctamente',
                  tipo: 'success'
                }
              )
              this.authService.nuevoUsuario.next();
            }
            else if(response.error == 'ERROR'){
              this.alertMessageService.showMessage.next({
                mensaje: response.objeto,
                tipo: "error"
              })
            }
          }
        )
      }
    );
  }

  modificarUsuario(){
    this.authService.modificarPermisosUsuario(this.data.usuario.username, this.rolUsuario).subscribe(
      (response: Response) => {
        if(response.error == null){
          this.alertMessageService.showMessage.next(
            {
              mensaje: 'Usuario modificado correctamente',
              tipo: 'success'
            }
          );

          this.authService.nuevoUsuario.next();
        }
        else if (response.error == 'ERROR'){
          this.alertMessageService.showMessage.next({
            mensaje: response.objeto,
            tipo: "error"
          })
        }
      },
      (error: HttpErrorResponse) => {
        this.alertMessageService.showMessage.next(
          {
            mensaje: UNKNOWN_ERROR,
            tipo: "error"
          }
        )
      }
    ) 
  }
}
