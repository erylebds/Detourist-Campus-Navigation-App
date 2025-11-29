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

    // my account
    const myUsernameForm = document.getElementById("myUsernameForm");
    myUsernameForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("form_type", "username");
        formData.append("old_username", document.querySelector('strong').textContent.trim());
        formData.append("new_username", myUsernameForm.new_username.value);
        formData.append("cu_password", prompt("Enter your current password:"));

        const data = await ajaxPost("/admin/account/username", formData);
        if (data.success) {
            Swal.fire("Success", data.message, "success");
            myUsernameForm.reset();
            document.querySelector('strong').textContent = ' ' + data.newUsername;
            document.getElementById("changeUsernameModal").style.display = "none";
        } else Swal.fire("Error", data.message, "error");
    });

    const myEmailForm = document.getElementById("myEmailForm");
    myEmailForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
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
