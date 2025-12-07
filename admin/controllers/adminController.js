const adminModel = require("../models/adminModel");
const roomModel = require("../models/roomModel");
const announcementModel = require("../models/announcementModel"); 

exports.getAdminPage = async (req, res) => {
    try {
        if (!req.session || !req.session.adminId) {
            return res.redirect('/login');
        }

        const activeTab = req.query.tab || 'announcements';
        const currentAdmin = req.session.adminId;
        const adminUsername = req.session.username || "Admin";

        // 1. Fetch Admins
        const admins = await adminModel.getAllAdmins();

        // 2. Fetch Rooms (Add fallback to empty array if undefined)
        let rooms = [];
        try {
            const fetchedRooms = await roomModel.getAllRooms();
            // Ensure we actually have an array
            rooms = Array.isArray(fetchedRooms) ? fetchedRooms : [];
        } catch (roomErr) {
            console.error("Failed to fetch rooms:", roomErr);
            // rooms remains [] so the page still loads
        }

        // 3. Fetch Announcements (Mocked as empty in your original code, but kept structured)
        const announcements = []; 

        res.render("adminView", {
            activeTab: activeTab,
            adminUsername: adminUsername,
            rooms: rooms, // Now guaranteed to be at least []
            announcements: announcements,
            annMsg: null,         
            editAnnouncement: null,
            currentAdmin: currentAdmin,
            otherAdmins: admins,
            accError: null,       
            accMsg: null           
        });

    } catch (err) {
        console.error("Error loading admin dashboard:", err);
        res.status(500).send("Server Error loading dashboard.");
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.redirect('/admin');
        }
        res.redirect('/login');
    });
};