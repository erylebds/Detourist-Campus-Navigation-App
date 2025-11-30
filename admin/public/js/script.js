document.addEventListener('DOMContentLoaded', () => {
    // get hamburger button, sidebar, and overlay elements
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (hamburgerBtn && sidebar && overlay) {
        // toggle sidebar and overlay on hamburger click
        hamburgerBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-active');
            overlay.classList.toggle('active');
        });

        // close sidebar when overlay is clicked
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-active');
            overlay.classList.remove('active');
        });
    }
});
