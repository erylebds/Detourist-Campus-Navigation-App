// Import middleware to restrict access to admins only
const requireAdmin = require("../middleware/requireAdmin");

// Import Express framework
const express = require('express');

// Create a new router instance
const router = express.Router();

// Import the controller that handles announcement logic
const announcementController = require('../controllers/announcementController');

// Import Multer for handling multipart/form-data (forms)
const multer = require('multer');
const upload = multer(); // default memory storage

// Route to save a new announcement or update an existing one
// POST method is used because it sends form data in the request body
router.post(
    "/admin/announcements",      // URL endpoint
    requireAdmin,                // Middleware: only admin can access
    upload.none(),               // Multer parses form-data but expects no files
    announcementController.saveAnnouncement // Controller function to handle saving
);

// Route to delete an announcement
// GET method is used here (though POST/DELETE is better practice)
// ":id" is a route parameter for the announcement ID
router.get(
    "/admin/announcements/delete/:id",
    requireAdmin,                  // Admin-only middleware
    announcementController.deleteAnnouncement // Controller function handles deletion
);

// Route to redirect to the edit page for a specific announcement
// GET method because we are fetching data to display the edit form
router.get(
    "/admin/announcements/edit/:id",
    requireAdmin,                  // Admin-only middleware
    announcementController.redirectToEdit // Controller handles fetching announcement and rendering edit page
);

module.exports = router;