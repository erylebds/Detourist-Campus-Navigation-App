const mapContainer = document.getElementById("campusMap");
let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX, startY;

function updateTransform() {
  mapContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

//ZOOM IN
document.getElementById('zoomIn').addEventListener("click", () => {
  scale += 0.1;
  updateTransform();
});

//ZOOM OUT
document.getElementById('zoomOut').addEventListener("click", () => {
  if (scale > 0.3) scale -= 0.1;
  updateTransform();
});

//ZOOM USING MOUSE SCROLL WHEEL
mapContainer.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (e.deltaY < 0) scale += 0.1;
  else if (scale > 0.3) scale -= 0.1;
  updateTransform();
});

//DOUBLE CLICK FOR ZOOM IN
mapContainer.addEventListener("dblclick", (e) => {
  scale += 0.2;
  updateTransform();
});

//LET USER DRAG MAP
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
