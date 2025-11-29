const adminModel = require("../models/adminModel");
const bcrypt = require("bcrypt");

// validation helpers
function isValidEmail(email) {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function minLen(str, len) {
    return typeof str === "string" && str.trim().length >= len;
}

exports.getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.getAllAdmins();
        res.json({ success: true, admins });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// create new admin (server-side validation)
exports.createAdmin = async (req, res) => {
    try {
        const { username, email, password, password2 } = req.body;

        if (!username || !email || !password || !password2) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        if (!minLen(username, 3)) return res.status(400).json({ success: false, message: "Username must be at least 3 characters." });
        if (!isValidEmail(email)) return res.status(400).json({ success: false, message: "Invalid email format." });
        if (!minLen(password, 6)) return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
        if (password !== password2) return res.status(400).json({ success: false, message: "Passwords do not match." });

        // checks existing username/email
        const existing = await adminModel.findByUsernameOrEmail(username);
        if (existing) return res.status(400).json({ success: false, message: "Username or email already in use." });

        const id = await adminModel.createAdmin({ username: username.trim(), email: email.trim(), password });
        res.json({ success: true, message: "Admin created", id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// update username (current admin or any admin)
exports.updateUsername = async (req, res) => {
    try {
        const { form_type } = req.body;

        // expect form_type=username for adminView client change
        if (form_type === "username") {
            const { old_username, new_username, cu_password } = req.body;

            if (!old_username || !new_username || !cu_password) {
                return res.status(400).json({ success: false, message: "All fields are required." });
            }
            if (!minLen(new_username, 3)) return res.status(400).json({ success: false, message: "New username must be at least 3 characters." });

            // get current admin from session
            const adminId = req.session.adminId;
            if (!adminId) return res.status(401).json({ success: false, message: "Unauthorized." });

            const admin = await adminModel.getAdminById(adminId);
            if (!admin) return res.status(400).json({ success: false, message: "Admin not found." });

            // confirm old username matches
            if (admin.username !== old_username) return res.status(400).json({ success: false, message: "Old username does not match." });

            // check password
            const match = await bcrypt.compare(cu_password, admin.password);
            if (!match) return res.status(400).json({ success: false, message: "Password incorrect." });

            await adminModel.updateUsername({ id: adminId, newUsername: new_username.trim() });
            // update session username
            req.session.adminUsername = new_username.trim();

            return res.json({ success: true, message: "Username updated." });
        } else {
            return res.status(400).json({ success: false, message: "Invalid form." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// update password (current admin)
exports.updatePassword = async (req, res) => {
    try {
        const { form_type } = req.body;

        if (form_type === "password") {
            const { old_password, new_password, new_password2 } = req.body;

            if (!old_password || !new_password || !new_password2) {
                return res.status(400).json({ success: false, message: "All fields are required." });
            }
            if (!minLen(new_password, 6)) return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
            if (new_password !== new_password2) return res.status(400).json({ success: false, message: "New passwords do not match." });

            const adminId = req.session.adminId;
            if (!adminId) return res.status(401).json({ success: false, message: "Unauthorized." });

            const admin = await adminModel.getAdminById(adminId);
            if (!admin) return res.status(400).json({ success: false, message: "Admin not found." });

            // compare old password
            const match = await bcrypt.compare(old_password, admin.password);
            if (!match) return res.status(400).json({ success: false, message: "Old password is incorrect." });

            await adminModel.updatePassword({ id: adminId, newPassword: new_password });
            return res.json({ success: true, message: "Password updated." });
        } else {
            return res.status(400).json({ success: false, message: "Invalid form." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// delete admin (by id) - requireAdmin middleware will ensure only admins can do this
exports.deleteAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: "Invalid id" });

        // prevent deleting self via this endpoint
        if (req.session.adminId === id) {
            return res.status(400).json({ success: false, message: "You cannot delete your own account." });
        }

        const affected = await adminModel.deleteAdmin(id);
        if (!affected) return res.status(404).json({ success: false, message: "Admin not found." });

        res.json({ success: true, message: "Admin deleted." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};
