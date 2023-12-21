import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Response } from 'src/app/core/models/response.model';
import { ConfiguracionService } from "src/app/core/services/configuracion.service";
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

import { AlarmaSGA } from 'src/app/core/models/configuracion.model';
import { NuevaAlarmaComponent } from '../configuracion-alarmas/nueva-alarma.component';

@Component({
  selector: 'app-consulta-alarmas',
  templateUrl: './consulta-alarmas.component.html',
  styleUrls: ['./consulta-alarmas.component.scss']
})
export class ConsultaAlarmasComponent implements OnInit {

  alarmas: AlarmaSGA[];

  public dataSource = new MatTableDataSource<AlarmaSGA>();
  public displayedColumns = ['position','idTicket','ticketNOC','estado','severidad','nivel1','cantidadIncidentes','fechaUltInc','tecnologia','servicioAfect','tipoEvento','idEvento','ciudad','fechaInicio','fechaPosSol','fechaIngreso','usuarioIngreso','usuarioModificacion','fechaModificacion'];
  selection = new SelectionModel<AlarmaSGA>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private configuracionService: ConfiguracionService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getAlarmas();

    this.configuracionService.nuevaConfiguracion.subscribe(
      () => {
        this.getAlarmas();
      }
    )
  }

  getAlarmas(){
    this.alarmas = <AlarmaSGA[]> [
      {
          "id_ticket": 150000001,
          "id_ticket_NOC": 150000001,
          "estado": "GUAYAQUIL",
          "severidad": "150000001",
          "nivel1": "150000001",
          "cantidad_incidentes":0,
          "fecha_ult_incidente":"",
          "tecnologia": "150000001",
          "servicio_afectado":"",
          "tipo_evento": "GUAYAQUIL",
          "id_tipo_evento": 0,
          "ciudad": "",
          "fecha_inicio": "2021-08-16",
          "fecha_pos_sol": "2021-08-16",
          "fecha_ingreso": "2021-08-16",
          "usuario_ingreso": "150000001",
          "usuario_modificacion": "150000001",
          "fecha_modificacion": "2021-08-16"
      }
    ];
    this.configuracionService.obtenerAlarmas().subscribe(
			(response: Response) => {
				if (response.error == null) {
					this.alarmas = (<AlarmaSGA[]>response.objeto);

          this.alarmas = this.alarmas.map((e,i) => {
            let position = i+1;
            return {...e, position}
          });

          this.dataSource.data = this.alarmas;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
				}
			},
			(error: HttpErrorResponse) => {
				if (error.status == 401)
					this.authService.sesionCaducada();
			},
			() =>  {
				this.authService.actualizarDatosSesion();
			}
		);
  }

  modificar(alarma){
    const dialogRef = this.dialog.open(NuevaAlarmaComponent, {
      width: '200%',
      height: '100%',
      data: {
        modo: 'Editar',
        alarma: alarma
      }
    });
    this.getAlarmas();
  }

}
