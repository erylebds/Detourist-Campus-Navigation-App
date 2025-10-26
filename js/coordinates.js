//Shows the coordinates (percentage for responsiveness) of each room when you click on a specific room in the map image
const map = document.querySelector('.campus-map img');

map.addEventListener('click', (e) => {
    const rect = map.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    console.log(`X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}%`);

    //NOTE: Ginamit lang tong js na ito para madetermine ung coordinates nung rooms
});