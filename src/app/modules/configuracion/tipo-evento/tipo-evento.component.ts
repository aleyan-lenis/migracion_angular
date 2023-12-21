import { HttpClient } from '@angular/common/http';

import { Component, OnInit, ViewChild } from '@angular/core';
import { Configuracion } from 'src/app/core/models/configuracion.model';
import { AlertMessagesService } from 'src/app/shared/services/alert-messages.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Response } from 'src/app/core/models/response.model';

import { UNKNOWN_ERROR } from 'src/app/core/properties/messages.parameters';
import * as MENSAJES from '../../../core/properties/messages.parameters';
import * as PARAMETROS from '../../../core/properties/parametros.parameter';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { JEIS_RESPONSE } from 'src/app/core/models/framework.model';
import { MatDialog } from '@angular/material/dialog';
import { NuevoTipoEventoComponent } from './nuevo-tipo-evento/nuevo-tipo-evento.component';
import { ConfiguracionService } from 'src/app/core/services/configuracion.service';

@Component({
  selector: 'app-tipo-evento',
  templateUrl: './tipo-evento.component.html',
  styleUrls: ['./tipo-evento.component.scss']
})
export class TipoEventoComponent implements OnInit {

  tipoEventos: Configuracion[];

  public dataSource = new MatTableDataSource<Configuracion>();
  public displayedColumns = ['position','idTipoEvento','nombre','estado', 'usuarioRegistro','fechaRegistro','usuarioModificacion','fechaModificacion'];
  selection = new SelectionModel<Configuracion>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private configuracionService: ConfiguracionService,
    private alertMessageService: AlertMessagesService,
    private http: HttpClient,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getTipoEventos();

    this.configuracionService.nuevaConfiguracion.subscribe(
      () => {
        this.getTipoEventos();
      }
    )
  }

  getTipoEventos(){
    const idTipoEvento = PARAMETROS.ID_CATALOGO_TIPO_EVENTO;
    this.configuracionService.consultaInfo(idTipoEvento).subscribe(
      (response: JEIS_RESPONSE) => {
        if (response.pnerrorOut == 0 && response.pvresultadoOut != '') {
          this.tipoEventos = <Configuracion[]> response.pvresultadoOut.datos.registro;
          this.tipoEventos = this.tipoEventos.map((e,i) => {
            let position = i+1;
            return {...e, position}
          });
          this.dataSource.data = this.tipoEventos;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
      },
      (error: HttpErrorResponse) => {
        this.alertMessageService.showMessage.next({
          mensaje: MENSAJES.UNKNOWN_ERROR,
          tipo: "error"
        });
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(){
    const dialogRef = this.dialog.open(NuevoTipoEventoComponent, {
      width: '600px',
      data: {
        modo: 'creacion',
        tipoEvento: null
      }
    });
    this.getTipoEventos();
  }

  modificarNombre(position:number){
    const tipoEvento = this.tipoEventos.find((e) =>  e.position == position);

    const dialogRef = this.dialog.open(NuevoTipoEventoComponent, {
      width: '600px',
      data: {
        modo: 'modificacion',
        tipoEvento: tipoEvento
      }
    });
    this.getTipoEventos();
  }

  modificarEstado(position:number){
    const tipoEvento = this.tipoEventos.find((e) =>  e.position == position);
    this.configuracionService.cambiarEstado(tipoEvento.id_catalogo).subscribe(
      (response: Response) => {
        if(response.error == null){
          this.alertMessageService.showMessage.next(
            {
              mensaje: 'TipoEvento modificado correctamente',
              tipo: 'success'
            }
          );
          this.getTipoEventos();
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
