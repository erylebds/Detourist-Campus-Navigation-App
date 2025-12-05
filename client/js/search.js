/**
 * Sets up two search fields with autocomplete functionality.
 * Fetches room data based on user input, filters results, and displays suggestions.
 * Clicking a suggestion fills the input and updates room/map images when selecting a destination.
 * Handles hiding suggestions on empty input or outside clicks.
 * Reusable through setupSearch(), initialized for source and destination fields on DOM load.
 */

function setupSearch(inputId, resultsId, excludeInputId = null, imageContainerSelector = null) {
  const searchInput = document.getElementById(inputId);
  const resultsDiv = document.getElementById(resultsId);
  const excludeInput = excludeInputId ? document.getElementById(excludeInputId) : null;
  const imageContainer = imageContainerSelector ? document.querySelector(imageContainerSelector) : null;

  if (!searchInput || !resultsDiv) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();

    if (query.length === 0) {
      resultsDiv.innerHTML = '';
      resultsDiv.style.display = 'none';
      return;
    }

    // currentFloor is in the global scope of mapFunctions.js
    const params = new URLSearchParams({ current_floor: currentFloor, room_code: query });
    fetch(`client/database/search.php?${params}`)
      .then(res => res.json())
      .then(data => {
        resultsDiv.innerHTML = '';

        if (data.length === 0) {
          resultsDiv.style.display = 'none';
          return;
        }

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

            if (imageContainer && searchInput.id == "destination-room") {
              imageContainer.querySelector('h2').innerText = `Destination: ${room.room_code}`;

              const basePath = "";

              imageContainer.querySelector('img').src = basePath + room.room_image;

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

setupSearch("source-room", "sourceResults", "destination-room");
setupSearch("destination-room", "destinationResults", "source-room", ".room-info");

