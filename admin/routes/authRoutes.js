const express = require('express');
const router = express.Router();

const adminService = require("../controllers/adminController");
const announcementController = require("../controllers/announcementController");

router.get("/login", (req, res) => {
    res.render("login", {loginError: req.session.loginError});
    delete req.session.loginError;
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    //Login validation
    try {
        const admin = await adminService.findAdminByUsernameOrEmail(username);

        if (!admin) {
            req.session.loginError = "Username or email not found";
            return res.redirect("/login");
        }

        //Get admin information if the login process is successful
        if (password === admin.password) {
            req.session.adminId = admin.admin_id;
            req.session.adminUsername = admin.username;
            req.session.adminEmail = admin.email;
            return res.redirect("/admin");
        }

        req.session.loginError = "Invalid password";
        return res.redirect("/login");

    } catch (err) {
        console.error(err);
        res.send("Server error.")
    }
});

//Don't let users who are not admins access the admin side of the website
function requireAdmin(req, res, next) {
    if (!req.session || !req.session.adminId) return res.redirect("/login");
    next();
}

//Protect admin dashboard
router.get("/admin", requireAdmin, async (req, res) => {
    try {
        const tab = req.query.tab || "announcements";
        const announcements = await announcementController.getAllAnnouncements();

        const editId = req.query.edit ? Number(req.query.edit) : null;
        const editAnnouncement = editId ? await announcementController.getAnnouncementById(editId) : null;

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
                email: req.session.adminEmail || ""
            }
        });

        req.session.annMsg = null;
        req.session.editAnnouncement = null;
        req.session.accMsg = null;
        req.session.accerror = null;
    } catch (err) {
        console.error("Render admin error:", err);
        res.setMaxListeners(500).send("Server error");
    }
});

//Logout
router.get("/admin/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;