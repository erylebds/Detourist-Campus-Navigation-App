const adminModel = require("../models/adminModel");
const roomModel = require("../models/roomModel");
const announcementModel = require("../models/announcementModel");

exports.getAdminPage = async (req, res) => {
    try {
        if (!req.session || !req.session.adminId) {
            return res.redirect('/login');
        }
        const activeTab = req.query.tab || 'announcements';
        const admins = await adminModel.getAllAdmins();
        const rooms = await roomModel.getAllRooms();
        const announcements = [];

        res.render("adminView", {
            activeTab: activeTab,
            adminUsername: req.session.username || "Admin",
            rooms: rooms,
            announcements: announcements,
            annMsg: null,         
            editAnnouncement: null,
            currentAdmin: req.session.adminId,
            otherAdmins: admins,
            accError: null,       
            accMsg: null           
        });

    } catch (err) {
        console.error("Error loading admin dashboard:", err);
        res.status(500).send("Server Error loading dashboard.");
    }
};

// logout functionality
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.redirect('/admin');
        }
        res.redirect('/login');
    });
};