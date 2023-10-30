const baseURL = "http://192.168.1.30/"

const cameras = [{
  label: "camera1",
  description: "vision 0 a 45 ",
  source: "http://192.168.1.161:8001/video_feed",
  azimuth: { inMin: 0.001, inMax: 1, outMin: 0, outMax: 45 },
  elevation: { inMin: 0.001, inMax: 1, outMin: 45, outMax:-25 }
},
{
  label: "camera2",
  description: "vision 45 a 90 degres",
  source: "http://192.168.1.74:8002/video_feed",
  azimuth: { inMin: 0.001, inMax: 1, outMin: 45, outMax: 90 },
  elevation: { inMin: 0.001, inMax: 1, outMin: 45, outMax: -25 }
},
{
  label: "camera3",
  description: "vision 90 a 135 degres",
  source: "http://192.168.1.226:8003/video_feed",
  azimuth: { inMin: 0.001, inMax: 1, outMin: 90, outMax: 135 },
  elevation: { inMin: 0.001, inMax: 1, outMin: 45, outMax: -25 }
},
{
  label: "camera4",
  description: "vision 135 a 180 degres",
  source: "http://192.168.1.169:8004/video_feed",
  azimuth: { inMin: 0.001, inMax: 1, outMin: 135, outMax: 180 },
  elevation: { inMin: 0.001, inMax: 1, outMin: 45, outMax: -25 }
},
{
  label: "camera5",
  description: "vision 180 a 225 degres",
  source: "http://192.168.1.80:8005/video_feed",
  azimuth: { inMin: 0.001, inMax: 1, outMin: 180, outMax: 225 },
  elevation: { inMin: 0.001, inMax: 1, outMin: 45, outMax: -25 }
},
{
  label: "camera6",
  description: "vision 225 a 270 Degres",
  source: "http://192.168.1.225:8006/video_feed",
  azimuth: { inMin: 0.001, inMax: 1, outMin: 225, outMax: 270 },
  elevation: { inMin: 0.001, inMax: 1, outMin: 45, outMax: -25 }
},
{
  label: "camera7",
  description: "vision 270 a 315 Degres",
  source: "http://192.168.1.99:8007/video_feed",
  azimuth: { inMin: 0.001, inMax: 1, outMin: 270, outMax: 315 },
  elevation: { inMin: 0.001, inMax: 1, outMin: 45, outMax: -25 }
},
{
  label: "camera8",
  description: "vision 315 a 360 Degres",
  source: "http://192.168.1.63:8008/video_feed",
  azimuth: { inMin: 0.001, inMax: 1, outMin: 315, outMax: 360 },
  elevation: { inMin: 0.001, inMax: 1, outMin: 45, outMax: -25 }
}];

function initCameras() {

  const target = document.getElementById("cameras");

  for (const camera of cameras) {
    const topElement = document.createElement("div");
    topElement.className = "top";
    topElement.innerHTML = `
    <h2>${camera.label}</h2>
    <p>${camera.description}</p>
    `
    const cameraElement = document.createElement("div");
    topElement.appendChild(cameraElement);
    cameraElement.className = "video-container";
    cameraElement.innerHTML = `
      <img class="video" id="${camera.label}" src="${camera.source}">
      <svg class="azimuth" width="100%" height="100%" id="azimuth_${camera.label}"></svg>
      <svg class="elevation" width="100%" height="100%" id="elevation_${camera.label}"></svg>
      <div class="mouseCoordinates" id="mouseCoordinates_${camera.label}"></div>`;
    target?.appendChild(topElement);

    const videoPlayer = document.getElementById(camera.label);
    addListener(videoPlayer);



  }
}

initCameras();

const buttons = document.querySelector('.control-buttons');

buttons.addEventListener('mousedown', function(event) {
  // El cursor del ratón en el momento del evento de ratón
  let shiftX = event.clientX - buttons.getBoundingClientRect().left;
  let shiftY = event.clientY - buttons.getBoundingClientRect().top;

  // Centra el buttons bajo el cursor
  function moveAt(pageX, pageY) {
    buttons.style.left = pageX - shiftX + 'px';
    buttons.style.top = pageY - shiftY + 'px';
  }

  // Mueve el buttons al momento del click del ratón
  moveAt(event.pageX, event.pageY);

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // Mueve el buttons al mover el ratón
  document.addEventListener('mousemove', onMouseMove);

  // Suelta el buttons al soltar el botón del ratón
  buttons.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    buttons.onmouseup = null;
  };

});

// Previene el comportamiento por defecto del navegador
buttons.ondragstart = function() {
  return false;
};

// Valores iniciales
let lastAzimuth = 0;
let lastElevation = 0;

// Define los incrementos
const azimutIncremento = 1; // Ajusta este valor según sea necesario
const elevacionIncremento = 1; // Ajusta este valor según sea necesario

// Cuando se haga clic en las flechas, modifica los últimos valores de azimut y elevación y envía una nueva petición.
document.getElementById('boton-azimut-incrementar').addEventListener('click', () => enviarNuevoValor(lastAzimuth + azimutIncremento, lastElevation));
document.getElementById('boton-azimut-decrementar').addEventListener('click', () => enviarNuevoValor(lastAzimuth - azimutIncremento, lastElevation));
document.getElementById('boton-elevacion-incrementar').addEventListener('click', () => enviarNuevoValor(lastAzimuth, lastElevation + elevacionIncremento));
document.getElementById('boton-elevacion-decrementar').addEventListener('click', () => enviarNuevoValor(lastAzimuth, lastElevation - elevacionIncremento));
// function.js or init.js
// modo nocturno
document.getElementById('night-mode-toggle').onclick = function() {
  document.body.classList.toggle('night-mode');
}

// Historial de valores
let azimuthHistory = [];
let elevationHistory = [];

async function enviarNuevoValor(azimut, elevacion) {
  lastAzimuth = Math.round(azimut);
  lastElevation = Math.round(elevacion);

  // Actualiza el historial y el texto de los elementos
  azimuthHistory.push(lastAzimuth);
  elevationHistory.push(lastElevation);

  // limitar los array 
  if (azimuthHistory.length > 5) {
    azimuthHistory = azimuthHistory.slice(-5);
    elevationHistory = elevationHistory.slice(-5);
  }

  document.getElementById('azimuth-display').textContent = `Azimuth: ${lastAzimuth}`;
  document.getElementById('azimuth-history').textContent = `Historial de Azimuth: ${azimuthHistory.join(', ')}`;
  document.getElementById('elevation-display').textContent = `Elevación: ${lastElevation}`;
  document.getElementById('elevation-history').textContent = `Historial de Elevación: ${elevationHistory.join(', ')}`;

  const url = baseURL + lastAzimuth + "," + lastElevation;
  const response = await fetch(url);
  console.log(response);
}
// funcion test mausi sacada de funcion
function getMousePosition(event) {
  const cameraLabel = event.target.id
  const camera = cameras.find((camera) => camera.label === cameraLabel);
  const rect = document.getElementById(cameraLabel).getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const azimuthDegrees = mapRange(mouseX / rect.width, camera?.azimuth);
  const elevationDegrees = mapRange(mouseY / rect.height, camera?.elevation);

  return { mouseX, mouseY, azimuthDegrees, elevationDegrees };
}



function mapRange(value, options) {
  const { inMin, inMax, outMin, outMax } = options;
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}