arrayNotas = JSON.parse(localStorage.getItem("arrayNotas")) || [];
arrayNotas.forEach(nota => {
    mostrarNota(nota);
});

arrayNotas.forEach(nota => {
    console.log(nota);
});

// Función para mostrar nota
function mostrarNota(nota){
    // Crear elementos para el DOM
    let listaNotas = document.getElementById("lista_notas");
    let contenedor = document.createElement("div");
    let span = document.createElement("span");
    let date = document.createElement("span");
    let btnDetalles = document.createElement("button");
    // Asignar atributos a los elementos creados
    contenedor.classList.add("notas");
    contenedor.dataset.id = nota.id;
    span.innerText = nota.titulo;
    span.classList.add("titulo")
    date.innerText = nota.fecha;
    btnDetalles.innerText = "Detalles";
    btnDetalles.classList.add("btnDetalles");
    // Anexar los elementos al DOM
    contenedor.appendChild(span);  
    contenedor.appendChild(date);
    contenedor.appendChild(btnDetalles);
    listaNotas.appendChild(contenedor);
}

function crearEditarFormularioNuevaTarea(boton, nota){
    let contenedor = document.getElementById("contenido_notas");
    let contenedorBotones = document.createElement("div");
    let textarea = document.createElement("textarea");
    let btnEliminar = document.createElement("button")
    let btnGuardar = document.createElement("button");
    // Crear elementos dentro del contenedor
    contenedor.innerHTML = "";
    contenedor.innerHTML = `
        <input type="text" id="txtTitulo" placeholder="Escribe el titulo...">
    `;
    // Asignar atributos
    contenedorBotones.id = "contenedorBotones";
    btnEliminar.classList.add("btnEliminar");
    btnEliminar.innerText = "Eliminar";
    btnGuardar.classList.add("btnGuardar");
    btnGuardar.innerText = "Guardar";
    if (boton === "Nuevo"){
        textarea.placeholder = "Escribe el contenido...";
    } else if (boton === "Detalles"){
        document.getElementById("txtTitulo").value = nota.titulo;
        textarea.value = nota.contenido;
    }
    textarea.id = "txtContenido";
    textarea.cols = 30;
    textarea.style.resize = "none";
    // Agregar eventos al textarea y al boton
    textarea.addEventListener("input", function(){
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });
    btnGuardar.addEventListener("click", function(){
        // Obtenemos el titulo y contenido de la nota
        let txtTitulo = document.getElementById("txtTitulo").value;
        let txtContenido = document.getElementById("txtContenido").value;
        if (boton === "Nuevo"){
            // Creamos el objeto que almacenará la nota
            let objNota = {id: Date.now(), titulo: txtTitulo, contenido: txtContenido, fecha: new Date().toLocaleDateString("en-US")};
            // Mostramos la nota en el DOM
            mostrarNota(objNota);
            // Guardamos el objeto en el array
            arrayNotas.push(objNota);
        } else if (boton === "Detalles"){
            // Creamos devuelta el array pero con el titulo y contenido editado manteniendo el id
            arrayNotas = arrayNotas.map(n => 
                n.id === nota.id ? {...n, titulo: txtTitulo, contenido: txtContenido}: n);
            // Borramos y volvemos a renderizar los elementos
            document.getElementById("lista_notas").innerHTML = "";
            arrayNotas.forEach(nota => {
            mostrarNota(nota);
            });
        }
        // Pasamos el array al localStorage
        localStorage.setItem("arrayNotas",JSON.stringify(arrayNotas));
        eliminarFormularioNuevaTarea();
    });
    btnEliminar.addEventListener("click", function(){
        // Filtramos el array de notas para excluir la nota seleccionada y asi eliminarla
        arrayNotas = arrayNotas.filter(n => n.id !== nota.id );
        // Borramos y volvemos a renderizar los elementos
        document.getElementById("lista_notas").innerHTML = "";
            arrayNotas.forEach(nota => {
            mostrarNota(nota);
        });
        localStorage.setItem("arrayNotas",JSON.stringify(arrayNotas));
        eliminarFormularioNuevaTarea()
   });
    // Anexar el textarea y botones al contenedor
    contenedorBotones.appendChild(btnEliminar);
    contenedorBotones.appendChild(btnGuardar);
    contenedor.appendChild(textarea);
    contenedor.appendChild(contenedorBotones);
};

function eliminarFormularioNuevaTarea(){
    document.getElementById("contenido_notas").innerHTML = "";
}


// Se edita la nota seleccionada
document.getElementById("lista_notas").addEventListener("click", function(e){
    if (e.target.tagName === "BUTTON"){
        // Buscamos el div más cercano al botón "detalles" presionado y obtenemos su dataset.id
        let div = e.target.closest("div");
        let DOMid = Number(div.dataset.id);
        // Buscamos en el array de notas la nota correspondiente al id de la nota seleccionada
        let itemNota = arrayNotas.find(nota => nota.id === DOMid);
        crearEditarFormularioNuevaTarea(e.target.innerText, itemNota);
    }
});

// Se crea una nueva nota
document.getElementById("btnCrearNota").addEventListener("click", function(){
    crearEditarFormularioNuevaTarea(this.innerText);
});

// Buscador con filtro al momento para las notas
document.getElementById("txtBuscador").addEventListener("input", function(e){
    // Cada que cambia el input se obtiene el texto ingresado
    let textoBuscado = e.target.value.toLowerCase();
    // Se obtienen todos los elementos con la clase "titulo"
    let titulosDOM = document.querySelectorAll(".titulo");
    // Por cada titulo se hará lo siguiente
    titulosDOM.forEach(titulo => {
        let textoTitulo = titulo.innerText.toLowerCase();
        if(textoTitulo.includes(textoBuscado)){
            titulo.parentElement.style.display = "block";
        } else{
            titulo.parentElement.style.display = "none";
        }
    })
});