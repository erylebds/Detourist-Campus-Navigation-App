const announcementModel = require("../models/announcementModel");

exports.getAllAnnouncements = async () => {
    return await announcementModel.getAllAnnouncements();
}

exports.getAnnouncemntById = async (id) => {
    return await announcementModel.getAnnouncemntById(id);
}

exports.saveAnnouncement = async (req, res) => {
    try {
        const { form_type, title, message, created_at, announcement_id } = req.body;

        if (form_type !== "announcement")
            return res.redirect("/admin?tab=announcements");

        if (!title.trim() || !message.trim()) {
            req.session.annMsg = "Title and message are required.";
            return res.redirect("/admin?tab=announcements");
        }

        const formatted = created_at.replace("T", " ") + ":00";

        if (announcement_id) {
            await announcementModel.updateAnnouncement({
                id: announcement_id,
                title,
                message,
                created_at: formatted,
            });
            
            req.sessions.annMsg = "Announcement updated";

        } else {
            await announcementModel.createAnnouncement({
                title,
                message,
                created_at: formatted,
            });

            req.session.annMsg = "Announcement created";
        }

        res.redirect("/admin?tab=announcements");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

exports.redirectToEdit = (req, res) => {
    res.redirect(`/admin?tab=announcements&edit=${req.params.id}`);
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await announcementModel.deleteAnnouncement(req.params.id);
    req.session.annMsg = "Announcement deleted.";
    res.redirect("/admin?tab=announcements");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};