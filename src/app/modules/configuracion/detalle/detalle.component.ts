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
import { NuevoDetalleComponent } from './nuevo-detalle/nuevo-detalle.component';
import { ConfiguracionService } from 'src/app/core/services/configuracion.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  detalles: Configuracion[];

  public dataSource = new MatTableDataSource<Configuracion>();
  public displayedColumns = ['position','idDetalle','nombre','estado', 'usuarioRegistro','fechaRegistro','usuarioModificacion','fechaModificacion'];
  selection = new SelectionModel<Configuracion>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private configuracionService: ConfiguracionService,
    private alertMessageService: AlertMessagesService,
    private http: HttpClient,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getDetalles();

    this.configuracionService.nuevaConfiguracion.subscribe(
      () => {
        this.getDetalles();
      }
    )
  }

  getDetalles(){
    const idDetalle = PARAMETROS.ID_CATALOGO_DETALLE;
    this.configuracionService.consultaInfo(idDetalle).subscribe(
      (response: JEIS_RESPONSE) => {
        if (response.pnerrorOut == 0 && response.pvresultadoOut != '') {
          this.detalles = <Configuracion[]> response.pvresultadoOut.datos.registro;
          this.detalles = this.detalles.map((e,i) => {
            let position = i+1;
            return {...e, position}
          });
          this.dataSource.data = this.detalles;
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
    const dialogRef = this.dialog.open(NuevoDetalleComponent, {
      width: '600px',
      data: {
        modo: 'creacion',
        detalle: null
      }
    });
    this.getDetalles();
  }

  modificarNombre(position:number){
    const detalle = this.detalles.find((e) =>  e.position == position);

    const dialogRef = this.dialog.open(NuevoDetalleComponent, {
      width: '600px',
      data: {
        modo: 'modificacion',
        detalle: detalle
      }
    });
    this.getDetalles();
  }

  modificarEstado(position:number){
    const detalle = this.detalles.find((e) =>  e.position == position);
    this.configuracionService.cambiarEstado(detalle.id_catalogo).subscribe(
      (response: Response) => {
        if(response.error == null){
          this.alertMessageService.showMessage.next(
            {
              mensaje: 'Detalle modificado correctamente',
              tipo: 'success'
            }
          );
          this.getDetalles();
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
