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
  // ZOOM IN
  document.getElementById('zoomIn').addEventListener("click", () => {
    scale += 0.1;
    updateTransform();
  });

  // ZOOM OUT
  document.getElementById('zoomOut').addEventListener("click", () => {
    if (scale > 0.3) scale -= 0.1;
    updateTransform();
  });

  // ZOOM USING MOUSE SCROLL WHEEL
  mapContainer.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.deltaY < 0) scale += 0.1;
    else if (scale > 0.3) scale -= 0.1;
    updateTransform();
  });

  // DOUBLE CLICK FOR ZOOM IN
  mapContainer.addEventListener("dblclick", (e) => {
    scale += 0.2;
    updateTransform();
  });

  // DRAG MAP
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

  document.getElementById("nightMode")
    .addEventListener("click", () => {
      let mapWrapper = document.getElementById("mapWrapper");
      if (!mapWrapper) return;
      if (mapWrapper.style.filter === "invert(1)") {
        mapWrapper.style.filter = "none";
        document.getElementById("map-line-canvas").style.filter = "none";
        document.getElementById("nightMode").innerHTML = "☼";
      } else {
        mapWrapper.style.filter = "invert(1)";
        // Invert the lines on the map again to retain their original color
        document.getElementById("map-line-canvas").style.filter = "invert(1)";
        document.getElementById("nightMode").innerHTML = "☾";
      }
    });
}
