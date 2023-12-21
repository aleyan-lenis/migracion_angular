import { Component, OnInit ,ViewChild ,ElementRef, Inject} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import * as _ from "underscore";

import { ConfiguracionService } from "src/app/core/services/configuracion.service";
import { Response } from "src/app/core/models/response.model";
import { AuthService } from "src/app/core/authentication/auth.service";
import { AlertMessagesService } from "src/app/shared/services/alert-messages.service";
import * as PARAMETROS from "../../../core/properties/parametros.parameter";
import * as MENSAJES from "src/app/core/properties/messages.parameters";
import { JEIS_RESPONSE } from "src/app/core/models/framework.model";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  AlarmaSGA,
  Configuracion,
  Nivel
} from "src/app/core/models/configuracion.model";

@Component({
  selector: "app-nueva-alarma",
  templateUrl: "./nueva-alarma.component.html",
  styleUrls: ["./nueva-alarma.component.scss"],
})
export class NuevaAlarmaComponent implements OnInit {
  @ViewChild('fechaFin') fechaFin: ElementRef;
  @ViewChild('horaFin') horaFin: ElementRef;
  @ViewChild('fechaIngreso') fechaIngreso: ElementRef;

  alarmas: AlarmaSGA[];
  selectsTotalFlags = {
    nivel1: {
      TODOS: false,
      message: "",
    },
    nivel2: {
      TODOS: false,
      message: "",
    },
    nivel3: {
      TODOS: false,
      message: "",
    },
    nivel4: {
      TODOS: false,
      message: "",
    },
  };
  private fechaInicio: Date;
  private fechaPosSol: string;
  nombreSolicitante: string;
  activaVoceo: boolean = true;
  activaAsesor: boolean = true;
  srv_internet: boolean = false;
  srv_telefonia: boolean = false;
  srv_television: boolean = false;
  srv_activado: boolean = false;
  estadoPorDefecto: string = "Alarmado";
  alarmadoPor = [];
  confirmacion = [];
  estados = [];
  severidad = [];
  tiposEventos: Configuracion[] = [];
  atribuibles: Configuracion[] = [];
  tiposProblemas: Configuracion[] = [];
  detalles: Configuracion[] = [];

  // datos tecnicos
  ciudades = [];
  tecnologias = [];
  niveles1 = [];
  niveles2 = [];
  niveles3 = [];
  niveles4 = [];

  codigoCiudad;
  codigoTecnologia;
  nivel1Escogido = [];
  codigoNivel1 = [];
  nivel2Escogido = [];
  codigoNivel2 = [];
  nivel3Escogido = [];
  codigoNivel3 = [];
  nivel4Escogido = [];
  codigoNivel4 = [];

  modo: "Nuevo" | "Editar";

  formulario: FormGroup;

  constructor(
    private configuracionService: ConfiguracionService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private alertMessageService: AlertMessagesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.nombreSolicitante = this.authService.getNombreUsuario();
    this.consultarInfo(PARAMETROS.ID_CATALOGO_ALARMADO_POR);
    this.consultarInfo(PARAMETROS.ID_CATALOGO_CONFIRMACION);
    this.consultarInfo(PARAMETROS.ID_CATALOGO_ESTADOS);
    this.consultarInfo(PARAMETROS.ID_CATALOGO_SEVERIDAD);
    this.consultarInfoConfiguracion(PARAMETROS.ID_CATALOGO_ATRIBUIBLE);
    this.consultarInfoConfiguracion(PARAMETROS.ID_CATALOGO_TIPO_EVENTO);
    this.consultarInfoConfiguracion(PARAMETROS.ID_CATALOGO_TIPO_PROBLEMA);
    this.consultarInfoConfiguracion(PARAMETROS.ID_CATALOGO_DETALLE);
    this.consultarCiudades();

    this.initForm();
  }

  initForm() {
    var fechaLocal=new Date();
      this.horaFin.nativeElement.value = fechaLocal.toTimeString().substring(0,5);
      this.fechaIngreso.nativeElement.valueAsDate = fechaLocal;
      this.fechaFin.nativeElement.valueAsDate = fechaLocal;
    if (this.data.modo != 'Editar') {
      this.formulario = this.formBuilder.group({
        nTicket: [""],
        alarmadoPor: ["", Validators.required],
        confirmacionPorNOC: ["", Validators.required],
        tipoEvento: ["", Validators.required],
        nTicketNOC: ["", Validators.maxLength(7)],
        fechaInicio: ["", Validators.required],
        horaInicio: ["", Validators.required],
        fechaPosSol: [""],
        estado: [this.estadoPorDefecto, Validators.required],
        fechaFin: [this.fechaFin.nativeElement.value,Validators.required],
        horaFin: [this.horaFin.nativeElement.value,Validators.required],
        tiempoPosSol: ["02:00"],
        usuario: [this.nombreSolicitante, Validators.required],
        fechaIngreso: [this.fechaIngreso.nativeElement.value],
        severidad: ["", Validators.required],
        ciudad: ["", Validators.required],
        tecnologia: ["", Validators.required],
        nivel1: ["", Validators.required],
        nivel2: [""],
        nivel3: [""],
        nivel4: [""],
        atribuible: ["", Validators.required],
        tipoProblema: ["", Validators.required],
        detalle: ["", Validators.required],
      });
    } else {
      const fechaInicio = this.data.alarma.fecha_inicio.substring(0,10)
      const fechaIngreso = this.data.alarma.fecha_ingreso.substring(0,10)
      const fechaFin = this.data.alarma.fecha_fin.substring(0,10)
      const fechaPosSol = this.data.alarma.fecha_pos_sol.substring(0,10)
      let alarmadoPor = "";
      if (this.data.alarma.alarmado_por == "1") {
        alarmadoPor = "SAC"
      } else if (this.data.alarma.alarmado_por == "2"){
        alarmadoPor = "NOC"
      }
      let confirmadoPorNOC = "";
      if (this.data.alarma.confirmacion_NOC == "1") {
        confirmadoPorNOC = "SI"
      } else if(this.data.alarma.confirmacion_NOC == "0") {
        confirmadoPorNOC = "NO"
      }

      this.activaVoceo = this.setCheckbox(this.data.alarma.activa_voceo)
      this.activaAsesor = this.setCheckbox(this.data.alarma.atencion_asesor)
      this.srv_internet = this.setCheckbox(this.data.alarma.srv_internet)
      this.srv_telefonia = this.setCheckbox(this.data.alarma.srv_telefonia)
      this.srv_television = this.setCheckbox(this.data.alarma.srv_television)
      this.formulario = this.formBuilder.group({
        nTicket: [this.data.alarma.id_ticket],
        alarmadoPor: [alarmadoPor],
        confirmacionPorNOC: [confirmadoPorNOC],
        tipoEvento: [this.data.alarma.tipo_evento],
        nTicketNOC: [this.data.alarma.id_ticket_NOC],
        fechaInicio: [fechaInicio],
        horaInicio: [this.data.alarma.hora_inicio],
        fechaPosSol: [fechaPosSol],
        estado: [this.estadoPorDefecto],
        fechaFin: [fechaFin],
        horaFin: [this.data.alarma.hora_fin],
        tiempoPosSol: ["02:00"],
        usuario: [this.data.alarma.usuario_ingreso],
        fechaIngreso: [fechaIngreso],
        severidad: [this.data.alarma.severidad],
        ciudad: [this.data.alarma.ciudad],
        tecnologia: [this.data.alarma.tecnologia],
        nivel1: [this.data.alarma.nivel1],
        nivel2: [this.data.alarma.nivel2],
        nivel3: [this.data.alarma.nivel3],
        nivel4: [this.data.alarma.nivel4],
        atribuible: [this.data.alarma.atribuible],
        tipoProblema: [this.data.alarma.tipo_prob],
        detalle: [this.data.alarma.detalle],
      });
    }
    if (this.data.modo != "Editar") {
      this.formulario.get("horaInicio").disable();
      this.formulario.get("fechaPosSol").disable();
      this.formulario.get("tiempoPosSol").disable();
      this.formulario.get("tecnologia").disable();
      this.formulario.get("nivel1").disable();
      this.formulario.get("nivel2").disable();
      this.formulario.get("nivel3").disable();
      this.formulario.get("nivel4").disable();
      this.formulario.get("fechaIngreso").disable();
    }
    this.formulario.get("ciudad").valueChanges.subscribe((check) => {
      if (check) {
        this.formulario.get("tecnologia").enable();
        this.formulario.get("nivel1").disable();
        this.formulario.get("nivel2").disable();
        this.formulario.get("nivel3").disable();
        this.formulario.get("nivel4").disable();
        this.formulario.get("tecnologia").setValue("")
        this.formulario.get("nivel1").setValue("")
        this.formulario.get("nivel2").setValue("")
        this.formulario.get("nivel3").setValue("")
        this.formulario.get("nivel4").setValue("")
        this.setearMultiple();
      }
    });
    this.formulario.get("tecnologia").valueChanges.subscribe((check) => {
      if (check) {
        this.formulario.get("nivel1").enable();
        this.formulario.get("nivel2").disable();
        this.formulario.get("nivel3").disable();
        this.formulario.get("nivel4").disable();
        this.formulario.get("nivel1").setValue("")
        this.formulario.get("nivel2").setValue("")
        this.formulario.get("nivel3").setValue("")
        this.formulario.get("nivel4").setValue("")
        this.setearMultiple();
      }
    });
    this.formulario.get("nivel1").valueChanges.subscribe((check) => {
      if (check) {
        this.formulario.get("nivel2").enable();
        if (this.formulario.value.nivel1.length > 1){
          this.formulario.get("nivel2").disable();
          this.formulario.get("nivel3").disable();
          this.formulario.get("nivel4").disable();
        }
        this.formulario.get("nivel2").setValue("")
        this.formulario.get("nivel3").setValue("")
        this.formulario.get("nivel4").setValue("")
      }
    });
    this.formulario.get("nivel2").valueChanges.subscribe((check) => {
      if (check) {
        this.formulario.get("nivel3").enable();
        if (this.formulario.value.nivel2.length > 1){
          this.formulario.get("nivel3").disable();
          this.formulario.get("nivel4").disable();
        }
        this.formulario.get("nivel3").setValue("")
        this.formulario.get("nivel4").setValue("")
      }
    });
    this.formulario.get("nivel3").valueChanges.subscribe((check) => {
      if (check) {
        this.formulario.get("nivel4").enable();
        if (this.formulario.value.nivel3.length > 1){
          this.formulario.get("nivel4").disable();
        }
        this.formulario.get("nivel4").setValue("")
      }
    });
  }

  activarVoceo() {
    var element = <HTMLInputElement> document.getElementById("activaVoceo");
    this.activaVoceo = element.checked;

    this.activaVoceo == false ? this.activaAsesor = false : console.log("");
  }

  asesor(){
    var element = <HTMLInputElement> document.getElementById("activaAsesor");
    this.activaAsesor = element.checked;
  }

  consultarInfo(parametro: string) {
    this.configuracionService.consultaInfo(parametro).subscribe(
      (response: JEIS_RESPONSE) => {
        if (response.pnerrorOut == 0 && response.pvresultadoOut != "") {
          var registro = response.pvresultadoOut.datos.registro;
          if (parametro == PARAMETROS.ID_CATALOGO_ALARMADO_POR) {
            this.alarmadoPor = registro;
          } else if (parametro == PARAMETROS.ID_CATALOGO_CONFIRMACION) {
            this.confirmacion = registro;
          } else if (parametro == PARAMETROS.ID_CATALOGO_ESTADOS) {
            this.estados = registro;
          } else if (parametro == PARAMETROS.ID_CATALOGO_SEVERIDAD) {
            this.severidad = registro;
          }
        }
      },
      (error: HttpErrorResponse) => {
        this.alertMessageService.showMessage.next({
          mensaje: MENSAJES.UNKNOWN_ERROR,
          tipo: "error",
        });
      }
    );
  }

  consultarInfoConfiguracion(parametro: string) {
    this.configuracionService.consultaInfo(parametro).subscribe(
      (response: JEIS_RESPONSE) => {
        if (response.pnerrorOut == 0 && response.pvresultadoOut != "") {
          var registro = <Configuracion[]>response.pvresultadoOut.datos.registro;
          registro.map((e,i) => {
            if (e.id_estado == "1") {
              if (parametro == PARAMETROS.ID_CATALOGO_ATRIBUIBLE) {
                this.atribuibles.push(e);
              } else if (parametro == PARAMETROS.ID_CATALOGO_TIPO_EVENTO) {
                this.tiposEventos.push(e);
              } else if (parametro == PARAMETROS.ID_CATALOGO_TIPO_PROBLEMA) {
                this.tiposProblemas.push(e);
              } else if (parametro == PARAMETROS.ID_CATALOGO_DETALLE) {
                this.detalles.push(e);
              }
            }
          });
        }
      },
      (error: HttpErrorResponse) => {
        this.alertMessageService.showMessage.next({
          mensaje: MENSAJES.UNKNOWN_ERROR,
          tipo: "error",
        });
      }
    );
  }

  consultarCiudades() {
    this.configuracionService.consultaCiudades().subscribe(
      (response: JEIS_RESPONSE) => {
        if (response.pnerrorOut == 0 && response.pvresultadoOut != '') {
          this.ciudades = response.pvresultadoOut.datos.registro;
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

  guardarCodigoCiudad(ciudad) {
     this.ciudades.map((e,i) => {
       if (e.nombre == ciudad.target.value){
         this.codigoCiudad = e.ciudad;
       }
     });
    this.consultarTecnologias();
  }

  consultarTecnologias() {
    this.configuracionService.consultaTecnologias(this.codigoCiudad).subscribe(
      (response: JEIS_RESPONSE) => {
        if (response.pnerrorOut == 0 && response.pvresultadoOut != '') {
          this.tecnologias = response.pvresultadoOut.datos.registro;
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

  guardarCodigoTecnologia(tecnologia) {
    this.tecnologias.map((e, i) => {
      if (e.descripcion == tecnologia.value) {
        this.codigoTecnologia = e.idcobertura;
      }
    });
    this.consultarNiveles1();
  }

  consultarNiveles1() {
    this.configuracionService.consultaNiveles1(this.codigoCiudad,this.codigoTecnologia).subscribe(
      (response: JEIS_RESPONSE) => {
        if (response.pnerrorOut == 0 && response.pvresultadoOut != '') {
          var registro = response.pvresultadoOut.datos.registro;
          if (registro.length > 1) {
            this.niveles1 = registro;
          }else{
            this.niveles1 = this.armarArray(registro);
          }
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

  guardarCodigoNivel1(nivel1) {
    if (
      nivel1.value.includes("TODOS") &&
      !this.selectsTotalFlags.nivel1.TODOS
    ) {
      this.selectsTotalFlags.nivel1.message = this.selectTotal("nivel1");
      this.selectsTotalFlags.nivel1.TODOS = true;
    } else if (
      nivel1.value.includes("TODOS") &&
      this.selectsTotalFlags.nivel1.TODOS
    ) {
      this.selectsTotalFlags.nivel1.message = this.limpiarTodo("nivel1");
      this.selectsTotalFlags.nivel1.TODOS = false;
    } else if (
      !nivel1.value.includes("TODOS") &&
      this.selectsTotalFlags.nivel1.TODOS
    ) {
      this.formulario.get("nivel1").setValue([]);
      this.selectsTotalFlags.nivel1.TODOS = false;
      this.selectsTotalFlags.nivel1.message = "Ninguna";
    } else {
      this.selectsTotalFlags.nivel1.message = `${nivel1.value[0]} ${
        nivel1.value.length > 1 ? " +" + (nivel1.value.length - 1) : ""
      }`;
    }
    this.codigoNivel1 = [];
    this.nivel1Escogido = [];

    if (this.niveles1[0].descripcion === undefined) {
      this.codigoNivel1.push(this.niveles1[0].id_equipo_nivel1)
      this.nivel1Escogido.push(this.formulario.value.nivel1[0])
    }else{
      this.formulario.value.nivel1.map((e,i) => {
        if(e != 'TODOS'){
          this.niveles1.map((n,i) => {
            if (n.descripcion == e){
              this.codigoNivel1.push(n.id_equipo_nivel1);
            }
          });
          this.nivel1Escogido.push(e);
        }
      });
    }
    this.consultarNiveles2()
  }

  consultarNiveles2() {
    this.configuracionService.consultaNiveles2(this.codigoNivel1[0],this.codigoTecnologia).subscribe(
      (response: JEIS_RESPONSE) => {
        if (response.pnerrorOut == 0 && response.pvresultadoOut != '') {
          var registro = response.pvresultadoOut.datos.registro;
          if (registro.length > 1) {
            this.niveles2 = registro;
          }else{
          }
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

  guardarCodigoNivel2(nivel2) {
    if (
      nivel2.value.includes("TODOS") &&
      !this.selectsTotalFlags.nivel2.TODOS
    ) {
      this.selectsTotalFlags.nivel2.message = this.selectTotal("nivel2");
      this.selectsTotalFlags.nivel2.TODOS = true;
    } else if (
      nivel2.value.includes("TODOS") &&
      this.selectsTotalFlags.nivel2.TODOS
    ) {
      this.selectsTotalFlags.nivel2.message = this.limpiarTodo("nivel2");
      this.selectsTotalFlags.nivel2.TODOS = false;
    } else if (
      !nivel2.value.includes("TODOS") &&
      this.selectsTotalFlags.nivel2.TODOS
    ) {
      this.formulario.get("nivel2").setValue([]);
      this.selectsTotalFlags.nivel2.TODOS = false;
      this.selectsTotalFlags.nivel2.message = "Ninguna";
    } else {
      this.selectsTotalFlags.nivel2.message = `${nivel2.value[0]} ${
        nivel2.value.length > 1 ? " +" + (nivel2.value.length - 1) : ""
      }`;
    }
    this.codigoNivel2 = [];
    this.nivel2Escogido = [];

    if (this.niveles2[0].dato_equipo === undefined) {
      this.codigoNivel2.push(this.niveles2[0].id_det_pla_ext)
      this.nivel2Escogido.push(this.formulario.value.nivel2[0])
    }else{
      this.formulario.value.nivel2.map((e,i) => {
        if(e != 'TODOS'){
          this.niveles2.map((n,i) => {
            if (n.dato_equipo == e){
              this.codigoNivel2.push(n.id_det_pla_ext);
            }
          });
          this.nivel2Escogido.push(e);
        }
      });
    }
    this.consultarNiveles3()
  }

  consultarNiveles3() {
    this.formulario.get("nivel3").enable();
    this.configuracionService.consultaNiveles3(this.codigoNivel2[0],this.codigoTecnologia,"3").subscribe(
      (response: JEIS_RESPONSE) => {
        if (response.pnerrorOut == 0 && response.pvresultadoOut != '') {
          var registro = response.pvresultadoOut.datos.registro;
          if (registro.length > 1) {
            this.niveles3 = registro;
          }else{
            this.niveles3 = this.armarArray(registro);
          }
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

  guardarCodigoNivel3(nivel3) {
    if (
      nivel3.value.includes("TODOS") &&
      !this.selectsTotalFlags.nivel3.TODOS
    ) {
      this.selectsTotalFlags.nivel3.message = this.selectTotal("nivel3");
      this.selectsTotalFlags.nivel3.TODOS = true;
    } else if (
      nivel3.value.includes("TODOS") &&
      this.selectsTotalFlags.nivel3.TODOS
    ) {
      this.selectsTotalFlags.nivel3.message = this.limpiarTodo("nivel3");
      this.selectsTotalFlags.nivel3.TODOS = false;
    } else if (
      !nivel3.value.includes("TODOS") &&
      this.selectsTotalFlags.nivel3.TODOS
    ) {
      this.formulario.get("nivel3").setValue([]);
      this.selectsTotalFlags.nivel3.TODOS = false;
      this.selectsTotalFlags.nivel3.message = "Ninguna";
    } else {
      this.selectsTotalFlags.nivel3.message = `${nivel3.value[0]} ${
        nivel3.value.length > 1 ? " +" + (nivel3.value.length - 1) : ""
      }`;
    }

    this.codigoNivel3 = [];
    this.nivel3Escogido = [];

    if (this.niveles3[0].dato_equipo === undefined) {
      this.codigoNivel3.push(this.niveles3[0].id_det_pla_ext)
      this.nivel3Escogido.push(this.formulario.value.nivel3[0])
    }else{
      this.formulario.value.nivel3.map((e,i) => {
        if(e != 'TODOS'){
          this.niveles3.map((n,i) => {
            if (n.dato_equipo == e){
              this.codigoNivel3.push(n.id_det_pla_ext);
            }
          });
          this.nivel3Escogido.push(e);
        }
      });
    }
    this.consultarNiveles4()
  }

  consultarNiveles4() {
    this.formulario.get("nivel3").enable();
    this.configuracionService.consultaNiveles4(this.codigoNivel3[0],this.codigoTecnologia,"4").subscribe(
      (response: JEIS_RESPONSE) => {
        if (response.pnerrorOut == 0 && response.pvresultadoOut != '') {
          var registro = response.pvresultadoOut.datos.registro;
          if (registro.length > 1) {
            this.niveles4 = registro;
          }else{
            this.niveles4 = this.armarArray(registro);
          }
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

  guardarCodigoNivel4(nivel4) {
    if (
      nivel4.value.includes("TODOS") &&
      !this.selectsTotalFlags.nivel4.TODOS
    ) {
      this.selectsTotalFlags.nivel4.message = this.selectTotal("nivel4");
      this.selectsTotalFlags.nivel4.TODOS = true;
    } else if (
      nivel4.value.includes("TODOS") &&
      this.selectsTotalFlags.nivel4.TODOS
    ) {
      this.selectsTotalFlags.nivel4.message = this.limpiarTodo("nivel4");
      this.selectsTotalFlags.nivel4.TODOS = false;
    } else if (
      !nivel4.value.includes("TODOS") &&
      this.selectsTotalFlags.nivel4.TODOS
    ) {
      this.formulario.get("nivel4").setValue([]);
      this.selectsTotalFlags.nivel4.TODOS = false;
      this.selectsTotalFlags.nivel4.message = "Ninguna";
    } else {
      this.selectsTotalFlags.nivel4.message = `${nivel4.value[0]} ${
        nivel4.value.length > 1 ? " +" + (nivel4.value.length - 1) : ""
      }`;
    }
    this.codigoNivel4 = [];
    this.nivel4Escogido = [];

    if (this.niveles4[0].dato_equipo === undefined) {
      this.codigoNivel4.push(this.niveles4[0].id_det_pla_ext)
      this.nivel4Escogido.push(this.formulario.value.nivel4[0])
    }else{
      this.formulario.value.nivel4.map((e,i) => {
        if(e != 'TODOS'){
          this.niveles4.map((n,i) => {
            if (n.dato_equipo == e){
              this.codigoNivel4.push(n.id_det_pla_ext);
            }
          });
          this.nivel4Escogido.push(e);
        }
      });
    }
  }

  armarArray(registro): any[]{
    let arr = [];
      Object.keys(registro).map(function(key){
          arr.push({[key]:registro[key]})
          return arr;
      });
    return arr;
  }

  selectTotal(field: string) {
    const values = ["TODOS"];
    switch (field) {
      case "nivel1":
        this.niveles1.forEach((element) => {
          values.push(element.descripcion);
        });
        break;
      case "nivel2":
        this.niveles2.forEach((element) => {
          values.push(element.dato_equipo);
        });
        break;
      case "nivel3":
        this.niveles3.forEach((element) => {
          values.push(element.dato_equipo);
        });
        break;
      case "nivel4":
        this.niveles4.forEach((element) => {
          values.push(element.dato_equipo);
        });
        break;
    }
    this.formulario.get(field).setValue(values);
    return "Todas";
  }

  limpiarTodo(field: string) {
    const values = this.formulario.get(field).value.filter((c) => c != "TODOS");
    this.formulario.get(field).setValue(values);
    return values.length > 0 ? `${values[0]}...` : "";
  }

  updateDate(event: any) {
    this.fechaInicio = new Date(
      `${event.target.value}T00:00:00`.replace(/-/g, "/").replace(/T.+/, "")
    );
    this.formulario.get("horaInicio").enable();
    if (this.formulario.get("horaInicio").value != ""){
      this.updatehour(event);
    }
  }

  private agregarCero(value: number) {
    return value < 10 ? `0${value}` : value;
  }

  updatehour(event: any) {
    const horaArray = this.formulario.get("horaInicio").value.split(":");
    this.fechaInicio.setHours(Number(horaArray[0]), Number(horaArray[1]));
    this.fechaInicio.setHours(this.fechaInicio.getHours() + 2);
    this.formulario.get("fechaPosSol").enable();
    const fechaString = `${this.fechaInicio.getFullYear()}-${this.agregarCero(this.fechaInicio.getMonth() + 1)}-${this.agregarCero(this.fechaInicio.getDate())}T${this.agregarCero(this.fechaInicio.getHours())}:${this.agregarCero(this.fechaInicio.getMinutes())}`;
    this.fechaPosSol = fechaString;
    this.formulario.get("fechaPosSol").setValue(fechaString.substring(0,10));
  }

  onReiniciarFormulario() {
    this.formulario.reset();
    this.initForm();
  }

  getCheckboxValue(tipo): boolean{
    var element = <HTMLInputElement> document.getElementById(tipo);
    return element.checked;
  }

  saveValue(checked): number{
    if(checked){
      return 1;
    }else{
      return 0;
    }
  }

  setCheckbox(tipo): boolean{
    if(tipo == 1) {
      return true;
    }else{
      return false;
    }
  }

  validaFormulario(e){
    if(this.getCheckboxValue("srv_internet") || this.getCheckboxValue("srv_telefonia") || this.getCheckboxValue("srv_television")){
      this.srv_activado = true;
    } else {
      this.srv_activado = false;
    }
  }

  submit(e) {
    this.activaVoceo = this.getCheckboxValue("activaVoceo");
    this.activaAsesor = this.getCheckboxValue("activaAsesor");
    this.srv_internet = this.getCheckboxValue("srv_internet");
    this.srv_telefonia = this.getCheckboxValue("srv_telefonia");
    this.srv_television = this.getCheckboxValue("srv_television");
    const alarma: AlarmaSGA = {
      alarmado_por: this.formulario.value.alarmadoPor,
      estado: this.formulario.value.estado,
      fecha_inicio: this.formulario.value.fechaInicio,
      hora_inicio: this.formulario.value.horaInicio,
      fecha_fin: this.formulario.value.fechaFin,
      hora_fin: this.formulario.value.horaFin,
      severidad: this.formulario.value.severidad,
      srv_internet: this.saveValue(this.srv_internet),
      srv_telefonia: this.saveValue(this.srv_telefonia),
      srv_television: this.saveValue(this.srv_television),
      fecha_pos_sol: this.formulario.value.fechaPosSol,
      tiempo_pos_sol: this.formulario.value.tiempoPosSol,
      atencion_asesor: this.saveValue(this.activaAsesor),
      tipo_evento: this.formulario.value.tipoEvento,
      id_ticket_NOC: this.formulario.value.nTicketNOC,
      atribuible: this.formulario.value.atribuible,
      detalle: this.formulario.value.detalle,
      tipo_prob: this.formulario.value.tipoProblema,
      confirmacion_NOC: this.formulario.value.confirmacionPorNOC,
      activa_voceo: this.saveValue(this.activaVoceo),
      usuario_ingreso: this.formulario.value.usuario,
      fecha_ingreso: this.fechaIngreso.nativeElement.value,
      id_ciudad: this.codigoCiudad,
      id_tecnologia: this.codigoTecnologia,
      ciudad: this.formulario.value.ciudad,
      tecnologia: this.formulario.value.tecnologia
    };
    if(this.data.modo != 'Editar') {
      alarma.tiempo_pos_sol = "02:00";
      if(this.nivel1Escogido.length > 1){
        for(let i=0;i<this.nivel1Escogido.length;i++){
          alarma.nivel1 =  this.nivel1Escogido[i];
          alarma.id_nivel1 = this.codigoNivel1[i];
          this.crearAlarmaDT(alarma,this.nivel1Escogido.length);
        }
      }else{
        alarma.nivel1 =  this.nivel1Escogido[0];
        alarma.id_nivel1 = this.codigoNivel1[0];
        if (this.nivel2Escogido.length != 0) {
          if(this.nivel2Escogido.length > 1){
            for(let i=0;i<this.nivel2Escogido.length;i++){
              alarma.nivel2 =  this.nivel2Escogido[i];
              alarma.id_nivel2 = this.codigoNivel2[i];
              this.crearAlarmaDT(alarma,this.nivel2Escogido.length);
            }
          }else{
            alarma.nivel2 =  this.nivel2Escogido[0];
            alarma.id_nivel2 = this.codigoNivel2[0];
            if (this.nivel3Escogido.length != 0) {
              if (this.nivel3Escogido.length > 1){
                for(let i=0;i<this.nivel3Escogido.length;i++){
                  alarma.nivel3 =  this.nivel3Escogido[i];
                  alarma.id_nivel3 = this.codigoNivel3[i];
                  this.crearAlarmaDT(alarma,this.nivel3Escogido.length);
                }
              }else{
                alarma.nivel3 =  this.nivel3Escogido[0];
                alarma.id_nivel3 = this.codigoNivel3[0];
                if (this.nivel4Escogido.length != 0) {
                  if (this.nivel4Escogido.length > 1){
                    for(let i=0;i<this.nivel4Escogido.length;i++){
                      alarma.nivel4 =  this.nivel4Escogido[i];
                      alarma.id_nivel4 = this.codigoNivel4[i];
                      this.crearAlarmaDT(alarma,this.nivel4Escogido.length);
                    }
                  }else{
                    alarma.nivel4 =  this.nivel4Escogido[0];
                    alarma.id_nivel4 = this.codigoNivel4[0];
                    this.crearAlarmaDT(alarma,this.nivel4Escogido.length)
                  }
                }else{
                  this.crearAlarmaDT(alarma,this.nivel3Escogido.length);
                }
              }
            }else{
              this.crearAlarmaDT(alarma,this.nivel2Escogido.length);
            }
          }
        }else{
          this.crearAlarmaDT(alarma,this.nivel1Escogido.length);
        }
      }
    } else {
      alarma.id_ticket = this.data.alarma.id_ticket;
      alarma.id_ciudad = this.data.alarma.id_ciudad;
      alarma.id_tecnologia = this.data.alarma.id_tecnologia;
      alarma.usuario_modificacion = this.nombreSolicitante;
      this.modificar(alarma);
    }
  }

  crearAlarma(alarma){
    this.configuracionService
      .crearAlarma(alarma, this.data.modo)
      .subscribe((response: Response) => {
        if (response.error == null) {
          this.alertMessageService.showMessage.next({
            mensaje: "Alarma registrado correctamente",
            tipo: "success",
          });
          this.configuracionService.nuevaConfiguracion.next();
        } else if (response.error == "ERROR") {
          this.alertMessageService.showMessage.next({
            mensaje: response.objeto,
            tipo: "error",
          });
        }
      },
			(error: HttpErrorResponse) => {
			},
			() => {
				this.authService.actualizarDatosSesion();
        this.reiniciarFormulario();
			}
		)
	}

  crearAlarmaDT(alarma,cantidad){
    if (cantidad!=0) {
      this.configuracionService
        .crearAlarmaDT(alarma,cantidad)
        .subscribe((response: Response) => {
          if (response.error == null) {
            this.configuracionService.nuevaConfiguracion.next();
          } else if (response.error == "ERROR") {
            this.alertMessageService.showMessage.next({
              mensaje: response.objeto,
              tipo: "error",
            });
          }
        },
        (error: HttpErrorResponse) => {
        },
        () => {
          this.authService.actualizarDatosSesion();
          this.reiniciarFormulario();
          this.alertMessageService.showMessage.next({
            mensaje: "Alarma registrado correctamente",
            tipo: "success",
          });
        }
      )
    }
  }

  modificar(alarma){
    this.configuracionService
      .crearAlarma(alarma, this.data.modo)
      .subscribe((response: Response) => {
        if (response.error == null) {
          this.alertMessageService.showMessage.next({
            mensaje: "Alarma modificada correctamente",
            tipo: "success",
          });
          this.configuracionService.nuevaConfiguracion.next();
        } else if (response.error == "ERROR") {
          this.alertMessageService.showMessage.next({
            mensaje: response.objeto,
            tipo: "error",
          });
        }
      },
			(error: HttpErrorResponse) => {
			},
			() => {
				this.authService.actualizarDatosSesion();
			}
		)
  }

  reiniciarFormulario(){
    this.nivel1Escogido = [];
    this.codigoNivel1 = [];
    this.nivel2Escogido = [];
    this.codigoNivel2 = [];
    this.nivel3Escogido = [];
    this.codigoNivel3 = [];
    this.nivel4Escogido = [];
    this.codigoNivel4 = [];
    this.setearMultiple();
    this.activaVoceo = true;
    this.activaAsesor = true;
    this.srv_internet = false;
    this.srv_telefonia = false;
    this.srv_television = false;
    this.srv_activado = false;
    this.estadoPorDefecto = "Alarmado";
    this.formulario.get("horaInicio").disable();
    this.formulario.get("fechaPosSol").disable();
    this.formulario.get("tiempoPosSol").disable();
    this.formulario.get("tecnologia").disable();
    this.formulario.get("nivel1").disable();
    this.formulario.get("nivel2").disable();
    this.formulario.get("nivel3").disable();
    this.formulario.get("nivel4").disable();
    this.formulario.get("fechaIngreso").disable();
		this.formulario.reset();
		this.initForm();
  }

  setearMultiple(){
    this.selectsTotalFlags = {
      nivel1: {
        TODOS: false,
        message: "",
      },
      nivel2: {
        TODOS: false,
        message: "",
      },
      nivel3: {
        TODOS: false,
        message: "",
      },
      nivel4: {
        TODOS: false,
        message: "",
      },
    };
  }

  cambioEstado(event:any){
    var fechaLocal=new Date();
      this.fechaFin.nativeElement.valueAsDate = fechaLocal;
      this.horaFin.nativeElement.value = fechaLocal.toTimeString().substring(0,5);
    if(event=="SOLUCIONADO" || event=="ELIMINADO"){
      this.fechaFin.nativeElement.disabled = true;
      this.horaFin.nativeElement.disabled = true;
    }else{
      this.fechaFin.nativeElement.disabled = false;
      this.horaFin.nativeElement.disabled = false;
    }
  }
}
