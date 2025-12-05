const express = require('express');
const router = express.Router();

const adminService = require("../controllers/adminController");
const adminModel = require("../models/adminModel");
const announcementController = require("../controllers/announcementController");
const requireAdmin = require("../middleware/requireAdmin");
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
    res.render("login", {loginError: req.session.loginError});
    delete req.session.loginError;
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // find admin by username or email
        const admin = await adminService.findAdminByUsernameOrEmail(username);

        // if not found, show error
        if (!admin) {
            req.session.loginError = "username or email not found";
            return res.redirect("/login");
        }

        // compare password
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            req.session.loginError = "invalid password";
            return res.redirect("/login");
        }

        // login success, store session data
        req.session.adminId = admin.admin_id;
        req.session.adminUsername = admin.username;
        req.session.adminEmail = admin.email;
        req.session.isAdmin = true;
        return res.redirect("/admin");
    } catch (err) {
        console.error(err);
        res.send("server error");
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
            otherAdmins: await adminModel.getAllAdmins().then(admins =>
                admins.filter(a => a.admin_id !== req.session.adminId)
            )
        });

        // reset temporary session messages
        req.session.annMsg = null;
        req.session.editAnnouncement = null;
        req.session.accMsg = null;
        req.session.accerror = null;
    } catch (err) {
        console.error("render admin error:", err);
        res.setMaxListeners(500).send("server error");
    }
});

// handle logout
router.get("/admin/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;
