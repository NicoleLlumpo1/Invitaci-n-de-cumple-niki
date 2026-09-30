/* ===== REFERENCIAS AL DOM ===== */
const trazadoMarcoOndulado = document.getElementById("trazadoMarcoOndulado");
const botonConfirmarSi = document.getElementById("botonConfirmarSi");
const botonConfirmarNo = document.getElementById("botonConfirmarNo");
const contenedorBotonesAsistencia = document.getElementById("contenedorBotonesAsistencia");
const mensajeAsistenciaConfirmada = document.getElementById("mensajeAsistenciaConfirmada");
const textoPreguntaAsistencia = document.getElementById("textoPreguntaAsistencia");

const frasesCuandoElNoEscapa = [
  "¿Venís?", "Ehh, ¿seguro?", "No se puede 😏", "Dale, decí que sí", "Ese botón no anda 🙈", "Rendite 💖"
];
let cantidadDeEscapesDelBotonNo = 0;

/* ===== DIBUJO DEL MARCO ONDULADO ===== */
function funcionGenerarTrazadoMarcoOndulado() {
  const izquierda = 62, derecha = 560, arriba = 80, abajo = 880;
  const amplitud = 17, ondasHorizontales = 6, ondasVerticales = 12, paso = 0.01;
  const puntos = [];
  for (let t = 0; t <= 1; t += paso) puntos.push([izquierda + t * (derecha - izquierda), arriba - amplitud * Math.sin(t * ondasHorizontales * 2 * Math.PI)]);
  for (let t = 0; t <= 1; t += paso) puntos.push([derecha + amplitud * Math.sin(t * ondasVerticales * 2 * Math.PI), arriba + t * (abajo - arriba)]);
  for (let t = 1; t >= 0; t -= paso) puntos.push([izquierda + t * (derecha - izquierda), abajo + amplitud * Math.sin(t * ondasHorizontales * 2 * Math.PI)]);
  for (let t = 1; t >= 0; t -= paso) puntos.push([izquierda - amplitud * Math.sin(t * ondasVerticales * 2 * Math.PI), arriba + t * (abajo - arriba)]);
  return "M" + puntos.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L") + " Z";
}

/* ===== BOTÓN "NO" QUE ESCAPA ===== */
function funcionHacerEscaparBotonNo(evento) {
  if (evento) evento.preventDefault();
  cantidadDeEscapesDelBotonNo++;

  const ancho = botonConfirmarNo.offsetWidth;
  const alto = botonConfirmarNo.offsetHeight;
  const maximoHorizontal = window.innerWidth - ancho - 10;
  const maximoVertical = window.innerHeight - alto - 10;
  const posicionActual = botonConfirmarNo.getBoundingClientRect();

  // Elegir un lugar random que esté lejos de donde estaba
  let nuevoX, nuevoY, intentos = 0;
  do {
    nuevoX = 10 + Math.random() * Math.max(maximoHorizontal - 10, 0);
    nuevoY = 10 + Math.random() * Math.max(maximoVertical - 10, 0);
    intentos++;
  } while (intentos < 20 && Math.hypot(nuevoX - posicionActual.left, nuevoY - posicionActual.top) < 150);

  botonConfirmarNo.classList.add("botonEscapando");
  document.documentElement.style.setProperty("--posicionHorizontalBotonNo", nuevoX + "px");
  document.documentElement.style.setProperty("--posicionVerticalBotonNo", nuevoY + "px");

  textoPreguntaAsistencia.textContent = frasesCuandoElNoEscapa[cantidadDeEscapesDelBotonNo % frasesCuandoElNoEscapa.length];
  botonConfirmarNo.blur();
}

// Mouse, touch, click y teclado: por cualquier vía se escapa
["pointerenter", "pointerdown", "touchstart", "click", "focus"].forEach(nombreEvento => {
  botonConfirmarNo.addEventListener(nombreEvento, funcionHacerEscaparBotonNo, { passive: false });
});

/* ===== CONFIRMAR ASISTENCIA ===== */
function funcionConfirmarAsistencia() {
  contenedorBotonesAsistencia.classList.add("oculto");
  botonConfirmarNo.classList.add("oculto");
  textoPreguntaAsistencia.classList.add("oculto");
  mensajeAsistenciaConfirmada.classList.remove("oculto");
}
botonConfirmarSi.addEventListener("click", funcionConfirmarAsistencia);

/* ===== INICIO ===== */
trazadoMarcoOndulado.setAttribute("d", funcionGenerarTrazadoMarcoOndulado());

/* ===== CUENTA REGRESIVA ===== */
const fechaDeLaFiesta = new Date("2026-10-03T20:00:00-03:00");
const numeroDias = document.getElementById("numeroDias");
const numeroHoras = document.getElementById("numeroHoras");
const numeroMinutos = document.getElementById("numeroMinutos");
const numeroSegundos = document.getElementById("numeroSegundos");
const cuentaRegresiva = document.getElementById("cuentaRegresiva");
const mensajeFiestaHoy = document.getElementById("mensajeFiestaHoy");

function funcionActualizarCuentaRegresiva() {
  const milisegundosFaltantes = fechaDeLaFiesta - new Date();

  if (milisegundosFaltantes <= 0) {
    cuentaRegresiva.classList.add("oculto");
    mensajeFiestaHoy.classList.remove("oculto");
    return;
  }

  const segundosTotales = Math.floor(milisegundosFaltantes / 1000);
  numeroDias.textContent = Math.floor(segundosTotales / 86400);
  numeroHoras.textContent = Math.floor((segundosTotales % 86400) / 3600);
  numeroMinutos.textContent = Math.floor((segundosTotales % 3600) / 60);
  numeroSegundos.textContent = segundosTotales % 60;
}

funcionActualizarCuentaRegresiva();
setInterval(funcionActualizarCuentaRegresiva, 1000);