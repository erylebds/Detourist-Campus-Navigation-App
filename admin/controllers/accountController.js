const adminModel = require("../models/adminModel"); // Import model for DB operations
const bcrypt = require("bcrypt"); // Import bcrypt for hashing and comparing passwords

// --- Validators ---

// Check if an email is valid
function isValidEmail(email) {
    return /^(?!.*\.\.)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email.trim());
}

// Check if a string has minimum length
function minLen(str, len) {
    return typeof str === "string" && str.trim().length >= len;
}

// Check if password is strong
function isStrongPassword(pass) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pass);
}

// Check if a password was used previously
function passwordPreviouslyUsed(newPass, oldList = []) {
    for (const oldHash of oldList) {
        if (bcrypt.compareSync(newPass, oldHash)) return true;
    }
    return false;
}

// --- Login Lockout Tracking ---

// Record a failed login attempt in session
function recordFailedAttempt(req) {
    req.session.failedLogins = (req.session.failedLogins || 0) + 1;
    req.session.lastFailed = Date.now();
}

// Check if user is temporarily locked due to failed attempts
function isLocked(req) {
    const attempts = req.session.failedLogins || 0;
    const last = req.session.lastFailed || 0;
    if (attempts >= 5) {
        const lockMinutes = 10;
        if (Date.now() - last < lockMinutes * 60000) return true;
        req.session.failedLogins = 0; // reset after lock period
    }
    return false;
}

// --- Admin CRUD Operations ---

// Get all admins
exports.getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.getAllAdmins();
        res.json({ success: true, admins });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// Create a new admin
exports.createAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate inputs
        if (!username || !email || !password)
            return res.status(400).json({ success: false, message: "all fields are required" });

        const cleanUsername = username.trim();
        const cleanEmail = email.trim();

        if (!minLen(cleanUsername, 3))
            return res.status(400).json({ success: false, message: "username must be at least 3 characters" });

        if (!isValidEmail(cleanEmail))
            return res.status(400).json({ success: false, message: "invalid email format" });

        if (!isStrongPassword(password))
            return res.status(400).json({ success: false, message: "password must meet strength requirements" });

        if (password.toLowerCase() === cleanUsername.toLowerCase() || password.toLowerCase() === cleanEmail.toLowerCase())
            return res.status(400).json({ success: false, message: "password cannot match username or email" });

        // Check for duplicates
        const existingUser = await adminModel.findByUsernameOrEmail(cleanUsername);
        if (existingUser) return res.status(400).json({ success: false, message: "username already in use" });

        const existingEmail = await adminModel.findByUsernameOrEmail(cleanEmail);
        if (existingEmail) return res.status(400).json({ success: false, message: "email already in use" });

        // Create admin in DB
        const id = await adminModel.createAdmin({ username: cleanUsername, email: cleanEmail, password });

        res.json({ success: true, message: "admin created successfully", id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// Update current admin's username
exports.updateUsername = async (req, res) => {
    try {
        const { old_username, new_username, cu_password } = req.body;

        if (!old_username || !new_username || !cu_password)
            return res.status(400).json({ success: false, message: "all fields are required" });

        const adminId = req.session.adminId;
        if (!adminId) return res.status(401).json({ success: false, message: "unauthorized" });

        const admin = await adminModel.getAdminById(adminId);
        if (!admin) return res.status(404).json({ success: false, message: "admin not found" });

        if (admin.username !== old_username)
            return res.status(400).json({ success: false, message: "old username is incorrect" });

        // Verify current password
        const match = await bcrypt.compare(cu_password, admin.password);
        if (!match) return res.status(400).json({ success: false, message: "password is incorrect" });

        // Check if new username is taken
        const exists = await adminModel.findByUsernameOrEmail(new_username);
        if (exists && exists.admin_id !== adminId)
            return res.status(400).json({ success: false, message: "username already taken" });

        await adminModel.updateUsername({ id: adminId, newUsername: new_username.trim() });

        res.json({ success: true, message: "username updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// Update current admin's email
exports.updateEmail = async (req, res) => {
    try {
        const { new_email } = req.body;
        const adminId = req.session.adminId;

        if (!new_email)
            return res.status(400).json({ success: false, message: "email is required" });

        if (!isValidEmail(new_email))
            return res.status(400).json({ success: false, message: "invalid email format" });

        const admin = await adminModel.getAdminById(adminId);
        if (!admin) return res.status(404).json({ success: false, message: "admin not found" });

        if (admin.email === new_email.trim())
            return res.status(400).json({ success: false, message: "new email is same as current email" });

        const exists = await adminModel.findByUsernameOrEmail(new_email);
        if (exists && exists.admin_id !== adminId)
            return res.status(400).json({ success: false, message: "email already in use" });

        await adminModel.updateEmail({ id: adminId, newEmail: new_email.trim() });

        req.session.adminEmail = new_email; // Update session

        res.json({ success: true, message: "email updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// Update current admin password
exports.updatePassword = async (req, res) => {
    try {
        const { old_password, new_password, new_password2 } = req.body;
        const adminId = req.session.adminId;
        if (!adminId) return res.status(401).json({ success: false, message: "unauthorized" });

        if (!old_password || !new_password || !new_password2)
            return res.status(400).json({ success: false, message: "all fields are required" });

        if (new_password !== new_password2)
            return res.status(400).json({ success: false, message: "passwords do not match" });

        const admin = await adminModel.getAdminById(adminId);
        if (!admin) return res.status(404).json({ success: false, message: "admin not found" });

        if (!await bcrypt.compare(old_password, admin.password))
            return res.status(400).json({ success: false, message: "old password is incorrect" });

        // Prevent using the same password
        if (await bcrypt.compare(new_password, admin.password))
            return res.status(400).json({ success: false, message: "new password cannot be same as old password" });

        // Check password history
        const oldPasswords = admin.old_passwords ? JSON.parse(admin.old_passwords) : [];
        if (passwordPreviouslyUsed(new_password, oldPasswords))
            return res.status(400).json({ success: false, message: "password was used recently" });

        if (!isStrongPassword(new_password))
            return res.status(400).json({ success: false, message: "password must be strong" });

        if (new_password.toLowerCase() === admin.username.toLowerCase() || new_password.toLowerCase() === admin.email.toLowerCase())
            return res.status(400).json({ success: false, message: "password cannot match username or email" });

        // Hash and update password
        const newHash = await bcrypt.hash(new_password, 10);
        oldPasswords.unshift(admin.password); // keep old password in history
        oldPasswords.splice(3); // keep last 3

        await adminModel.updatePassword(adminId, newHash, JSON.stringify(oldPasswords));

        res.json({ success: true, message: "password updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// Edit other admin details (admin management)
exports.editAdmin = async (req, res) => {
    // similar checks as above: validate input, check duplicates, update password history if password changed
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
    // Checks for valid id, prevents self-deletion, verifies username matches, deletes admin
};