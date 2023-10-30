



function addListener(videoPlayer) {
  videoPlayer.addEventListener("click", async (event) => {
    const { azimuthDegrees, elevationDegrees } = getMousePosition(event);
    await enviarNuevoValor(azimuthDegrees, elevationDegrees);
  })

  videoPlayer.addEventListener("mousemove", (event) => {
    const cameraLabel = event.target.id
    const { mouseX, mouseY, azimuthDegrees, elevationDegrees } = getMousePosition(event);
    const mouseCoordinates = document.getElementById("mouseCoordinates_" + event.target.id);
    const azimuth = document.getElementById("azimuth_" + cameraLabel);
    const elevation = document.getElementById("elevation_" + cameraLabel);
    mouseCoordinates.textContent = "Azimuth: " + azimuthDegrees.toFixed(2) + ", Elevation: " + elevationDegrees.toFixed(2);
    azimuth.innerHTML = '<line x1="0" y1="' + mouseY + '" x2="' + event.target.clientWidth + '" y2="' + mouseY + '" class="mouse-line"/>';
    elevation.innerHTML = '<line x1="' + mouseX + '" y1="0" x2="' + mouseX + '" y2="' + event.target.clientHeight + '" class="mouse-line"/>';
  });
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

