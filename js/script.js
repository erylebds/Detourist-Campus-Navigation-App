// Get label names and coordinates from the database then draw the labels on the map
var c = document.getElementById("map-canvas");
var ctx = c.getContext("2d");
ctx.font = "15px Arial";
fetch("database/roomLabels.php")
  .then(res => res.json())
  .then(data => {
    data.forEach(roomLabel => {
      ctx.fillText(roomLabel.name, roomLabel.x_coord, roomLabel.y_coord);
    });
  });


/* Uncomment code below to visualize the map nodes */
// fetch("database/mapNodes.php")
//   .then(res => res.json())
//   .then(data => {
//     data.forEach(mapNode => {
//       ctx.fillStyle = "red";
//       ctx.fillRect(mapNode.x_coord, mapNode.y_coord, 3, 3);
//     });
//   });

// Temporary function for help in finding coordinates (to be removed later)
// Click on map then check console for coordinates
c.addEventListener('mousedown', (event) => {
  const rect = c.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log(`Clicked at: x=${x}, y=${y}`);
});

// Navbar color on scroll
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// Announcement modal
const modal = document.getElementById("announcement-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.querySelector(".modal-close-btn");

document.querySelectorAll(".announcement-card").forEach(card => {
  card.addEventListener("click", () => {
    modalTitle.textContent = card.dataset.title;
    modalBody.textContent = card.dataset.body;
    modal.classList.add("active");
  });
});
closeBtn.addEventListener("click", () => modal.classList.remove("active"));
window.addEventListener("click", e => {
  if (e.target === modal) modal.classList.remove("active");
});

// ===== Hamburger Menu =====
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
  });
});
