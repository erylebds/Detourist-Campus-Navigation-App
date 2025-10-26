document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.querySelector(".campus-map");
  const map = mapContainer.querySelector("img");

  mapContainer.style.position = "relative";

  fetch("database/get_rooms.php")
    .then(response => response.json())
    .then(rooms => {
      rooms.forEach(room => {
        const marker = document.createElement("div");
        marker.classList.add("room-marker");

        // Position markers using percentage coordinates
        marker.style.position = "absolute";
        marker.style.left = `${room.x_coord}%`;
        marker.style.top = `${room.y_coord}%`;
        marker.style.transform = "translate(-50%, -50%)";

        mapContainer.appendChild(marker);
      });
    });
});