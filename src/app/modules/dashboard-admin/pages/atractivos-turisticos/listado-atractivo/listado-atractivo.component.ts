import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrestadorTuristico } from 'src/app/common/place.interface';
import { PrestadoresService } from 'src/app/core/services/prestadores.service';

@Component({
  selector: 'app-listado-atractivo',
  templateUrl: './listado-atractivo.component.html',
  styleUrls: ['./listado-atractivo.component.css']
})
export class ListadoAtractivoComponent implements OnInit {

  //?Página donde estamos, propiedad para la paginación
  page: number = 1;

  //? -> Propiedad para el Pipe en el filtro de texto
  filterPost: string = '';

  //? -> Propiedad para el Pipe en el filtro por botón de Servicios
  servicio: string = 'todos'; //Almacena el valor de la opción que se elija en el botón a filtrar.

  //? -> Propiedad para el Pipe en el filtro por botón de Municipios
  municipio: string = 'todos'; //Almacena el valor de la opción que se elija en el botón a filtrar.

  //? -> Propiedad para almacenar el arreglo de objetos que nos va a traer la BD al disparar el método getPrestadores, la utilizamos para Bandear los datos en el html de list y mostrar los datos
  prestadores: PrestadorTuristico[] = [];

  //? -> Inyecciones de dependencias
  constructor(
    private prestadoresService: PrestadoresService, // Inyectamos el servicio
    private router: Router, // Clase Router para moverme a otro componente una vez enviado el form
  ) {

  }

  ngOnInit() {
    //Lo ejecutamos en el método OnInit para que dispare el método getPrestadores y me cargue los datos apenas se cargue el componente. Además de que disparamos el cold Observable para que se actualizen los datos a tiempo real.
    this.getPrestadores();
  }

  //? -> Método para obtener los elementos de la BD
  getPrestadores() {
    //? -> Aquí nos suscribimos a nuestro observable desde el método de nuestro servicio para que esté atento a los cambios que se hagan a tiempo real.
    this.prestadoresService.obtenerPrestadores().subscribe(data => {
      // data nos trae un arreglo con el conjunto de elemento de tipo Object - Arreglo de Objetos
      // console.log(data);
      this.prestadores = data; //Pasamos la información a una propiedad nativa de la clase para hacer el Banding
    })
  }


  //? -> Método para eliminar un Prestador
  eliminarPrestador(prestador: any) {
    //Primero borramos los datos del Storage ya que necesitamos el path de la imágenes que tiene nuestro objeto guardado en Firestore
    // Hacer Validación de si exísten imágenes para borrar en cada caso
    this.prestadoresService.borrarImagenesPrestador(prestador);

    //Aquí eliminamos los datos de Firestore
    this.prestadoresService.borrarPrestador(prestador)
    .then(() => {
      alert('Prestador Turistico Eliminado');
    })
    .catch(error => console.log(error));
  }

  //? -> Método para obtener objeto a actualizar y enviarlo por medio de Observables
  obtenerPrestador(prestador: any) {
    //Utilizamos un BehaviorSubject para obtener el dato que queremos actualizar
    this.prestadoresService.editPrestadorData = prestador;
    this.router.navigate(['/dashboard-admin/pagina-inicio/editar-prestadores-turisticos']);
  }

  //? -> Método para filtrar por medio del botón
  applyFilterServices(selectedCategory: any) {
    this.servicio = selectedCategory.target.value; // Obtenemos el valor seleccionado en el html.
    this.servicio = this.servicio.toLowerCase(); // Los valores de las opciones pasan a minúsculas para comparar.
  } //Fin Función applyFilterServices

  //? -> Método para filtrar por medio del botón
  applyFilterMunicipio(selectedCategory: any) {
    this.municipio = selectedCategory.target.value; // Obtenemos el valor seleccionado en el html.
    this.municipio = this.municipio.toLowerCase(); // Los valores de las opciones pasan a minúsculas para comparar.
  } //Fin Función applyFilterServices

}
