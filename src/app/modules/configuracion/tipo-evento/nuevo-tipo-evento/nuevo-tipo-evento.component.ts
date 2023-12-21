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
  selector: 'app-nuevo-tipo-evento',
  templateUrl: './nuevo-tipo-evento.component.html',
  styleUrls: ['./nuevo-tipo-evento.component.scss']
})
export class NuevoTipoEventoComponent implements OnInit {
  tipoEventos: Configuracion[] = [];
  isSearch:boolean = false;
  nombreTipoEvento: string = '';
	usuarioRegistro: string;
  idGrupo = PARAMETROS.ID_CATALOGO_TIPO_EVENTO;

  constructor(private authService: AuthService,
      private configuracionService: ConfiguracionService,
      private alertMessageService: AlertMessagesService,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.usuarioRegistro = this.authService.getUsuario();
    if(this.data.tipoEvento != null){
      this.nombreTipoEvento = this.data.tipoEvento.descripcion;
    }
  }

  onBuscarTipoEvento(e) {
      this.isSearch = false;
      this.tipoEventos = [];

      const value = (<string>e.target.value).toUpperCase();
      this.nombreTipoEvento = value;
      this.configuracionService.buscarConfiguracion(value,this.idGrupo).subscribe(
        (response: Response) => {
          this.isSearch = true;
          if(response.error == null){
            this.tipoEventos = response.objeto;
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

  crearNuevoTipoEvento(){
    this.configuracionService.crearConfiguracion(this.nombreTipoEvento,this.idGrupo,this.usuarioRegistro).subscribe(
      (response: Response) => {
        if(response.error == null){
          this.alertMessageService.showMessage.next(
            {
              mensaje: 'TipoEvento registrado correctamente',
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

  modificarNombreTipoEvento(idTipoEvento: number){
    this.configuracionService.modificarNombre(idTipoEvento,this.nombreTipoEvento,this.usuarioRegistro).subscribe(
      (response: Response) => {
        if(response.error == null){
          this.alertMessageService.showMessage.next(
            {
              mensaje: 'TipoEvento modificado correctamente',
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
