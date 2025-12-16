// Import models for database access
const adminModel = require("../models/adminModel");
const roomModel = require("../models/roomModel");
const announcementModel = require("../models/announcementModel"); 

// Controller function to render the Admin Dashboard page
exports.getAdminPage = async (req, res) => {
    try {
        // Check if admin is logged in via session
        if (!req.session || !req.session.adminId) {
            return res.redirect('/login'); // Redirect to login if not authenticated
        }

        // Determine which tab is active (default to 'announcements')
        const activeTab = req.query.tab || 'announcements';
        const currentAdmin = req.session.adminId; // Current admin ID
        const adminUsername = req.session.username || "Admin"; // Default username fallback

        // Fetch all admins from the database
        const admins = await adminModel.getAllAdmins();

        // Fetch all rooms, with error handling and fallback to empty array
        let rooms = [];
        try {
            const fetchedRooms = await roomModel.getAllRooms();
            // Ensure fetched data is an array
            rooms = Array.isArray(fetchedRooms) ? fetchedRooms : [];
        } catch (roomErr) {
            console.error("Failed to fetch rooms:", roomErr);
            // rooms remains empty so that page still loads
        }

        // Placeholder for announcements; could fetch from DB if desired
        const announcements = []; 

        // Render the admin dashboard view with all necessary data
        res.render("adminView", {
            activeTab: activeTab,          // Currently active tab
            adminUsername: adminUsername,  // Display admin's username
            rooms: rooms,                  // List of rooms for admin module
            announcements: announcements,  // Announcements list
            annMsg: null,                  // Message for announcements
            editAnnouncement: null,        // Used if editing a specific announcement
            currentAdmin: currentAdmin,    // Logged-in admin ID
            otherAdmins: admins,           // List of other admins
            accError: null,                // Error message for account operations
            accMsg: null                   // Success message for account operations
        });

    } catch (err) {
        console.error("Error loading admin dashboard:", err);
        res.status(500).send("Server Error loading dashboard.");
    }
};

// Controller function to log out the admin
exports.logout = (req, res) => {
    // Destroy the current session
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.redirect('/admin'); // Stay on admin page if error occurs
        }
        // Redirect to login page after successful logout
        res.redirect('/login');
    });
};