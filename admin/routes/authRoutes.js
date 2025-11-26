const express = require('express');
const router = express.Router();
const pool = require("../controllers/connectDB");

router.get("/login", (req, res) => {
    res.render("login", {loginError: req.session.loginError});
    delete req.session.loginError;
});

router.post("/login", async (req, res) => {
        const { username, password } = req.body;

        try {
            const [rows] = await pool.query(
                "SELECT * FROM admin WHERE username = ? or email = ? LIMIT 1",
                [username, username]
            );

            if (rows.length === 0) {
                req.session.loginError = "Username or email not found.";
                return res.redirect("/login");
            }

            const admin = rows[0];

            //Check if the password input is correct
            if (password === admin.password) {
                req.session.adminUsername = admin.username;
                return res.redirect("/admin");
            }

            req.session.loginError = "Invalid password.";
            return res.redirect("/login")

        } catch (err) {
            console.error(err);
            res.send("Server error.")
        }
    });

//Protect admin dashboard
router.get("/admin", (req, res) => {
    if(!req.session.adminUsername) {
        return res.redirect("/login");
    }

    res.render("adminView", { 
        adminUsername: req.session.adminUsername,
        activeTab: 'announcements',
        announcements: [],
        editAnnouncement: null,
        annMsg: null,
        accError: null,
        accMsg: null,
        currentAdmin: {username: req.session.adminUsername, email: ''}
    });
});

//Logout
router.get("/admin/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;