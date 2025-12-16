const express = require('express');
const router = express.Router();

const adminService = require("../controllers/adminController");
const adminModel = require("../models/adminModel"); 
const announcementController = require("../controllers/announcementController");
const roomModel = require("../models/roomModel");
const requireAdmin = require("../middleware/requireAdmin");
const bcrypt = require("bcrypt");

// Show login page
router.get("/login", (req, res) => {
    res.render("login", { loginError: req.session.loginError }); // render login template with error if exists
    delete req.session.loginError; // clear the error from session after displaying
});

// Handle login submission
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await adminModel.findAdminByUsernameOrEmail(username);

        // Show error if user not found
        if (!admin) {
            req.session.loginError = "Username or email not found";
            return res.redirect("/login");
        }

        // Compare submitted password with hashed password
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            req.session.loginError = "Invalid password";
            return res.redirect("/login");
        }

        // Login successful, store session info
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

// Admin dashboard (protected)
router.get("/admin", requireAdmin, async (req, res) => {
    try {
        const tab = req.query.tab || "announcements"; // determine active tab

        // Get all announcements
        const announcements = await announcementController.getAllAnnouncements();

        // Get all rooms (if any)
        let rooms = [];
        try {
            rooms = await roomModel.getAllRooms(); 
        } catch (err) {
            console.error("Error fetching rooms:", err);
        }

        // Check if editing a specific announcement
        const editId = req.query.edit ? Number(req.query.edit) : null;
        const editAnnouncement = editId ? await announcementController.getAnnouncementById(editId) : null;
        
        // Get other admins excluding current logged-in admin
        let otherAdmins = [];
        try {
            const allAdmins = await adminModel.getAllAdmins();
            otherAdmins = allAdmins.filter(a => a.admin_id !== req.session.adminId);
        } catch (err) {
            console.warn("Could not fetch other admins:", err.message);
        }

        // Render admin dashboard with all required data
        res.render("adminView", {
            activeTab: tab,
            adminUsername: req.session.adminUsername,
            annMsg: req.session.annMsg || null,
            announcements,
            editAnnouncement,
            rooms: rooms, 
            accMsg: req.session.accMsg || null,
            accError: req.session.accerror || null,
            currentAdmin: {
                username: req.session.adminUsername,
                email: req.session.adminEmail || "",
                created_at: req.session.adminCreatedAt || "n/a"
            },
            otherAdmins: otherAdmins
        });

        // Clear session messages after rendering
        req.session.annMsg = null;
        req.session.editAnnouncement = null;
        req.session.accMsg = null;
        req.session.accerror = null;
    } catch (err) {
        console.error("Render admin error:", err);
        res.status(500).send("Server error loading dashboard"); 
    }
});

// Handle logout
router.get("/admin/logout", (req, res) => {
    req.session.destroy(); // destroy session
    res.redirect("/login"); // redirect to login page
});

module.exports = router;