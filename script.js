const form = document.getElementById("registro-form");
const alumnoInput = document.getElementById("alumno-input");
const temaInput = document.getElementById("tema-input");
const estadoSelect = document.getElementById("estado-select");
const filtroEstado = document.getElementById("filtro-estado");
const lista = document.getElementById("lista-registros");
const contador = document.getElementById("contador");
const btnLimpiar = document.getElementById("btn-limpiar");
const bomInfo = document.getElementById("bom-info");

const STORAGE_KEY = "registros_curso_4to";
let registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function mostrarDatosBOM() {
  const protocolo = window.location.protocol;
  const anchoVentana = window.innerWidth;
  const idioma = window.navigator.language;
  bomInfo.textContent = "Protocolo: " + protocolo + " | Ancho: " + anchoVentana + "px | Idioma: " + idioma;
}

mostrarDatosBOM();
window.addEventListener("resize", mostrarDatosBOM);

function guardarRegistros() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}

function renderizar() {
  const filtro = filtroEstado.value;
  lista.innerHTML = "";

  const filtrados = registros.filter(function (item) {
    return filtro === "Todos" ? true : item.estado === filtro;
  });

  contador.textContent = filtrados.length + " de " + registros.length + " registro(s)";

  if (filtrados.length === 0) {
    const vacio = document.createElement("li");
    vacio.className = "item";
    vacio.textContent = "No hay registros para mostrar.";
    lista.appendChild(vacio);
    return;
  }

  filtrados.forEach(function (item) {
    const li = document.createElement("li");
    li.className = "item";

    const info = document.createElement("div");
    info.className = "item-info";

    const titulo = document.createElement("strong");
    titulo.textContent = item.alumno;

    const detalle = document.createElement("span");
    detalle.textContent = "Tema: " + item.tema;

    const badge = document.createElement("span");
    badge.className = "badge " + (item.estado === "Entregado" ? "badge-entregado" : "badge-pendiente");
    badge.textContent = item.estado;

    info.appendChild(titulo);
    info.appendChild(detalle);
    info.appendChild(badge);

    const acciones = document.createElement("div");
    acciones.className = "item-acciones";

    const btnEstado = document.createElement("button");
    btnEstado.type = "button";
    btnEstado.className = "btn-secundario";
    btnEstado.textContent = "Cambiar estado";
    btnEstado.addEventListener("click", function () {
      alternarEstado(item.id);
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn-secundario";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", function () {
      eliminarRegistro(item.id);
    });

    acciones.appendChild(btnEstado);
    acciones.appendChild(btnEliminar);
    li.appendChild(info);
    li.appendChild(acciones);
    lista.appendChild(li);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevoRegistro = {
    id: Date.now(),
    alumno: alumnoInput.value.trim(),
    tema: temaInput.value.trim(),
    estado: estadoSelect.value
  };

  if (!nuevoRegistro.alumno || !nuevoRegistro.tema) return;

  registros.unshift(nuevoRegistro);
  guardarRegistros();
  renderizar();
  form.reset();
  alumnoInput.focus();
});

function alternarEstado(id) {
  registros = registros.map(function (item) {
    if (item.id === id) {
      return {
        id: item.id,
        alumno: item.alumno,
        tema: item.tema,
        estado: item.estado === "Entregado" ? "Pendiente" : "Entregado"
      };
    }
    return item;
  });
  guardarRegistros();
  renderizar();
}

function eliminarRegistro(id) {
  registros = registros.filter(function (item) {
    return item.id !== id;
  });
  guardarRegistros();
  renderizar();
}

btnLimpiar.addEventListener("click", function () {
  if (registros.length === 0) return;
  if (window.confirm("¿Seguro que deseas borrar todos los registros?")) {
    registros = [];
    guardarRegistros();
    renderizar();
  }
});

filtroEstado.addEventListener("change", renderizar);

renderizar();