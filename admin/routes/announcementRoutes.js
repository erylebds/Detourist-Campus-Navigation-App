const requireAdmin = require("../middleware/requireAdmin");
const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const multer = require('multer');
const upload = multer();

router.post("/admin/announcements", requireAdmin, upload.none(), announcementController.saveAnnouncement);
router.get("/admin/announcements/delete/:id", requireAdmin, announcementController.deleteAnnouncement);
router.get("/admin/announcements/edit/:id", requireAdmin, announcementController.redirectToEdit);

module.exports = router;