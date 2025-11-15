// Campus map 
var c = document.getElementById("map-canvas");
var ctx = c.getContext("2d");

// hard-coded map labels (to be moved to the database)
ctx.font = "15px Arial";
ctx.fillText("D501", 48, 40);
ctx.fillText("D502", 48, 210);
ctx.fillText("D503", 48, 300);
ctx.fillText("D504", 48, 390);
ctx.fillText("D505", 160, 390);
ctx.fillText("D506", 160, 250);
ctx.fillText("D507", 160, 160);
ctx.fillText("D508", 160, 70);
ctx.fillText("D511", 240, 390);
ctx.fillText("D512", 320, 390);
ctx.fillText("D513", 400, 390);
ctx.fillText("D514", 480, 390);
ctx.fillText("D515", 560, 390);
ctx.fillText("D525", 640, 390);
ctx.fillText("D522", 755, 370);
ctx.fillText("D524", 755, 230);
ctx.fillText("D521", 755, 40);
ctx.fillText("D526", 640, 230);
ctx.fillText("D528", 640, 90);
ctx.fillText("CR(M)", 30, 145);
ctx.fillText("CR(F)", 765, 145);

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
