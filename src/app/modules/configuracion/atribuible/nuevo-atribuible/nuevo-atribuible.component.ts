import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Response } from 'src/app/core/models/response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertMessagesService } from 'src/app/shared/services/alert-messages.service';

import { UNKNOWN_ERROR } from 'src/app/core/properties/messages.parameters';
import * as PARAMETROS from '../../../../core/properties/parametros.parameter';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Configuracion } from 'src/app/core/models/configuracion.model';
import { ConfiguracionService } from 'src/app/core/services/configuracion.service';

@Component({
  selector: 'app-nuevo-atribuible',
  templateUrl: './nuevo-atribuible.component.html',
  styleUrls: ['./nuevo-atribuible.component.scss']
})
export class NuevoAtribuibleComponent implements OnInit {
  atribuibles: Configuracion[] = [];
  isSearch:boolean = false;
  nombreAtribuible: string = '';
	usuarioRegistro: string;
  idGrupo = PARAMETROS.ID_CATALOGO_ATRIBUIBLE;7

  constructor(private authService: AuthService,
      private configuracionService: ConfiguracionService,
      private alertMessageService: AlertMessagesService,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.usuarioRegistro = this.authService.getUsuario();
    if(this.data.atribuible != null){
      this.nombreAtribuible = this.data.atribuible.descripcion;
    }
  }

  onBuscarAtribuible(e) {
      this.isSearch = false;
      this.atribuibles = [];

      const value = (<string>e.target.value).toUpperCase();
      this.nombreAtribuible = value;
      this.configuracionService.buscarConfiguracion(value,this.idGrupo).subscribe(
        (response: Response) => {
          this.isSearch = true;
          if(response.error == null){
            this.atribuibles = response.objeto;
          }
          else if(response.error == 'ERROR'){
            this.alertMessageService.showMessage.next({
              mensaje: response.objeto,
              tipo: "error"
            })
          }
        }
      );
  }

  crearNuevoAtribuible(){
    this.configuracionService.crearConfiguracion(this.nombreAtribuible,this.idGrupo,this.usuarioRegistro).subscribe(
      (response: Response) => {
        if(response.error == null){
          this.alertMessageService.showMessage.next(
            {
              mensaje: 'Atribuible registrado correctamente',
              tipo: 'success'
            }
          );
          this.configuracionService.nuevaConfiguracion.next();
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

  modificarNombreAtribuible(idAtribuible: number){
    this.configuracionService.modificarNombre(idAtribuible,this.nombreAtribuible,this.usuarioRegistro).subscribe(
      (response: Response) => {
        if(response.error == null){
          this.alertMessageService.showMessage.next(
            {
              mensaje: 'Atribuible modificado correctamente',
              tipo: 'success'
            }
          );
          this.configuracionService.nuevaConfiguracion.next();
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
    );
    }

}
