document.addEventListener("DOMContentLoaded", () => {
    //Autocomplete search functionality for a given input
    function setupSearch(inputId, resultsId, excludeInputId = null, imageContainerSelector = null) {
        const searchInput = document.getElementById(inputId);
        const resultsDiv = document.getElementById(resultsId);
        const excludeInput = excludeInputId ? document.getElementById(excludeInputId) : null;
        const imageContainer = imageContainerSelector ? document.querySelector(imageContainerSelector) : null;

        // listen for typing in the input field
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();//Get the current value and trim any white spaces

            //If the input is empty, hide the results
            if (query.length === 0) {
                resultsDiv.innerHTML = '';
                resultsDiv.style.display = 'none';
                return;
            }

            fetch(`database/search.php?room_code=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    resultsDiv.innerHTML = ''; //Clear previous results

                    //If there are no results, hide the container
                    if (data.length === 0) {
                        resultsDiv.style.display = 'none';
                        return;
                    }

                    //Don't show the same room as the source room in the destination input
                    const filteredData = excludeInput ? data.filter(room => room.room_code !== excludeInput.value) : data;

                    filteredData.forEach(room => {
                        const div = document.createElement('div');
                        div.classList.add('autocomplete-item');
                        div.textContent = room.room_code; //Show room code

                        div.addEventListener('click', () => {
                            searchInput.value = room.room_code; //Update input with selected room
                            resultsDiv.innerHTML = '';
                            resultsDiv.style.display = 'none';

                            //Will update the image
                            if (imageContainer) {
                                imageContainer.querySelector('h2').innerText = room.room_code; //Update room name
                                imageContainer.querySelector('img').src = room.room_image; //Update room image
                                const campusMapImg = document.querySelector('.campus-map img');
                                campusMapImg.src = room.floor_map; //Update floor map
                            }
                        });

                        resultsDiv.appendChild(div); //Add the results to the container
                    });

                    //Show or hide results container depending on filtered results
                    resultsDiv.style.display = filteredData.length > 0 ? 'block' : 'none';
                })
                .catch(err => {
                    console.error(err);
                    resultsDiv.style.display = 'none';
                });
        });
    }

    //Initialize search for source and destination rooms
    setupSearch("source-room", "sourceResults", "destination-room");
    setupSearch("destination-room", "destinationResults", "source-room", ".room-info");
});