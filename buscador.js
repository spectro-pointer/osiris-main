
const baseURL = "http://192.168.1.30/"

const cameras = [{
  label: "camera1",
  description: "Zonn SONY",
  source: "http://192.168.1.57:8086/video_feed",
  azimuth: { inMin: 0.001, inMax: 1, outMin: 0, outMax: 360 },
  elevation: { inMin: 0.001, inMax: 1, outMin: 45, outMax:-25 }
},
{
  label: "camera2",
  description: "py_angular",
  source: "http://192.168.1.210:8088/video_feed",
  azimuth: { inMin: 0.001, inMax: 1, outMin: 45, outMax: 90 },
  elevation: { inMin: 0.001, inMax: 1, outMin: 45, outMax: -25 }
},
{
  label: "camera3",
  description: "py_telex",
  source: "http://192.168.1.210:8088/video_feed",
  azimuth: { inMin: 0.001, inMax: 1, outMin: 90, outMax: 135 },
  elevation: { inMin: 0.001, inMax: 1, outMin: 45, outMax: -25 }


}];

function initCameras() {

  const target = document.getElementById("buscador");

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

/*
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

*/



















// control joisty
 /*
var control = document.getElementById("joystick-control");
var base = document.getElementById("joystick-base");

var dragging = false;
var baseRect = base.getBoundingClientRect();
var baseCenterX = baseRect.left + baseRect.width / 2;
var baseCenterY = baseRect.top + baseRect.height / 2;
var maxRadius = baseRect.width / 2 - control.offsetWidth / 2;

control.style.left = baseRect.width / 2 - control.offsetWidth / 2 + "px";
control.style.top = baseRect.height / 2 - control.offsetHeight / 2 + "px";

control.addEventListener("mousedown", function() {
  dragging = true;
});

window.addEventListener("mouseup", function() {
  dragging = false;
  control.style.left = baseRect.width / 2 - control.offsetWidth / 2 + "px";
  control.style.top = baseRect.height / 2 - control.offsetHeight / 2 + "px";
});

window.addEventListener("mousemove", function(event) {
  if (dragging) {
    var x = event.clientX - baseCenterX;
    var y = event.clientY - baseCenterY;

    var distance = Math.sqrt(x * x + y * y);
    if (distance < maxRadius) {
      control.style.left = x + baseRect.width / 2 - control.offsetWidth / 2 + "px";
      control.style.top = y + baseRect.height / 2 - control.offsetHeight / 2 + "px";
    }
  }
});

// ...
var azimuth = 0, elevation = 0;
var increment = 1;  // Define the amount by which azimuth and elevation will change

window.addEventListener("mousemove", function(event) {
  if (dragging) {
    var x = event.clientX - baseCenterX;
    var y = event.clientY - baseCenterY;

    var distance = Math.sqrt(x * x + y * y);
    if (distance < maxRadius) {
      control.style.left = x + baseRect.width / 2 - control.offsetWidth / 2 + "px";
      control.style.top = y + baseRect.height / 2 - control.offsetHeight / 2 + "px";

      // Increment or decrement azimuth and elevation based on joystick position
      if (x > 0) {
        azimuthzimuth += increment;
      } azimuth -= increment;
      }

      if (y > 0) {
        elevation += increment;
      } else if (y < 0) {
        elevation -= increment;
      }
      console.log(response);

      // Here you would send the new azimuth and elevation values to the server
      // sendNewValue(azimuth, elevation);
    
  }
});
// ...
*/


