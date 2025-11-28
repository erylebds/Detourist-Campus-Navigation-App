const requireAdmin = require("../middleware/requireAdmin");
const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

router.post("/announcements", requireAdmin, announcementController.saveAnnouncement);
router.get("/announcements/delete/:id", requireAdmin, announcementController.deleteAnnouncement);

module.exports = router;