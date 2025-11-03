const searchInput = document.getElementById('searchRoom');
const resultsDiv = document.getElementById('searchResults');
let selectedRoom = null;

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query.length === 0) {
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'none'; //hides the options box if the search bar input is empty
        return;
    }

    fetch(`database/search.php?room_code=${query}`)
        .then(res => res.json())
        .then(data => {
            resultsDiv.innerHTML = '';

            if (data.length === 0) {
                resultsDiv.style.display = 'none'; //hide options box if there are no results
                return;
            }

            data.forEach(room => {
                const div = document.createElement('div');
                div.classList.add('autocomplete-item');
                div.textContent = room.room_code;

                div.addEventListener('click', () => {
                    searchInput.value = room.room_code;
                    resultsDiv.innerHTML = '';
                    resultsDiv.style.display = 'none'; //hide options after selection

                    //Update room info in the side bar
                    document.querySelector('.room-info h2').innerText = room.room_code;
                    document.querySelector('.room-info img').src = room.room_image;

                    //Update the campus map based on the searched floor of the user
                    const campusMapImg = document.querySelector('.campus-map img');
                    campusMapImg.src = room.floor_map;

                    selectedRoom = room;
                });

                resultsDiv.appendChild(div);
            });

            resultsDiv.style.display = 'block'; //show options if results are available
        }). catch(err => {
            console.error(err);
            resultsDiv.style.display = 'none';
        });
});