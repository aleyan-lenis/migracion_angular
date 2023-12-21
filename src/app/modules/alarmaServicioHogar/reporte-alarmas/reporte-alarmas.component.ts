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
  selector: 'app-reporte-alarmas',
  templateUrl: './reporte-alarmas.component.html',
  styleUrls: ['./reporte-alarmas.component.scss']
})
export class ReporteAlarmasComponent implements OnInit {

  alarmas: AlarmaSGA[];

  public dataSource = new MatTableDataSource<AlarmaSGA>();
  public displayedColumns = ['fecha_ingreso','id_ticket','nivel2','nivel1','ciudad','tipo_prob','cantidad_afectados',
  'hora_inicio','hora_actualizacion','hora_fin','atencion_asesor','tiempo_trabajado','numero_ingresos','dias_trabajados'];
  selection = new SelectionModel<AlarmaSGA>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private configuracionService: ConfiguracionService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getAlarmas();
  }

  getAlarmas(){
    this.alarmas = <AlarmaSGA[]> [
      {
        "fecha_ingreso": "2021-08-16",
        "id_ticket": 150000001,
        "nivel2": "GUAYAQUIL",
        "nivel1": "150000001",
        "ciudad": "150000001",
        "tipo_prob": "",
        "cantidad_afectados": 0,
        "hora_inicio": "",
        "hora_actualizacion":"",
        "hora_fin": "GUAYAQUIL",
        "atencion_asesor": 0,
        "tiempo_trabajado": 0,
        "numero_ingresos": 150000001,
        "dias_trabajados": 0
      }
    ];
    this.alarmas = this.alarmas.map((e,i) => {
      let position = i+1;
      return {...e, position}
    });

    this.dataSource.data = this.alarmas;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.configuracionService.obtenerAlarmasReportes().subscribe(
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

  obtenerHoraModif (fechaModif) : string{
    if (fechaModif)
    return fechaModif.substring(10,16)
  }

  dateDiff(diaInicio: string, diaFin: string, horaInicio: string, horaFin: string) {
    var fechaFin;
    var fechaInicio;
      if (horaFin != null){
        fechaFin = new Date(diaFin.replace("00:00:00","") + horaFin);
      } else {
        fechaFin = new Date(Date.parse(diaFin));
      }
      if (horaInicio != null){
        fechaInicio = new Date(diaInicio.replace("00:00:00","") + horaInicio);
      } else {
        fechaInicio = new Date(Date.parse(diaInicio));
      }
    let diffTime = Math.abs(fechaFin.getTime() - fechaInicio.getTime()) / 1000;
    if (diffTime == 0 || !diffTime)
      return {dias: 0, time: 0};
    let hour = Math.floor(diffTime / 3600);
    diffTime = diffTime - (3600 * hour);
    let days = Math.floor(hour / 24)
    const minutes = Math.floor (diffTime / 60);
    diffTime = diffTime - ( 60 * minutes);
    return {
      dias: days,
      time: `${hour < 10 ? "0" : ""}${hour}:${minutes < 10 ? "0" : ""}${minutes}:${diffTime < 10 ? "0" : ""}${diffTime}`
    };
  }

  onGenerarReporte() {
		this.configuracionService.crearReporteGeneral(this.alarmas);
	}

  modificar(alarma){
    const dialogRef = this.dialog.open(NuevaAlarmaComponent, {
      width: '700px',
      height: '100%',
      data: {
        modo: 'Editar',
        alarma: alarma
      }
    });
  }

}
