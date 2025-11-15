document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.querySelector(".campus-map");
  const erButton = document.getElementById("er-route");
  let markers = [];

  function clearMarkers() {
    markers.forEach(marker => mapContainer.removeChild(marker));
    markers = [];
  }

  function loadRooms(type) {
    fetch(`database/getEmergencyRoute.php?type=${type}`)
      .then(res => res.json())
      .then(rooms => {
        clearMarkers();
        rooms.forEach(room => {
          const marker = document.createElement("div");
          marker.className = "emergency-marker";
          marker.style.left = `${room.x_coord}%`;
          marker.style.top = `${room.y_coord}%`;
          mapContainer.appendChild(marker);
          markers.push(marker);
        });
      });
  }

  erButton.addEventListener("click", () => {
    loadRooms('safe_route');
  });
});