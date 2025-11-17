document.addEventListener("DOMContentLoaded", () => {
  const announcementList = document.getElementById("announcementList");
  const modal = document.getElementById("announcement-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.querySelector(".modal-close-btn");

  fetch("../database/announcements.php")
    .then((res) => res.json())
    .then((data) => {
      announcementList.innerHTML = "";

      data.forEach((announcement) => {
        const card = document.createElement("article");
        card.classList.add("announcement-card");
        card.dataset.title = announcement.title;
        card.dataset.body = announcement.message;

        card.innerHTML = `
          <h3>${announcement.title}</h3>
          <p>${announcement.message.substring(0, 50)}...</p>
        `;

        card.addEventListener("click", () => {
          modalTitle.textContent = announcement.title;
          modalBody.textContent = announcement.message;
          modal.classList.add("active");
        });

        announcementList.appendChild(card);
      });
    });

  modalClose.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
});
