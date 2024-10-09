const crudForm = document.querySelector('.crud__form');
const crudButton = document.querySelector('.crud__button');
const listaContenido = document.querySelector('.lista__contenido');
const crudErase = document.querySelector('.crud__erase');
let listaTotales = [];
let editando = false;
let indiceEdicion = -1;
let crudTiempo =  document.querySelector('.crud__tiempo');
let filtroTareas = document.querySelector('.filtro__tareasCompletadas');

crudButton.addEventListener('click', enviar);

function enviar(e) {
    e.preventDefault();
    const selectedCategory = document.querySelector('input[name="tipo"]:checked');
    if (crudForm.value === '') {
        formVacio();
    } 
    else if(crudTiempo.value === ""){
        tiempoVacio();
    } 
    else if (!selectedCategory) {
        checkBoxVacio();
    } 
    else {
        if (editando) {
            listaTotales[indiceEdicion].texto = crudForm.value;
            listaTotales[indiceEdicion].categoria = selectedCategory.value;
            listaTotales[indiceEdicion].fecha = crudTiempo.value;
            listaTotales[indiceEdicion].completado = listaTotales[indiceEdicion].completado || false;
            editando = false;
            indiceEdicion = -1;
        } else {
            listaTotales.push({ texto: crudForm.value, categoria: selectedCategory.value, fecha: crudTiempo.value, completado: false});
        }
        mostrarDatos();
        crudForm.value = '';
    }
}

function mostrarDatos() {
    while (listaContenido.firstChild) {
        listaContenido.removeChild(listaContenido.firstChild);
    }

    while (filtroTareas.firstChild) {
        filtroTareas.removeChild(filtroTareas.firstChild);
    }

    listaTotales.forEach((lista, index) => {
        const divAgrupada = document.createElement('div');
        divAgrupada.classList.add('lista__agrupada');

        const listaMostrar = document.createElement('p');
        listaMostrar.classList.add('lista__mostrar');
        listaMostrar.textContent = lista.texto;

        const listaBotones = document.createElement('div');
        listaBotones.classList.add('lista__botones');

        // Asigna la clase según la categoría
        listaMostrar.classList.add(`color-${lista.categoria}`);

        //creacion de la fecha de vencimiento
        const fechaVencimiento = document.createElement('p');
        fechaVencimiento.classList.add("lista__fechaVencimiento");
        fechaVencimiento.textContent = `fecha de vencimiento: ${lista.fecha}`;

        const formCheck = document.createElement('form');
        formCheck.classList.add('lista__formCheck');

        const check = document.createElement('input');
        check.type= 'checkbox';
        check.id ='completado';
        check.name = "lista__check";
        check.value = "completado";
        check.classList.add('lista__check');

        const labelCheck = document.createElement('label');
        // labelCheck.htmlFor = "completado";
        labelCheck.textContent = 'se completo la tarea?';


        const listaUpdate = document.createElement('button');
        listaUpdate.classList.add('lista__update');
        listaUpdate.innerHTML = `Modificar Lista <i class="fa-solid fa-pencil"></i>`;

        listaUpdate.onclick = (e) => {
            e.preventDefault();
            crudForm.value = lista.texto;
            document.querySelector(`input[name="tipo"][value="${lista.categoria}"]`).checked = true;
            editando = true;
            indiceEdicion = index;
        };

        const listaDelete = document.createElement('button');
        listaDelete.classList.add('lista__delete');
        listaDelete.innerHTML = `Eliminar Lista <i class="fa-solid fa-eraser"></i>`;

        listaDelete.onclick = (e) => {
            e.preventDefault();
            listaTotales = listaTotales.filter((_, listIndex) => listIndex !== index);
            mostrarDatos();
        };

        listaBotones.appendChild(listaUpdate);
        listaBotones.appendChild(listaDelete);
        formCheck.appendChild(check);
        formCheck.appendChild(labelCheck);
        divAgrupada.appendChild(listaMostrar);
        divAgrupada.appendChild(formCheck);
        divAgrupada.appendChild(fechaVencimiento);
        listaContenido.appendChild(divAgrupada);
        divAgrupada.appendChild(listaBotones);

        //convertir el input string a objeto Date
        const fechaSeleccionada = new Date(lista.fecha);
        const fechaActual = new Date();

        // Normalizamos ambas fechas para que solo se tengan en cuenta el año, mes y día (ignorando la hora)
        const fechaSeleccionadaSinHora = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), fechaSeleccionada.getDate());
        const fechaActualSinHora = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());

        // Comparación
        if (fechaSeleccionadaSinHora.getTime() === fechaActualSinHora.getTime()) {
            console.log('La fecha seleccionada es hoy.');
        } else if (fechaSeleccionadaSinHora.getTime() > fechaActualSinHora.getTime()) {
            console.log('La fecha seleccionada es en el futuro.');
        } else {
            console.log('La fecha seleccionada es en el pasado.');
            listaUpdate.disabled='true';
            listaUpdate.style.backgroundColor = "#cdd";
            listaUpdate.style.cursor = "auto";
            fechaVencimiento.textContent = "SE VENCIO LA NOTA";
            labelCheck.style.display = 'none';
            check.style.display ="none";
        }
    // Verifica si la tarea está completada
    if (lista.completado) {
        check.checked = true;
        listaUpdate.style.display = "none";
        listaDelete.style.display = "none";
        fechaVencimiento.textContent = "TAREA COMPLETADA";
        filtroTareas.appendChild(divAgrupada); // Mueve la tarea completada al contenedor de filtrado

    } else {
        listaContenido.appendChild(divAgrupada); // Solo añade las tareas no completadas a la lista principal
    }

        check.addEventListener('change',(e)=>{ //se activa cuando cambia algo en este caso el check
               // Actualizar el estado en la lista
            listaTotales[index].completado = e.target.checked;
            if (e.target.checked) {

                listaUpdate.style.display = "none";
                listaDelete.style.display = "none";
                fechaVencimiento.textContent = "TAREA COMPLETADA";
                filtroTareas.appendChild(divAgrupada);
            }
            else {
                // Si se desmarcó como completado
                listaUpdate.style.display = "inline-block";
                listaDelete.style.display = "inline-block";
                fechaVencimiento.textContent = `fecha de vencimiento: ${lista.fecha}`;
                listaContenido.appendChild(divAgrupada);
            }
        })
    });
}


function formVacio() {
    const error = document.createElement('P');
    error.textContent = "El formulario está vacío";
    error.classList.add('error');
    crudForm.parentElement.appendChild(error);

    setTimeout(() => {
        error.remove();
    }, 3000);
}

function checkBoxVacio() {
    const error = document.createElement('P');
    error.textContent = "El checkbox está vacío";
    error.classList.add('error');
    crudForm.parentElement.appendChild(error);

    setTimeout(() => {
        error.remove();
    }, 3000);
}

function tiempoVacio(){
    const error = document.createElement('P');
    error.textContent = "La fecha de vencimiento está vacío";
    error.classList.add('error');
    crudForm.parentElement.appendChild(error);

    setTimeout(() => {
        error.remove();
    }, 3000);
}

crudErase.onclick = (e) => {
    e.preventDefault();
    listaTotales = [];
    mostrarDatos();
};

