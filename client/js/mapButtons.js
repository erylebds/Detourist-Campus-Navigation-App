/*
  - Tracks scale and translation for zooming and panning the map.
  - Zoom buttons, mouse wheel, and double-click adjust scale.
  - Mouse drag updates translation for panning.
  - Dark mode toggles CSS filter inversion for map and overlay canvas.
*/

const mapContainer = document.getElementById("campusMap");
let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX, startY;

function updateTransform() {
  if (!mapContainer) return;
  mapContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

if (mapContainer) {
  document.getElementById('zoomIn').addEventListener("click", () => {
    scale += 0.1;
    updateTransform();
  });

  document.getElementById('zoomOut').addEventListener("click", () => {
    if (scale > 0.3) scale -= 0.1;
    updateTransform();
  });

  mapContainer.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.deltaY < 0) scale += 0.1;
    else if (scale > 0.3) scale -= 0.1;
    updateTransform();
  });

  mapContainer.addEventListener("dblclick", (e) => {
    scale += 0.2;
    updateTransform();
  });

  mapContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });


  let darkMode = localStorage.getItem("darkMode") == "true";

  if (darkMode) {
    toggleDarkMode();
  }

  document.getElementById("darkMode")
    .addEventListener("click", () => {
      darkMode = !darkMode;
      localStorage.setItem("darkMode", darkMode);
      toggleDarkMode();
    });

  function toggleDarkMode() {
    let mapWrapper = document.getElementById("mapWrapper");
    let darkModeBtn = document.getElementById("darkMode");

    mapWrapper.classList.toggle('dark-mode');
    darkModeBtn.innerHTML = darkMode ? "☾" : "☼";
  }
}