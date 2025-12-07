const express = require('express');
const router = express.Router();

const adminService = require("../controllers/adminController");
const adminModel = require("../models/adminModel"); 
const announcementController = require("../controllers/announcementController");
const requireAdmin = require("../middleware/requireAdmin");
const bcrypt = require("bcrypt");

// show login page
router.get("/login", (req, res) => {
    res.render("login", {loginError: req.session.loginError});
    delete req.session.loginError;
});

// handle login submission
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await adminModel.findAdminByUsernameOrEmail(username);

        // if not found, show error
        if (!admin) {
            req.session.loginError = "Username or email not found";
            return res.redirect("/login");
        }

        // compare password
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            req.session.loginError = "Invalid password";
            return res.redirect("/login");
        }

        // login success, store session data
        req.session.adminId = admin.admin_id;
        req.session.adminUsername = admin.username;
        req.session.adminEmail = admin.email;
        req.session.isAdmin = true;
        return res.redirect("/admin");
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).send("Server error during login");
    }
});

// show admin dashboard, protect with requireAdmin
router.get("/admin", requireAdmin, async (req, res) => {
    try {
        const tab = req.query.tab || "announcements";

        // get all announcements
        const announcements = await announcementController.getAllAnnouncements();

        // check if editing a specific announcement
        const editId = req.query.edit ? Number(req.query.edit) : null;
        const editAnnouncement = editId ? await announcementController.getAnnouncementById(editId) : null;
        
        // get other admins excluding current
        let otherAdmins = [];
        try {
            const allAdmins = await adminModel.getAllAdmins();
            otherAdmins = allAdmins.filter(a => a.admin_id !== req.session.adminId);
        } catch (err) {
            console.warn("Could not fetch other admins (function might be missing in model):", err.message);
        }

        // render admin view with data
        res.render("adminView", {
            activeTab: tab,
            adminUsername: req.session.adminUsername,
            annMsg: req.session.annMsg || null,
            announcements,
            editAnnouncement,
            accMsg: req.session.accMsg || null,
            accError: req.session.accerror || null,
            currentAdmin: {
                username: req.session.adminUsername,
                email: req.session.adminEmail || "",
                created_at: req.session.adminCreatedAt || "n/a"
            },
            otherAdmins: otherAdmins
        });

        // reset temporary session messages
        req.session.annMsg = null;
        req.session.editAnnouncement = null;
        req.session.accMsg = null;
        req.session.accerror = null;
    } catch (err) {
        console.error("Render admin error:", err);
        res.status(500).send("Server error loading dashboard"); 
    }
});

// handle logout
router.get("/admin/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;