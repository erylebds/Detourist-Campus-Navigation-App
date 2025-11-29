const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/requireAdmin");
const accountController = require("../controllers/accountController");
const multer = require("multer");
const upload = multer();

router.post("/admin/account/username", requireAdmin, upload.none(), accountController.updateUsername);
router.post("/admin/account/password", requireAdmin, upload.none(), accountController.updatePassword);

module.exports = router;
