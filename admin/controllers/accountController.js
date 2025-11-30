const adminModel = require("../models/adminModel");
const bcrypt = require("bcrypt");

// simple validators for email, length, password strength
function isValidEmail(email) {
    return /^(?!.*\.\.)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email.trim());
}

function minLen(str, len) {
    return typeof str === "string" && str.trim().length >= len;
}

function isStrongPassword(pass) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pass);
}

// check if password was used before
function passwordPreviouslyUsed(newPass, oldList = []) {
    for (const oldHash of oldList) {
        if (bcrypt.compareSync(newPass, oldHash)) return true;
    }
    return false;
}

// track failed login attempts for lockout
function recordFailedAttempt(req) {
    req.session.failedLogins = (req.session.failedLogins || 0) + 1;
    req.session.lastFailed = Date.now();
}

// check if user is locked due to too many failed attempts
function isLocked(req) {
    const attempts = req.session.failedLogins || 0;
    const last = req.session.lastFailed || 0;
    if (attempts >= 5) {
        const lockMinutes = 10;
        if (Date.now() - last < lockMinutes * 60000) return true;
        req.session.failedLogins = 0;
    }
    return false;
}

// get all admins
exports.getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.getAllAdmins();
        res.json({ success: true, admins });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// create a new admin
exports.createAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check for empty fields
        if (!username || !email || !password)
            return res.status(400).json({ success: false, message: "all fields are required" });

        const cleanUsername = username.trim();
        const cleanEmail = email.trim();

        // check username length
        if (!minLen(cleanUsername, 3))
            return res.status(400).json({ success: false, message: "username must be at least 3 characters" });

        // check valid email
        if (!isValidEmail(cleanEmail))
            return res.status(400).json({ success: false, message: "invalid email format" });

        // check password strength
        if (!isStrongPassword(password))
            return res.status(400).json({ success: false, message: "password must be at least 8 characters with uppercase, lowercase, number, and special character" });

        // password cannot match username or email
        if (password.toLowerCase() === cleanUsername.toLowerCase() || password.toLowerCase() === cleanEmail.toLowerCase())
            return res.status(400).json({ success: false, message: "password cannot match username or email" });

        // check for duplicate username
        const existingUser = await adminModel.findByUsernameOrEmail(cleanUsername);
        if (existingUser)
            return res.status(400).json({ success: false, message: "username already in use" });

        // check for duplicate email
        const existingEmail = await adminModel.findByUsernameOrEmail(cleanEmail);
        if (existingEmail)
            return res.status(400).json({ success: false, message: "email already in use" });

        // create the admin
        const id = await adminModel.createAdmin({ username: cleanUsername, email: cleanEmail, password });

        res.json({ success: true, message: "admin created successfully", id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// update current admin username
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

        // verify current password
        const match = await bcrypt.compare(cu_password, admin.password);
        if (!match) return res.status(400).json({ success: false, message: "password is incorrect" });

        // check if new username is taken
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

// update current admin email
exports.updateEmail = async (req, res) => {
    try {
        const { new_email } = req.body;
        const adminId = req.session.adminId;

        if (!new_email)
            return res.status(400).json({ success: false, message: "email is required" });

        if (!isValidEmail(new_email))
            return res.status(400).json({ success: false, message: "invalid email format" });

        const admin = await adminModel.getAdminById(adminId);
        if (!admin)
            return res.status(404).json({ success: false, message: "admin not found" });

        if (admin.email === new_email.trim())
            return res.status(400).json({ success: false, message: "new email is same as current email" });

        const exists = await adminModel.findByUsernameOrEmail(new_email);
        if (exists && exists.admin_id !== adminId)
            return res.status(400).json({ success: false, message: "email already in use" });

        await adminModel.updateEmail({ id: adminId, newEmail: new_email.trim() });

        req.session.adminEmail = new_email;

        res.json({ success: true, message: "email updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// update current password
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

        // verify old password
        if (!await bcrypt.compare(old_password, admin.password))
            return res.status(400).json({ success: false, message: "old password is incorrect" });

        // prevent using the same password
        if (await bcrypt.compare(new_password, admin.password))
            return res.status(400).json({ success: false, message: "new password cannot be same as old password" });

        // check password history
        const oldPasswords = admin.old_passwords ? JSON.parse(admin.old_passwords) : [];
        if (passwordPreviouslyUsed(new_password, oldPasswords))
            return res.status(400).json({ success: false, message: "password was used recently" });

        if (!isStrongPassword(new_password))
            return res.status(400).json({ success: false, message: "password must be at least 8 characters with uppercase, lowercase, number, and special character" });

        if (new_password.toLowerCase() === admin.username.toLowerCase() || new_password.toLowerCase() === admin.email.toLowerCase())
            return res.status(400).json({ success: false, message: "password cannot be username or email" });

        // update password and history
        const newHash = await bcrypt.hash(new_password, 10);
        oldPasswords.unshift(admin.password);
        oldPasswords.splice(3);

        await adminModel.updatePassword(adminId, newHash, JSON.stringify(oldPasswords));

        res.json({ success: true, message: "password updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// edit admin details
exports.editAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { username, email, password } = req.body;

        if (!id)
            return res.status(400).json({ success: false, message: "invalid admin id" });

        const cleanUsername = username?.trim();
        const cleanEmail = email?.trim();

        // validate username and email
        if (!minLen(cleanUsername, 3))
            return res.status(400).json({ success: false, message: "username must be at least 3 characters" });

        if (!isValidEmail(cleanEmail))
            return res.status(400).json({ success: false, message: "invalid email format" });

        const admin = await adminModel.getAdminById(id);
        if (!admin)
            return res.status(404).json({ success: false, message: "admin not found" });

        // check duplicates
        const usernameExists = await adminModel.findByUsernameOrEmail(cleanUsername);
        if (usernameExists && usernameExists.admin_id !== id)
            return res.status(400).json({ success: false, message: "username already taken" });

        const emailExists = await adminModel.findByUsernameOrEmail(cleanEmail);
        if (emailExists && emailExists.admin_id !== id)
            return res.status(400).json({ success: false, message: "email already taken" });

        let finalPassword = null;

        if (password && password.trim() !== "") {
            const newPass = password.trim();

            if (!isStrongPassword(newPass))
                return res.status(400).json({ success: false, message: "password must be at least 8 characters with uppercase, lowercase, number, and special character" });

            if (newPass.toLowerCase() === cleanUsername.toLowerCase() || newPass.toLowerCase() === cleanEmail.toLowerCase())
                return res.status(400).json({ success: false, message: "password cannot be username or email" });

            if (await bcrypt.compare(newPass, admin.password))
                return res.status(400).json({ success: false, message: "new password cannot match previous password" });

            const oldPasswords = admin.old_passwords ? JSON.parse(admin.old_passwords) : [];
            if (passwordPreviouslyUsed(newPass, oldPasswords))
                return res.status(400).json({ success: false, message: "password was used recently" });

            const newHash = await bcrypt.hash(newPass, 10);
            oldPasswords.unshift(admin.password);
            oldPasswords.splice(3);

            await adminModel.updatePassword(id, newHash, JSON.stringify(oldPasswords));
            finalPassword = newHash;
        }

        // update admin details
        await adminModel.updateAdmin({ id, username: cleanUsername, email: cleanEmail, password: finalPassword });

        res.json({ success: true, message: "admin updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// delete admin
exports.deleteAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { username } = req.body;

        if (!id || !username)
            return res.status(400).json({ success: false, message: "invalid request" });

        // prevent self deletion
        if (req.session.adminId === id)
            return res.status(400).json({ success: false, message: "you cannot delete your own account" });

        const admin = await adminModel.getAdminById(id);
        if (!admin)
            return res.status(404).json({ success: false, message: "admin not found" });

        // check username matches
        if (admin.username !== username.trim())
            return res.status(400).json({ success: false, message: "username does not match, deletion cancelled" });

        const affected = await adminModel.deleteAdmin(id);
        if (!affected)
            return res.status(500).json({ success: false, message: "failed to delete admin" });

        res.json({ success: true, message: "admin deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};
