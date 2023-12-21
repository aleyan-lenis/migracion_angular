import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Usuario } from 'src/app/core/models/usuario.model';
import { Response } from 'src/app/core/models/response.model';
import { AlertMessagesService } from 'src/app/shared/services/alert-messages.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as MENSAJES from '../../core/properties/messages.parameters';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[];

  public dataSource = new MatTableDataSource<Usuario>();
  public displayedColumns = ['nombre','nombre_departamento','rol', 'estado','fechaDesde','fechaActualizacion','position'];
  selection = new SelectionModel<Usuario>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private usuarioService: AuthService,
    private alertMessageService: AlertMessagesService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getUsuariosPermitidos();

    this.usuarioService.nuevoUsuario.subscribe(
      () => {
        this.getUsuariosPermitidos();
      }
    )
  }

  getUsuariosPermitidos(){
    this.usuarioService.getUsuariosPermitidos().subscribe(
      (respuesta: Response) => {
        if (respuesta.error == null) {
          this.usuarios = respuesta.objeto;

          this.usuarios = this.usuarios.map((e,i) => {
            let position = i+1;
            return {...e, position}
          });

          this.dataSource.data = this.usuarios;
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
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  checkboxLabel(row?: Usuario): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  openDialog(){
    const dialogRef = this.dialog.open(NuevoUsuarioComponent, {
      width: '600px',
      data: {
        modo: 'creacion',
        usuario: null
      }
    });

  }

  inactivarUsuario(position: number){
    const usuario = this.usuarios.find((e) =>  e.position == position);

    const dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(result => {

      if(result){
        this.usuarioService.cambiarEstadoUsuario(usuario.username, 'I').subscribe(
          (response: Response) => {
            if(response.error == null){
              this.alertMessageService.showMessage.next(
                {
                  mensaje: 'Usuario inactivado correctamente',
                  tipo: 'success'
                }
              );

              this.getUsuariosPermitidos();

            }
            else {
              this.alertMessageService.showMessage.next({
                mensaje: response.error,
                tipo: "error"
              });
            }
          },
          (error: HttpErrorResponse) => {
            this.alertMessageService.showMessage.next(
              {
                mensaje: MENSAJES.UNKNOWN_ERROR,
                tipo: 'error'
              }
            )
          }
        )
      }
    });
  }

  activarUsuario(position:number){
    const usuario = this.usuarios.find((e) =>  e.position == position);

    this.usuarioService.cambiarEstadoUsuario(usuario.username, 'A').subscribe(
      (response: Response) => {
        if(response.error == null){
          this.alertMessageService.showMessage.next(
            {
              mensaje: 'Usuario activado correctamente',
              tipo: 'success'
            }
          );

          this.getUsuariosPermitidos();
        }
      },
      (error: HttpErrorResponse) => {
        this.alertMessageService.showMessage.next(
          {
            mensaje: MENSAJES.UNKNOWN_ERROR,
            tipo: 'error'
          }
        )
      }
    )
  }

  modificarPermisos(position:number){
    const usuario = this.usuarios.find((e) =>  e.position == position);

    const dialogRef = this.dialog.open(NuevoUsuarioComponent, {
      width: '600px',
      data: {
        modo: 'modificacion',
        usuario: usuario
      }
    });
  }

}
