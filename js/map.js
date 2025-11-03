document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.querySelector(".campus-map");

  fetch("database/get_rooms.php")
    .then(res => res.json())
    .then(rooms => {
      rooms.forEach(room => {
        const marker = document.createElement("div");
        marker.className = "room-marker";

        marker.style.left = `${room.x_coord}%`;
        marker.style.top = `${room.y_coord}%`;

        mapContainer.appendChild(marker);
      });
    });
});