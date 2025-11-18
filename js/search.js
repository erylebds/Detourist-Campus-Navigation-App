document.addEventListener("DOMContentLoaded", () => {
  // Autocomplete search functionality for a given input
  function setupSearch(inputId, resultsId, excludeInputId = null, imageContainerSelector = null) {
    const searchInput = document.getElementById(inputId);
    const resultsDiv = document.getElementById(resultsId);
    const excludeInput = excludeInputId ? document.getElementById(excludeInputId) : null;
    const imageContainer = imageContainerSelector ? document.querySelector(imageContainerSelector) : null;

    if (!searchInput || !resultsDiv) return;

    // listen for typing in the input field
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();

      // If the input is empty, hide the results
      if (query.length === 0) {
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'none';
        return;
      }

      // IMPORTANT: root-relative path now
      fetch(`database/search.php?room_code=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          resultsDiv.innerHTML = '';

          if (data.length === 0) {
            resultsDiv.style.display = 'none';
            return;
          }

          // Don't show the same room as the source room in the destination input
          const filteredData = excludeInput
            ? data.filter(room => room.room_code !== excludeInput.value)
            : data;

          filteredData.forEach(room => {
            const div = document.createElement('div');
            div.classList.add('autocomplete-item');
            div.textContent = room.room_code;

            div.addEventListener('click', () => {
              searchInput.value = room.room_code;
              resultsDiv.innerHTML = '';
              resultsDiv.style.display = 'none';

              if (imageContainer) {
                imageContainer.querySelector('h2').innerText = room.room_code;

                const basePath = ""; // index.html is at root

                // room image from DB (e.g. "assets/images/room.jpg")
                imageContainer.querySelector('img').src = basePath + room.room_image;

                // floor map image (e.g. "assets/images/floor5.png")
                const campusMapImg = document.querySelector('.campus-map img');
                if (campusMapImg) {
                  campusMapImg.src = basePath + room.floor_map;
                }
              }
            });

            document.addEventListener('click', () => {
              resultsDiv.innerHTML = '';
              resultsDiv.style.display = 'none';
            });

            resultsDiv.appendChild(div);
          });

          resultsDiv.style.display = filteredData.length > 0 ? 'block' : 'none';
        })
        .catch(err => {
          console.error(err);
          resultsDiv.style.display = 'none';
        });
    });
  }

  // Initialize search for source and destination rooms
  setupSearch("source-room", "sourceResults", "destination-room");
  setupSearch("destination-room", "destinationResults", "source-room", ".room-info");
});
