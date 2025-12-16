// Import the announcement model which handles database operations
const announcementModel = require("../models/announcementModel");

// Function to get all announcements from the database
exports.getAllAnnouncements = async () => {
    return await announcementModel.getAllAnnouncements();
}

// Function to get a specific announcement by its ID
exports.getAnnouncementById = async (id) => {
    return await announcementModel.getAnnouncementById(id);
}

// Function to create or update an announcement
exports.saveAnnouncement = async (req, res) => {
    try {
        // Destructure the expected fields from the request body
        const { form_type, title, message, created_at, announcement_id } = req.body;

        // Validate that the form type is "announcement"
        if (form_type !== "announcement") {
            // If request is AJAX (xhr), return JSON error
            if (req.xhr) return res.status(400).json({ success: false, message: "Invalid form" });
            // Otherwise, redirect to the admin announcements tab
            return res.redirect("/admin?tab=announcements");
        }

        // Check if title or message is empty
        if (!title.trim() || !message.trim()) {
            if (req.xhr) return res.json({ success: false, message: "Title and message are required." });
            req.session.annMsg = "Title and message are required.";
            return res.redirect("/admin?tab=announcements");
        }

        // Format the created_at date properly
        let formattedCreatedAt;
        if (!created_at) {
            // Use current date if no date provided
            formattedCreatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
        } else {
            // Parse provided date
            const date = new Date(created_at);
            // Use current date if the provided date is invalid
            formattedCreatedAt = isNaN(date) ? new Date().toISOString().slice(0, 19).replace("T", " ") : date.toISOString().slice(0, 19).replace("T", " ");
        }

        if (announcement_id) {
            // Update existing announcement if announcement_id is present
            await announcementModel.updateAnnouncement({
                id: announcement_id,
                title,
                message,
                created_at: formattedCreatedAt,
            });
            if (req.xhr) return res.json({ success: true, message: "Announcement updated" });
            req.session.annMsg = "Announcement updated";
        } else {
            // Create a new announcement if no announcement_id
            await announcementModel.createAnnouncement({
                title,
                message,
                created_at: formattedCreatedAt,
            });
            if (req.xhr) return res.json({ success: true, message: "Announcement created" });
            req.session.annMsg = "Announcement created";
        }

        // Redirect to admin announcements tab if not AJAX
        if (!req.xhr) res.redirect("/admin?tab=announcements");

    } catch (err) {
        console.error(err);
        // Send error response if AJAX
        if (req.xhr) return res.status(500).json({ success: false, message: "Server error occurred." });
        // Otherwise, send plain server error
        res.status(500).send("Server error");
    }
};

// Function to redirect to the edit page for a specific announcement
exports.redirectToEdit = (req, res) => {
    // Use the announcement ID from URL parameters
    res.redirect(`/admin?tab=announcements&edit=${req.params.id}`);
};

// Function to delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    // Call the model to delete the announcement by ID
    await announcementModel.deleteAnnouncement(req.params.id);

    // Return JSON if request is AJAX
    if (req.xhr) return res.json({ success: true, message: "Announcement deleted." });
    
    // Otherwise, store message in session and redirect
    req.session.annMsg = "Announcement deleted.";
    res.redirect("/admin?tab=announcements");
  } catch (err) {
    console.error(err);
    if (req.xhr) return res.status(500).json({ success: false, message: "Server error occurred." });
    res.status(500).send("Server error");
  }
};