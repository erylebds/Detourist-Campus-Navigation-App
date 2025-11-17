document.addEventListener("DOMContentLoaded", () => {

    function setupSearch(inputId, resultsId, excludeInputId = null, imageContainerSelector = null) {
        const searchInput = document.getElementById(inputId);
        const resultsDiv = document.getElementById(resultsId);
        const excludeInput = excludeInputId ? document.getElementById(excludeInputId) : null;
        const imageContainer = imageContainerSelector ? document.querySelector(imageContainerSelector) : null;

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();

            if (query.length === 0) {
                resultsDiv.innerHTML = '';
                resultsDiv.style.display = 'none';
                return;
            }

            fetch(`database/search.php?room_code=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    resultsDiv.innerHTML = '';

                    if (data.length === 0) {
                        resultsDiv.style.display = 'none';
                        return;
                    }

                    //don't let the user input the same destination room as the source room
                    const filteredData = excludeInput ? data.filter(room => room.room_code !== excludeInput.value) : data;

                    filteredData.forEach(room => {
                        const div = document.createElement('div');
                        div.classList.add('autocomplete-item');
                        div.textContent = room.room_code;

                        div.addEventListener('click', () => {
                            searchInput.value = room.room_code;
                            resultsDiv.innerHTML = '';
                            resultsDiv.style.display = 'none';

                            //updates the image for the destination input
                            if (imageContainer) {
                                imageContainer.querySelector('h2').innerText = room.room_code;
                                imageContainer.querySelector('img').src = room.room_image;

                                const campusMapImg = document.querySelector('.campus-map img');
                                campusMapImg.src = room.floor_map;
                            }
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

});