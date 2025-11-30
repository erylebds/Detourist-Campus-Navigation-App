document.addEventListener("DOMContentLoaded", () => {

    // modal
    const modals = document.querySelectorAll(".modal");
    const modalButtons = document.querySelectorAll("[data-modal]");
    const closeButtons = document.querySelectorAll(".modal .close");

    modalButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) modal.style.display = "block";
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".modal").style.display = "none";
        });
    });

    window.onclick = function(event) {
        if (event.target.classList.contains("modal")) {
            event.target.style.display = "none";
        }
    };

    // ajaxx
    async function ajaxPost(url, data) {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                body: data
            });
            return await res.json();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Server error occurred.", "error");
        }
    }

    // MY ACCOUNT - username change
    const myUsernameForm = document.getElementById("myUsernameForm");

    myUsernameForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newUsername = myUsernameForm.new_username.value.trim();
        const currentPassword = myUsernameForm.cu_password.value.trim();
        const oldUsername = document.getElementById("currentUsername").textContent.trim();

        // Validate
        if (!newUsername || !currentPassword) {
            Swal.fire("Error", "Please fill out all fields.", "error");
            return;
        }

        if (newUsername.length < 3) {
            Swal.fire("Error", "Username must be at least 3 characters.", "error");
            return;
        }

        if (newUsername === oldUsername) {
            Swal.fire("Error", "New username is the same as your current username.", "error");
            return;
        }

        // Prepare data
        const formData = new FormData();
        formData.append("form_type", "username");
        formData.append("old_username", oldUsername);
        formData.append("new_username", newUsername);
        formData.append("cu_password", currentPassword);

        const data = await ajaxPost("/admin/account/username", formData);

        if (data.success) {
            Swal.fire("Success", data.message, "success");
            document.querySelector("p strong").textContent = newUsername;
            myUsernameForm.reset();
            document.getElementById("changeUsernameModal").style.display = "none";
        } else {
            Swal.fire("Error", data.message, "error");
        }
    });


    const myEmailForm = document.getElementById("myEmailForm");
    myEmailForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newEmail = myEmailForm.new_email.value.trim();
        const currentEmail = "<%= currentAdmin.email %>"; // printed from server

        if (newEmail === currentEmail) {
            Swal.fire("Error", "New email is the same as current email.", "error");
            return;
        }

        const formData = new FormData(myEmailForm);
        formData.append("form_type", "email");

        const data = await ajaxPost("/admin/account/email", formData);

        if (data.success) {
            Swal.fire("Success", data.message, "success");
            myEmailForm.reset();
            document.getElementById("changeEmailModal").style.display = "none";
        } else Swal.fire("Error", data.message, "error");
    });

    const myPasswordForm = document.getElementById("myPasswordForm");
    myPasswordForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(myPasswordForm);
        formData.append("form_type", "password");

        const data = await ajaxPost("/admin/account/password", formData);
        if (data.success) {
            Swal.fire("Success", data.message, "success");
            myPasswordForm.reset();
            document.getElementById("changePasswordModal").style.display = "none";
        } else Swal.fire("Error", data.message, "error");
    });

        // Password strength meter
    const passwordInput = document.querySelector("input[name='new_password']");
    const strengthBar = document.createElement("div");
    strengthBar.id = "strengthBar";
    strengthBar.style.height = "8px";
    strengthBar.style.width = "0%";
    strengthBar.style.borderRadius = "4px";
    strengthBar.style.marginTop = "5px";
    strengthBar.style.background = "#ddd";
    passwordInput?.parentNode.appendChild(strengthBar);

    passwordInput?.addEventListener("input", (e) => {
        const p = e.target.value;
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[a-z]/.test(p)) score++;
        if (/\d/.test(p)) score++;
        if (/[\W_]/.test(p)) score++;
        const percent = (score / 5) * 100;
        strengthBar.style.width = percent + "%";
        if (percent < 40) strengthBar.style.background = "red";
        else if (percent < 70) strengthBar.style.background = "orange";
        else strengthBar.style.background = "green";
    });


    // OTHER ADMIN ACTIONS
    // edit admin
    document.querySelectorAll(".edit-admin-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const id = link.dataset.id;
            const tr = link.closest("tr");
            const form = document.getElementById("editAdminForm");
            form.admin_id.value = id;
            form.username.value = tr.children[1].textContent.trim();
            form.email.value = tr.children[2].textContent.trim();
            form.password.value = "";
            document.getElementById("editAdminModal").style.display = "block";
        });
    });

    const editAdminForm = document.getElementById("editAdminForm");
    editAdminForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = editAdminForm.admin_id.value;
        const data = await ajaxPost(`/admin/account/edit/${id}`, new FormData(editAdminForm));
        if (data.success) Swal.fire("Success", data.message, "success").then(() => location.reload());
        else Swal.fire("Error", data.message, "error");
    });

    // delete admin
    document.querySelectorAll(".delete-admin-link").forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();
            const id = link.dataset.id;
            const row = link.closest("tr");

            const result = await Swal.fire({
                title: "Are you sure?",
                text: "This will delete the admin account.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete"
            });

            if (result.isConfirmed) {
                const data = await ajaxPost(`/admin/account/delete/${id}`, new FormData());
                if (data.success) {
                    Swal.fire("Deleted!", data.message, "success");
                    row.remove();
                } else {
                    Swal.fire("Error", data.message, "error");
                }
            }
        });
    });

    // add new admin
    document.getElementById("addAdminBtn")?.addEventListener("click", () => {
        document.getElementById("addAdminModal").style.display = "block";
    });

    const addAdminForm = document.getElementById("addAdminForm");
    addAdminForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = await ajaxPost("/admin/account/create", new FormData(addAdminForm));
        if (data.success) Swal.fire("Success", data.message, "success").then(() => location.reload());
        else Swal.fire("Error", data.message, "error");
    });

});
