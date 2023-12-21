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
  selector: 'app-nuevo-detalle',
  templateUrl: './nuevo-detalle.component.html',
  styleUrls: ['./nuevo-detalle.component.scss']
})
export class NuevoDetalleComponent implements OnInit {
  detalles: Configuracion[] = [];
  isSearch:boolean = false;
  nombreDetalle: string = '';
	usuarioRegistro: string;
  idGrupo = PARAMETROS.ID_CATALOGO_DETALLE;

  constructor(private authService: AuthService,
      private configuracionService: ConfiguracionService,
      private alertMessageService: AlertMessagesService,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.usuarioRegistro = this.authService.getUsuario();
    if(this.data.detalle != null){
      this.nombreDetalle = this.data.detalle.descripcion;
    }
  }

  onBuscarDetalle(e) {
      this.isSearch = false;
      this.detalles = [];

      const value = (<string>e.target.value).toUpperCase();
      this.nombreDetalle = value;
      this.configuracionService.buscarConfiguracion(value,this.idGrupo).subscribe(
        (response: Response) => {
          this.isSearch = true;
          if(response.error == null){
            this.detalles = response.objeto;
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

  crearNuevoDetalle(){
    this.configuracionService.crearConfiguracion(this.nombreDetalle,this.idGrupo,this.usuarioRegistro).subscribe(
      (response: Response) => {
        if(response.error == null){
          this.alertMessageService.showMessage.next(
            {
              mensaje: 'Detalle registrado correctamente',
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

  modificarNombreDetalle(idDetalle: number){
    this.configuracionService.modificarNombre(idDetalle,this.nombreDetalle,this.usuarioRegistro).subscribe(
      (response: Response) => {
        if(response.error == null){
          this.alertMessageService.showMessage.next(
            {
              mensaje: 'Detalle modificado correctamente',
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
