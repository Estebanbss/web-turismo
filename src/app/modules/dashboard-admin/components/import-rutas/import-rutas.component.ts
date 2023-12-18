import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ModalServiceService } from 'src/app/core/services/modal-service.service';
import {Ruta} from 'src/app/core/common/place.interface';
import { PrestadoresService } from 'src/app/core/services/prestadores.service';

@Component({
  selector: 'app-import-rutas',
  templateUrl: './import-rutas.component.html',
  styleUrls: ['./import-rutas.component.css']
})
export class ImportRutasComponent {
  constructor( private MatProgressBarModule: MatProgressBarModule, private modalService: ModalServiceService,     private prestadoresService: PrestadoresService,) {
    this.ruta = {
      //id -> Nos lo da firebase
      name: '',
      descripcion: '',
      googleMaps: '',
      latitud: 0,
      longitud: 0,
      informacionAdicional: '',
      agenciaDeViajes: '',

    }


  }

  closemodal() {
    this.modalService.setModalSuichRutas(false);//cierra el modal
   }

  ngOnInit(): void {

  }


//?->data en crudo formato JSON (esta crudo osea hay que cocinarlo como un pollo asado)
  data:any = [];//almacena el archivo en formato JSON

  //* -> valores de la barra de progreso
  progress:number = 0;//almacena el progreso de la carga del archivo
  mode='determinate'//modo de la barra de progreso
  value:any=0//valor de la barra de progreso
//* ->-----------------------------------------------------------------------

  // ? -> Propiedad para almacenar los archivos antes de cargarlos a la BD
  files: any[] = []; //Presupongo que los archivos son un arreglo de tipo any, no estoy seguro

   // ? -> Propiedad de tipo Object que va a almacenar nuestros datos y se va a pasar a Firestore
  ruta: Ruta;//almacena los datos del prestador turistico


  //? -> Propiedad para almacenar la imágen de portada antes de cargarla a la BD
  portadaFile: any;

  prestarrays:any=[]


datocurioso(){
  this.prestarrays=[]

  for (let index = 0; index < this.data[0].length; index++) {
    this.ruta = {
      //id -> Nos lo da firebase
      name: this.data[0][index].name === undefined  ? '--' : this.data[0][index].name,
      descripcion: this.data[0][index].descripcion === undefined  ? '--' : this.data[0][index].descripcion,
      googleMaps: this.data[0][index].googleMaps === undefined  ? '--' : this.data[0][index].googleMaps,
      latitud: (this.data[0][index].latitud)*1 === undefined || this.data[0][index].latitud === "--" || (this.data[0][index].latitud)*1 === null  ? 0 : (this.data[0][index].latitud)*1,
      longitud: this.data[0][index].longitud * -1 === undefined || this.data[0][index].longitud === "--" || this.data[0][index].longitud * -1 === null  ? 0 : this.data[0][index].longitud * -1,
      informacionAdicional: this.data[0][index].informacionAdicional === undefined  ? '--' : this.data[0][index].informacionAdicional,
      agenciaDeViajes: this.data[0][index].agenciaDeViajes === undefined  ? '--' : this.data[0][index].agenciaDeViajes,

    }
    this.prestarrays.push(this.ruta)
  }

  this.prestadoresService.agregarRutasImportacion(this.prestarrays)
  this.closemodal()
  alert("ya 👍")
}

//? Método para subir el archivo
fileUpload(event:any) {
  this.progress = 0;
  const selectedFile = event.target.files[0];
  const fileReader = new FileReader();

  fileReader.readAsBinaryString(selectedFile);
  fileReader.onprogress = (event) => {
    this.progress = Math.round((event.loaded / event.total) * 100);
    this.value = this.progress;
    console.log(`Progress: ${this.progress}%`);
  };

  fileReader.onload = (event) => {
    let binaryData = event.target?.result;
    let workbook = XLSX.read(binaryData, {type: 'binary'});
    console.log("SheetNames del archivo:", workbook.SheetNames); // Lista todas las hojas
    let targetSheetNames = ["rutas", "routes", "roots", "rutasturisticas"];
    workbook.SheetNames.forEach(sheet => {
      if(targetSheetNames.includes(sheet.toLowerCase().trim())) {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        console.log("Datos de la hoja", sheet, ":", data);
        this.data.push(data);
      }
    });
    console.log("Data final:", this.data); // Muestra el arreglo completo
  }
}
}
