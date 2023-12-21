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
  selector: 'app-nuevo-tipo-problema',
  templateUrl: './nuevo-tipo-problema.component.html',
  styleUrls: ['./nuevo-tipo-problema.component.scss']
})
export class NuevoTipoProblemaComponent implements OnInit {
  tipoProblemas: Configuracion[] = [];
  isSearch:boolean = false;
  nombreTipoProblema: string = '';
	usuarioRegistro: string;
  idGrupo = PARAMETROS.ID_CATALOGO_TIPO_PROBLEMA;

  constructor(private authService: AuthService,
      private configuracionService: ConfiguracionService,
      private alertMessageService: AlertMessagesService,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.usuarioRegistro = this.authService.getUsuario();
    if(this.data.tipoProblema != null){
      this.nombreTipoProblema = this.data.tipoProblema.descripcion;
    }
  }

  onBuscarTipoProblema(e) {
      this.isSearch = false;
      this.tipoProblemas = [];

      const value = (<string>e.target.value).toUpperCase();
      this.nombreTipoProblema = value;
      this.configuracionService.buscarConfiguracion(value,this.idGrupo).subscribe(
        (response: Response) => {
          this.isSearch = true;
          if(response.error == null){
            this.tipoProblemas = response.objeto;
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

  crearNuevoTipoProblema(){
    this.configuracionService.crearConfiguracion(this.nombreTipoProblema,this.idGrupo,this.usuarioRegistro).subscribe(
      (response: Response) => {
        if(response.error == null){
          this.alertMessageService.showMessage.next(
            {
              mensaje: 'TipoProblema registrado correctamente',
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

  modificarNombreTipoProblema(idTipoProblema: number){
    this.configuracionService.modificarNombre(idTipoProblema,this.nombreTipoProblema,this.usuarioRegistro).subscribe(
      (response: Response) => {
        if(response.error == null){
          this.alertMessageService.showMessage.next(
            {
              mensaje: 'TipoProblema modificado correctamente',
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
