// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // --- Modal Setup ---
    const modals = document.querySelectorAll(".modal"); // All modals
    const modalButtons = document.querySelectorAll("[data-modal]"); // Buttons to open modals
    const closeButtons = document.querySelectorAll(".modal .close"); // Modal close buttons

    // Open modal when corresponding button is clicked
    modalButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-modal"); // get modal id
            const modal = document.getElementById(modalId);
            if (modal) modal.style.display = "block"; // show modal
        });
    });

    // Close modal when close button clicked
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".modal").style.display = "none"; // hide modal
        });
    });

    // Close modal when clicking outside modal content
    window.onclick = function(event) {
        if (event.target.classList.contains("modal")) {
            event.target.style.display = "none";
        }
    };

    // --- Helper Function ---
    // AJAX POST helper using fetch, sends FormData
    async function ajaxPost(url, data) {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { 'X-Requested-With': 'XMLHttpRequest' }, // mark as AJAX
                body: data
            });
            return await res.json(); // return JSON response
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "server error occurred", "error"); // show error popup
        }
    }

    // --- My Account - Change Username ---
    const myUsernameForm = document.getElementById("myUsernameForm");
    myUsernameForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newUsername = myUsernameForm.new_username.value.trim();
        const currentPassword = myUsernameForm.cu_password.value.trim();
        const oldUsername = document.getElementById("currentUsername").textContent.trim();

        // validation
        if (!newUsername || !currentPassword) {
            Swal.fire("Error", "please fill out all fields", "error");
            return;
        }

        if (newUsername.length < 3) {
            Swal.fire("Error", "username must be at least 3 characters", "error");
            return;
        }

        if (newUsername === oldUsername) {
            Swal.fire("Error", "new username is the same as your current username", "error");
            return;
        }

        // prepare data for AJAX
        const formData = new FormData();
        formData.append("form_type", "username");
        formData.append("old_username", oldUsername);
        formData.append("new_username", newUsername);
        formData.append("cu_password", currentPassword);

        // send request
        const data = await ajaxPost("/admin/account/username", formData);

        if (data.success) {
            Swal.fire("Success", data.message, "success");
            document.getElementById("currentUsername").textContent = newUsername; // update UI
            myUsernameForm.reset();
            document.getElementById("changeUsernameModal").style.display = "none"; // close modal
        } else {
            Swal.fire("Error", data.message, "error");
        }
    });

    // --- My Account - Change Email ---
    const myEmailForm = document.getElementById("myEmailForm");
    myEmailForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newEmail = myEmailForm.new_email.value.trim();
        const currentEmail = document.querySelector(".card-box p:nth-of-type(2)").textContent.trim();

        if (newEmail === currentEmail) {
            Swal.fire("Error", "new email is the same as current email", "error");
            return;
        }

        const formData = new FormData(myEmailForm);
        formData.append("form_type", "email");

        const data = await ajaxPost("/admin/account/email", formData);

        if (data.success) {
            Swal.fire("Success", data.message, "success");
            document.querySelector(".card-box p:nth-of-type(2)").textContent = newEmail; // update UI
            myEmailForm.reset();
            document.getElementById("changeEmailModal").style.display = "none";
        } else {
            Swal.fire("Error", data.message, "error");
        }
    });

    // --- Admin Actions - Edit Admin ---
    document.querySelectorAll(".edit-admin-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const id = link.dataset.id;
            const tr = link.closest("tr");
            const form = document.getElementById("editAdminForm");
            form.admin_id.value = id;
            form.username.value = tr.children[1].textContent.trim();
            form.email.value = tr.children[2].textContent.trim();
            form.password.value = ""; // clear password field
            document.getElementById("editAdminModal").style.display = "block";
        });
    });

    // Submit edited admin form
    const editAdminForm = document.getElementById("editAdminForm");
    editAdminForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = editAdminForm.admin_id.value;
        const data = await ajaxPost(`/admin/account/edit/${id}`, new FormData(editAdminForm));
        if (data.success) Swal.fire("Success", data.message, "success").then(() => location.reload());
        else Swal.fire("Error", data.message, "error");
    });

    // --- Admin Actions - Delete Admin ---
    document.querySelectorAll(".delete-admin-link").forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();
            const id = link.dataset.id;
            const row = link.closest("tr");
            const username = row.children[1].textContent.trim();

            // confirm deletion
            const { value: inputUsername } = await Swal.fire({
                title: "are you sure?",
                html: `type <strong>${username}</strong> to confirm deletion:`,
                input: 'text',
                showCancelButton: true,
                confirmButtonText: "delete",
                cancelButtonText: "cancel",
            });

            if (!inputUsername) return; // cancelled
            if (inputUsername.trim() !== username) {
                Swal.fire("Error", "username does not match, deletion cancelled", "error");
                return;
            }

            const formData = new FormData();
            formData.append("username", inputUsername.trim());

            const data = await ajaxPost(`/admin/account/delete/${id}`, formData);
            if (data.success) {
                Swal.fire("Deleted!", data.message, "success");
                row.remove(); // remove row from table
            } else {
                Swal.fire("Error", data.message, "error");
            }
        });
    });

    // --- My Account - Change Password ---
    const myPasswordForm = document.getElementById("myPasswordForm");
    myPasswordForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const oldPassword = myPasswordForm.old_password.value.trim();
        const newPassword = myPasswordForm.new_password.value.trim();
        const newPassword2 = myPasswordForm.new_password2.value.trim();

        if (!oldPassword || !newPassword || !newPassword2) {
            Swal.fire("Error", "please fill out all fields", "error");
            return;
        }

        const formData = new FormData(myPasswordForm);
        formData.append("form_type", "password");

        const data = await ajaxPost("/admin/account/password", formData);

        if (data.success) {
            Swal.fire("Success", data.message, "success");
            myPasswordForm.reset();
            document.getElementById("changePasswordModal").style.display = "none";
        } else {
            Swal.fire("Error", data.message, "error");
        }
    });

    // --- Add New Admin ---
    document.getElementById("addAdminBtn")?.addEventListener("click", () => {
        document.getElementById("addAdminModal").style.display = "block";
    });

    const addAdminForm = document.getElementById("addAdminForm");
    addAdminForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = addAdminForm.username.value.trim();
        const email = addAdminForm.email.value.trim();
        const password = addAdminForm.password.value.trim();

        // validate
        if (username.length < 3) {
            Swal.fire("Error", "username must be at least 3 characters", "error");
            return;
        }

        const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
        if (!emailRegex.test(email)) {
            Swal.fire("Error", "invalid email format", "error");
            return;
        }

        const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!strongPassword.test(password)) {
            Swal.fire("Error", "password must meet requirements", "error");
            return;
        }

        if (password.toLowerCase() === username.toLowerCase() || password.toLowerCase() === email.toLowerCase()) {
            Swal.fire("Error", "password cannot be the same as username or email", "error");
            return;
        }

        const data = await ajaxPost("/admin/account/create", new FormData(addAdminForm));

        if (data.success) Swal.fire("Success", data.message, "success").then(() => location.reload());
        else Swal.fire("Error", data.message, "error");
    });

});