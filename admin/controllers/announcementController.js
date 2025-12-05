const announcementModel = require("../models/announcementModel");

exports.getAllAnnouncements = async () => {
    return await announcementModel.getAllAnnouncements();
}

exports.getAnnouncementById = async (id) => {
    return await announcementModel.getAnnouncementById(id);
}

exports.saveAnnouncement = async (req, res) => {
    try {
        const { form_type, title, message, created_at, announcement_id } = req.body;

        if (form_type !== "announcement") {
            if (req.xhr) return res.status(400).json({ success: false, message: "Invalid form" });
            return res.redirect("/admin?tab=announcements");
        }

        if (!title.trim() || !message.trim()) {
            if (req.xhr) return res.json({ success: false, message: "Title and message are required." });
            req.session.annMsg = "Title and message are required.";
            return res.redirect("/admin?tab=announcements");
        }

        let formattedCreatedAt;
        if (!created_at) {
            formattedCreatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
        } else {
            const date = new Date(created_at);
            formattedCreatedAt = isNaN(date) ? new Date().toISOString().slice(0, 19).replace("T", " ") : date.toISOString().slice(0, 19).replace("T", " ");
        }

        if (announcement_id) {
            await announcementModel.updateAnnouncement({
                id: announcement_id,
                title,
                message,
                created_at: formattedCreatedAt,
            });
            if (req.xhr) return res.json({ success: true, message: "Announcement updated" });
            req.session.annMsg = "Announcement updated";
        } else {
            await announcementModel.createAnnouncement({
                title,
                message,
                created_at: formattedCreatedAt,
            });
            if (req.xhr) return res.json({ success: true, message: "Announcement created" });
            req.session.annMsg = "Announcement created";
        }

        if (!req.xhr) res.redirect("/admin?tab=announcements");

    } catch (err) {
        console.error(err);
        if (req.xhr) return res.status(500).json({ success: false, message: "Server error occurred." });
        res.status(500).send("Server error");
    }
};

exports.redirectToEdit = (req, res) => {
    res.redirect(`/admin?tab=announcements&edit=${req.params.id}`);
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await announcementModel.deleteAnnouncement(req.params.id);

    if (req.xhr) return res.json({ success: true, message: "Announcement deleted." });
    
    req.session.annMsg = "Announcement deleted.";
    res.redirect("/admin?tab=announcements");
  } catch (err) {
    console.error(err);
    if (req.xhr) return res.status(500).json({ success: false, message: "Server error occurred." });
    res.status(500).send("Server error");
  }
};