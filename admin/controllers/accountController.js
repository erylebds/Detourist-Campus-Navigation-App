const adminModel = require("../models/adminModel");
const bcrypt = require("bcrypt");

// simple validators
function isValidEmail(email) {
    return /^(?!.*\.\.)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email.trim());
}


function minLen(str, len) {
    return typeof str === "string" && str.trim().length >= len;
}

// GET ALL ADMINS
exports.getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.getAllAdmins();
        res.json({ success: true, admins });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// CREATE ADMIN
exports.createAdmin = async (req, res) => {
    try {
        const { username, email, password, password2 } = req.body;

        if (!username || !email || !password || !password2)
            return res.status(400).json({ success: false, message: "All fields are required." });

        if (!minLen(username, 3))
            return res.status(400).json({ success: false, message: "Username must be at least 3 characters." });

        if (!isValidEmail(email))
            return res.status(400).json({ success: false, message: "Invalid email format." });

        if (!minLen(password, 6))
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });

        if (password !== password2)
            return res.status(400).json({ success: false, message: "Passwords do not match." });

        // check duplicate username/email
        const existingUser = await adminModel.findByUsernameOrEmail(username);
        const existingEmail = await adminModel.findByUsernameOrEmail(email);

        if (existingUser || existingEmail)
            return res.status(400).json({ success: false, message: "Username or email already in use." });

        const id = await adminModel.createAdmin({ username: username.trim(), email: email.trim(), password });

        return res.json({ success: true, message: "Admin created successfully.", id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// UPDATE CURRENT ADMIN USERNAME
exports.updateUsername = async (req, res) => {
    try {
        const { old_username, new_username, cu_password } = req.body;

        if (!old_username || !new_username || !cu_password)
            return res.status(400).json({ success: false, message: "All fields are required." });

        const adminId = req.session.adminId;
        if (!adminId) return res.status(401).json({ success: false, message: "Unauthorized." });

        const admin = await adminModel.getAdminById(adminId);
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found." });

        if (admin.username !== old_username)
            return res.status(400).json({ success: false, message: "Old username is incorrect." });

        // verify password
        const match = await bcrypt.compare(cu_password, admin.password);
        if (!match) return res.status(400).json({ success: false, message: "Password is incorrect." });

        // check duplicate username
        const exists = await adminModel.findByUsernameOrEmail(new_username);
        if (exists && exists.admin_id !== adminId)
            return res.status(400).json({ success: false, message: "Username already taken." });


        await adminModel.updateUsername({ id: adminId, newUsername: new_username.trim() });

        res.json({ success: true, message: "Username updated successfully." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

//UPDATE CURRENT ADMIN EMAIL
exports.updateEmail = async (req, res) => {
    try {
        const { new_email } = req.body;
        const adminId = req.session.adminId;

        if (!new_email)
            return res.status(400).json({ success: false, message: "Email is required." });

        if (!isValidEmail(new_email))
            return res.status(400).json({ success: false, message: "Invalid email format." });

        const admin = await adminModel.getAdminById(adminId);
        if (!admin)
            return res.status(404).json({ success: false, message: "Admin not found." });

        if (admin.email === new_email.trim())
            return res.status(400).json({ success: false, message: "New email is the same as current email." });

        const exists = await adminModel.findByUsernameOrEmail(new_email);
        if (exists && exists.admin_id !== adminId)
            return res.status(400).json({ success: false, message: "Email already in use." });

        await adminModel.updateEmail({ id: adminId, newEmail: new_email.trim() });

        req.session.adminEmail = new_email;

        res.json({ success: true, message: "Email updated successfully." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};



exports.editAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { username, email, password } = req.body;

        if (!minLen(username, 3))
            return res.status(400).json({ success: false, message: "Username must be at least 3 characters." });

        if (!isValidEmail(email))
            return res.status(400).json({ success: false, message: "Invalid email format." });

        const existing = await adminModel.findByUsernameOrEmail(username);
        if (existing && existing.admin_id !== id)
            return res.status(400).json({ success: false, message: "Username already taken." });

        const existingEmail = await adminModel.findByUsernameOrEmail(email);
        if (existingEmail && existingEmail.admin_id !== id)
            return res.status(400).json({ success: false, message: "Email already taken." });

        await adminModel.updateAdmin({
            id,
            username,
            email,
            password: password || null
        });

        res.json({ success: true, message: "Admin updated successfully." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// UPDATE CURRENT ADMIN PASSWORD
exports.updatePassword = async (req, res) => {
    try {
        const { old_password, new_password, new_password2 } = req.body;

        if (!old_password || !new_password || !new_password2)
            return res.status(400).json({ success: false, message: "All fields are required." });

        if (!minLen(new_password, 6))
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });

        if (new_password !== new_password2)
            return res.status(400).json({ success: false, message: "Passwords do not match." });

        const adminId = req.session.adminId;
        if (!adminId) return res.status(401).json({ success: false, message: "Unauthorized." });

        const admin = await adminModel.getAdminById(adminId);
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found." });

        // verify old password
        const match = await bcrypt.compare(old_password, admin.password);
        if (!match) return res.status(400).json({ success: false, message: "Old password is incorrect." });

        await adminModel.updatePassword({ id: adminId, newPassword: new_password });

        res.json({ success: true, message: "Password updated successfully." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// DELETE ADMIN BY ID
exports.deleteAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: "Invalid ID." });

        if (req.session.adminId === id)
            return res.status(400).json({ success: false, message: "You cannot delete your own account." });

        const affected = await adminModel.deleteAdmin(id);
        if (!affected) return res.status(404).json({ success: false, message: "Admin not found." });

        res.json({ success: true, message: "Admin deleted successfully." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};
